import { Link } from 'react-router-dom';
import { useState } from 'react';

// Mock data for insights
const skillGrowth = [
  { month: 'Jan', skills: 8 },
  { month: 'Feb', skills: 10 },
  { month: 'Mar', skills: 12 },
  { month: 'Apr', skills: 14 },
  { month: 'May', skills: 18 },
  { month: 'Jun', skills: 22 },
];

const applicationsData = [
  { status: 'Applied', count: 12, color: 'bg-blue-500' },
  { status: 'Interview', count: 6, color: 'bg-yellow-500' },
  { status: 'Offer', count: 2, color: 'bg-green-500' },
  { status: 'Rejected', count: 4, color: 'bg-red-500' },
];

const trendingSkills = [
  { name: 'AI/ML', growth: '+45%', demand: 'High' },
  { name: 'Python', growth: '+32%', demand: 'High' },
  { name: 'Docker', growth: '+28%', demand: 'Medium' },
  { name: 'Kubernetes', growth: '+25%', demand: 'High' },
  { name: 'React', growth: '+18%', demand: 'High' },
];

export default function Insights() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">⚡ Career Insights</h1>
        <p className="text-gray-400 mb-8">Track applications, prep for interviews, and visualize your skill growth</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📈 Overview
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'skills'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎯 Skills
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'applications'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Applications
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <p className="text-gray-400 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-blue-400">24</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <p className="text-gray-400 text-sm">Interview Rate</p>
                <p className="text-3xl font-bold text-yellow-400">25%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <p className="text-gray-400 text-sm">Offer Rate</p>
                <p className="text-3xl font-bold text-green-400">8%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <p className="text-gray-400 text-sm">Skills Added</p>
                <p className="text-3xl font-bold text-purple-400">22</p>
              </div>
            </div>

            {/* Skill Growth Chart (simple bar chart) */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-lg font-semibold mb-4">📈 Skills Growth</h3>
              <div className="flex justify-between items-end h-32 gap-2">
                {skillGrowth.map((item) => (
                  <div key={item.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-400"
                      style={{ height: `${(item.skills / 25) * 100}%`, maxHeight: '100px' }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                    <span className="text-xs text-gray-400">{item.skills}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Skills */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">🔥 Trending Skills</h3>
              <div className="space-y-3">
                {trendingSkills.map((skill) => (
                  <div key={skill.name} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className={`ml-3 text-sm ${
                        skill.demand === 'High' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {skill.demand} demand
                      </span>
                    </div>
                    <span className="text-orange-400">{skill.growth}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">🎯 Your Skill Profile</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>React</span>
                  <span className="text-orange-400">Expert</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange-500 rounded-full h-2" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>TypeScript</span>
                  <span className="text-orange-400">Advanced</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange-500 rounded-full h-2" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Java</span>
                  <span className="text-orange-400">Intermediate</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange-500 rounded-full h-2" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Docker</span>
                  <span className="text-orange-400">Beginner</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange-500 rounded-full h-2" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-400 text-sm">
                  💡 Focus on Docker and Kubernetes to increase your job match scores by 15-20%.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {applicationsData.map((item) => (
                <div key={item.status} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                  <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-2`}></div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-gray-400 text-sm">{item.status}</p>
                </div>
              ))}
            </div>

            {/* Recent Applications List */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">📋 Recent Applications</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <p className="font-medium">Senior Developer - TechCorp</p>
                    <p className="text-sm text-gray-400">Applied 2 days ago</p>
                  </div>
                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">Interview</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <p className="font-medium">Full Stack - DesignStudio</p>
                    <p className="text-sm text-gray-400">Applied 5 days ago</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">Applied</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <p className="font-medium">Java Developer - FinTech</p>
                    <p className="text-sm text-gray-400">Applied 1 week ago</p>
                  </div>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Offer</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">DevOps Engineer - CloudNative</p>
                    <p className="text-sm text-gray-400">Applied 2 weeks ago</p>
                  </div>
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}