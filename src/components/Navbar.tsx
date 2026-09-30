import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Compass,
  LayoutDashboard,
  Sparkles,
  Map,
  BookOpen,
  User,
  Code2,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Flame,
  Palette,
  Check,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    careers,
    activeCareerId,
    setActiveCareerId,
    theme,
    toggleTheme,
    accent,
    setAccent,
    logout,
    getCareerSummary,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCareerDropdownOpen, setIsCareerDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPaletteDropdownOpen, setIsPaletteDropdownOpen] = useState(false);

  const activeCareer = careers.find((c) => c.career_id === activeCareerId) || careers[0];
  const activeSummary = getCareerSummary(activeCareerId);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'assessment', label: 'Skill Diagnostic', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Interactive Roadmap', icon: <Map className="w-4 h-4" /> },
    { id: 'resources', label: 'Resource Hub', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile & Export', icon: <User className="w-4 h-4" /> },
    {
      id: 'academic_code',
      label: 'PHP/MySQL Code',
      icon: <Code2 className="w-4 h-4 text-emerald-400" />,
      badge: 'BCA Defense',
    },
  ];

  const accents: { id: 'emerald' | 'violet' | 'cyan' | 'amber'; name: string; color: string }[] = [
    { id: 'emerald', name: 'Emerald Aurora', color: 'bg-emerald-500' },
    { id: 'violet', name: 'Electric Violet', color: 'bg-purple-500' },
    { id: 'cyan', name: 'Cyber Cyan', color: 'bg-cyan-500' },
    { id: 'amber', name: 'Sunset Amber', color: 'bg-amber-500' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-site-header"
      className="sticky top-0 z-40 w-full bg-[var(--app-canvas)]/90 backdrop-blur-md border-b border-[var(--app-border)] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Career Selector */}
          <div className="flex items-center gap-5">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform font-black">
                <Compass className="w-5 h-5 text-slate-950 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-[var(--text-main)] font-display flex items-center gap-1">
                  PathForge<span className="text-emerald-400 font-normal">.io</span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block -mt-1 font-mono-code font-medium">
                  Career Engine
                </span>
              </div>
            </button>

            {/* Active Career Quick Switcher (Desktop) */}
            {user && (
              <div className="relative hidden md:block">
                <button
                  id="btn-career-switcher-dropdown"
                  onClick={() => setIsCareerDropdownOpen(!isCareerDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCareerDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] text-xs font-semibold text-[var(--text-main)] hover:border-emerald-500/50 hover:bg-[var(--app-card-elevated)] transition-all cursor-pointer shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate max-w-[150px]">{activeCareer.career_name}</span>
                  {activeSummary && (
                    <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {activeSummary.completionPercentage}%
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                </button>

                {isCareerDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] border-b border-[var(--app-border)]">
                      Select Career Track
                    </div>
                    {careers.map((c) => {
                      const sum = getCareerSummary(c.career_id);
                      return (
                        <button
                          key={c.career_id}
                          id={`btn-select-career-${c.career_slug}`}
                          onClick={() => {
                            setActiveCareerId(c.career_id);
                            setIsCareerDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[var(--app-card-elevated)] transition-colors cursor-pointer ${
                            c.career_id === activeCareerId
                              ? 'text-emerald-400 font-bold bg-emerald-500/10'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          <span className="truncate">{c.career_name}</span>
                          <div className="flex items-center gap-2">
                            {sum && (
                              <span className="text-[10px] font-mono-code text-[var(--text-subtle)]">
                                {sum.completionPercentage}%
                              </span>
                            )}
                            {c.career_id === activeCareerId && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          {user && (
            <nav id="desktop-main-navigation" className="hidden lg:flex items-center gap-1 bg-[var(--app-card)] p-1 rounded-xl border border-[var(--app-border)]">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-card-elevated)]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Streak Counter */}
            {user && (
              <div
                id="streak-indicator-badge"
                title="Your daily learning streak"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold font-mono-code"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{user.study_streak_days || 14}d Streak</span>
              </div>
            )}

            {/* Accent Theme Palette Selector */}
            <div className="relative">
              <button
                id="btn-palette-picker"
                onClick={() => setIsPaletteDropdownOpen(!isPaletteDropdownOpen)}
                onBlur={() => setTimeout(() => setIsPaletteDropdownOpen(false), 200)}
                className="p-2 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-emerald-500/40 transition-colors cursor-pointer"
                title="Change Color Palette"
                aria-label="Change Accent Color"
              >
                <Palette className="w-4 h-4 text-emerald-400" />
              </button>

              {isPaletteDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] border-b border-[var(--app-border)] mb-1">
                    Accent Theme
                  </div>
                  {accents.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccent(acc.id);
                        setIsPaletteDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between hover:bg-[var(--app-card-elevated)] transition-colors cursor-pointer ${
                        accent === acc.id ? 'font-bold text-[var(--text-main)] bg-white/5' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${acc.color}`}></span>
                        <span>{acc.name}</span>
                      </div>
                      {accent === acc.id && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button (Dark / Light) */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-emerald-500/40 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--app-card)] border border-transparent hover:border-[var(--app-border)] transition-all focus:outline-none cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-xs font-black text-slate-950 uppercase shadow-md shadow-emerald-500/20">
                    {user.username.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-[var(--text-main)] font-display">
                    {user.username}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[var(--text-subtle)] hidden sm:block" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3.5 py-2 border-b border-[var(--app-border)]">
                      <p className="text-xs font-bold text-[var(--text-main)]">{user.username}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>

                    <button
                      id="profile-dropdown-profile-link"
                      onClick={() => {
                        setActiveTab('profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-card-elevated)] flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Profile & Settings</span>
                    </button>

                    <button
                      id="profile-dropdown-php-code-link"
                      onClick={() => {
                        setActiveTab('academic_code');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-card-elevated)] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PHP/MySQL Source Files</span>
                    </button>

                    <div className="border-t border-[var(--app-border)] my-1"></div>

                    <button
                      id="btn-logout"
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-login-header"
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-card)]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden px-4 pt-3 pb-5 space-y-1.5 bg-[var(--app-card)] border-b border-[var(--app-border)] shadow-xl"
        >
          {user && (
            <div className="pb-3 mb-2 border-b border-[var(--app-border)]">
              <label className="text-[11px] text-[var(--text-subtle)] uppercase font-bold block mb-1.5">
                Active Career Track:
              </label>
              <select
                id="mobile-career-select"
                value={activeCareerId}
                onChange={(e) => setActiveCareerId(parseInt(e.target.value, 10))}
                className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] text-[var(--text-main)] text-xs rounded-xl p-2.5 focus:outline-none"
              >
                {careers.map((c) => (
                  <option key={c.career_id} value={c.career_id}>
                    {c.career_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-[var(--text-muted)] hover:bg-[var(--app-card-elevated)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono-code">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
