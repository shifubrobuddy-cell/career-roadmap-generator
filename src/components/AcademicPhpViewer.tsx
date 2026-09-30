import React, { useState } from 'react';
import { PHP_PROJECT_FILES, PhpFile } from '../data/phpSourceCode';
import { useApp } from '../context/AppContext';
import {
  Code2,
  FileCode,
  Database,
  Download,
  Copy,
  Check,
  Server,
  Layers,
  FolderTree,
  BookOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const AcademicPhpViewer: React.FC = () => {
  const { addToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<PhpFile>(PHP_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'viva'>('files');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    addToast('success', 'Code Copied', `${selectedFile.path} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = (file: PhpFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'File Downloaded', `Downloaded ${file.name}`);
  };

  const handleDownloadAllFiles = () => {
    PHP_PROJECT_FILES.forEach((file, index) => {
      setTimeout(() => {
        handleDownloadSingleFile(file);
      }, index * 200);
    });
    addToast('success', 'Batch Export Started', `Exporting all ${PHP_PROJECT_FILES.length} PHP & SQL files.`);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'database':
        return (
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25 font-mono-code font-bold">
            SQL Schema
          </span>
        );
      case 'config':
        return (
          <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/25 font-mono-code font-bold">
            Config / PDO
          </span>
        );
      case 'api':
        return (
          <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/25 font-mono-code font-bold">
            AJAX API
          </span>
        );
      case 'assets':
        return (
          <span className="text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/25 font-mono-code font-bold">
            CSS System
          </span>
        );
      default:
        return (
          <span className="text-[10px] bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/25 font-mono-code font-bold">
            PHP Script
          </span>
        );
    }
  };

  const vivaQuestions = [
    {
      q: 'Why use PDO (PHP Data Objects) instead of legacy mysqli or raw queries?',
      a: 'PDO provides a unified database abstraction layer supporting prepared statements with parameter binding. Prepared statements separate query structure from user input data, completely immunizing the application against SQL Injection attacks. Furthermore, PDO provides granular transaction controls (beginTransaction, commit, rollBack).',
    },
    {
      q: 'How is password security enforced in the project?',
      a: 'Passwords are never stored in plaintext. We utilize PHP 8 password_hash() with the modern BCRYPT hashing algorithm, which dynamically applies cryptographically secure per-user salts and cost factors. Verification is done via password_verify() to prevent timing attacks.',
    },
    {
      q: 'How does the AJAX progress updater work without full-page refreshes?',
      a: 'When the student updates a skill milestone on the roadmap, client-side JavaScript issues an asynchronous fetch() POST request with JSON to update_progress.php. The backend updates user_progress via an ON DUPLICATE KEY UPDATE query, computes overall percentage, and returns JSON. The UI updates dynamically in real-time.',
    },
    {
      q: 'How is XSS (Cross-Site Scripting) prevented across the application?',
      a: 'All dynamic user-controlled data rendered into HTML is sanitized using htmlspecialchars($var, ENT_QUOTES, \'UTF-8\') wrapped in a helper function e(). This encodes characters like <, >, ", and \' into benign HTML entities.',
    },
    {
      q: 'What is the purpose of the user_skills vs user_progress relational separation?',
      a: 'user_skills records initial baseline diagnostic self-assessment (marking whether a skill was already known prior to generating the roadmap), while user_progress tracks active milestone progression (not_started, in_progress, completed) with timestamps for longitudinal study velocity.',
    },
  ];

  return (
    <div id="academic-php-viewer-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5 font-mono-code">
              <Code2 className="w-3.5 h-3.5" />
              <span>BCA Academic Final Project Defense</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
            PHP / MySQL Source Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
            Inspect, copy, and export all generated PHP backend scripts, PDO database configurations, and normalized MySQL schemas ready for execution in XAMPP.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            id="btn-download-all-php-project"
            onClick={handleDownloadAllFiles}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export All Source Files ({PHP_PROJECT_FILES.length})</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--app-border)] pb-3">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'files'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--app-card)] border border-[var(--app-border)]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Project File Tree ({PHP_PROJECT_FILES.length} Files)</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'viva'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--app-card)] border border-[var(--app-border)]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Viva Voce Defense Q&A</span>
        </button>
      </div>

      {activeTab === 'files' ? (
        /* FILE BROWSER & CODE VIEWER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Explorer Sidebar */}
          <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-emerald-400" /> Project Structure
              </span>
              <span className="text-[10px] text-[var(--text-subtle)] font-mono-code">/htdocs/careerpath/</span>
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {PHP_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    id={`btn-select-file-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-3 rounded-2xl text-xs flex flex-col gap-1 transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-[var(--text-main)] shadow-sm'
                        : 'bg-[var(--app-canvas)] border-[var(--app-border)] text-[var(--text-muted)] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code font-bold flex items-center gap-1.5 text-[var(--text-main)]">
                        <FileCode
                          className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-[var(--text-subtle)]'}`}
                        />
                        {file.path}
                      </span>
                      {getCategoryBadge(file.category)}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{file.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl shadow-xl overflow-hidden flex flex-col">
            {/* Header bar */}
            <div className="p-4 sm:p-5 bg-[var(--app-canvas)] border-b border-[var(--app-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-mono-code font-bold text-[var(--text-main)]">
                    {selectedFile.path}
                  </h3>
                  {getCategoryBadge(selectedFile.category)}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{selectedFile.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-active-file-code"
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--app-card)] hover:bg-[var(--app-card-elevated)] border border-[var(--app-border)] text-[var(--text-main)] text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  id="btn-download-active-file"
                  type="button"
                  onClick={() => handleDownloadSingleFile(selectedFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Content Container */}
            <div className="p-5 overflow-x-auto bg-[#07090E] font-mono-code text-xs leading-relaxed text-slate-200 max-h-[600px] select-text">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* VIVA VOCE DEFENSE GUIDE */
        <div className="space-y-6">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-7 rounded-3xl">
            <h2 className="text-lg font-bold text-[var(--text-main)] font-display mb-1">
              BCA Mini-Project Technical Defense & Viva Voce Q&A
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Core software engineering and database design concepts to explain when demonstrating the platform to professors and evaluators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vivaQuestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-3xl space-y-3 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono-code">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text-main)] font-display">{item.q}</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-9">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
