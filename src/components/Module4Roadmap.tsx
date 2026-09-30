import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SkillPath, SkillStatus, StageLabel } from '../types';
import { getMilestoneDetails, MilestoneDetails } from '../data/roadmapExtras';
import {
  Check,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  LayoutList,
  GitCommit,
  Share2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Target,
  FileText,
  Video,
  Award,
  Calendar,
  Layers,
  Network,
  Columns3,
  Timer,
  Star,
  CheckSquare,
  HelpCircle,
  FolderGit2,
  Compass,
  Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Module4Roadmap: React.FC = () => {
  const {
    careers,
    skillPaths,
    userProgress,
    userSkills,
    activeCareerId,
    setActiveCareerId,
    updateSkillStatus,
    openSkillModal,
    selectedSkillForModal,
    closeSkillModal,
    addToast,
    getCareerSummary,
  } = useApp();

  // Layout View Modes:
  // 'network': Visual serpentine node graph with SVG connectors
  // 'split': Master-Detail IDE Workspace with active milestone playground
  // 'board': 3-Column Kanban Workflow (To Do / In Progress / Mastered)
  // 'schedule': Weekly Sprint Planner with dynamic hours-per-week calculator
  const [layoutMode, setLayoutMode] = useState<'network' | 'split' | 'board' | 'schedule'>('network');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Master-detail selected skill
  const [focusedSkillId, setFocusedSkillId] = useState<number | null>(null);

  // Focus Pomodoro Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [studyPaceHoursPerWeek, setStudyPaceHoursPerWeek] = useState<number>(15);

  // Modal / Detail state
  const [modalStatus, setModalStatus] = useState<SkillStatus>('not_started');
  const [modalNotes, setModalNotes] = useState<string>('');
  const [modalConfidence, setModalConfidence] = useState<number>(3);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState<boolean>(false);

  const activeCareer = careers.find((c) => c.career_id === activeCareerId) || careers[0];
  const allCareerSkills = useMemo(
    () =>
      skillPaths
        .filter((s) => s.career_id === activeCareerId)
        .sort((a, b) => a.step_order - b.step_order),
    [skillPaths, activeCareerId]
  );

  const summary = getCareerSummary(activeCareerId);

  // Set default focused skill to first in-progress or non-completed
  useEffect(() => {
    if (!focusedSkillId && allCareerSkills.length > 0) {
      const inProg = allCareerSkills.find((s) => {
        const prog = userProgress.find((p) => p.career_id === activeCareerId && p.skill_id === s.skill_id);
        return prog?.status === 'in_progress';
      });
      const firstNotDone = allCareerSkills.find((s) => {
        const prog = userProgress.find((p) => p.career_id === activeCareerId && p.skill_id === s.skill_id);
        return !prog || prog.status !== 'completed';
      });
      setFocusedSkillId(inProg?.skill_id || firstNotDone?.skill_id || allCareerSkills[0].skill_id);
    }
  }, [allCareerSkills, activeCareerId, focusedSkillId, userProgress]);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      addToast('success', 'Focus Session Complete!', 'Great work! Take a 5-minute breather.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, addToast]);

  const activeFocusedSkill = useMemo(
    () => allCareerSkills.find((s) => s.skill_id === focusedSkillId) || allCareerSkills[0],
    [allCareerSkills, focusedSkillId]
  );

  const focusedSkillDetails = useMemo(() => {
    if (!activeFocusedSkill) return null;
    return getMilestoneDetails(activeFocusedSkill);
  }, [activeFocusedSkill]);

  const handleNodeClick = (skill: SkillPath) => {
    setFocusedSkillId(skill.skill_id);
    const existingProg = userProgress.find(
      (p) => p.career_id === activeCareerId && p.skill_id === skill.skill_id
    );
    setModalStatus(existingProg?.status || 'not_started');
    setModalNotes(existingProg?.notes || '');
    setModalConfidence(existingProg?.confidence_rating || 3);
    setQuizAnswers({});
    setQuizChecked(false);
    openSkillModal(skill);
  };

  const handleSaveModalProgress = () => {
    if (!selectedSkillForModal) return;
    updateSkillStatus(activeCareerId, selectedSkillForModal.skill_id, modalStatus, modalNotes, modalConfidence);
    closeSkillModal();
  };

  const handleQuickStatusCycle = (e: React.MouseEvent, skill: SkillPath) => {
    e.stopPropagation();
    const existingProg = userProgress.find(
      (p) => p.career_id === activeCareerId && p.skill_id === skill.skill_id
    );
    const current = existingProg?.status || 'not_started';
    const nextStatus: SkillStatus =
      current === 'not_started' ? 'in_progress' : current === 'in_progress' ? 'completed' : 'not_started';
    updateSkillStatus(activeCareerId, skill.skill_id, nextStatus);
  };

  const handleDirectSetStatus = (skillId: number, status: SkillStatus) => {
    updateSkillStatus(activeCareerId, skillId, status);
  };

  const filteredSkills = useMemo(() => {
    return allCareerSkills.filter((s) => {
      const matchStage = selectedStageFilter === 'all' || s.stage_label === selectedStageFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        s.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.key_topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStage && matchSearch;
    });
  }, [allCareerSkills, selectedStageFilter, searchQuery]);

  const stages: StageLabel[] = ['Fundamentals', 'Intermediate', 'Advanced'];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // Weekly Schedule calculations
  const totalEstimatedHours = allCareerSkills.reduce((acc, curr) => acc + curr.estimated_hours, 0);
  const totalEstimatedWeeks = Math.ceil(totalEstimatedHours / (studyPaceHoursPerWeek || 15));

  return (
    <div id="module-4-roadmap-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Card: Career Overview & Live Progress */}
      <section
        id="roadmap-overview-banner"
        className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5 font-display">
              <Sparkles className="w-3 h-3" />
              <span>Interactive Career Roadmap</span>
            </span>
            <span className="text-xs text-[var(--text-subtle)]">&bull;</span>
            <span className="text-xs text-[var(--text-muted)] font-semibold">{activeCareer.career_name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
            {activeCareer.career_name} Curriculum Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {activeCareer.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs text-[var(--text-muted)] font-mono-code bg-[var(--app-canvas)] px-3 py-1 rounded-xl border border-[var(--app-border)]">
              ⏱️ {activeCareer.total_duration_weeks} Weeks Estimated &bull; {totalEstimatedHours}h
            </span>
            <span className="text-xs text-emerald-400 font-mono-code bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/25 font-bold">
              💰 {activeCareer.avg_salary}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono-code bg-[var(--app-canvas)] px-3 py-1 rounded-xl border border-[var(--app-border)]">
              🎯 {allCareerSkills.length} Core Milestones
            </span>
          </div>
        </div>

        {/* Live Progress Mini-Gauge */}
        {summary && (
          <div className="lg:w-72 bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl p-5 shadow-sm space-y-3 relative z-10 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-muted)]">Track Progress</span>
              <span className="text-emerald-400 font-mono-code font-bold text-sm">
                {summary.completionPercentage}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-[var(--app-card)] border border-[var(--app-border)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${summary.completionPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--text-subtle)] font-mono-code font-medium">
              <span>{summary.completedSkills} / {summary.totalSkills} Completed</span>
              <span>{summary.inProgressSkills} Active</span>
            </div>
          </div>
        )}
      </section>

      {/* Roadmap Controls Bar: Search, Filters & 4-View Switcher */}
      <section
        id="roadmap-control-bar"
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-2xl shadow-sm"
      >
        {/* Left: Search & Stage Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--text-subtle)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search milestones or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[var(--app-canvas)] text-[var(--text-main)] border border-[var(--app-border)] focus:outline-none focus:border-emerald-500/50 w-48 sm:w-60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedStageFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedStageFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-canvas)]'
              }`}
            >
              All Stages ({allCareerSkills.length})
            </button>
            {stages.map((stg) => {
              const count = allCareerSkills.filter((s) => s.stage_label === stg).length;
              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setSelectedStageFilter(stg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedStageFilter === stg
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-canvas)]'
                  }`}
                >
                  {stg} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Multi-Dimensional 4-View Switcher */}
        <div className="flex items-center gap-1 bg-[var(--app-canvas)] p-1 rounded-xl border border-[var(--app-border)] self-start lg:self-auto overflow-x-auto">
          <button
            onClick={() => setLayoutMode('network')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              layoutMode === 'network'
                ? 'bg-[var(--app-card)] text-emerald-400 shadow-sm font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Path Network</span>
          </button>

          <button
            onClick={() => setLayoutMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              layoutMode === 'split'
                ? 'bg-[var(--app-card)] text-emerald-400 shadow-sm font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>IDE Workbench</span>
          </button>

          <button
            onClick={() => setLayoutMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              layoutMode === 'board'
                ? 'bg-[var(--app-card)] text-emerald-400 shadow-sm font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setLayoutMode('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              layoutMode === 'schedule'
                ? 'bg-[var(--app-card)] text-emerald-400 shadow-sm font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Sprint</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VIEW 1: INTERACTIVE PATHWAY NETWORK (ZIG-ZAG SERPENTINE FLOW) */}
      {/* ========================================================================= */}
      {layoutMode === 'network' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          {stages
            .filter((stg) => selectedStageFilter === 'all' || selectedStageFilter === stg)
            .map((stage) => {
              const stageSkills = filteredSkills.filter((s) => s.stage_label === stage);
              if (stageSkills.length === 0) return null;

              return (
                <div
                  key={stage}
                  className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-8 shadow-xl space-y-8"
                >
                  {/* Stage Header Gate */}
                  <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold font-display text-xs border border-emerald-500/30">
                        {stage === 'Fundamentals' ? '01' : stage === 'Intermediate' ? '02' : '03'}
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-[var(--text-main)] font-display">
                          {stage} Stage Architecture
                        </h2>
                        <p className="text-xs text-[var(--text-muted)]">
                          {stageSkills.length} Core Milestones &bull;{' '}
                          {stageSkills.reduce((a, b) => a + b.estimated_hours, 0)} Total Hours
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/25">
                      {stageSkills.filter((s) => {
                        const p = userProgress.find(
                          (up) => up.career_id === activeCareerId && up.skill_id === s.skill_id
                        );
                        return p?.status === 'completed';
                      }).length}{' '}
                      / {stageSkills.length} Mastered
                    </span>
                  </div>

                  {/* Multi-Column Bento / Grid of Milestone Nodes with Connection Visuals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stageSkills.map((skill, index) => {
                      const prog = userProgress.find(
                        (p) => p.career_id === activeCareerId && p.skill_id === skill.skill_id
                      );
                      const status = prog?.status || 'not_started';
                      const isMastered = status === 'completed';
                      const isInProgress = status === 'in_progress';

                      return (
                        <motion.div
                          key={skill.skill_id}
                          whileHover={{ y: -4 }}
                          onClick={() => handleNodeClick(skill)}
                          className={`relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden group shadow-md ${
                            isMastered
                              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/5'
                              : isInProgress
                              ? 'bg-amber-500/10 border-amber-500/40 shadow-amber-500/5 ring-1 ring-amber-500/30'
                              : 'bg-[var(--app-canvas)] border-[var(--app-border)] hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Step Order & Quick Status Action */}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono-code font-bold text-[var(--text-subtle)] bg-[var(--app-card)] px-2 py-0.5 rounded-md border border-[var(--app-border)]">
                                Milestone #{skill.step_order}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => handleQuickStatusCycle(e, skill)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all cursor-pointer ${
                                  isMastered
                                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                                    : isInProgress
                                    ? 'bg-amber-500 text-slate-950 font-black border-amber-400'
                                    : 'bg-[var(--app-card)] text-[var(--text-muted)] border-[var(--app-border)] hover:border-emerald-500/40'
                                }`}
                              >
                                {isMastered && <Check className="w-3 h-3 stroke-[3]" />}
                                {isInProgress && <Play className="w-3 h-3 fill-current" />}
                                <span>
                                  {isMastered ? 'Mastered' : isInProgress ? 'In Progress' : 'Not Started'}
                                </span>
                              </button>
                            </div>

                            {/* Milestone Title & Description */}
                            <div>
                              <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-emerald-400 transition-colors font-display">
                                {skill.skill_name}
                              </h3>
                              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                                {skill.description}
                              </p>
                            </div>

                            {/* Key Topics Badges */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {skill.key_topics.slice(0, 3).map((topic, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] text-[var(--text-subtle)] bg-[var(--app-card)] px-2 py-0.5 rounded-md border border-[var(--app-border)] font-mono-code"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Action & Hours */}
                          <div className="mt-4 pt-3 border-t border-[var(--app-border)]/60 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-[var(--text-subtle)] font-mono-code flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{skill.estimated_hours}h estimated</span>
                            </span>

                            <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              <span>Details &amp; Lab</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SPLIT-PANE MASTER-DETAIL IDE WORKSPACE */}
      {/* ========================================================================= */}
      {layoutMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          {/* Left Column: Milestone Navigator Tree */}
          <div className="lg:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-5 shadow-xl space-y-4 max-h-[750px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <span className="text-xs font-bold text-[var(--text-main)] font-display uppercase tracking-wider">
                Milestone Explorer
              </span>
              <span className="text-xs text-[var(--text-subtle)] font-mono-code">
                {allCareerSkills.length} Steps
              </span>
            </div>

            <div className="space-y-2">
              {allCareerSkills.map((skill) => {
                const isSelected = skill.skill_id === activeFocusedSkill?.skill_id;
                const prog = userProgress.find(
                  (p) => p.career_id === activeCareerId && p.skill_id === skill.skill_id
                );
                const status = prog?.status || 'not_started';

                return (
                  <button
                    key={skill.skill_id}
                    type="button"
                    onClick={() => setFocusedSkillId(skill.skill_id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-[var(--text-main)] shadow-md shadow-emerald-500/10'
                        : 'bg-[var(--app-canvas)] border-[var(--app-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          status === 'completed'
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : status === 'in_progress'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-[var(--app-card)] text-[var(--text-subtle)] border border-[var(--app-border)]'
                        }`}
                      >
                        {status === 'completed' ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          skill.step_order
                        )}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate leading-tight font-display">
                          {skill.skill_name}
                        </h4>
                        <span className="text-[10px] text-[var(--text-subtle)] font-mono-code">
                          {skill.stage_label} &bull; {skill.estimated_hours}h
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md shrink-0 uppercase font-mono-code ${
                        status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-[var(--app-card)] text-[var(--text-subtle)]'
                      }`}
                    >
                      {status === 'completed' ? 'Mastered' : status === 'in_progress' ? 'Active' : 'Queued'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Milestone Lab & Workbench */}
          {activeFocusedSkill && focusedSkillDetails && (
            <div className="lg:col-span-7 bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Header & Status Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[var(--app-border)] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/25 font-mono-code">
                      {activeFocusedSkill.stage_label} &bull; Step {activeFocusedSkill.step_order}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)] font-mono-code">
                      ⏱️ {activeFocusedSkill.estimated_hours} Hours Estimated
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-display mt-2">
                    {activeFocusedSkill.skill_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                    {activeFocusedSkill.description}
                  </p>
                </div>

                {/* 3-State Status Segment */}
                <div className="flex items-center bg-[var(--app-canvas)] p-1 rounded-xl border border-[var(--app-border)] shrink-0 self-start sm:self-auto">
                  {(['not_started', 'in_progress', 'completed'] as SkillStatus[]).map((st) => {
                    const currentProg = userProgress.find(
                      (p) => p.career_id === activeCareerId && p.skill_id === activeFocusedSkill.skill_id
                    );
                    const isCur = (currentProg?.status || 'not_started') === st;

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleDirectSetStatus(activeFocusedSkill.skill_id, st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCur
                            ? st === 'completed'
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : st === 'in_progress'
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'bg-[var(--app-card)] text-[var(--text-main)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {st === 'completed' ? 'Mastered' : st === 'in_progress' ? 'In Progress' : 'Not Started'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Integrated Focus Timer Widget */}
              <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block font-mono-code">
                      Deep Work Session (Pomodoro)
                    </span>
                    <span className="text-xl font-bold font-mono-code text-[var(--text-main)]">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isTimerRunning
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950 font-black'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isTimerRunning ? 'Pause Session' : 'Start Focus Sprint'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(25 * 60);
                    }}
                    className="p-2 rounded-xl bg-[var(--app-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--app-border)] cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Practical Hands-On Project Lab Brief */}
              <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-display flex items-center gap-1.5 uppercase tracking-wider">
                    <FolderGit2 className="w-4 h-4" />
                    <span>Hands-On Milestone Lab</span>
                  </span>
                  <span className="text-[10px] font-mono-code text-[var(--text-subtle)]">
                    Est. {focusedSkillDetails.project.estimatedTimeHours}h Lab
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-main)] font-display">
                  {focusedSkillDetails.project.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {focusedSkillDetails.project.deliverable}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)]">
                    Lab Checklist:
                  </span>
                  {focusedSkillDetails.project.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Self-Check Mini Quiz */}
              {focusedSkillDetails.quiz.length > 0 && (
                <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 font-display flex items-center gap-1.5 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>Knowledge Mastery Self-Check</span>
                    </span>
                    <span className="text-[10px] font-mono-code text-[var(--text-subtle)]">
                      Test Before Marking Complete
                    </span>
                  </div>

                  {focusedSkillDetails.quiz.map((q, qIndex) => (
                    <div key={qIndex} className="space-y-2 text-xs">
                      <p className="font-bold text-[var(--text-main)]">
                        {qIndex + 1}. {q.question}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIndex) => {
                          const isSel = quizAnswers[qIndex] === optIndex;
                          let optCls =
                            'bg-[var(--app-card)] text-[var(--text-muted)] border-[var(--app-border)] hover:border-emerald-500/40';

                          if (quizChecked) {
                            if (optIndex === q.correctIndex) {
                              optCls = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
                            } else if (isSel) {
                              optCls = 'bg-rose-500/20 text-rose-300 border-rose-500/50';
                            }
                          } else if (isSel) {
                            optCls = 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => setQuizAnswers((p) => ({ ...p, [qIndex]: optIndex }))}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2 ${optCls}`}
                            >
                              <span className="w-4 h-4 rounded bg-black/10 flex items-center justify-center font-bold text-[9px] shrink-0">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizChecked && (
                        <p className="text-[11px] text-[var(--text-muted)] pt-1">
                          💡 <span className="font-semibold text-[var(--text-main)]">Explanation:</span>{' '}
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuizChecked(!quizChecked)}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs cursor-pointer transition-all"
                    >
                      {quizChecked ? 'Reset Answers' : 'Validate Quiz Answers'}
                    </button>
                  </div>
                </div>
              )}

              {/* Official Documentation Link Launchpad */}
              <div className="flex items-center justify-between pt-2">
                <a
                  href={activeFocusedSkill.resource_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Official MDN / Tutorial &bull; {activeFocusedSkill.resource_title}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: KANBAN WORKFLOW STAGE BOARD */}
      {/* ========================================================================= */}
      {layoutMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {(
            [
              { status: 'not_started', title: 'To Learn', color: 'slate', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/25' },
              { status: 'in_progress', title: 'In Active Progress', color: 'amber', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25' },
              { status: 'completed', title: 'Mastered', color: 'emerald', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
            ] as { status: SkillStatus; title: string; color: string; badge: string }[]
          ).map((col) => {
            const skillsInCol = allCareerSkills.filter((s) => {
              const prog = userProgress.find(
                (p) => p.career_id === activeCareerId && p.skill_id === s.skill_id
              );
              const currentStatus = prog?.status || 'not_started';
              return currentStatus === col.status;
            });

            return (
              <div
                key={col.status}
                className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-5 shadow-xl space-y-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold font-display ${col.badge}`}>
                      {col.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono-code font-bold text-[var(--text-subtle)]">
                    {skillsInCol.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {skillsInCol.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[var(--app-border)] rounded-2xl">
                      <p className="text-xs text-[var(--text-subtle)]">No milestones in this stage.</p>
                    </div>
                  ) : (
                    skillsInCol.map((skill) => (
                      <div
                        key={skill.skill_id}
                        onClick={() => handleNodeClick(skill)}
                        className="bg-[var(--app-canvas)] border border-[var(--app-border)] hover:border-emerald-500/40 p-4 rounded-2xl shadow-sm transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-code font-bold text-[var(--text-subtle)]">
                            Step #{skill.step_order} &bull; {skill.stage_label}
                          </span>
                          <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                            {skill.estimated_hours}h
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[var(--text-main)] group-hover:text-emerald-400 transition-colors font-display">
                          {skill.skill_name}
                        </h4>

                        <div className="flex items-center justify-between pt-2 border-t border-[var(--app-border)]/50 text-[10px]">
                          <span className="text-[var(--text-subtle)] font-mono-code">
                            {skill.key_topics[0]}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleQuickStatusCycle(e, skill)}
                            className="text-emerald-400 font-bold hover:underline"
                          >
                            Move Next &rarr;
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: WEEKLY SPRINT & SCHEDULE PLANNER */}
      {/* ========================================================================= */}
      {layoutMode === 'schedule' && (
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
          {/* Header & Pace Slider */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--app-border)] pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 inline-block font-display">
                Dynamic Schedule Simulator
              </span>
              <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-display mt-2">
                Weekly Sprint &amp; Completion Forecast
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Adjust your weekly study commitment to project exact milestone completion deadlines.
              </p>
            </div>

            {/* Study Commitment Slider */}
            <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-4 rounded-2xl space-y-2 w-full md:w-80 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text-muted)]">Weekly Study Commitment</span>
                <span className="font-mono-code font-bold text-emerald-400">
                  {studyPaceHoursPerWeek} hrs / week
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={studyPaceHoursPerWeek}
                onChange={(e) => setStudyPaceHoursPerWeek(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-mono-code">
                <span>Part-Time (5h)</span>
                <span>Full-Time (40h)</span>
              </div>
            </div>
          </div>

          {/* Forecast Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                Total Curriculum Load
              </span>
              <span className="text-xl font-bold text-[var(--text-main)] font-mono-code mt-1 block">
                {totalEstimatedHours} Study Hours
              </span>
            </div>

            <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                Target Timeline
              </span>
              <span className="text-xl font-bold text-emerald-400 font-mono-code mt-1 block">
                ~{totalEstimatedWeeks} Total Weeks
              </span>
            </div>

            <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                Milestone Velocity
              </span>
              <span className="text-xl font-bold text-cyan-400 font-mono-code mt-1 block">
                {(allCareerSkills.length / (totalEstimatedWeeks || 1)).toFixed(1)} Milestones / Wk
              </span>
            </div>
          </div>

          {/* Week-by-Week Milestone Roadmap List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-main)] font-display">
              Sequential Milestone Execution Plan
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[11px] font-bold text-[var(--text-subtle)] uppercase tracking-wider font-mono-code">
                    <th className="py-3 px-4">Sprint Week</th>
                    <th className="py-3 px-4">Milestone</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Hours</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-xs">
                  {allCareerSkills.map((skill, i) => {
                    // Calculate cumulative hours up to this skill
                    const hoursPrior = allCareerSkills
                      .slice(0, i)
                      .reduce((acc, curr) => acc + curr.estimated_hours, 0);
                    const weekStart = Math.floor(hoursPrior / studyPaceHoursPerWeek) + 1;
                    const weekEnd = Math.ceil((hoursPrior + skill.estimated_hours) / studyPaceHoursPerWeek);

                    const prog = userProgress.find(
                      (p) => p.career_id === activeCareerId && p.skill_id === skill.skill_id
                    );
                    const status = prog?.status || 'not_started';

                    return (
                      <tr
                        key={skill.skill_id}
                        className="hover:bg-[var(--app-canvas)] transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono-code font-bold text-emerald-400">
                          Week {weekStart}{weekStart !== weekEnd ? ` - ${weekEnd}` : ''}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[var(--text-main)] font-display">
                          {skill.skill_name}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)]">{skill.stage_label}</td>
                        <td className="py-3.5 px-4 font-mono-code text-[var(--text-subtle)]">
                          {skill.estimated_hours}h
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono-code ${
                              status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : status === 'in_progress'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-[var(--app-canvas)] text-[var(--text-subtle)] border border-[var(--app-border)]'
                            }`}
                          >
                            {status === 'completed' ? 'Mastered' : status === 'in_progress' ? 'Active' : 'Queued'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleNodeClick(skill)}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          >
                            Inspect Lab &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MILESTONE INSPECTION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedSkillForModal && (
          <div
            id="skill-detail-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[var(--app-border)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/25 font-mono-code">
                      {selectedSkillForModal.stage_label} &bull; Milestone #{selectedSkillForModal.step_order}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)] font-mono-code">
                      ⏱️ {selectedSkillForModal.estimated_hours} Hours
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[var(--text-main)] font-display mt-2">
                    {selectedSkillForModal.skill_name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeSkillModal}
                  className="p-1.5 rounded-xl text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--app-canvas)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description & Topics */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {selectedSkillForModal.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSkillForModal.key_topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-[var(--text-muted)] bg-[var(--app-canvas)] px-2.5 py-1 rounded-lg border border-[var(--app-border)] font-mono-code"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-main)] block font-display">
                  Update Completion Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'not_started', label: 'Not Started' },
                    { id: 'in_progress', label: 'In Progress' },
                    { id: 'completed', label: 'Mastered' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setModalStatus(st.id as SkillStatus)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        modalStatus === st.id
                          ? st.id === 'completed'
                            ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md'
                            : st.id === 'in_progress'
                            ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md'
                            : 'bg-[var(--app-canvas)] text-[var(--text-main)] border-slate-400 shadow-md'
                          : 'bg-[var(--app-canvas)] text-[var(--text-muted)] border-[var(--app-border)] hover:border-emerald-500/40'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-main)] block font-display">
                  Personal Study Notes / Key Insights:
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Record your breakthroughs, project repo links, or study notes..."
                  className="w-full p-3 rounded-xl bg-[var(--app-canvas)] text-xs text-[var(--text-main)] border border-[var(--app-border)] focus:outline-none focus:border-emerald-500/50"
                ></textarea>
              </div>

              {/* Resource Launch Link */}
              <div className="pt-2">
                <a
                  href={selectedSkillForModal.resource_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Curriculum Resource: {selectedSkillForModal.resource_title}</span>
                </a>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={closeSkillModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalProgress}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-display shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
                >
                  Save Progress
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
