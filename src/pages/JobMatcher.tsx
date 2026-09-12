import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, MapPin, Briefcase, DollarSign, Check, Bookmark } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  jobType: string;
  matchScore: number;
  applyLink?: string;
}

export default function JobMatcher() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [country, setCountry] = useState('in'); // ✅ Default to India
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchSaved = async () => {
      try {
        const response = await api.get('/saved-jobs');
        const ids = response.data.map((item: any) => item.job.id);
        setSavedJobs(new Set(ids));
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
      }
    };
    fetchSaved();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated to accept country parameter
  const matchJobs = async (resumeText: string, location: string, countryCode: string) => {
    setLoading(true);
    try {
      const response = await api.post('/jobs/match', {
        resumeText: resumeText || 'Java Spring React AWS Docker',
        preferredLocation: location || 'Remote',
        country: countryCode || 'in'
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to match jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDescription = (jobId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const toggleSave = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save jobs.');
      return;
    }

    const isSaved = savedJobs.has(jobId);
    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await api.post('/saved-jobs', { jobId });
        setSavedJobs(prev => new Set(prev).add(jobId));
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      alert('Could not save job. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === '' || 
                           job.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">💼 Job Matcher</h1>
        <p className="text-gray-400 mb-8">Find jobs that match your skills and experience</p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Location (e.g., Hyderabad, Remote)"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>

          {/* ✅ Country Dropdown - NEW */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="us">🇺🇸 USA</option>
            <option value="in">🇮🇳 India</option>
            <option value="gb">🇬🇧 UK</option>
            <option value="ca">🇨🇦 Canada</option>
            <option value="au">🇦🇺 Australia</option>
            <option value="de">🇩🇪 Germany</option>
            <option value="sg">🇸🇬 Singapore</option>
            <option value="ae">🇦🇪 UAE</option>
          </select>

          <button
            onClick={() => matchJobs('', filterLocation, country)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition"
          >
            Match Jobs
          </button>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-2xl mb-2">🔍 No jobs found</p>
            <p>Try adjusting your search criteria or selecting a different country</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => {
              const isSaved = savedJobs.has(job.id);
              return (
                <div
                  key={job.id || `${job.title}-${job.company}-${index}`}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition cursor-pointer"
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getMatchColor(job.matchScore)}`}>
                          {job.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-gray-400">{job.company}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange || 'Competitive'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.jobType || 'Full-time'}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className={`text-gray-400 text-sm ${!expandedDescriptions[job.id] && 'line-clamp-2'}`}>
                          {job.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(job.id);
                          }}
                          className="text-orange-500 text-sm mt-1 hover:text-orange-400 transition"
                        >
                          {expandedDescriptions[job.id] ? 'Show Less' : 'Show More'}
                        </button>
                      </div>
                      
                      {job.requirements && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.requirements.split(',').map((skill, i) => (
                            <span key={i} className="bg-white/10 px-2 py-1 rounded-full text-xs text-gray-300">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (job.applyLink) {
                            window.open(job.applyLink, '_blank', 'noopener,noreferrer');
                          } else {
                            alert('No external application link available.');
                          }
                        }}
                      >
                        Apply Now
                      </button>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm transition flex items-center gap-1 ${
                          isSaved 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                        onClick={(e) => toggleSave(job.id, e)}
                      >
                        {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>

                  {selectedJob?.id === job.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="font-semibold mb-2">📊 Skill Gap Analysis</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          <span className="text-green-400">Matched skills:</span> {job.requirements ? 
                            job.requirements.split(',').slice(0, 3).join(', ') : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          💡 To increase your match score, focus on building skills in this role.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}