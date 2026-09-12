import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navigation Bar */}
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <div className="text-2xl font-bold flex items-center gap-2">
          <span className="text-orange-500 text-3xl">⚒️</span> 
          <span>CareerForge</span>
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full ml-2">AI-powered</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition text-sm">
            Sign in
          </Link>
          <Link to="/register">
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Forge Your Career Path
          </h1>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Beat the applicant tracking systems, match with the right roles, and land interviews faster with AI that reads your resume like a recruiter.
          </p>
          
          <Link to="/analyze">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full text-base font-semibold transition">
              Get Started Free →
            </button>
          </Link>
          
          <div className="flex flex-wrap gap-6 justify-center mt-6 text-sm text-gray-500">
            <span>✓ No credit card</span>
            <span>✓ Instant ATS score</span>
            <span>✓ Free forever plan</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Card 1 - AI Resume Scoring */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-orange-500/30 transition">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Resume Scoring</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get an instant ATS score with category breakdowns, keyword gaps, and section-by-section feedback.
            </p>
          </div>

          {/* Card 2 - Smart Job Matching (CLICKABLE) */}
          <Link to="/jobs" className="block">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover roles ranked by real skills, experience, and domain with a clear skill-gap map.
              </p>
            </div>
          </Link>

          {/* Card 3 - Career Insights (CLICKABLE) */}
          <Link to="/insights" className="block">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Insights</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Track applications, prep for interviews, and visualize your skill growth over time.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}