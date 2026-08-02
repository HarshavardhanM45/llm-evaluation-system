import React, { useState } from 'react';
import { evaluateBatch } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function BatchEvaluation() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await evaluateBatch(file);
      setResults(data.batch_results);
    } catch (err) {
      setError("Batch evaluation failed. Please make sure you uploaded a valid CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Batch Evaluation</h2>
      <p className="text-gray-600 mb-6">Upload a CSV file containing question, response, reference_answer, and source_context columns to evaluate multiple entries at once.</p>
      
      <div className="flex items-center space-x-4 mb-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>
          <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
        </label>
      </div>
      
      {file && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="text-blue-500 w-6 h-6" />
            <span className="text-sm font-medium text-gray-700">{file.name}</span>
          </div>
          <button 
            onClick={handleUpload} 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Evaluating..." : "Run Batch"}
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {results && (
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Results ({results.length} entries)</h3>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Question</th>
                <th className="px-6 py-3">Final Verdict</th>
                <th className="px-6 py-3">Overall Score</th>
                <th className="px-6 py-3">Relevance</th>
                <th className="px-6 py-3">Accuracy</th>
                <th className="px-6 py-3">Completeness</th>
                <th className="px-6 py-3">Hallucination</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap max-w-xs truncate" title={res.original_data.question}>
                    {res.original_data.question}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      res.evaluation.verdict.final_verdict === 'Pass' ? 'bg-green-100 text-green-800' :
                      res.evaluation.verdict.final_verdict === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {res.evaluation.verdict.final_verdict}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{res.evaluation.verdict.overall_score}</td>
                  <td className="px-6 py-4">{res.evaluation.relevance.score}</td>
                  <td className="px-6 py-4">{res.evaluation.accuracy.score}</td>
                  <td className="px-6 py-4">{res.evaluation.completeness.score}</td>
                  <td className="px-6 py-4">{res.evaluation.hallucination.hallucination_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
