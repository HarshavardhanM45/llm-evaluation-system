import React from 'react';

export default function OverallSummary({ results }) {
  if (!results || !results.verdict) return null;

  const { overall_score, final_verdict, consolidated_reasoning } = results.verdict;
  
  let grade = "F";
  let color = "text-red-600";
  
  if (final_verdict === "Pass") { grade = "Pass"; color = "text-green-600"; }
  else if (final_verdict === "Needs Improvement") { grade = "Needs Improvement"; color = "text-yellow-600"; }
  else { grade = "Fail"; color = "text-red-600"; }

  return (
    <section className="glass-panel p-8 text-center flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
      <h3 className="text-lg text-gray-500 font-medium mb-2">Overall Evaluation (Verdict Agent)</h3>
      <div className="flex items-end gap-3">
        <span className="text-6xl font-black text-gray-900">{overall_score}</span>
        <span className="text-xl text-gray-400 mb-1">/ 100</span>
      </div>
      <div className={`mt-4 text-2xl font-bold ${color}`}>{grade}</div>
      <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto italic">
        "{consolidated_reasoning}"
      </p>
    </section>
  );
}
