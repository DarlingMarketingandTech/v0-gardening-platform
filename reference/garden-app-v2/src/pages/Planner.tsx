import React, { useState } from 'react';
import { TerraCard } from '../components/TerraCard';
import { Plus, Info, Move, Layers, Box, Maximize2, Search } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { PlantCatalogModal } from '../components/PlantCatalogModal';

interface GardenItem {
  id: string;
  name: string;
  emoji: string;
  category: 'Vegetable' | 'Fruit' | 'Herb' | 'Flower';
  companion: string[];
  antagonists: string[];
  stage?: string;
}

const PLANT_CATALOG: GardenItem[] = [
  { 
    id: '1', name: 'Tomato', emoji: '🍅', category: 'Vegetable', 
    companion: ['Basil', 'Marigold', 'Carrot'], 
    antagonists: ['Cabbage', 'Corn', 'Fennel'],
    stage: 'Seedling'
  },
  { 
    id: '2', name: 'Basil', emoji: '🌿', category: 'Herb', 
    companion: ['Tomato', 'Peppers'], 
    antagonists: ['Rue'],
    stage: 'Seedling'
  },
  { 
    id: '3', name: 'Marigold', emoji: '🌼', category: 'Flower', 
    companion: ['Tomato', 'Cabbage', 'Kale'], 
    antagonists: [],
    stage: 'Seedling'
  },
  { 
    id: '4', name: 'Peppers', emoji: '🫑', category: 'Vegetable', 
    companion: ['Basil', 'Onions', 'Tomato'], 
    antagonists: ['Fennel'],
    stage: 'Seedling'
  },
  { 
    id: '5', name: 'Lavender', emoji: '🪻', category: 'Herb', 
    companion: ['Roses', 'Fruit Trees', 'Cabbage'], 
    antagonists: [],
    stage: 'Seedling'
  },
];

