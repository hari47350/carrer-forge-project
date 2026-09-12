import { Link } from 'react-router-dom';
import { useState } from 'react';

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    salary: '$120k - $160k',
    matchScore: 92,
    skillsMatch: ['React', 'Node.js', 'TypeScript', 'AWS'],
    missingSkills: ['Docker', 'Kubernetes'],
    description: 'Build scalable web applications for enterprise clients.'
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'DesignStudio',
    location: 'New York, NY',
    salary: '$100k - $130k',
    matchScore: 85,
    skillsMatch: ['React', 'Tailwind CSS', 'TypeScript'],
    missingSkills: ['Vue.js', 'Next.js'],
    description: 'Create pixel-perfect user interfaces for our design system.'
  },
  {
    id: 3,
    title: 'Java Backend Developer',
    company: 'FinTech Solutions',
    location: 'Austin, TX',
    salary: '$130k - $170k',
    matchScore: 78,
    skillsMatch: ['Java', 'Spring Boot', 'PostgreSQL'],
    missingSkills: ['Microservices', 'Kafka'],
    description: 'Build robust financial APIs serving millions of users.'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudNative Inc.',
    location: 'Remote',
    salary: '$140k - $180k',
    matchScore: 65,
    skillsMatch: ['AWS', 'Docker', 'Linux'],
    missingSkills: ['Kubernetes', 'Terraform', 'CI/CD'],
    description: 'Manage cloud infrastructure and deployment pipelines.'
  }
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === 'all' || job.location.includes(location);
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">💼 Smart Job Matching</h1>
        <p className="text-gray-400 mb-8">Discover roles ranked by your skills and experience</p>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-white"
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
          >
            <option value="all">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="Austin">Austin</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      job.matchScore >= 80 ? 'bg-green-500/20 text-green-400' :
                      job.matchScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {job.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-gray-400">{job.company} • {job.location} • {job.salary}</p>
                  <p className="text-gray-500 text-sm mt-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs text-gray-500">Skills you have:</span>
                    {job.skillsMatch.map((skill, i) => (
                      <span key={i} className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        ✅ {skill}
                      </span>
                    ))}
                    {job.missingSkills.map((skill, i) => (
                      <span key={i} className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                        ❌ {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition">
                    Apply Now
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
                    Save
                  </button>
                </div>
              </div>

              {/* Skill Gap Details - Show only when selected */}
              {selectedJob?.id === job.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="font-semibold mb-2">📊 Skill Gap Analysis</h4>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      <span className="text-green-400">You match {job.skillsMatch.length} skills</span>
                      {' • '}
                      <span className="text-red-400">Missing {job.missingSkills.length} skills</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      💡 To increase your match score, consider learning: {job.missingSkills.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-400 py-12">No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}