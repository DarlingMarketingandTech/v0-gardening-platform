import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  MapPin, 
  Layout, 
  Sprout, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Info, 
  Droplets, 
  Sun, 
  Activity,
  Zap,
  Target,
  ExternalLink,
  Plus,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { TerraCard } from '../components/TerraCard';
import { api } from '../lib/api';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Plant {
  id: string;
  name: string;
  species: string;
  emoji: string;
  plantedDate: string;
  harvestDate: string;
  stage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Mature';
  status: 'Growing' | 'Harvesting' | 'Dormant';
  progress: number;
  health: number;
  aiCareAdvice: string[];
  companions: string[];
  antagonists: string[];
}

interface Resource {
  title: string;
  type: 'Guide' | 'Video' | 'Article';
  link: string;
}

interface GardenArea {
  id: string;
  name: string;
  type: string;
  plantCount: number;
  conditions: string;
  tasks: Task[];
  plants: Plant[];
  tips: string[];
  resources: Resource[];
}

const GARDEN_DATA: GardenArea[] = [
  {
    id: 'raised-bed-1',
    name: 'Raised Bed 1',
    type: 'Outdoor / In-Ground',
    plantCount: 4,
    conditions: 'Full Sun (8+ hrs)',
    tasks: [
      { id: '1', title: 'Thin radish seedlings', dueDate: 'Today', completed: false },
      { id: '2', title: 'Apply organic compost mulching', dueDate: 'Tomorrow', completed: false }
    ],
    plants: [
      { 
        id: 'p1', name: 'Roma Tomato', species: 'Solanum lycopersicum', emoji: '🍅', 
        plantedDate: '2026-04-10', harvestDate: '2026-06-25', stage: 'Flowering', status: 'Growing', progress: 45, health: 92,
        aiCareAdvice: [
          "Heat spike detected (92°F). Increase water frequency to prevent blossom end rot.",
          "Plant is entering peak flowering. Apply high-potash organic feed today.",
          "Pinch out side shoots (suckers) to focus energy on primary fruit clusters."
        ],
        companions: ['Basil', 'Marigold', 'Genovese Basil'],
        antagonists: ['Corn', 'Fennel']
      },
      { 
        id: 'p2', name: 'Cherry Tomato', species: 'Var. cerasiforme', emoji: '🍒', 
        plantedDate: '2026-04-10', harvestDate: '2026-06-15', stage: 'Fruiting', status: 'Growing', progress: 60, health: 88,
        aiCareAdvice: [
          "Fruit heavy clusters detected. Ensure support ties are secure to prevent stem snaps.",
          "Early blight risk is moderate due to high evening humidity. Maintain lower foliage pruning.",
          "Check ripeness daily; harvest at uniform color to encourage continuous production."
        ],
        companions: ['Basil', 'Genovese Basil'],
        antagonists: []
      },
      { 
        id: 'p3', name: 'Genovese Basil', species: 'Ocimum basilicum', emoji: '🌿', 
        plantedDate: '2026-05-01', harvestDate: '2026-06-01', stage: 'Vegetative', status: 'Growing', progress: 30, health: 95,
        aiCareAdvice: [
          "Prune top set of leaves to encourage bushier growth pattern.",
          "Nitrogen levels are optimal. Continue existing feeding schedule.",
          "Morning harvests will yield the highest essential oil concentration."
        ],
        companions: ['Roma Tomato', 'Cherry Tomato'],
        antagonists: []
      }
    ],
    tips: [
      "Prune bottom leaves to prevent blight splashback.",
      "Companion plant with basil to improve tomato flavor.",
      "Check for hornworms during evening inspection."
    ],
    resources: [
      { title: "Organic Pest Control in Tomato Beds", type: "Guide", link: "#" },
      { title: "Mastering the 'Suckering' Pruning Technique", type: "Video", link: "#" }
    ]
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse Alpha',
    type: 'Protected Environment',
    plantCount: 2,
    conditions: 'Temperature Managed',
    tasks: [
      { id: '3', title: 'Check humidity sensors', dueDate: 'Weekly', completed: true },
      { id: '4', title: 'Ventilate for 2 hours', dueDate: 'Today', completed: false }
    ],
    plants: [
      { 
        id: 'p4', name: 'English Cucumber', species: 'Cucumis sativus', emoji: '🥒', 
        plantedDate: '2026-05-05', harvestDate: '2026-07-05', stage: 'Vegetative', status: 'Growing', progress: 20, health: 90,
        aiCareAdvice: [
          "Maintain consistent greenhouse humidity at 70% RH for optimal transpiration.",
          "Monitor for whiteflies specifically on the underside of new leaves.",
          "Introduce beneficial nematodes to the soil reservoir next week."
        ],
        companions: [],
        antagonists: []
      }
    ],
    tips: [
      "Ensure airflow to prevent powdery mildew.",
      "Pollinate manually if beneficial insects are low."
    ],
    resources: [
      { title: "Managing GH Temperatures in Summer", type: "Article", link: "#" }
    ]
  },
  {
    id: 'indoor-shelf',
    name: 'Kitchen Shelf',
    type: 'Indoor Vertical',
    plantCount: 8,
    conditions: 'Artificial Spectrum',
    tasks: [
      { id: '5', title: 'Refill hydroponic reservoir', dueDate: 'Every 3 days', completed: false }
    ],
    plants: [
      { 
        id: 'p5', name: 'Microgreens Mix', species: 'Brassica blend', emoji: '🌱', 
        plantedDate: '2026-05-10', harvestDate: '2026-05-20', stage: 'Seedling', status: 'Growing', progress: 75, health: 100,
        aiCareAdvice: [
          "Harvest window opens in 48 hours. Reduce light intensity to prevent bitter flavor profile.",
          "Ensure tray ventilation remains high to prevent dampening off.",
          "Bottom-water only to keep foliage dry and reduce bacterial risk."
        ],
        companions: [],
        antagonists: []
      }
    ],
    tips: [
      "Rotate trays for even light distribution.",
      "Harvest at first set of true leaves for high nutrient density."
    ],
    resources: [
      { title: "Hydroponic Nutrient Ratios for Brassicas", type: "Guide", link: "#" }
    ]
  }
];

