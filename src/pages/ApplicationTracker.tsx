import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Briefcase,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
  matchScore: number;
  notes: string;
}

const statusColors = {
  APPLIED: 'bg-blue-500/20 text-blue-400',
  REVIEWING: 'bg-yellow-500/20 text-yellow-400',
  INTERVIEW: 'bg-purple-500/20 text-purple-400',
  OFFER: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
};

const statusOrder = ['APPLIED', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApp, setNewApp] = useState({
    jobTitle: '',
    company: '',
    status: 'APPLIED',
    notes: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      // For demo, load from localStorage
      const saved = localStorage.getItem('applications');
      if (saved) {
        setApplications(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.jobTitle || !newApp.company) {
      alert('Please fill in job title and company');
      return;
    }

    const app: Application = {
      id: Date.now().toString(),
      jobTitle: newApp.jobTitle,
      company: newApp.company,
      status: newApp.status,
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: Math.floor(Math.random() * 30) + 70,
      notes: newApp.notes,
    };

    const updated = [app, ...applications];
    setApplications(updated);
    localStorage.setItem('applications', JSON.stringify(updated));
    setShowAddForm(false);
    setNewApp({ jobTitle: '', company: '', status: 'APPLIED', notes: '' });

    // Try to save to backend
    try {
      await api.post('/applications', {
        jobId: '00000000-0000-0000-0000-000000000000',
        matchScore: app.matchScore,
        notes: app.notes,
      });
    } catch (error) {
      console.log('Backend not available – saved locally');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem('applications', JSON.stringify(updated));

    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
    } catch (error) {
      console.log('Backend not available – updated locally');
    }
  };

  const getStats = () => {
    const total = applications.length;
    const byStatus = statusOrder.map(status => ({
      status,
      count: applications.filter(a => a.status === status).length,
    }));
    return { total, byStatus };
  };

  const stats = getStats();

  const filteredApps = selectedStatus 
    ? applications.filter(a => a.status === selectedStatus)
    : applications;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/" className="text-orange-500 hover:text-orange-400 transition inline-block mb-6">
          ← Back to Home
        </Link>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">📋 Application Tracker</h1>
            <p className="text-gray-400 mt-1">Manage all your job applications in one place</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-gray-400 text-sm">Total</p>
          </div>
          {stats.byStatus.map(({ status, count }) => (
            <div key={status} className="bg-white/5 rounded-xl p-4 text-center border border-white/5 cursor-pointer hover:bg-white/10 transition"
                 onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}>
              <p className="text-2xl font-bold">{count}</p>
              <p className={`text-sm ${statusColors[status as keyof typeof statusColors]}`}>
                {status}
              </p>
            </div>
          ))}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-semibold mb-4">Add New Application</h3>
            <form onSubmit={handleAddApplication} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                value={newApp.jobTitle}
                onChange={(e) => setNewApp({ ...newApp, jobTitle: e.target.value })}
                className="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={newApp.company}
                onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                className="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
                required
              />
              <select
                value={newApp.status}
                onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                className="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                {statusOrder.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea
                placeholder="Notes"
                value={newApp.notes}
                onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                className="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white md:col-span-2"
                rows={2}
              />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition">
                  Save
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Application Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-2xl mb-2">📭 No applications yet</p>
            <p>Click "Add Application" to start tracking your job search</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-semibold">{app.jobTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${statusColors[app.status as keyof typeof statusColors]}`}>
                        {app.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm bg-orange-500/20 text-orange-400">
                        {app.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-gray-400">{app.company}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>📅 Applied: {app.appliedDate}</span>
                      {app.notes && <span>📝 {app.notes}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="bg-white/10 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      {statusOrder.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}