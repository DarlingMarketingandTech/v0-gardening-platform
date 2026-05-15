import React from 'react';
import { TerraCard } from '../components/TerraCard';
import { Calendar as CalendarIcon, Package, TrendingUp, Info, Wind, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

export const Calendar: React.FC = () => {
  const events = [
    { day: 'MON', date: 'MAY 18', type: 'Pruning', plant: 'Monstera', urgent: true },
    { day: 'WED', date: 'MAY 20', type: 'Fertilizer', plant: 'All Herbs', urgent: false },
    { day: 'FRI', date: 'MAY 22', type: 'Harvest', plant: 'Microgreens', urgent: false },
    { day: 'SUN', date: 'MAY 24', type: 'Sync', plant: 'Soil Sensors', urgent: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Management Tier</span>
          <h2 className="text-5xl font-headline font-bold text-stone-800">Season Strategy</h2>
          <p className="text-stone-500 mt-2">Precision alignment with Lunar and Atmospheric cycles</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
             <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">NEXT NEW MOON</span>
             <span className="text-xl font-headline font-bold text-stone-800">MAY 22, 2026</span>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-200">
             <Wind className="w-6 h-6 text-stone-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-headline font-bold text-stone-800 flex items-center gap-2">
            <CalendarIcon className="text-primary w-5 h-5" />
            Biological Timeline
          </h3>
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-soft border border-stone-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center w-12 shrink-0">
                    <span className="block text-xs font-bold text-stone-400">{event.day}</span>
                    <span className="block text-xl font-headline font-black text-stone-800">{event.date.split(' ')[1]}</span>
                  </div>
                  <div className="h-10 w-[1px] bg-stone-200" />
                  <div>
                    <h4 className="font-bold text-stone-800 text-lg group-hover:text-primary transition-colors">{event.type} Protocol</h4>
                    <p className="text-stone-400 text-sm">{event.plant} Ecosystem</p>
                  </div>
                </div>
                {event.urgent && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-widest animate-pulse">
                    Urgent
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar/Inventory */}
        <div className="space-y-8">
           <TerraCard title="Seed Vault" icon={<Package />} variant="cream">
              <div className="space-y-4">
                {[
                   { name: 'Heritage Heirloom', count: 42, quality: 'Excell' },
                   { name: 'Red Russian Kale', count: 125, quality: 'Prime' },
                   { name: 'Genovese Basil', count: 88, quality: 'Excell' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-stone-200 last:border-0 last:pb-0">
                    <div>
                      <span className="block font-bold text-stone-700 text-sm">{item.name}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">{item.quality}</span>
                    </div>
                    <span className="text-lg font-headline font-bold text-primary">{item.count}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-white border border-stone-200 rounded-xl text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors">
                Inventory Export (PDF/JSON)
              </button>
           </TerraCard>

           <TerraCard title="Yield Engine" icon={<TrendingUp />} variant="tertiary">
              <div className="space-y-4">
                 <div className="flex justify-between text-tertiary">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-70">Projected Yield</span>
                    <span className="font-headline font-black">12.8 kg</span>
                 </div>
                 <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '74%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-tertiary"
                    />
                 </div>
                 <p className="text-xs text-tertiary/80 leading-relaxed italic">
                   "Your nutrient optimization has increased projected tomato yield by 14% compared to the 2025 cycle."
                 </p>
              </div>
           </TerraCard>

           <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Leaf className="w-6 h-6" />
                <h4 className="font-headline font-bold text-lg">BioTip</h4>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                The micro-frost alert for tomorrow has subsided. You may safely keep the Greenhouse vents at 15% aperture for optimal oxygen exchange.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
