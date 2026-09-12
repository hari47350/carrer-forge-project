import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import Analyze from './pages/analyze';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Jobs from './pages/JobMatcher';
import Insights from './pages/insights';
import ApplicationTracker from './pages/ApplicationTracker';  // ← ADD THIS
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import InterviewPrep from './pages/InterviewPrep';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/applications" element={<ApplicationTracker />} />  {/* ← ADD THIS */}
        <Route path="/cover-letter" element={<CoverLetterGenerator />} />
<Route path="/interview-prep" element={<InterviewPrep />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;