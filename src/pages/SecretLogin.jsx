// ============================================================
// frontend/src/pages/SecretLogin.jsx
// ============================================================
// Clean login page — no hardcoded credentials, minimal GSAP.
// ============================================================

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SecretLogin = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useContext(AuthContext);
  const navigate   = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/authenticate-master', { replace: true });
    } else {
      setError(result.message || 'Access Denied. Invalid master credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1f14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-olivia-gold opacity-[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-150px] left-[-80px] w-[400px] h-[400px] bg-olivia-green opacity-[0.08] rounded-full blur-[100px]" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-olivia-gold rounded-full mx-auto flex items-center justify-center font-bold text-[#0a1f14] text-3xl mb-4 shadow-[0_0_40px_rgba(251,191,36,0.25)]">
            ✦
          </div>
          <h1 className="text-2xl font-serif text-white tracking-wide">
            Master Authentication
          </h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.3em]">
            Admin Access Only
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#112b1d] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="text-red-400 text-center text-sm mb-6 bg-red-900/20 py-3 rounded-lg border border-red-900/50 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-olivia-gold focus:ring-1 focus:ring-olivia-gold/30 text-white placeholder-gray-600 transition-all"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-olivia-gold focus:ring-1 focus:ring-olivia-gold/30 text-white placeholder-gray-600 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-olivia-gold hover:bg-yellow-400 text-[#0a1f14] font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a1f14]/30 border-t-[#0a1f14] rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-gray-500 hover:text-olivia-gold text-xs uppercase tracking-[0.2em] transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecretLogin;