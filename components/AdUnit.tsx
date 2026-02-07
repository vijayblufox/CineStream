
import React from 'react';

interface AdUnitProps {
  type: 'leaderboard' | 'sidebar' | 'infeed' | 'sticky-bottom';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type, className = "" }) => {
  const specs = {
    leaderboard: { label: 'Leaderboard (728x90)', height: 'h-24 md:h-32' },
    sidebar: { label: 'Square (300x250 / 300x600)', height: 'h-64' },
    infeed: { label: 'In-Feed Native Ad', height: 'h-48' },
    'sticky-bottom': { label: 'Anchor Ad', height: 'h-16' },
  };

  const selected = specs[type];

  return (
    <div className={`ad-placeholder w-full ${selected.height} rounded-md flex flex-col items-center justify-center text-gray-400 p-4 border border-dashed border-gray-200 my-6 ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-widest mb-1 text-gray-300">Advertisement</span>
      <span className="text-xs italic">{selected.label}</span>
      <div className="mt-2 flex gap-1">
        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
};

export default AdUnit;
