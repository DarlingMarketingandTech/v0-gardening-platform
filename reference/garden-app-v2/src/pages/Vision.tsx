import React, { useRef, useState, useEffect } from 'react';
import { TerraCard } from '../components/TerraCard';
import { 
  Camera, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  X, 
  Sun, 
  Search, 
  Scan,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { IdentityResult, DiagnosisResult } from '../types';

type VisionMode = 'scan' | 'diagnosis' | 'meter';

export const Vision: React.FC = () => {
  const [activeMode, setActiveMode] = useState<VisionMode>('scan');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [identityResult, setIdentityResult] = useState<IdentityResult | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Light Meter Specific State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lightLevel, setLightLevel] = useState(0);
  const [placementAdvice, setPlacementAdvice] = useState<string | null>(null);

  useEffect(() => {
    if (activeMode === 'meter' && !selectedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMode, selectedImage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        analyzeLight();
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const analyzeLight = () => {
    if (activeMode !== 'meter' || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const process = () => {
      if (video.paused || video.ended || activeMode !== 'meter') return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let totalBrightness = 0;

      // Simple heatmap & brightness calculation
      // We'll iterate through pixels to find bright spots
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += brightness;

        // Overlay heatmap logic (simplified for visualization)
        if (brightness > 180) {
           // High intensity spots
           data[i] = 255; // Red
           data[i+1] = 255; // Yellow
           data[i+2] = 0;
           data[i+3] = 120; // Alpha
        } else if (brightness > 120) {
           data[i] = 0;
           data[i+1] = 255; // Greenish
           data[i+2] = 100;
           data[i+3] = 60;
        } else {
           data[i+3] = 0; // Transparent for dark areas
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      const avgBrightness = totalBrightness / (data.length / 4);
      const normalized = (avgBrightness / 255) * 100;
      setLightLevel(Math.round(normalized));

      // Placement Advice Logic
      if (normalized > 70) setPlacementAdvice("IDEAL: 8+ hrs Full Sun (Tomatoes, Peppers)");
      else if (normalized > 40) setPlacementAdvice("Partial Shade (Leafy Greens, Herbs)");
      else setPlacementAdvice("Low Light / Indoor Zone (Houseplants)");

      requestAnimationFrame(process);
    };

    requestAnimationFrame(process);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIdentityResult(null);
        setDiagnosisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      if (activeMode === 'scan') {
        const result = await api.identifyPlant(selectedImage);
        setIdentityResult(result);
      } else if (activeMode === 'diagnosis') {
        const result = await api.diagnosePlant(selectedImage);
        setDiagnosisResult(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setIdentityResult(null);
    setDiagnosisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-headline font-bold text-stone-800">BioVision Suite</h2>
        <p className="text-stone-500">Augmented Reality & AI Diagnostic Engine</p>
      </div>

      <div className="flex gap-4 p-1.5 bg-stone-100 rounded-[2rem] w-fit mx-auto border border-stone-200/50 backdrop-blur-md">
         {[
           { id: 'scan', label: 'Variety Scan', icon: Scan },
           { id: 'diagnosis', label: 'Pathogen Intel', icon: Activity },
           { id: 'meter', label: 'Light Meter', icon: Sun }
         ].map((m) => (
           <button 
             key={m.id}
             onClick={() => {
               setActiveMode(m.id as VisionMode);
               reset();
             }}
             className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
               activeMode === m.id ? 'bg-white text-primary shadow-soft' : 'text-stone-400 hover:text-stone-600'
             }`}
           >
             <m.icon className={`w-4 h-4 ${activeMode === m.id ? 'text-primary' : 'text-stone-300'}`} />
             {m.label}
           </button>
         ))}
      </div>

      {activeMode !== 'meter' ? (
        /* Identification & Diagnosis Mode */
        !selectedImage ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5, borderColor: 'var(--color-primary)' }}
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer bg-white border-2 border-dashed border-stone-200 rounded-[2.5rem] p-12 flex flex-col items-center gap-6 transition-all"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Camera className="w-12 h-12" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-stone-800">Initialize Optical Input</h3>
                <p className="text-stone-400 mt-2 font-medium">Sync high-res bio-data for analysis</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageSelect} 
                ref={fileInputRef}
              />
            </motion.div>

            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-stone-800 rounded-[2.5rem] p-12 text-white flex flex-col items-center gap-6 text-center"
            >
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-white/80">
                <History className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Archives</h3>
                <p className="text-stone-400 mt-2 font-medium">Historical diagnostic records</p>
              </div>
            </motion.div>
          </section>
        ) : (
          <div className="space-y-6">
            <TerraCard className="overflow-hidden p-0 relative border-0 shadow-2xl">
              <button 
                onClick={reset}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all scale-90 hover:scale-100"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-[4/3] sm:aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
                 <img src={selectedImage} alt="Captured" className="w-full h-full object-cover" />
              </div>
              
              <div className="p-8 space-y-8 bg-bg-warm">
                {!identityResult && !diagnosisResult ? (
                  <div className="text-center py-4">
                    <button 
                      disabled={loading}
                      onClick={processImage}
                      className="group relative inline-flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
                    >
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Activity className="w-7 h-7" />
                        </motion.div>
                      ) : (
                        <Sparkles className="w-7 h-7 group-hover:animate-pulse" />
                      )}
                      {loading ? 'Synthesizing...' : activeMode === 'scan' ? 'Identify Variety' : 'Begin Diagnosis'}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-6 text-stone-400">
                       <Zap className="w-3 h-3" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Core Active</span>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="animate-in slide-in-from-bottom-4 duration-700"
                  >
                    {identityResult && (
                      <div className="space-y-8 font-body">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-4xl font-headline font-black text-stone-800 tracking-tight">{identityResult.commonName}</h3>
                            <p className="text-primary italic font-bold text-lg select-none hover:tracking-wider transition-all">{identityResult.scientificName}</p>
                          </div>
                          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                            <CheckCircle2 className="w-10 h-10" />
                          </div>
                        </div>
                        
                        <div className="p-8 bg-white border border-stone-100 rounded-[2rem] shadow-soft relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Sparkles className="w-24 h-24 text-primary" />
                          </div>
                          <h4 className="text-stone-800 font-black mb-4 flex items-center gap-3 text-sm uppercase tracking-widest">
                            <Info className="w-4 h-4 text-primary" /> 
                            AI Cognitive Summary
                          </h4>
                          <p className="text-stone-600 leading-relaxed italic text-lg relative z-10">"{identityResult.description}"</p>
                        </div>
  
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                             <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3 block">Care Protocol Alpha</h5>
                             <p className="text-sm font-medium text-stone-700 leading-relaxed">{identityResult.careSummary}</p>
                          </div>
                          <div className="p-6 bg-stone-800 rounded-2xl border border-stone-700 shadow-lg text-white">
                             <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3 block text-stone-500">Spectral Req.</h5>
                             <div className="flex items-end gap-2 mb-2">
                               <span className="text-3xl font-black italic">6.2</span>
                               <span className="text-[10px] font-bold text-stone-400 pb-1 uppercase tracking-widest leading-none">DSI Index</span>
                             </div>
                             <p className="text-xs font-medium text-stone-300">High indirect spectrum required for vegetative optimization.</p>
                          </div>
                        </div>
                      </div>
                    )}
  
                    {diagnosisResult && (
                      <div className="space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-3xl font-headline font-black text-stone-800 leading-none">{diagnosisResult.diagnosis}</h3>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                diagnosisResult.severity.toLowerCase().includes('high') ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                              }`}>
                                {diagnosisResult.severity}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="flex-1 h-1 bg-stone-200 rounded-full w-32 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${diagnosisResult.confidence * 100}%` }}
                                    className="h-full bg-primary"
                                  />
                               </div>
                               <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{diagnosisResult.confidence * 100}% CONFIDENCE</p>
                            </div>
                          </div>
                          <AlertCircle className={`w-12 h-12 transition-transform duration-500 hover:rotate-12 ${
                            diagnosisResult.severity.toLowerCase().includes('high') ? 'text-red-500' : 'text-orange-500'
                          }`} />
                        </div>
  
                        <div className="p-8 bg-red-50/50 rounded-[2rem] border border-red-100 flex gap-6 items-start">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-red-100 shadow-sm shrink-0">
                              <Scan className="w-6 h-6 text-red-400" />
                           </div>
                           <div>
                             <h4 className="text-red-800 font-black text-sm uppercase tracking-widest mb-2">Diagnostic Scan Results</h4>
                             <p className="text-stone-600 text-lg font-medium leading-relaxed italic">"{diagnosisResult.symptoms}"</p>
                           </div>
                        </div>
  
                        <div className="space-y-4">
                          <h4 className="text-stone-800 font-black text-xs uppercase tracking-[0.2em] px-2 mb-2">Neutralization Action Plan</h4>
                          {diagnosisResult.treatmentPlan.map((step, i) => (
                             <motion.div 
                               key={i} 
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: i * 0.1 }}
                               className="flex gap-6 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all group"
                             >
                                <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-110 transition-transform">{i+1}</div>
                                <p className="text-stone-700 font-medium leading-relaxed">{step}</p>
                             </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </TerraCard>
          </div>
        )
      ) : (
        /* Smart Light Meter Tool */
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
           <TerraCard className="overflow-hidden p-0 relative border-0 shadow-2xl bg-black aspect-square sm:aspect-video flex items-center justify-center">
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  
                  {/* AR UI Overlays */}
                  <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                     <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Spectrum Analysis</span>
                     </div>
                     <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white border-white flex items-center gap-2">
                        <Sun className="w-4 h-4 text-primary" />
                        <span className="text-sm font-black text-stone-800">{lightLevel} LUX %</span>
                     </div>
                  </div>

                  <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 border-white/20 rounded-[inherit] overflow-hidden">
                     {/* Scanning Grid Effect */}
                     <div className="absolute top-0 w-full h-[1px] bg-primary shadow-[0_0_20px_rgba(var(--color-primary),0.8)] animate-[scan_3s_ease-in-out_infinite]" />
                  </div>

                  <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3">
                     <AnimatePresence mode="wait">
                        {placementAdvice && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-primary/95 backdrop-blur-lg text-white p-5 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-4"
                          >
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
                               <CheckCircle2 className="w-7 h-7 text-primary" />
                             </div>
                             <p className="font-bold text-sm leading-tight uppercase tracking-tight">{placementAdvice}</p>
                          </motion.div>
                        )}
                     </AnimatePresence>

                     <div className="grid grid-cols-2 gap-3">
                       <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                         <Zap className="text-yellow-400 w-5 h-5" />
                         <div>
                            <p className="text-[8px] font-black text-white/60 uppercase">Max Photon Flux</p>
                            <p className="text-xs font-bold text-white">420 µmol/m²/s</p>
                         </div>
                       </div>
                       <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                         <Activity className="text-blue-400 w-5 h-5" />
                         <div>
                            <p className="text-[8px] font-black text-white/60 uppercase">Optimal Zone</p>
                            <p className="text-xs font-bold text-white">Direct Exposure</p>
                         </div>
                       </div>
                     </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-stone-500">
                  <Sun className="w-12 h-12 animate-pulse" />
                  <p className="text-sm font-bold uppercase tracking-widest">Waking Sensor Net...</p>
                  <button 
                    onClick={startCamera}
                    className="mt-4 px-6 py-3 bg-white text-stone-800 rounded-full font-black text-xs uppercase tracking-widest shadow-lg"
                  >
                    Grant Optic Access
                  </button>
                </div>
              )}
           </TerraCard>

           <div className="p-8 bg-white rounded-[2.5rem] border border-stone-100 shadow-soft space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Info className="w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-stone-800 leading-none">Optical Guidance System</h4>
                   <p className="text-xs text-stone-400 font-medium mt-1">AR heatmap simulates solar track data for precise placement.</p>
                 </div>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed">
                BioSteward analyzes shadows, reflectance, and live photon counts to determine if a specific location is viable for your biological assets. Point your sensor at a potential growing spot for 5 seconds to lock the lock spectral signature.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <h6 className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">Full Sun</h6>
                    <p className="text-[10px] font-bold text-stone-700 leading-tight">Requires &gt;80% Light Saturation</p>
                 </div>
                 <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <h6 className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">Partial</h6>
                    <p className="text-[10px] font-bold text-stone-700 leading-tight">40 - 70% Saturation Zone</p>
                 </div>
                 <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <h6 className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">Low Light</h6>
                    <p className="text-[10px] font-bold text-stone-700 leading-tight">&lt; 30% Saturation Zone</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Mode Switch Helper */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xs z-50 px-4 md:hidden">
         <div className="bg-stone-900/90 backdrop-blur-xl border border-white/20 rounded-full p-2 flex items-center justify-center gap-1 shadow-2xl">
            {[
              { id: 'scan', icon: Scan },
              { id: 'diagnosis', icon: Activity },
              { id: 'meter', icon: Sun }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setActiveMode(m.id as VisionMode)}
                className={`p-3 rounded-full transition-all ${activeMode === m.id ? 'bg-primary text-white scale-110' : 'text-stone-500'}`}
              >
                <m.icon className="w-5 h-5" />
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};
