import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import InputForm from '../components/InputForm';
import ScoreCard from '../components/ScoreCard';
import ReasonCard from '../components/ReasonCard';
import ClaimTable from '../components/ClaimTable';
import LoadingSpinner from '../components/LoadingSpinner';
import OverallSummary from '../components/OverallSummary';
import { evaluateAll } from '../services/api';
import { Target, CheckSquare, BrainCircuit, Info, AlertOctagon } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Smooth scroll to results
  useEffect(() => {
    if (results && !loading) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [results, loading]);

  const handleEvaluate = async (formData) => {
    setLoading(true);
    setResults(null);
    try {
      const data = await evaluateAll(formData);
      setResults(data);
    } catch (err) {
      alert("Evaluation failed. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            AI Response Evaluation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test and benchmark LLM outputs using three independent AI judges for relevance, factual accuracy, and hallucination detection.
          </p>
        </header>

        <section className="max-w-4xl mx-auto mb-16">
          <InputForm onSubmit={handleEvaluate} isLoading={loading} />
        </section>

        {loading && (
          <div className="mb-16">
            <LoadingSpinner />
          </div>
        )}

        {results && !loading && (
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700" aria-label="Evaluation Results">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard 
                title="Relevance" 
                score={results.relevance?.score || 0} 
                icon={Target} 
                colorClass="bg-blue-600" 
              />
              <ScoreCard 
                title="Accuracy" 
                score={results.accuracy?.score || 0} 
                icon={CheckSquare} 
                colorClass="bg-green-600" 
              />
              <ScoreCard 
                title="Hallucination" 
                score={results.hallucination?.hallucination_score || 0} 
                icon={BrainCircuit} 
                colorClass="bg-red-600" 
              />
            </div>

            <OverallSummary results={results} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReasonCard 
                title="Relevance Reasoning" 
                content={results.relevance?.reason} 
                icon={Info} 
              />
              <ReasonCard 
                title="Accuracy Evidence" 
                content={results.accuracy?.evidence} 
                icon={CheckSquare} 
              />
              <ReasonCard 
                title="Missing Information" 
                content={results.accuracy?.missing_information} 
                icon={AlertOctagon} 
              />
              <ReasonCard 
                title="Hallucination Analysis" 
                content={results.hallucination?.reason} 
                icon={BrainCircuit} 
              />
            </div>

            <ClaimTable 
              supportedClaims={results.hallucination?.supported_claims}
              unsupportedClaims={results.hallucination?.unsupported_claims}
            />
          </section>
        )}
      </main>
    </div>
  );
}
