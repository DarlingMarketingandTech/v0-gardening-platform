import React, { useEffect, useState } from 'react';
import { TerraCard } from '../components/TerraCard';
import { Droplet, Sun, Thermometer, Wind, ChevronRight, Activity, Zap, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { SensorData } from '../types';
import { PlantCatalogModal } from '../components/PlantCatalogModal';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    api.getSensorData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-primary"
        >
          <Activity className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Vitality Score */}
        <TerraCard 
          className="md:col-span-7 flex flex-col items-center md:flex-row gap-8 overflow-hidden relative"
          variant="cream"
        >
          <div className="relative w-48 h-48 flex items-center justify-center">
             {/* Gradient Arc Container */}
            <svg className="w-full h-full -rotate-90">
              <circle 
                cx="96" cy="96" r="80" 
                fill="none" 
                stroke="#e4e0d8" 
                strokeWidth="12"
              />
              <motion.circle 
                cx="96" cy="96" r="80" 
                fill="none" 
                stroke="#4a7c59" 
                strokeWidth="12"
                strokeDasharray="502.6"
                strokeDashoffset={502.6 * (1 - data.vitality / 100)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 502.6 }}
                animate={{ strokeDashoffset: 502.6 * (1 - data.vitality / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-headline font-black text-primary">{data.vitality}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Vitality</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-3xl text-stone-800">Ecosystem Vitality</h2>
            <p className="text-stone-500 leading-relaxed max-w-sm">
              Your indoor garden is thriving. The current balance of nutrients and hydration is optimal.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Optimal Growth</span>
              <span className="px-3 py-1 bg-tertiary-light/50 text-tertiary text-xs font-bold rounded-full">Balanced pH</span>
            </div>
          </div>
        </TerraCard>

        {/* Current Ambient */}
        <TerraCard 
          className="md:col-span-5 flex flex-col justify-between"
          variant="tertiary"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/50 rounded-2xl">
                 <Thermometer className="w-6 h-6 text-tertiary" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600 bg-white/30 px-2 py-1 rounded">STABLE</span>
            </div>
            <span className="text-sm font-bold text-stone-600 uppercase tracking-wide">Current Ambient</span>
            <h3 className="text-6xl font-headline font-bold text-stone-800 mt-2">
              {data.ambient.temp}°<span className="text-3xl font-medium">C</span>
            </h3>
            <p className="text-stone-600 mt-2 font-medium">Humidity: {data.ambient.humidity}%</p>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
               <div className="w-[65%] h-full bg-tertiary"></div>
            </div>
          </div>
        </TerraCard>
      </section>

      {/* Sensor Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TerraCard title="Soil Moisture" icon={<Droplet />}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-primary">{data.soil.moisture}%</span>
            <span className="text-sm text-stone-400 font-medium">Optimal</span>
          </div>
          <div className="mt-4 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-1000" 
              style={{ width: `${data.soil.moisture}%` }} 
            />
          </div>
        </TerraCard>

        <TerraCard title="Lux Intensity" icon={<Sun />}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-tertiary">{data.light.lux}</span>
            <span className="text-sm text-stone-400 font-medium">{data.light.intensity}</span>
          </div>
          <div className="mt-4 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-tertiary h-full rounded-full transition-all duration-1000" 
              style={{ width: `82%` }} 
            />
          </div>
        </TerraCard>

        <TerraCard title="Soil Temp" icon={<Wind />}>
           <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-stone-700">{data.soil.temp}°C</span>
            <span className="text-sm text-primary font-bold flex items-center gap-0.5">
              <ChevronRight className="w-3 h-3 rotate-[-90deg]" />
              +1.2°
            </span>
          </div>
          <div className="mt-4 flex gap-1 h-1">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`flex-1 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-stone-200'}`} />
             ))}
          </div>
        </TerraCard>
      </section>

      {/* Action Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl text-stone-800">Action Required</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsCatalogOpen(true)}
              className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Log New Bio-Asset
            </button>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.actions.map((action) => (
            <motion.div 
              key={action.id}
              whileHover={{ x: 4 }}
              className="group bg-white p-4 rounded-2xl flex items-center justify-between shadow-soft border border-stone-100 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-stone-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">{action.type} {action.plant}</h4>
                  <p className="text-sm text-stone-400">{action.message} in {action.location}</p>
                </div>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-soft hover:bg-primary-dark transition-all active:scale-95">
                Actuate
              </button>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Plant Catalog Modal */}
      <AnimatePresence>
        {isCatalogOpen && (
          <PlantCatalogModal 
            isOpen={isCatalogOpen} 
            onClose={() => setIsCatalogOpen(false)}
            onAdd={(plant) => {
              console.log('Added biological asset:', plant);
              // In a real app, we'd save this to the DB
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
