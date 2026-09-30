import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Compass,
  Zap,
  Target,
  Flame,
  CheckCircle2,
  Layers,
  ChevronRight,
  Code2,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'motion/react';

export const Module3Dashboard: React.FC = () => {
  const {
    user,
    getAllTrackedSummaries,
    setActiveCareerId,
    setActiveTab,
    careers,
    activeCareerId,
  } = useApp();

  const trackedSummaries = getAllTrackedSummaries();
  const primarySummary =
    trackedSummaries.find((s) => s.career.career_id === activeCareerId) ||
    (trackedSummaries.length > 0 ? trackedSummaries[0] : null);

  // Compute donut chart parameters
  const getDonutSegments = (completed: number, inProgress: number, total: number) => {
    if (total === 0) return { compDash: 0, inProgDash: 0, circ: 283 };
    const circ = 2 * Math.PI * 45; // r=45
    const compFraction = completed / total;
    const inProgFraction = inProgress / total;

    const compDash = compFraction * circ;
    const inProgDash = inProgFraction * circ;
    const compOffset = 0;
    const inProgOffset = -compDash;

    return { circ, compDash, inProgDash, compOffset, inProgOffset };
  };

  const handleContinueCareer = (careerId: number) => {
    setActiveCareerId(careerId);
    setActiveTab('roadmap');
  };

  const totalCompletedAllTracks = trackedSummaries.reduce((acc, curr) => acc + curr.completedSkills, 0);
  const totalInProgressAllTracks = trackedSummaries.reduce((acc, curr) => acc + curr.inProgressSkills, 0);
  const totalTrackedSkills = trackedSummaries.reduce((acc, curr) => acc + curr.totalSkills, 0);

  return (
    <div id="module-3-dashboard-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Skill Progress & Analytics Hub</span>
            </span>
            <span className="text-xs text-[var(--text-subtle)]">&bull;</span>
            <span className="text-xs text-[var(--text-muted)]">
              Welcome back, <strong className="text-[var(--text-main)]">{user?.username || 'Student'}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
            Personalized Engineering Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl leading-relaxed">
            Track your skill masteries, analyze roadmap velocity across high-demand tech tracks, and continue your tailored milestone progression.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <button
            id="btn-track-new-career"
            onClick={() => setActiveTab('assessment')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>+ Diagnostic Assessment</span>
          </button>
        </div>
      </div>

      {/* Bento Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Tracked Paths
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display">
              {trackedSummaries.length}
            </span>
            <span className="text-xs text-[var(--text-subtle)] font-mono-code font-semibold">
              / 5 Career Tracks
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active learning curricula</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Skills Mastered
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
              {totalCompletedAllTracks}
            </span>
            <span className="text-xs text-[var(--text-subtle)] font-mono-code font-semibold">
              of {totalTrackedSkills} Total
            </span>
          </div>
          <div className="mt-2 text-[11px] text-teal-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Verified skill credits</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
              {totalInProgressAllTracks}
            </span>
            <span className="text-xs text-[var(--text-subtle)] font-mono-code font-semibold">
              Active Topics
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-medium flex items-center gap-1">
            <span>Currently studying</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Study Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display">
              {user?.study_streak_days || 14}
            </span>
            <span className="text-xs text-amber-400 font-mono-code font-bold">
              Days Active 🔥
            </span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400 font-medium flex items-center gap-1">
            <span>Consistent daily momentum</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {trackedSummaries.length === 0 ? (
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 font-display">
            No Career Roadmap Initialized Yet
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
            Take our 2-minute skill diagnostic to check off what you already know and instantly generate your tailored, ordered roadmap.
          </p>
          <button
            onClick={() => setActiveTab('assessment')}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Start Diagnostic Assessment &rarr;
          </button>
        </div>
      ) : (
        <>
          {/* Primary Focus Card + SVG Donut Analytics */}
          {primarySummary && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Primary Focus Card */}
              <div className="lg:col-span-7 bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Primary Career Track
                      </span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      {primarySummary.currentStage} Tier
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-display mb-2">
                    {primarySummary.career.career_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    {primarySummary.career.description}
                  </p>

                  {/* Progress Bar with sheen */}
                  <div className="space-y-2.5 mb-6 bg-[var(--app-canvas)] p-4 rounded-2xl border border-[var(--app-border)]">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[var(--text-muted)]">Track Progress</span>
                      <span className="text-emerald-400 font-mono-code font-bold text-sm">
                        {primarySummary.completionPercentage}%
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[var(--app-card)] border border-[var(--app-border)] overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${primarySummary.completionPercentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--text-subtle)] font-mono-code font-medium">
                      <span>{primarySummary.completedSkills} Mastered</span>
                      <span>{primarySummary.inProgressSkills} In Progress</span>
                      <span>{primarySummary.notStartedSkills} Remaining</span>
                    </div>
                  </div>

                  {/* Next Step Callout */}
                  {primarySummary.nextRecommendedSkill ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 mb-6">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" /> Next Recommended Milestone
                        </span>
                        <span className="text-[10px] font-mono-code bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          ~{primarySummary.nextRecommendedSkill.estimated_hours}h estimated
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                            Step {primarySummary.nextRecommendedSkill.step_order}: {primarySummary.nextRecommendedSkill.skill_name}
                          </span>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                            {primarySummary.nextRecommendedSkill.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6 flex items-center gap-2.5">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span>Incredible achievement! You have mastered all skills in this track!</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--app-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>Est. Compensation:</span>
                    <strong className="text-emerald-400 font-mono-code bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {primarySummary.career.avg_salary}
                    </strong>
                  </div>
                  <button
                    id="btn-continue-primary-career"
                    onClick={() => handleContinueCareer(primarySummary.career.career_id)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>Open Interactive Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Donut Analytics Card */}
              <div className="lg:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-xl">
                <div className="w-full">
                  <h3 className="text-sm font-bold text-[var(--text-main)] font-display mb-1">
                    Mastery Distribution
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Curriculum breakdown for {primarySummary.career.career_name}
                  </p>
                </div>

                {/* SVG Donut Chart */}
                <div className="relative w-48 h-48 my-4 flex items-center justify-center">
                  {(() => {
                    const { circ, compDash, inProgDash, compOffset, inProgOffset } = getDonutSegments(
                      primarySummary.completedSkills,
                      primarySummary.inProgressSkills,
                      primarySummary.totalSkills
                    );
                    return (
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Background Ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          className="text-[var(--app-canvas)]"
                          strokeWidth="9"
                          fill="transparent"
                        />
                        {/* Completed Arc (Emerald) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#10B981"
                          strokeWidth="9"
                          strokeDasharray={`${compDash} ${circ}`}
                          strokeDashoffset={compOffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700"
                        />
                        {/* In Progress Arc (Amber) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#F59E0B"
                          strokeWidth="9"
                          strokeDasharray={`${inProgDash} ${circ}`}
                          strokeDashoffset={inProgOffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700"
                        />
                      </svg>
                    );
                  })()}

                  {/* Centered Donut Label */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-[var(--text-main)] font-display">
                      {primarySummary.completionPercentage}%
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-bold">
                      Mastered
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="w-full grid grid-cols-3 gap-2.5 pt-4 border-t border-[var(--app-border)] text-center">
                  <div className="p-2.5 rounded-2xl bg-[var(--app-canvas)] border border-[var(--app-border)]">
                    <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mastered
                    </span>
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono-code">
                      {primarySummary.completedSkills}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[var(--app-canvas)] border border-[var(--app-border)]">
                    <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-400 mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> In Progress
                    </span>
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono-code">
                      {primarySummary.inProgressSkills}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[var(--app-canvas)] border border-[var(--app-border)]">
                    <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--text-subtle)] mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--text-subtle)]"></span> Upcoming
                    </span>
                    <span className="text-xs font-bold text-[var(--text-main)] font-mono-code">
                      {primarySummary.notStartedSkills}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All Tracked Career Cards Grid */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[var(--text-main)] font-display">
                  All Career Learning Tracks
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Compare your progress across the 5 industry-standard roadmaps.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => {
                const summary = trackedSummaries.find((s) => s.career.career_id === career.career_id);
                const isTracked = !!summary;
                const percentage = summary ? summary.completionPercentage : 0;

                return (
                  <div
                    key={career.career_id}
                    id={`dashboard-career-card-${career.career_slug}`}
                    className="bg-[var(--app-card)] border border-[var(--app-border)] hover:border-emerald-500/40 rounded-3xl p-6 transition-all flex flex-col justify-between shadow-lg group hover:shadow-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-base font-bold text-[var(--text-main)] font-display group-hover:text-emerald-400 transition-colors">
                            {career.career_name}
                          </h3>
                          <span className="text-[11px] text-[var(--text-subtle)] font-mono-code">
                            {summary ? `${summary.currentStage} Tier` : 'Not Started'}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono-code">
                          {percentage}%
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                        {career.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[var(--app-canvas)] border border-[var(--app-border)] overflow-hidden mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-[var(--app-canvas)] rounded-2xl border border-[var(--app-border)] mb-4">
                        <div>
                          <span className="text-[10px] text-[var(--text-subtle)] block">Done</span>
                          <strong className="text-emerald-400 font-mono-code">{summary?.completedSkills || 0}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-subtle)] block">Active</span>
                          <strong className="text-amber-400 font-mono-code">{summary?.inProgressSkills || 0}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-subtle)] block">Left</span>
                          <strong className="text-[var(--text-muted)] font-mono-code">{summary ? summary.notStartedSkills : 10}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn-open-roadmap-${career.career_slug}`}
                      onClick={() => handleContinueCareer(career.career_id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[var(--app-canvas)] hover:bg-emerald-500 border border-[var(--app-border)] hover:border-emerald-400 text-xs font-bold text-[var(--text-main)] hover:text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>{isTracked ? 'Continue Roadmap' : 'Explore Curriculum'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
