
import React, { useState, useEffect } from 'react';
import { LEARNING_ICONS, SUBJECT_FACTS } from '../constants';
import { authAPI } from '../services/api';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFact, setActiveFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFact((prev) => (prev + 1) % SUBJECT_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ username, password });
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 overflow-hidden">
      {/* Animated Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {LEARNING_ICONS.map((item, idx) => (
          <div
            key={idx}
            className={`absolute animate-pulse ${item.color} opacity-10`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${idx * 0.5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Subject Info Slider */}
      <div className="absolute top-12 left-0 right-0 text-center px-4">
        <div className="inline-block px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-1000">
          <p className="text-white/60 text-sm italic font-light animate-in fade-in slide-in-from-bottom-2 duration-1000">
            "{SUBJECT_FACTS[activeFact]}"
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-200/60 text-sm">Sign in to SmartSchool Pro</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Username / Admin ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Password / Mobile</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Enter Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs">
              Powered by SmartSchool Pro &bull; AI Optimized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
