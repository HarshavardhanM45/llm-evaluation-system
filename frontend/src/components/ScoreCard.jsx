import React from 'react';

export default function ScoreCard({ title, score, icon: Icon, colorClass }) {
  const textColorClass = colorClass.replace('bg-', 'text-');
  
  return (
    <article className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${colorClass}`}></div>
      <div className="flex items-center gap-2 mb-4 text-gray-600">
        {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90" aria-label={`${title} score is ${score} out of 100`}>
          <circle cx="64" cy="64" r="56" className="stroke-current text-gray-100" strokeWidth="12" fill="transparent" />
          <circle 
            cx="64" cy="64" r="56" 
            className={`stroke-current ${textColorClass} transition-all duration-1000 ease-out`} 
            strokeWidth="12" 
            fill="transparent"
            strokeDasharray={351.86}
            strokeDashoffset={351.86 - (351.86 * score) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
    </article>
  );
}
