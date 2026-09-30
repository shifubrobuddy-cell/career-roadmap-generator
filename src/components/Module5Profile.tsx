import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Lock,
  Download,
  Key,
  Calendar,
  Mail,
  Shield,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Server,
  Database,
  Code2,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';

export const Module5Profile: React.FC = () => {
  const { user, changePassword, exportDataJson, updateUserGoal, addToast, setActiveTab } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [goalInput, setGoalInput] = useState(user?.target_goal || 'Full-Stack Software Engineer & SaaS Builder');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!currentPassword) {
      errs.push('Please provide your current password.');
    }
    if (newPassword.length < 8) {
      errs.push('New password must be at least 8 characters long.');
    }
    if (newPassword !== confirmPassword) {
      errs.push('New passwords do not match.');
    }

    if (errs.length > 0) {
      setPasswordErrors(errs);
      return;
    }

    const success = changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors([]);
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserGoal(goalInput);
  };

  return (
    <div id="module-5-profile-wrapper" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 mb-2 inline-block">
            Module 5 &bull; Student Account & Data Export
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
            Account Profile & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Manage your credentials, update your learning goals, and export your entire roadmap progress as a structured JSON snapshot.
          </p>
        </div>

        <button
          onClick={exportDataJson}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Roadmap (JSON)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Account Details & Goal */}
        <div className="lg:col-span-6 space-y-6">
          {/* User Account Info Card */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20 uppercase">
                {user?.username.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)] font-display">{user?.username}</h2>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user?.email}</span>
                </p>
                <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mt-2 inline-block">
                  Student User ID: #{user?.user_id}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--app-border)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--text-subtle)]" /> Member Since:
                </span>
                <span className="text-[var(--text-main)] font-mono-code font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'August 2026'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Active Study Streak:
                </span>
                <span className="text-amber-400 font-mono-code font-bold">
                  {user?.study_streak_days || 14} Days Active 🔥
                </span>
              </div>
            </div>
          </div>

          {/* Goal & Milestone Target Form */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--app-border)]">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-[var(--text-main)] font-display">
                Career Target & Objective
              </h3>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                  Primary Milestone Objective
                </label>
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer & SaaS Builder"
                  className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl p-3 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Save Milestone Goal
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Password & JSON Exporter */}
        <div className="lg:col-span-6 space-y-6">
          {/* Password Change Form */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--app-border)]">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-[var(--text-main)] font-display">
                Security & Password Management
              </h3>
            </div>

            {passwordErrors.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                {passwordErrors.map((err, i) => (
                  <p key={i}>&bull; {err}</p>
                ))}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--app-canvas)] hover:bg-emerald-500 border border-[var(--app-border)] hover:border-emerald-400 text-xs font-bold text-[var(--text-main)] hover:text-slate-950 transition-all cursor-pointer"
              >
                Update Password Hash
              </button>
            </form>
          </div>

          {/* JSON Export Card */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--app-border)]">
              <FileJson className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-[var(--text-main)] font-display">
                Data Portability & Academic Export
              </h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Export a complete structured JSON snapshot containing your user profile, active career summaries, milestone completion statuses, notes, and timestamp metrics.
            </p>

            <button
              id="btn-export-json-action"
              onClick={exportDataJson}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Progress Snapshot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
