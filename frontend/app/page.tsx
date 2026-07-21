'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from './authStore';
import { useRouter } from 'next/navigation';
import { useTheme } from './components/ThemeProvider';
import { Sparkles, Mail, Lock, ShieldCheck, User, Moon, Sun, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { theme, toggle } = useTheme();
  const isDarkMode = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Prefetch dashboards to compile/preload them ahead of time for instant login redirects
    router.prefetch('/recruiter');
    router.prefetch('/candidate/dashboard');
  }, [router]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'recruiter') {
        router.push('/recruiter');
      } else if (currentUser?.role === 'candidate') {
        router.push('/candidate/dashboard');
      } else {
        throw new Error('Unauthorized role');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#070b13] transition-colors duration-500 font-sans">
      
      {/* ─── DYNAMIC GLOWING BACKGROUND BLOBS ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] animate-pulse duration-10000" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-violet-600/15 blur-[120px] animate-pulse duration-7000" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)]" />
      </div>

      {/* ─── FLOATING CONTROL BUTTONS ─── */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {/* Light/Dark Toggle */}
        <button
          onClick={toggle}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
        </button>
      </div>

      {/* ─── MAIN LOGIN BOX ─── */}
      <div className="relative z-10 w-full max-w-[460px] mx-4 py-8">
        
        {/* Logo / Brand */}
        <div className="flex flex-col items-center justify-center text-center mb-8 space-y-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-xl shadow-blue-500/20 ring-1 ring-white/10">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">
                HireAI
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-450 uppercase tracking-widest ring-1 ring-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold tracking-wide">
              Next-Gen Autonomous Candidate Evaluation Platform
            </p>
          </div>
        </div>

        {/* Glassmorphic Auth Form Container */}
        <div className="bg-white/80 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800/80 rounded-[32px] p-6 lg:p-8 shadow-[0_20px_50px_rgba(8,12,28,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden">
          
          <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-2xl" />

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              Please authenticate to enter the workspace.
            </p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  placeholder="your.email@hireai.com"
                  className="w-full h-11 pl-11 pr-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 font-semibold transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450 block">
                  Password
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-11 pr-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 font-semibold transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-blue-550/45 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>




        </div>

        {/* Footer info */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-slate-400 font-bold tracking-wider">
            &copy; 2026 HireAI Platforms Inc. All security logs auditing enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
