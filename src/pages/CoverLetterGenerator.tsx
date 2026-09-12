import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import { Copy, Check, Download } from 'lucide-react';

export default function CoverLetterGenerator() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLetter = async () => {
    if (!jobTitle || !company || !jobDescription) {
      alert('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/cover-letter/generate', {
        userName: localStorage.getItem('userName') || 'Applicant',
        jobTitle,
        company,
        jobDescription,
      });
      setLetter(response.data.coverLetter);
    } catch (error) {
      console.error('Failed to generate letter:', error);
      alert('Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">📝 Cover Letter Generator</h1>
        <p className="text-gray-400 mb-8">AI-powered cover letter tailored to your job application.</p>

        <div className="grid md:grid-cols-1 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="e.g., Senior Full Stack Developer"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="e.g., Google"
              />
            </div>
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
              onClick={generateLetter}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>
          </div>

          {letter && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Your Cover Letter</h3>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto whitespace-pre-wrap">
                {letter}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}