export const Planner: React.FC = () => {
  const [grid, setGrid] = useState<(GardenItem | null)[]>(Array(12).fill(null));
  const [activeItem, setActiveItem] = useState<GardenItem | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalog, setCatalog] = useState<GardenItem[]>(PLANT_CATALOG);

  const placeItem = (index: number) => {
    if (activeItem) {
      const newGrid = [...grid];
      newGrid[index] = activeItem;
      setGrid(newGrid);
      setActiveItem(null);
    } else if (grid[index]) {
      const newGrid = [...grid];
      newGrid[index] = null;
      setGrid(newGrid);
    }
  };

  const getSynergyStatus = (index: number) => {
    const item = grid[index];
    if (!item) return { companions: 0, antagonists: 0 };

    const cols = 4; // Based on md:grid-cols-4
    const neighbors = [
      index - 1, // Left
      index + 1, // Right
      index - cols, // Top
      index + cols // Bottom
    ].filter(ni => {
      // Check boundaries
      if (ni < 0 || ni >= grid.length) return false;
      // Handle row wrapping for left/right
      if (Math.abs(ni - index) === 1 && Math.floor(ni / cols) !== Math.floor(index / cols)) return false;
      return true;
    });

    let companions = 0;
    let antagonists = 0;

    neighbors.forEach(ni => {
      const neighbor = grid[ni];
      if (!neighbor) return;

      if (item.companion.includes(neighbor.name) || neighbor.companion.includes(item.name)) {
        companions++;
      }
      if (item.antagonists.includes(neighbor.name) || neighbor.antagonists.includes(item.name)) {
        antagonists++;
      }
    });

    return { companions, antagonists };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-stone-800">Spatial Layout Engine</h2>
          <p className="text-stone-500">Optimizing root placement and companion synergy</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white rounded-xl shadow-soft border border-stone-200 text-stone-600 hover:text-primary">
             <Layers className="w-5 h-5" />
           </button>
           <button className="p-3 bg-white rounded-xl shadow-soft border border-stone-200 text-stone-600 hover:text-primary">
             <Maximize2 className="w-5 h-5" />
           </button>
           <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 font-bold text-sm">
             <Box className="w-4 h-4" />
             <span>3D Render ON</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Plant Catalog/Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <TerraCard title="Companion Guide">
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-xl border border-stone-100 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1">
                  <h6 className="text-[10px] font-bold uppercase text-stone-600">Synergy (Good)</h6>
                  <p className="text-[9px] text-stone-400">Plants that share nutrients or repel each other's pests.</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-100 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="flex-1">
                  <h6 className="text-[10px] font-bold uppercase text-stone-600">Antagonist (Bad)</h6>
                  <p className="text-[9px] text-stone-400">Plants that compete for resources or attract same pests.</p>
                </div>
              </div>
            </div>
          </TerraCard>

          <TerraCard title="Asset Library">
            <div className="space-y-3">
              {catalog.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveItem(item)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    activeItem?.id === item.id 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-stone-100 hover:border-stone-300'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-stone-700">{item.name}</h5>
                    <p className="text-[10px] text-stone-400 uppercase tracking-tighter">{item.category}</p>
                  </div>
                  <Plus className="w-4 h-4 text-stone-300" />
                </motion.div>
              ))}
              
              <button 
                onClick={() => setIsCatalogOpen(true)}
                className="w-full mt-4 py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 font-bold text-xs flex flex-col items-center gap-2 hover:border-primary hover:text-primary transition-all group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Discover Varieties
              </button>
            </div>
            <div className="mt-6 p-4 bg-tertiary-light/30 rounded-xl border border-tertiary-light/50">
               <div className="flex items-center gap-2 text-tertiary mb-1">
                 <Info className="w-4 h-4" />
                 <h6 className="text-[10px] font-bold uppercase">Companion Hint</h6>
               </div>
               <p className="text-xs text-tertiary/80 leading-snug italic">
                 "Try placing Basil alongside your Tomatoes to enhance flavor and deter pests naturally."
               </p>
            </div>
          </TerraCard>
        </div>

        {/* The Grid */}
        <div className="lg:col-span-3 space-y-4">
           <div className="bg-[#e8e4db] rounded-[2rem] p-8 shadow-inner relative overflow-hidden group">
              {/* Grid Background Lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 relative z-10">
                {grid.map((item, i) => {
                  const status = getSynergyStatus(i);
                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => placeItem(i)}
                      className={`aspect-square rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer border-2 transition-all relative ${
                        item 
                        ? (status.antagonists > 0 ? 'bg-red-50 border-red-200 shadow-md' : 'bg-white border-stone-200 shadow-lg') 
                        : 'bg-white/40 border-stone-300 border-dashed hover:bg-white/60'
                      }`}
                    >
                      {item && (
                        <>
                          {/* Synergy Indicators */}
                          <div className="absolute top-3 right-3 flex gap-1">
                            {Array.from({ length: status.companions }).map((_, idx) => (
                              <div key={idx} className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                            ))}
                            {Array.from({ length: status.antagonists }).map((_, idx) => (
                              <div key={idx} className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200" />
                            ))}
                          </div>

                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-5xl"
                          >
                            {item.emoji}
                          </motion.span>
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">{item.name}</span>
                            {item.stage && (
                              <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em]">{item.stage}</span>
                            )}
                          </div>
                          
                          {status.antagonists > 0 && (
                            <div className="absolute -bottom-2 px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-full uppercase tracking-tighter">
                              Conflict detected
                            </div>
                          )}
                          {status.companions > 0 && status.antagonists === 0 && (
                            <div className="absolute -bottom-2 px-2 py-0.5 bg-green-500 text-white text-[8px] font-black rounded-full uppercase tracking-tighter">
                              Synergy active
                            </div>
                          )}
                        </>
                      )}
                      {!item && (
                        <div className="p-3 bg-stone-200/50 rounded-full text-stone-400 group-hover:text-primary transition-colors">
                          <Plus className="w-6 h-6" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Status HUD Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sync Active</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Available Area</span>
                  <span className="text-sm font-mono tracking-widest">12.4m²</span>
                </div>
                <div className="text-center pl-4 border-l border-white/20">
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Light Coverage</span>
                  <span className="text-sm font-mono tracking-widest text-tertiary-light">88%</span>
                </div>
              </div>
           </div>
           
           <div className="flex items-center justify-between text-stone-400 text-xs font-medium px-4">
             <div className="flex items-center gap-4">
               <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Drag to reorganize</span>
               <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" /> Resize pods</span>
             </div>
             <p>2026 Layout Protocol: V3.1.2</p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isCatalogOpen && (
          <PlantCatalogModal 
            isOpen={isCatalogOpen}
            onClose={() => setIsCatalogOpen(false)}
            onAdd={(plant) => {
              const newItem: GardenItem = {
                id: plant.id + Date.now(),
                name: plant.commonName,
                emoji: plant.id.includes('tomato') ? '🍅' : plant.id.includes('basil') ? '🌿' : plant.id.includes('kale') ? '🥬' : '🪴',
                category: plant.category,
                companion: [],
                antagonists: [],
                stage: plant.stage
              };
              setCatalog([...catalog, newItem]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
