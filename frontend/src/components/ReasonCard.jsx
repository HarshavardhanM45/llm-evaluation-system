import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ReasonCard({ title, content, icon: Icon }) {
  if (!content) return null;
  
  return (
    <article className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
      <div className="text-gray-600 prose max-w-none text-base">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
