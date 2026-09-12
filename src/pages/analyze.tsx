import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      alert('Please upload a resume and paste a job description');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setResult({
        overallScore: 78,
        matchedKeywords: ['Java', 'Spring', 'Microservices'],
        missingKeywords: ['Docker', 'Kubernetes', 'AWS'],
        recommendations: ['Add Docker to your skills', 'Quantify achievements'],
        summary: 'Good foundation but missing cloud technologies'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-center mb-8">Resume Analyzer</h1>
        
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Upload Resume (PDF/DOCX)</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <p className="text-gray-400">{file ? file.name : 'Click to upload or drag and drop'}</p>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Paste the job description here..."
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
        
        {result && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4">📊 Results</h2>
            <div className="flex items-center mb-4">
              <span className="text-5xl font-bold text-orange-500 mr-4">{result.overallScore}%</span>
              <span className="text-gray-400">Overall ATS Score</span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">✅ Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords.map((kw: string, i: number) => (
                  <span key={i} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">{kw}</span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">❌ Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw: string, i: number) => (
                  <span key={i} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">{kw}</span>
                ))}
              </div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-blue-400">{result.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}