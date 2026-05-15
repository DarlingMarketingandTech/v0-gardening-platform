import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerraCard } from '../components/TerraCard';
import { 
  ChevronRight, 
  MapPin, 
  User, 
  Sun, 
  Sprout, 
  Bell, 
  CheckCircle2, 
  Wind, 
  Droplets,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

type OnboardingData = {
  name: string;
  location: string;
  environment: 'indoor' | 'outdoor' | 'both' | null;
  indoorLight: string | null;
  outdoorType: string | null;
  outdoorSize: string | null;
  skillLevel: string | null;
  alerts: string[];
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    location: '',
    environment: null,
    indoorLight: null,
    outdoorType: null,
    outdoorSize: null,
    skillLevel: null,
    alerts: []
  });

  const stepsConfig = [
    {
      id: 'welcome',
      title: "Welcome to BioSteward",
      subtitle: "First, what's your name?",
      condition: () => true,
    },
    {
      id: 'location',
      title: "Geographic Context",
      subtitle: "Where is your garden located?",
      condition: () => true,
    },
    {
      id: 'environment',
      title: "Your Ecosystem",
      subtitle: "Where are we growing today?",
      condition: () => true,
    },
    {
      id: 'indoor-details',
      title: "Indoor Microclimate",
      subtitle: "How would you describe your main indoor light source?",
      condition: () => data.environment === 'indoor' || data.environment === 'both',
    },
    {
      id: 'outdoor-details',
      title: "Outdoor Landscape",
      subtitle: "What best describes your outdoor setup?",
      condition: () => data.environment === 'outdoor' || data.environment === 'both',
    },
    {
      id: 'outdoor-size',
      title: "Spatial Optimization",
      subtitle: "Approximately how much outdoor area are we optimizing?",
      condition: () => data.environment === 'outdoor' || data.environment === 'both',
    },
    {
      id: 'skill',
      title: "Skill Level",
      subtitle: "What is your current gardening experience?",
      condition: () => true,
    },
    {
      id: 'notifications',
      title: "Sync Connections",
      subtitle: "How should we notify you of micro-weather alerts?",
      condition: () => true,
    },
    {
      id: 'finish',
      title: "Ecosystem Calibrated",
      subtitle: `Welcome to BioSteward, ${data.name.split(' ')[0] || ''}`,
      condition: () => true,
    }
  ];

  const visibleSteps = stepsConfig.filter(s => s.condition());
  const currentIndex = visibleSteps.findIndex(s => s.id === stepsConfig[step].id);

  const nextStep = () => {
    let next = step + 1;
    while (next < stepsConfig.length && !stepsConfig[next].condition()) {
      next++;
    }
    if (next < stepsConfig.length) setStep(next);
  };

  const prevStep = () => {
    let prev = step - 1;
    while (prev >= 0 && !stepsConfig[prev].condition()) {
      prev--;
    }
    if (prev >= 0) setStep(prev);
  };

  const steps = [
    {
      id: 'welcome',
      content: (
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" />
            <input 
              autoFocus
              type="text" 
              placeholder="e.g. Alex Moss"
              className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-headline text-lg"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && data.name && nextStep()}
            />
          </div>
          <button 
            disabled={!data.name}
            onClick={nextStep}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-soft hover:bg-primary-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      id: 'location',
      content: (
        <div className="space-y-6">
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" />
            <input 
              autoFocus
              type="text" 
              placeholder="e.g. Portland, OR or 97201"
              className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-headline text-lg"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && data.location && nextStep()}
            />
          </div>

          <div className="aspect-video bg-stone-100 rounded-3xl border border-stone-200 overflow-hidden relative">
            <div className="absolute inset-0 opacity-40 grayscale" style={{
               backgroundImage: 'url("https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i711!3i1612!2m3!1e0!2sm!3i634125345!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!5f2!23i1301875")',
               backgroundSize: 'cover'
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="text-primary"
               >
                 <MapPin className="w-10 h-10 fill-current opacity-80" />
               </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/50 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-center">
              Awaiting satellite lock... {data.location ? `Matched: ${data.location}` : ''}
            </div>
          </div>

          <button 
            disabled={!data.location}
            onClick={nextStep}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-soft hover:bg-primary-dark transition-all disabled:opacity-30"
          >
            Confirm Location <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      id: 'environment',
      content: (
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'indoor', label: 'Indoor', desc: 'Houseplants, apartments, or terrariums', icon: Wind },
            { id: 'outdoor', label: 'Outdoor', desc: 'Gardens, backyards, or patios', icon: Droplets },
            { id: 'both', label: 'Both', desc: 'A mix of indoor and outdoor life', icon: Sprout }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setData({ ...data, environment: opt.id as any });
                nextStep();
              }}
              className="flex items-center gap-4 p-5 bg-white border border-stone-100 rounded-2xl text-left hover:border-primary hover:bg-primary/5 transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-primary transition-colors">
                <opt.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-stone-800">{opt.label}</span>
                <span className="text-xs text-stone-400">{opt.desc}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'indoor-details',
      content: (
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'low', label: 'Low/Medium', desc: 'North-facing or deep in a room' },
            { id: 'bright', label: 'Bright Indirect', desc: 'Near windows but no direct rays' },
            { id: 'direct', label: 'Direct Sun', desc: 'Full-spectrum southern exposure' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setData({ ...data, indoorLight: opt.id });
                nextStep();
              }}
              className="p-5 bg-white border border-stone-100 rounded-2xl text-left hover:border-primary transition-all group shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="block font-bold text-stone-800">{opt.label}</span>
                <span className="text-xs text-stone-400">{opt.desc}</span>
              </div>
              <Sun className="w-5 h-5 text-stone-300 group-hover:text-tertiary transition-colors" />
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'outdoor-details',
      content: (
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'balcony', label: 'Balcony Pods', desc: 'Container gardening in small spaces' },
            { id: 'raised', label: 'Raised Beds', desc: 'Managed vegetable or fruit plots' },
            { id: 'ground', label: 'In-Ground', desc: 'Traditional landscaping or large lot' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setData({ ...data, outdoorType: opt.id });
                nextStep();
              }}
              className="p-5 bg-white border border-stone-100 rounded-2xl text-left hover:border-primary transition-all group shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="block font-bold text-stone-800">{opt.label}</span>
                <span className="text-xs text-stone-400">{opt.desc}</span>
              </div>
              <Sprout className="w-5 h-5 text-stone-300 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'outdoor-size',
      content: (
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'small', label: 'Intensive (< 50 sq ft)', desc: 'Optimized for high-yield square foot beds' },
            { id: 'medium', label: 'Standard (50-250 sq ft)', desc: 'Residential garden or active patio' },
            { id: 'large', label: 'Estate (250+ sq ft)', desc: 'Large plots requiring automation zones' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setData({ ...data, outdoorSize: opt.id });
                nextStep();
              }}
              className="p-5 bg-white border border-stone-100 rounded-2xl text-left hover:border-primary transition-all group shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="block font-bold text-stone-800">{opt.label}</span>
                <span className="text-xs text-stone-400">{opt.desc}</span>
              </div>
              <Maximize2 className="w-5 h-5 text-stone-300 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'skill',
      content: (
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'novice', label: 'Enthusiastic Novice', desc: 'I have a few plants and know the basics' },
            { id: 'seasoned', label: 'Seasoned Grower', desc: "Multiple seasons of healthy harvests" },
            { id: 'master', label: 'Master Gardener', desc: 'I propagate and troubleshoot everything' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setData({ ...data, skillLevel: opt.id });
                nextStep();
              }}
              className="p-5 bg-white border border-stone-100 rounded-2xl text-left hover:border-primary transition-all group shadow-sm"
            >
              <span className="block font-bold text-stone-800">{opt.label}</span>
              <span className="text-xs text-stone-400">{opt.desc}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'notifications',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'push', label: 'Push Notifications', desc: 'Instant alerts on this device' },
              { id: 'email', label: 'Weekly Email Data', desc: 'Yield reports and deep insights' },
              { id: 'sms', label: 'SMS Micro-alerts', desc: 'Urgent frost or heat warnings' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  const current = data.alerts;
                  setData({
                    ...data,
                    alerts: current.includes(opt.id) 
                      ? current.filter(a => a !== opt.id) 
                      : [...current, opt.id]
                  });
                }}
                className={`p-5 border rounded-2xl text-left transition-all group shadow-sm flex items-center justify-between ${
                  data.alerts.includes(opt.id) 
                  ? 'bg-primary/5 border-primary' 
                  : 'bg-white border-stone-100'
                }`}
              >
                <div>
                  <span className="block font-bold text-stone-800">{opt.label}</span>
                  <span className="text-xs text-stone-400">{opt.desc}</span>
                </div>
                {data.alerts.includes(opt.id) && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>
          <button 
            onClick={nextStep}
            className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Finalize Profile
          </button>
        </div>
      )
    },
    {
      id: 'finish',
      content: (
        <div className="text-center space-y-8 py-8 animate-in fade-in zoom-in duration-500">
          <div className="relative w-32 h-32 mx-auto">
            <motion.div 
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 bg-primary/10 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-16 h-16" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-stone-500 max-w-sm mx-auto">
              We've initialized your microclimate data and care schedules. Your garden dashboard is ready.
            </p>
          </div>

          <button 
            onClick={onComplete}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl transition-all"
          >
            Enter your Garden
          </button>
        </div>
      )
    }
  ];

  const currentStepConfig = stepsConfig[step];
  const currentStepContent = steps.find(s => s.id === currentStepConfig.id);

  return (
    <div className="fixed inset-0 z-[100] bg-bg-warm flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/4" />

      <div className="w-full max-w-md">
        {/* Progress Bar & Navigation Control */}
        <div className="mb-12 space-y-4">
           <div className="flex justify-between items-center">
             <button 
               onClick={prevStep}
               className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-1 ${
                 currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-stone-400 hover:text-primary'
               }`}
             >
               <ChevronRight className="w-3 h-3 rotate-180" /> Back
             </button>
             <div className="flex flex-col items-center gap-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                 Protocol {currentIndex + 1} / {visibleSteps.length}
               </span>
             </div>
             <div className="w-10" /> {/* Spacer */}
           </div>
           
           <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-primary"
               initial={false}
               animate={{ width: `${((currentIndex + 1) / visibleSteps.length) * 100}%` }}
               transition={{ ease: "easeOut", duration: 0.5 }}
             />
           </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-2 mb-8">
               <h2 className="text-sm font-bold text-primary uppercase tracking-widest">{currentStepConfig.title}</h2>
               <h3 className="text-3xl font-headline font-bold text-stone-800 leading-tight">{currentStepConfig.subtitle}</h3>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                {currentStepContent?.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

