import React from 'react';
import { LayoutGrid, Map, Camera, Calendar, Settings, User, Sprout } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'garden', label: 'Garden', icon: Sprout },
    { id: 'vision', label: 'Vision', icon: Camera },
    { id: 'planner', label: 'Planner', icon: Map },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50 px-8 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-headline font-bold text-primary">BioSteward</h1>
        </div>
        
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-stone-500 hover:text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-stone-400 hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-tertiary-light overflow-hidden border border-stone-200 cursor-pointer">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Garden" alt="User" />
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50 px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-headline font-bold text-primary">BioSteward</h1>
        <div className="w-8 h-8 rounded-full bg-tertiary-light overflow-hidden border border-stone-200">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Garden" alt="User" />
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-1 left-4 right-4 h-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft border border-stone-100 z-50 px-6 flex items-center justify-between mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-primary scale-110' : 'text-stone-400'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-label font-bold uppercase tracking-wider">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="navIndicator"
                className="w-1 h-1 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </nav>
    </>
  );
};
