
import React from 'react';

interface AdUnitProps {
  type: 'leaderboard' | 'sidebar' | 'infeed' | 'sticky-bottom';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type, className = "" }) => {
  const specs = {
    leaderboard: { label: 'Google Display - Leaderboard (728x90)', height: 'h-24 md:h-32' },
    sidebar: { label: 'Google Display - Responsive Sidebar (300x250/600)', height: 'h-64' },
    infeed: { label: 'Google Display - Native In-Feed (Responsive)', height: 'h-48' },
    'sticky-bottom': { label: 'Google Display - Anchor/Overlay Ad', height: 'h-20' },
  };

  const selected = specs[type];

  return (
    <div className={`ad-placeholder w-full ${selected.height} rounded-2xl flex flex-col items-center justify-center text-gray-400 p-6 border-2 border-dashed border-gray-200 my-8 shadow-inner overflow-hidden relative group ${className}`}>
      <div className="absolute top-2 right-4 text-[8px] font-black uppercase text-gray-300 tracking-[0.2em]">AdChoices</div>
      <span className="text-[10px] uppercase font-black tracking-[0.3em] mb-2 text-gray-300">Google Advertisement Slot</span>
      <span className="text-xs font-bold text-gray-400 italic text-center max-w-xs">{selected.label}</span>
      <div className="mt-4 flex gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-gray-200 group-hover:bg-red-200 transition-colors"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-gray-200 group-hover:bg-red-300 transition-colors"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-gray-200 group-hover:bg-red-400 transition-colors"></div>
      </div>
    </div>
  );
};

export default AdUnit;
