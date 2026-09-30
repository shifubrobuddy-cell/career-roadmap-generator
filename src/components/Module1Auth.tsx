import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const Module1Auth: React.FC = () => {
  const { login, addToast } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const errs: string[] = [];
    if (!username.trim() || username.length < 3) {
      errs.push('Username must be at least 3 characters long.');
    }
    if (isRegisterMode) {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.push('Please provide a valid email address.');
      }
      if (password.length < 8) {
        errs.push('Password must be at least 8 characters long.');
      }
      if (password !== confirmPassword) {
        errs.push('Passwords do not match.');
      }
    } else {
      if (!password) {
        errs.push('Please enter your password.');
      }
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isRegisterMode) {
      login(username.trim(), email.trim());
      addToast('success', 'Account Created!', 'Welcome to PathForge! Your personalized roadmap awaits.');
    } else {
      login(username.trim(), `${username.toLowerCase().replace(/\s+/g, '')}@student.edu`);
    }
  };

  const handleQuickDemoLogin = () => {
    login('shifubrobuddy', 'shifubrobuddy@gmail.com');
    addToast('success', 'Demo Session Loaded', 'Signed in as BCA Student demo account with pre-seeded progress.');
  };

  return (
    <div
      id="module-1-auth-container"
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      <div className="w-full max-w-4xl bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        {/* Left Hero Split */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/40 via-[var(--app-canvas)] to-[var(--app-card)] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[var(--app-border)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black">
                <Compass className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--text-main)] font-display tracking-tight">
                  PathForge<span className="text-emerald-400 font-normal">.io</span>
                </h2>
                <span className="text-[10px] text-emerald-400 font-mono-code font-bold uppercase tracking-wider">
                  BCA Mini-Project
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-[var(--text-main)] font-display tracking-tight leading-tight mb-3">
              Personalized Engineering Roadmaps.
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-8">
              Benchmark what you already know, eliminate tutorial overload, and track your milestone trajectory with real-time analytics.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">Diagnostic Baseline</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Check off existing skills to pre-credit hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">5 High-Demand Tech Tracks</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Web Dev, Data Analyst, UI/UX, Android, Marketing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">PHP/MySQL Defense Ready</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Full PDO, normalized schema, and viva notes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--app-border)] relative z-10">
            <span className="text-[10px] text-[var(--text-subtle)] font-mono-code block">
              Powered by PHP 8.0 &bull; MySQL &bull; Responsive CSS
            </span>
          </div>
        </div>

        {/* Right Form Split */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-[var(--app-card)]">
          <div>
            {/* Toggle header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--app-border)]">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-main)] font-display">
                  {isRegisterMode ? 'Create Student Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {isRegisterMode
                    ? 'Start tracking your personalized skill journey'
                    : 'Sign in to access your saved milestones'}
                </p>
              </div>

              <button
                id="btn-toggle-auth-mode"
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrors([]);
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : 'Need an account? Register'}
              </button>
            </div>

            {/* Error notifications */}
            {errors.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1 mb-6">
                {errors.map((err, i) => (
                  <p key={i} className="flex items-center gap-1.5 font-medium">
                    <span>&bull;</span> {err}
                  </p>
                ))}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="input-auth-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. shifubrobuddy"
                    className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="input-auth-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-auth-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 8 chars)"
                    className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-muted)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="input-auth-confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                id="btn-auth-submit"
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:scale-[1.01] mt-2"
              >
                {isRegisterMode ? 'Complete Registration & Continue' : 'Sign In to Dashboard &rarr;'}
              </button>
            </form>
          </div>

          {/* Quick Demo Login Option */}
          <div className="mt-8 pt-6 border-t border-[var(--app-border)] space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-subtle)]">
              <span>BCA Academic Review Mode</span>
              <span className="text-[10px] font-mono-code font-bold uppercase text-emerald-400">
                1-Click Demo
              </span>
            </div>

            <button
              id="btn-quick-demo-login"
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-2xl bg-[var(--app-canvas)] hover:bg-emerald-500/10 border border-[var(--app-border)] hover:border-emerald-500/40 text-xs font-bold text-[var(--text-main)] hover:text-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Load Pre-Seeded BCA Student Demo Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
