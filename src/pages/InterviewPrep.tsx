import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';

export default function InterviewPrep() {
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!jobDescription) {
      alert('Please paste the job description.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/interview/questions', { jobDescription });
      // Assuming response.data.questions is a JSON array string; parse it
      const parsed = JSON.parse(response.data.questions);
      setQuestions(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      alert('Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">🎤 Interview Prep</h1>
        <p className="text-gray-400 mb-8">Generate targeted interview questions based on the job description.</p>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Paste the job description..."
            />
          </div>
          <button
            onClick={generateQuestions}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Interview Questions'}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Interview Questions</h3>
            <ul className="list-decimal list-inside space-y-2">
              {questions.map((q, idx) => (
                <li key={idx} className="text-gray-300">{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}