export const MyGarden: React.FC = () => {
  const [view, setView] = useState<'overview' | 'area' | 'plant'>('overview');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [dynamicAdvice, setDynamicAdvice] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const selectedArea = GARDEN_DATA.find(a => a.id === selectedAreaId);
  const selectedPlant = selectedArea?.plants.find(p => p.id === selectedPlantId);

  useEffect(() => {
    if (view === 'plant' && selectedPlant && selectedArea) {
      handleSyncAdvice();
    }
  }, [view, selectedPlantId]);

  const handleSyncAdvice = async () => {
    if (!selectedPlant || !selectedArea) return;
    
    setIsSyncing(true);
    try {
      const advice = await api.getGrowthCareAdvice(
        selectedPlant.name,
        selectedPlant.stage,
        selectedArea.conditions
      );
      setDynamicAdvice(advice);
    } catch (error) {
      console.error("Failed to sync advice:", error);
      // Fallback to static advice if API fails
      setDynamicAdvice(selectedPlant.aiCareAdvice);
    } finally {
      setIsSyncing(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-headline font-black text-stone-800">My Domains</h2>
        <button className="p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GARDEN_DATA.map((area) => (
          <motion.div
            key={area.id}
            whileHover={{ y: -5 }}
            onClick={() => {
              setSelectedAreaId(area.id);
              setView('area');
            }}
            className="group cursor-pointer bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-soft hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center text-stone-400 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <MapPin className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black bg-stone-100 text-stone-400 px-3 py-1 rounded-full uppercase tracking-widest">{area.type}</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-stone-800">{area.name}</h3>
              <p className="text-stone-400 font-medium text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary/40" /> {area.plantCount} Active Varieties
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-50 flex items-center justify-between">
              <div className="flex -space-x-2">
                {area.plants.map((p, i) => (
                  <div key={p.id} className="w-10 h-10 rounded-full bg-stone-50 border-2 border-white flex items-center justify-center text-xl shadow-sm" style={{ zIndex: area.plants.length - i }}>
                    {p.emoji}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-primary font-bold text-xs">
                Inspect <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAreaDetail = () => {
    if (!selectedArea) return null;

    const checkSynergy = (plant: Plant) => {
      const companionsInArea = selectedArea.plants.filter(p => 
        p.id !== plant.id && (plant.companions.includes(p.name) || p.companions.includes(plant.name))
      );
      const antagonistsInArea = selectedArea.plants.filter(p => 
        p.id !== plant.id && (plant.antagonists.includes(p.name) || p.antagonists.includes(plant.name))
      );
      return { 
        hasSynergy: companionsInArea.length > 0, 
        hasConflict: antagonistsInArea.length > 0,
        companionsCount: companionsInArea.length,
        antagonistsCount: antagonistsInArea.length
      };
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <button 
          onClick={() => setView('overview')}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest leading-none">Back to Overview</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="flex-1 space-y-8 w-full">
              <div className="space-y-2">
                <h2 className="text-5xl font-headline font-black text-stone-800 tracking-tight">{selectedArea.name}</h2>
                <div className="flex flex-wrap gap-4 items-center">
                   <div className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-1.5 rounded-full text-xs font-bold border border-primary/10">
                     <Sun className="w-4 h-4" /> {selectedArea.conditions}
                   </div>
                   <div className="flex items-center gap-2 text-stone-500 bg-stone-100 px-4 py-1.5 rounded-full text-xs font-bold border border-stone-200/50">
                     <Layout className="w-4 h-4" /> {selectedArea.type}
                   </div>
                </div>
              </div>

              {/* Plant Timeline Header */}
              <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">Active Timeline</h3>
                  <div className="h-px flex-1 bg-stone-100 mx-4" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {selectedArea.plants.map(p => {
                    const { hasSynergy, hasConflict } = checkSynergy(p);
                    return (
                      <motion.div 
                        key={p.id}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          setSelectedPlantId(p.id);
                          setView('plant');
                        }}
                        className={`bg-white p-6 rounded-[2rem] border-2 shadow-soft flex items-center gap-6 cursor-pointer group transition-all duration-300 ${
                          hasConflict ? 'border-red-200' : hasSynergy ? 'border-green-200' : 'border-stone-100'
                        }`}
                      >
                        <div className="w-16 h-16 bg-bg-warm rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform relative">
                          {p.emoji}
                          {hasSynergy && !hasConflict && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Zap className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          {hasConflict && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Info className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex justify-between items-start">
                             <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-stone-800">{p.name}</h4>
                                {hasSynergy && !hasConflict && <span className="text-[7px] font-black bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Synergized</span>}
                                {hasConflict && <span className="text-[7px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Conflict</span>}
                              </div>
                              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider italic">{p.species}</p>
                             </div>
                             <div className="text-right">
                                <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md">{p.status}</span>
                                <p className="text-[9px] text-stone-400 mt-1 font-bold">Harv: May 25</p>
                             </div>
                           </div>
                           <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${p.progress}%` }}
                               className="h-full bg-primary"
                             />
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-200 group-hover:text-primary transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </section>
           </div>

           <div className="w-full md:w-80 space-y-6">
              <TerraCard title="Area Tasks" className="bg-stone-800 text-white border-0">
                 <div className="space-y-4">
                    {selectedArea.tasks.map(task => (
                      <div key={task.id} className="flex items-start gap-3 group">
                        <button className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          task.completed ? 'bg-primary border-primary' : 'border-stone-600 hover:border-primary'
                        }`}>
                          {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.completed ? 'text-stone-500 line-through' : 'text-stone-200'}`}>
                            {task.title}
                          </p>
                          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mt-1">
                            <Clock className="w-2.5 h-2.5 inline mr-1" /> {task.dueDate}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:bg-white/10 hover:text-white transition-all">
                      Log Activity
                    </button>
                 </div>
              </TerraCard>

              <TerraCard title="Ecological Tips">
                 <div className="space-y-4">
                    {selectedArea.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-6 h-6 bg-tertiary-light/50 rounded-lg flex items-center justify-center text-tertiary shrink-0">
                           <Info className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs text-stone-600 font-medium leading-relaxed">{tip}</p>
                      </div>
                    ))}
                 </div>
              </TerraCard>

              <TerraCard title="Library Resources">
                 <div className="space-y-3">
                    {selectedArea.resources.map((res, i) => (
                      <a 
                        key={i} 
                        href={res.link}
                        className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 rounded-xl transition-all border border-stone-200/50 group/res"
                      >
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                               <ExternalLink className="w-4 h-4 text-stone-400 group-hover/res:text-primary transition-colors" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{res.type}</p>
                               <h6 className="text-xs font-bold text-stone-700">{res.title}</h6>
                            </div>
                         </div>
                         <ChevronRight className="w-3 h-3 text-stone-300" />
                      </a>
                    ))}
                 </div>
              </TerraCard>
           </div>
        </div>
      </motion.div>
    );
  };

  const renderPlantDetail = () => {
    if (!selectedPlant || !selectedArea) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <button 
          onClick={() => setView('area')}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest leading-none">Back to {selectedArea.name}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-8">
                 <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-7xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                   {selectedPlant.emoji}
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-5xl font-headline font-black text-stone-800 tracking-tight">{selectedPlant.name}</h2>
                    <p className="text-primary italic font-bold text-lg select-none tracking-wide">{selectedPlant.species}</p>
                    <div className="flex gap-2 mt-2">
                       <span className="text-[10px] font-black bg-stone-100 text-stone-500 px-3 py-1 rounded-full uppercase">Established</span>
                       <span className="text-[10px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase">Optimal Health</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {[
                   { label: 'Growth Progress', val: `${selectedPlant.progress}%`, icon: Activity, color: 'text-blue-500' },
                   { label: 'Neural Health', val: `${selectedPlant.health}%`, icon: Zap, color: 'text-yellow-500' },
                   { label: 'Growth Stage', val: selectedPlant.stage, icon: Sprout, color: 'text-primary' },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-stone-800">{stat.val}</p>
                   </div>
                 ))}
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <TerraCard className="relative bg-white/80 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Sparkles className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-stone-800">Cognitive Care Protocol</h4>
                            <p className="text-[10px] font-bold text-stone-400">Context: {selectedPlant.stage} Stage & {selectedArea.conditions}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          whileTap={{ rotate: 180 }}
                          onClick={handleSyncAdvice}
                          disabled={isSyncing}
                          className={`p-2 bg-stone-100 text-stone-400 rounded-full hover:bg-primary/10 hover:text-primary transition-colors ${isSyncing ? 'animate-spin' : ''}`}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.button>
                        <div className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-full uppercase tracking-widest">AI Sync: {isSyncing ? 'Synchronizing...' : 'Active'}</div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                         <div className="flex items-center gap-2 mb-2">
                            <Sprout className="w-3 h-3 text-primary" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Stage Intelligence</span>
                         </div>
                         <p className="text-xs font-bold text-stone-800">Current Goal: {
                           selectedPlant.stage === 'Flowering' ? 'Nutrient loading for fruit set' :
                           selectedPlant.stage === 'Fruiting' ? 'Moisture stability & ripening' :
                           'Structural growth optimization'
                         }</p>
                      </div>
                      <div className="p-4 bg-tertiary/5 rounded-2xl border border-tertiary/10">
                         <div className="flex items-center gap-2 mb-2">
                            <Sun className="w-3 h-3 text-tertiary" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Weather Engine</span>
                         </div>
                         <p className="text-xs font-bold text-stone-800">Active Alert: {
                           selectedArea.conditions.includes('Sun') ? 'UV index high; transpirational monitoring active' : 'Stable atmospheric baseline'
                         }</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 px-1">Prescriptive Actions</p>
                      {(dynamicAdvice.length > 0 ? dynamicAdvice : selectedPlant.aiCareAdvice).map((advice, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex gap-4 p-4 bg-white rounded-2xl border border-stone-100 group/item hover:bg-primary/5 hover:border-primary/20 transition-all shadow-sm"
                        >
                           <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform shrink-0">
                              <Zap className="w-4 h-4" />
                           </div>
                           <p className="text-sm font-medium text-stone-700 leading-relaxed italic">"{advice}"</p>
                        </motion.div>
                      ))}
                   </div>
                </TerraCard>
              </div>

              <TerraCard title="Growth Intelligence Journal">
                 <div className="space-y-6">
                    <div className="relative pl-8 border-l-2 border-stone-100 pb-6">
                       <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm" />
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Today, 08:30 AM</p>
                       <h5 className="font-bold text-stone-800">Automatic Irrigation Event</h5>
                       <p className="text-sm text-stone-500 mt-1">Dispensed 250ml based on thermal stress prediction. Soil moisture optimized to 65%.</p>
                    </div>
                    <div className="relative pl-8 border-l-2 border-stone-100 pb-6">
                       <div className="absolute -left-2 top-0 w-4 h-4 bg-tertiary rounded-full border-4 border-white shadow-sm" />
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">May 12, 2026</p>
                       <h5 className="font-bold text-stone-800">Phenological Shift Detected</h5>
                       <p className="text-sm text-stone-500 mt-1">First flower clusters appearing. Increasing potassium nutrient ratio recommended.</p>
                    </div>
                    <button className="w-full py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:bg-stone-100 transition-all">
                      Explore Full Journal
                    </button>
                 </div>
              </TerraCard>
           </div>

           <div className="space-y-6">
              <TerraCard title="Bio-Metrics" className="bg-gradient-to-br from-primary to-primary-dark text-white border-0">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Droplets className="w-5 h-5 text-white/60" />
                          <span className="text-xs font-bold text-white/80">Moisture Profile</span>
                       </div>
                       <span className="text-sm font-black">62% RH</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Sun className="w-5 h-5 text-white/60" />
                          <span className="text-xs font-bold text-white/80">Spectral Intensity</span>
                       </div>
                       <span className="text-sm font-black">8.4 DLI</span>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Sync Status</p>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase">Real-time Telemetry Active</span>
                       </div>
                    </div>
                 </div>
              </TerraCard>

              <TerraCard title="Resource Intel">
                 <div className="space-y-4">
                    <button className="w-full p-4 bg-white border border-stone-100 rounded-2xl flex items-center justify-between group hover:border-primary transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <Target className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase text-left">Strategy</p>
                            <p className="text-xs font-bold text-stone-800">Pest Prevention Guide</p>
                          </div>
                       </div>
                       <ExternalLink className="w-4 h-4 text-stone-300" />
                    </button>
                    <button className="w-full p-4 bg-white border border-stone-100 rounded-2xl flex items-center justify-between group hover:border-primary transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                             <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase text-left">Database</p>
                            <p className="text-xs font-bold text-stone-800">Harvest Techniques</p>
                          </div>
                       </div>
                       <ExternalLink className="w-4 h-4 text-stone-300" />
                    </button>
                 </div>
              </TerraCard>
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-32">
      <AnimatePresence mode="wait">
        {view === 'overview' && (
          <motion.div key="overview" exit={{ opacity: 0, x: -20 }}>
            {renderOverview()}
          </motion.div>
        )}
        {view === 'area' && (
          <motion.div key="area" exit={{ opacity: 0, x: -20 }}>
            {renderAreaDetail()}
          </motion.div>
        )}
        {view === 'plant' && (
          <motion.div key="plant" exit={{ opacity: 0, x: -20 }}>
            {renderPlantDetail()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
