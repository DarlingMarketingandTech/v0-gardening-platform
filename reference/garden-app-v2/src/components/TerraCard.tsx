import React from 'react';
import { motion } from 'motion/react';

interface TerraCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'white' | 'cream' | 'tertiary';
}

export const TerraCard: React.FC<TerraCardProps> = ({ 
  children, 
  className = "", 
  title, 
  icon,
  variant = 'white' 
}) => {
  const variants = {
    white: 'bg-white',
    cream: 'bg-[#f5f1ea]',
    tertiary: 'bg-[#f8e0a8]'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-6 shadow-soft border border-stone-100/50 ${variants[variant]} ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            {title && <h3 className="text-lg font-headline text-stone-800">{title}</h3>}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};
