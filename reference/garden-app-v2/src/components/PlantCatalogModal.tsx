import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Activity, 
  Wind, 
  Droplets, 
  Sprout,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { PLANT_DATABASE, PlantSpecies, GrowthStage, CultivationMethod, calculateEHD } from '../services/plantService';

interface PlantCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plant: any) => void;
}

export const PlantCatalogModal: React.FC<PlantCatalogModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState<'search' | 'config'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecies | null>(null);

  // Configuration State
  const [stage, setStage] = useState<GrowthStage>('Seedling');
  const [location, setLocation] = useState('Raised Bed 1');
  const [plantedDate, setPlantedDate] = useState<string>('Today');
  const [method, setMethod] = useState<CultivationMethod>('Soil');

  const filteredPlants = useMemo(() => {
    return PLANT_DATABASE.filter(p => {
      const matchesSearch = p.commonName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.botanicalName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectPlant = (plant: PlantSpecies) => {
    setSelectedPlant(plant);
    setStep('config');
  };

  const handleComplete = () => {
    if (!selectedPlant) return;
    
    // Resolve date
    let actualDate = new Date();
    if (plantedDate === 'Yesterday') actualDate.setDate(actualDate.getDate() - 1);
    if (plantedDate === 'Last Week') actualDate.setDate(actualDate.getDate() - 7);

    const ehd = calculateEHD({
      speciesId: selectedPlant.id,
      stage,
      locationId: location,
      plantedDate: actualDate,
      method
    }, selectedPlant);

    onAdd({
      ...selectedPlant,
      stage,
      location,
      plantedDate: actualDate,
      method,
      ehd
    });
    
    // Reset and close
    setStep('search');
    setSelectedPlant(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-lg bg-bg-warm rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold text-stone-800">
            {step === 'search' ? 'Add Bio-Asset' : 'Configure Profile'}
          </h2>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-8 overflow-y-auto max-h-[80vh]">
          {step === 'search' ? (
            <div className="space-y-6">
              {/* Step 1: Active Search & Filtering */}
              <div className="space-y-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text"
                    placeholder="Search biology database..."
                    className="w-full pl-12 pr-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {[
                    { label: 'Vegetables', id: 'Vegetable', icon: '🥬' },
                    { label: 'Herbs', id: 'Herb', icon: '🌿' },
                    { label: 'Houseplants', id: 'Houseplant', icon: '🪴' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`glass px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        selectedCategory === cat.id ? 'border-primary bg-primary/10 text-primary' : 'border-white/50 text-stone-500'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Auto-Complete Drop-down (High-Density List) */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-2">Matching Varieties</h3>
                <div className="space-y-1">
                  {filteredPlants.map(plant => (
                    <motion.div
                      key={plant.id}
                      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.8)' }}
                      onClick={() => handleSelectPlant(plant)}
                      className="flex items-center gap-4 p-3 bg-white/40 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-stone-100"
                    >
                      <img src={plant.thumbnail} alt={plant.commonName} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-800 truncate">{plant.commonName}</h4>
                        <p className="text-xs text-stone-400 italic truncate">{plant.botanicalName}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Step 3: Contextual Modal (The 4 Essential Questions) */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-100">
                  <img src={selectedPlant?.thumbnail} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">{selectedPlant?.commonName}</h3>
                    <p className="text-xs text-primary font-medium tracking-wide">DAYS TO MATURITY: {selectedPlant?.baseDTM}d</p>
                  </div>
               </div>

               {/* Q1: Growth Stage Section */}
               <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                      <Sprout className="w-3.5 h-3.5" />
                      1. Evolution Phase
                   </label>
                   <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Required</span>
                 </div>
                 
                 <div className="bg-stone-100/50 p-1 rounded-[1.5rem] flex gap-1 border border-stone-200/50 backdrop-blur-sm">
                    {[
                      { id: 'Seed', icon: '🌱', label: 'Seed' },
                      { id: 'Seedling', icon: '🌿', label: 'Seedling' },
                      { id: 'Mature', icon: '🪴', label: 'Mature' }
                    ].map(s => {
                      const isActive = stage === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setStage(s.id as GrowthStage)}
                          className={`relative flex-1 flex flex-col items-center gap-1 py-4 rounded-[1.25rem] transition-all duration-300 ${
                            isActive 
                            ? 'bg-white text-primary shadow-soft z-10' 
                            : 'text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="activeStageBg"
                              className="absolute inset-0 bg-white rounded-[1.25rem] shadow-sm -z-10"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'grayscale opacity-50'}`}>
                            {s.icon}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {s.label}
                          </span>
                        </button>
                      );
                    })}
                 </div>
               </div>

               {/* Q2: Location */}
               <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 pl-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    2. Cultivation Zone
                 </label>
                 <div className="grid grid-cols-3 gap-2">
                    {['☀️ Raised Bed 1', '⛱️ Greenhouse', '🏠 Indoor Shelf'].map(loc => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className={`p-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${
                          location === loc ? 'bg-stone-800 border-stone-800 text-white shadow-lg' : 'bg-white border-stone-100 text-stone-500 hover:border-stone-200'
                        }`}
                      >
                        {loc.split(' ')[1]}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Q3: When did you plant it? */}
               <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 pl-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    3. Planting Schedule
                 </label>
                 <div className="grid grid-cols-4 gap-2">
                    {['Today', 'Yesterday', 'Last Week', 'Pick Date'].map(d => (
                      <button
                        key={d}
                        onClick={() => setPlantedDate(d)}
                        className={`p-3 rounded-xl border text-[9px] font-black uppercase transition-all ${
                          plantedDate === d ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/80 border-white/50 text-stone-400 backdrop-blur-sm'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Q4: Substrate Method */}
               <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 pl-1 flex items-center gap-2">
                    <Droplets className="w-3 h-3" />
                    4. Cultivation Method
                 </label>
                 <div className="flex bg-stone-200/50 p-1.5 rounded-2xl backdrop-blur-md">
                    {[
                      { id: 'Soil', label: 'In-Ground', icon: '🪹' },
                      { id: 'Container', label: 'Pots', icon: '🪵' },
                      { id: 'Hydroponic', label: 'Hydro', icon: '💧' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id as CultivationMethod)}
                        className={`flex-1 flex flex-col items-center py-3 rounded-xl text-[9px] font-black uppercase transition-all duration-300 ${
                          method === m.id ? 'bg-white text-primary shadow-md scale-105' : 'text-stone-400 hover:text-stone-600'
                        }`}
                      >
                        <span className="text-lg mb-1">{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="pt-4 space-y-4">
                  <div className="p-4 bg-tertiary-light/30 rounded-2xl border border-tertiary-light/50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Activity className="text-tertiary w-5 h-5" />
                        <div>
                          <p className="text-[10px] font-bold text-tertiary/70 uppercase">Estimated Harvest</p>
                          <p className="font-headline font-black text-stone-800">
                             {stage === 'Mature' ? 'Ready to pick' : 'Autumn 2026'}
                          </p>
                        </div>
                     </div>
                     <span className="text-[10px] font-bold text-tertiary">SYNCED</span>
                  </div>

                  <button 
                    onClick={handleComplete}
                    className="w-full bg-primary text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    Initialize Bio-Asset
                  </button>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
