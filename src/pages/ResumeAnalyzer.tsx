import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import { Loader2, CheckCircle, XCircle, Lightbulb, Award, BookOpen, Sparkles, FileText, Briefcase } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Please upload a resume and paste a job description');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
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
        
        <h1 className="text-4xl font-bold text-center mb-8">📊 Resume Analyzer</h1>
        
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Upload Resume (PDF, DOCX, DOC)</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">{file ? file.name : 'Click to upload or drag and drop'}</p>
                <p className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, DOC</p>
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
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" />
                Analyzing with AI...
              </span>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </form>
        
        {result && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-4">📊 Analysis Results</h2>
            
            {/* Overall Score */}
            <div className="flex items-center mb-6">
              <span className="text-5xl font-bold text-orange-500 mr-4">{result.overallScore || 0}%</span>
              <span className="text-gray-400">Overall ATS Score</span>
            </div>

            {/* Category Scores */}
            {result.categoryScores && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {Object.entries(result.categoryScores).map(([key, value]) => (
                  <div key={key} className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400">{key}</p>
                    <p className="text-xl font-semibold">{value as number}%</p>
                  </div>
                ))}
              </div>
            )}

            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Strengths
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  {result.strengths.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {result.weaknesses && result.weaknesses.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Areas for Improvement
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  {result.weaknesses.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actionable Tips */}
            {result.actionableTips && result.actionableTips.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Actionable Tips
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                  {result.actionableTips.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Template Suggestion */}
            {result.templateSuggestion && (
              <div className="mb-4 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Recommended Resume Template
                </h3>
                <p className="text-gray-300">{result.templateSuggestion}</p>
              </div>
            )}

            {/* Extracted Skills */}
            {result.extractedSkills && result.extractedSkills.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.extractedSkills.map((skill: string, i: number) => (
                    <span key={i} className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Education Summary */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {result.experienceSummary && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <h3 className="font-semibold text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Experience
                  </h3>
                  <p className="text-gray-300">{result.experienceSummary}</p>
                </div>
              )}
              {result.educationSummary && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <h3 className="font-semibold text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Education
                  </h3>
                  <p className="text-gray-300">{result.educationSummary}</p>
                </div>
              )}
            </div>

            {/* Matched / Missing Keywords */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">✅ Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw: string, i: number) => (
                      <span key={i} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {result.missingKeywords && result.missingKeywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">❌ Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            {result.summary && (
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <p className="text-blue-400">📌 {result.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}