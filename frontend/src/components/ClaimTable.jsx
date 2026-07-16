import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function ClaimTable({ supportedClaims = [], unsupportedClaims = [] }) {
  const hasClaims = supportedClaims.length > 0 || unsupportedClaims.length > 0;

  if (!hasClaims) {
    return (
      <section className="glass-panel p-6 text-center text-gray-500">
        No claims extracted for hallucination detection.
      </section>
    );
  }

  return (
    <section className="glass-panel overflow-hidden" aria-labelledby="claim-analysis-heading">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" aria-hidden="true" />
        <h3 id="claim-analysis-heading" className="font-semibold text-gray-900">Extracted Claims Analysis</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {supportedClaims.map((claim, idx) => (
          <article key={`supported-${idx}`} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-gray-700 text-base leading-relaxed">{claim}</span>
          </article>
        ))}
        {unsupportedClaims.map((claim, idx) => (
          <article key={`unsupported-${idx}`} className="p-4 flex gap-3 hover:bg-red-50/50 transition-colors bg-red-50">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-gray-800 text-base leading-relaxed">{claim}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
