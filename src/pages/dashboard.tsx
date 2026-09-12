import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  LogOut, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  X
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState({
    totalResumes: 0,
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName') || 'User';
    if (!token) {
      navigate('/login');
    }
    setUserName(name);
    
    // Load stats from localStorage or API
    const savedStats = localStorage.getItem('dashboardStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white/10 p-2 rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#1a1a2e] border-r border-white/5 p-6 transition-transform z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">⚒️</span>
          <span className="text-xl font-bold">CareerForge</span>
        </div>

        <nav className="space-y-2">
          <Link to="/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/20 rounded-lg text-orange-400">
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/analyze">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition">
              <FileText className="w-5 h-5" />
              <span>Resume Analyzer</span>
            </div>
          </Link>
          <Link to="/jobs">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition">
              <Briefcase className="w-5 h-5" />
              <span>Job Matcher</span>
            </div>
          </Link>
          <Link to="/applications">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition">
              <CheckCircle className="w-5 h-5" />
              <span>Applications</span>
            </div>
          </Link>
          <Link to="/insights">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition">
              <Award className="w-5 h-5" />
              <span>Career Insights</span>
            </div>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 rounded-lg text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {userName}! 👋</h1>
            <p className="text-gray-400 mt-1">Here's your career progress overview</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalResumes}</p>
                <p className="text-gray-400 text-sm">Resumes</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications}</p>
                <p className="text-gray-400 text-sm">Applications</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.interviews}</p>
                <p className="text-gray-400 text-sm">Interviews</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.offers}</p>
                <p className="text-gray-400 text-sm">Offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/analyze">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold group-hover:text-orange-400 transition">Analyze Resume</p>
                  <p className="text-gray-400 text-sm">Get your ATS score</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/jobs">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <p className="font-semibold group-hover:text-orange-400 transition">Find Jobs</p>
                  <p className="text-gray-400 text-sm">Discover your perfect role</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/applications">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 transition cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="font-semibold group-hover:text-orange-400 transition">Track Applications</p>
                  <p className="text-gray-400 text-sm">Manage your progress</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}