/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Vision } from './pages/Vision';
import { Planner } from './pages/Planner';
import { Calendar } from './pages/Calendar';
import { MyGarden } from './pages/MyGarden';
import { Onboarding } from './pages/Onboarding';
import { AnimatePresence, motion } from 'motion/react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem('biosteward_onboarded');
    setShowOnboarding(onboarded !== 'true');
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('biosteward_onboarded', 'true');
    setShowOnboarding(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'vision': return <Vision />;
      case 'planner': return <Planner />;
      case 'garden': return <MyGarden />;
      case 'calendar': return <Calendar />;
      default: return <Dashboard />;
    }
  };

  if (showOnboarding === null) return null;

  return (
    <div className="min-h-screen bg-bg-warm selection:bg-primary/20">
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={completeOnboarding} />
        )}
      </AnimatePresence>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="px-4 py-6 md:pt-24 md:pb-12 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Decorative Gradient Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/4" />
    </div>
  );
}

export default App;
