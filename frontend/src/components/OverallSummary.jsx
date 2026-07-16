import React from 'react';

export default function OverallSummary({ results }) {
  if (!results) return null;

  const relScore = results.relevance?.score || 0;
  const accScore = results.accuracy?.score || 0;
  const halScore = results.hallucination?.hallucination_score || 0; 
  
  const invertedHalScore = 100 - halScore;
  const overall = Math.round((relScore + accScore + invertedHalScore) / 3);
  
  let grade = "F";
  let color = "text-red-600";
  
  if (overall >= 90) { grade = "A"; color = "text-green-600"; }
  else if (overall >= 80) { grade = "B"; color = "text-blue-600"; }
  else if (overall >= 70) { grade = "C"; color = "text-yellow-600"; }
  else if (overall >= 60) { grade = "D"; color = "text-orange-600"; }

  return (
    <section className="glass-panel p-8 text-center flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
      <h3 className="text-lg text-gray-500 font-medium mb-2">Overall Evaluation</h3>
      <div className="flex items-end gap-3">
        <span className="text-6xl font-black text-gray-900">{overall}</span>
        <span className="text-xl text-gray-400 mb-1">/ 100</span>
      </div>
      <div className={`mt-4 text-2xl font-bold ${color}`}>Grade {grade}</div>
      <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto">
        This score is an aggregate of relevance, accuracy, and inversely proportional to the hallucination rate.
      </p>
    </section>
  );
}
