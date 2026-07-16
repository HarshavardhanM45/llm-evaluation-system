import React, { useState } from 'react';

export default function InputForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    question: '',
    response: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.response.trim()) {
      setError('Question and AI Response are required fields.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <section aria-labelledby="evaluation-form-heading">
      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
        <h2 id="evaluation-form-heading" className="text-xl font-semibold mb-4 text-gray-900">Evaluation Input</h2>
        
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-base" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="question-input" className="block text-base font-medium text-gray-700 mb-1">Question *</label>
            <textarea
              id="question-input"
              name="question"
              rows="2"
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder-gray-400"
              placeholder="Enter the question asked to the AI..."
              value={formData.question}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="response-input" className="block text-base font-medium text-gray-700 mb-1">AI Response *</label>
            <textarea
              id="response-input"
              name="response"
              rows="4"
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder-gray-400"
              placeholder="Enter the AI's response to evaluate..."
              value={formData.response}
              onChange={handleChange}
              aria-required="true"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white text-lg font-medium rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
        >
          {isLoading ? 'Evaluating...' : 'Evaluate Response'}
        </button>
      </form>
    </section>
  );
}
