import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { Module1Auth } from './components/Module1Auth';
import { Module2Assessment } from './components/Module2Assessment';
import { Module3Dashboard } from './components/Module3Dashboard';
import { Module4Roadmap } from './components/Module4Roadmap';
import { Module5Profile } from './components/Module5Profile';
import { ModuleResources } from './components/ModuleResources';
import { AcademicPhpViewer } from './components/AcademicPhpViewer';
import { Compass, Code2, Sparkles, Layers, ShieldCheck, ExternalLink } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, activeTab, setActiveTab } = useApp();

  const renderActiveView = () => {
    if (!user) {
      return <Module1Auth />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Module3Dashboard />;
      case 'assessment':
        return <Module2Assessment />;
      case 'roadmap':
        return <Module4Roadmap />;
      case 'resources':
        return <ModuleResources />;
      case 'profile':
        return <Module5Profile />;
      case 'academic_code':
        return <AcademicPhpViewer />;
      default:
        return <Module3Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--text-main)] transition-colors relative bg-grid-pattern selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient background glow accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <Navbar />

      <main className="flex-1 w-full pb-16">
        {renderActiveView()}
      </main>

      <ToastContainer />

      {/* Modern High-End Footer */}
      <footer
        id="main-site-footer"
        className="border-t border-[var(--app-border)] bg-[var(--app-canvas)] py-10 text-xs text-[var(--text-muted)] mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black">
              <Compass className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <p className="text-[var(--text-main)] font-extrabold font-display text-sm tracking-tight flex items-center gap-1.5">
                PathForge<span className="text-emerald-400 font-normal">.io</span>
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  BCA Mini-Project
                </span>
              </p>
              <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                Personalized Career Roadmap Generator & Skill Progress Tracking Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('academic_code')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-[var(--text-muted)]"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PHP/MySQL Source Architecture</span>
            </button>
            <span className="text-[var(--app-border-light)]">&bull;</span>
            <button
              onClick={() => setActiveTab('resources')}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-[var(--text-muted)]"
            >
              Curated Documentation
            </button>
            <span className="text-[var(--app-border-light)]">&bull;</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-[var(--text-muted)]"
            >
              JSON Data Snapshot
            </button>
          </div>

          <div className="text-[11px] text-[var(--text-subtle)] font-mono-code flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PHP 8 &bull; MySQL 8 &bull; PDO &bull; Chart.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
