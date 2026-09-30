import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StageLabel, Career } from '../types';
import { CAREER_DIAGNOSTIC_QUIZZES, DiagnosticQuestion } from '../data/assessmentData';
import {
  Globe,
  BarChart3,
  Palette,
  Smartphone,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Layers,
  Award,
  HelpCircle,
  RotateCcw,
  Sliders,
  Compass,
  DollarSign,
  TrendingDown,
  BookOpen,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  Briefcase,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Module2Assessment: React.FC = () => {
  const { careers, skillPaths, activeCareerId, submitAssessment, setActiveTab, addToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCareerId, setSelectedCareerId] = useState<number>(activeCareerId || 1);
  const [knownSkills, setKnownSkills] = useState<number[]>([101, 102]);
  
  // Step 2 Diagnostic Mode: 'grid' (Interactive Matrix) vs 'quiz' (Adaptive 5-Question Test)
  const [diagnosticMode, setDiagnosticMode] = useState<'grid' | 'quiz'>('grid');
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Comparator modal/drawer state in Step 1
  const [comparingCareerId, setComparingCareerId] = useState<number | null>(null);
  const [careerCategoryFilter, setCareerCategoryFilter] = useState<string>('all');

  const selectedCareer = careers.find((c) => c.career_id === selectedCareerId) || careers[0];
  const careerSkills = useMemo(
    () =>
      skillPaths
        .filter((s) => s.career_id === selectedCareerId)
        .sort((a, b) => a.step_order - b.step_order),
    [skillPaths, selectedCareerId]
  );

  const careerQuizzes = useMemo(
    () => CAREER_DIAGNOSTIC_QUIZZES[selectedCareerId] || CAREER_DIAGNOSTIC_QUIZZES[1],
    [selectedCareerId]
  );

  const getCareerIcon = (iconKey: string, size = 'w-5 h-5') => {
    switch (iconKey) {
      case 'Globe':
        return <Globe className={size} />;
      case 'BarChart3':
        return <BarChart3 className={size} />;
      case 'Palette':
        return <Palette className={size} />;
      case 'Smartphone':
        return <Smartphone className={size} />;
      case 'TrendingUp':
        return <TrendingUp className={size} />;
      default:
        return <Globe className={size} />;
    }
  };

  const handleSelectCareerCard = (careerId: number) => {
    setSelectedCareerId(careerId);
    // Pre-populate with first 2 skills if changing career
    const firstTwo = skillPaths
      .filter((s) => s.career_id === careerId && s.stage_label === 'Fundamentals')
      .slice(0, 2)
      .map((s) => s.skill_id);
    setKnownSkills(firstTwo);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveQuestionIndex(0);
    setStep(2);
  };

  const toggleSkill = (skillId: number) => {
    setKnownSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleSelectAllStage = (stage: StageLabel) => {
    const stageSkillIds = careerSkills
      .filter((s) => s.stage_label === stage)
      .map((s) => s.skill_id);
    const allSelected = stageSkillIds.every((id) => knownSkills.includes(id));

    if (allSelected) {
      setKnownSkills((prev) => prev.filter((id) => !stageSkillIds.includes(id)));
    } else {
      setKnownSkills((prev) => Array.from(new Set([...prev, ...stageSkillIds])));
    }
  };

  // Presets
  const applyPreset = (presetType: 'beginner' | 'student' | 'switcher' | 'advanced') => {
    if (presetType === 'beginner') {
      setKnownSkills([]);
      addToast('info', 'Preset Applied', 'Reset to complete scratch roadmap (0 pre-credited skills).');
    } else if (presetType === 'student') {
      const fundIds = careerSkills
        .filter((s) => s.stage_label === 'Fundamentals')
        .slice(0, 2)
        .map((s) => s.skill_id);
      setKnownSkills(fundIds);
      addToast('success', 'Preset Applied', 'Pre-credited core fundamentals basics.');
    } else if (presetType === 'switcher') {
      const fundIds = careerSkills
        .filter((s) => s.stage_label === 'Fundamentals')
        .map((s) => s.skill_id);
      setKnownSkills(fundIds);
      addToast('success', 'Preset Applied', 'Pre-credited all Fundamentals stage milestones.');
    } else if (presetType === 'advanced') {
      const fundAndInter = careerSkills
        .filter((s) => s.stage_label === 'Fundamentals' || s.stage_label === 'Intermediate')
        .map((s) => s.skill_id);
      setKnownSkills(fundAndInter);
      addToast('success', 'Preset Applied', 'Pre-credited Fundamentals & Intermediate stages.');
    }
  };

  // Quiz Answer Selection
  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinishQuiz = () => {
    setQuizSubmitted(true);
    // Determine which skills were answered correctly
    const autoCreditedSkillIds: number[] = [];
    careerQuizzes.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        autoCreditedSkillIds.push(q.associatedSkillId);
      }
    });

    setKnownSkills((prev) => Array.from(new Set([...prev, ...autoCreditedSkillIds])));

    addToast(
      'success',
      'Diagnostic Quiz Evaluated!',
      `You answered ${autoCreditedSkillIds.length} of ${careerQuizzes.length} correctly and earned fast-track credits!`
    );
  };

  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    submitAssessment(selectedCareerId, knownSkills);
  };

  const stages: StageLabel[] = ['Fundamentals', 'Intermediate', 'Advanced'];

  // Real-time calculations
  const totalCareerHours = careerSkills.reduce((acc, curr) => acc + curr.estimated_hours, 0);
  const totalHoursSaved = careerSkills
    .filter((s) => knownSkills.includes(s.skill_id))
    .reduce((acc, curr) => acc + curr.estimated_hours, 0);

  const hoursRemaining = Math.max(0, totalCareerHours - totalHoursSaved);
  const weeksSaved = Math.min(
    selectedCareer.total_duration_weeks - 4,
    Math.round((totalHoursSaved / (totalCareerHours || 1)) * selectedCareer.total_duration_weeks)
  );
  const estimatedWeeksRemaining = Math.max(4, selectedCareer.total_duration_weeks - weeksSaved);
  const readinessPercentage = Math.min(100, Math.round((knownSkills.length / (careerSkills.length || 1)) * 100));

  // Determine starting stage
  const startingStage: StageLabel = useMemo(() => {
    const fundSkills = careerSkills.filter((s) => s.stage_label === 'Fundamentals');
    const interSkills = careerSkills.filter((s) => s.stage_label === 'Intermediate');
    
    const fundCompleted = fundSkills.every((s) => knownSkills.includes(s.skill_id));
    const interCompleted = interSkills.every((s) => knownSkills.includes(s.skill_id));

    if (fundCompleted && interCompleted) return 'Advanced';
    if (fundCompleted) return 'Intermediate';
    return 'Fundamentals';
  }, [careerSkills, knownSkills]);

  return (
    <div id="module-2-assessment-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Interactive Stepper */}
      <section
        id="assessment-header-bar"
        className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5 font-display">
              <Sparkles className="w-3 h-3" />
              <span>Skill Benchmark Engine</span>
            </span>
            <span className="text-xs text-[var(--text-subtle)]">&bull;</span>
            <span className="text-xs text-[var(--text-muted)] font-semibold">
              Step {step} of 2 &bull; {step === 1 ? 'Career Trajectory' : 'Skills & Fast-Track Diagnostic'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
            {step === 1 ? 'Choose Your Target Career Trajectory' : `Benchmark Skills for ${selectedCareer.career_name}`}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {step === 1
              ? 'Select your domain to calibrate required industry competencies, market salary ranges, and duration.'
              : 'Identify concepts you already grasp. Our engine skips redundant training and optimizes your learning pace.'}
          </p>
        </div>

        {/* Stepper Button Controls */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              step === 1
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                : 'bg-[var(--app-canvas)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--app-border)]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>1. Career Track</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              step === 2
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                : 'bg-[var(--app-canvas)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--app-border)]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>2. Diagnostic Benchmark</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STEP 1: CAREER TRAJECTORY EXPLORER & COMPARATOR */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--app-card)] p-4 rounded-2xl border border-[var(--app-border)]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-[var(--text-main)]">Filter Careers:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All 5 Disciplines' },
                  { id: 'engineering', label: 'Software & Mobile' },
                  { id: 'data', label: 'Data & Analytics' },
                  { id: 'design_marketing', label: 'Design & Growth' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCareerCategoryFilter(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      careerCategoryFilter === f.id
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-canvas)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-[var(--text-subtle)] font-mono-code">
              Click any card to begin diagnostic
            </span>
          </div>

          {/* Multi-Column Career Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers
              .filter((c) => {
                if (careerCategoryFilter === 'engineering') return c.career_id === 1 || c.career_id === 4;
                if (careerCategoryFilter === 'data') return c.career_id === 2;
                if (careerCategoryFilter === 'design_marketing') return c.career_id === 3 || c.career_id === 5;
                return true;
              })
              .map((career) => {
                const isSelected = career.career_id === selectedCareerId;
                const skillsForCareer = skillPaths.filter((s) => s.career_id === career.career_id);
                const totalHours = skillsForCareer.reduce((acc, curr) => acc + curr.estimated_hours, 0);

                return (
                  <motion.div
                    key={career.career_id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleSelectCareerCard(career.career_id)}
                    className={`group relative rounded-3xl p-6 transition-all cursor-pointer border flex flex-col justify-between overflow-hidden shadow-lg ${
                      isSelected
                        ? 'bg-[var(--app-card)] border-emerald-500 ring-2 ring-emerald-500/30 shadow-emerald-500/10'
                        : 'bg-[var(--app-card)] border-[var(--app-border)] hover:border-emerald-500/50 hover:bg-[var(--app-card-hover)]'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Icon & Selected State */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                          {getCareerIcon(career.icon_key, 'w-6 h-6')}
                        </div>

                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active Selection</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-[var(--text-subtle)] group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                            Select Track <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-emerald-400 transition-colors font-display">
                          {career.career_name}
                        </h3>
                        <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                          {career.tagline}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                        {career.description}
                      </p>

                      {/* Metrics Badges */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-2.5 rounded-xl">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                            Market Compensation
                          </span>
                          <span className="text-xs font-bold text-emerald-400 font-mono-code">
                            {career.avg_salary}
                          </span>
                        </div>

                        <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-2.5 rounded-xl">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                            Estimated Duration
                          </span>
                          <span className="text-xs font-bold text-[var(--text-main)] font-mono-code">
                            {career.total_duration_weeks} Wks &bull; {totalHours}h
                          </span>
                        </div>
                      </div>

                      {/* Core Tech Stack Preview */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)]">
                          Core Competencies:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {skillsForCareer.slice(0, 4).map((s) => (
                            <span
                              key={s.skill_id}
                              className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--app-canvas)] px-2 py-0.5 rounded-md border border-[var(--app-border)]"
                            >
                              {s.skill_name.split(' ')[0]}
                            </span>
                          ))}
                          <span className="text-[10px] text-emerald-400 font-bold px-1 py-0.5">
                            +{skillsForCareer.length - 4} more
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <div className="mt-6 pt-4 border-t border-[var(--app-border)] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">
                        {career.difficulty_level} Difficulty
                      </span>
                      <button
                        type="button"
                        className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1"
                      >
                        <span>Configure Benchmark</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Career Comparison Matrix Banner */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)] font-display flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <span>Cross-Domain Career Comparison Matrix</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Compare earning potential, learning curves, and core competencies across all 5 career tracks.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[11px] font-bold text-[var(--text-subtle)] uppercase tracking-wider font-mono-code">
                    <th className="py-3 px-4">Career Track</th>
                    <th className="py-3 px-4">Avg Salary</th>
                    <th className="py-3 px-4">Learning Curve</th>
                    <th className="py-3 px-4">Curriculum Length</th>
                    <th className="py-3 px-4">Key Tech Stack</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-xs">
                  {careers.map((c) => {
                    const isSelected = c.career_id === selectedCareerId;
                    return (
                      <tr
                        key={c.career_id}
                        className={`hover:bg-[var(--app-canvas)] transition-colors ${
                          isSelected ? 'bg-emerald-500/5 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            {getCareerIcon(c.icon_key, 'w-4 h-4')}
                          </div>
                          <div>
                            <span className="font-bold text-[var(--text-main)]">{c.career_name}</span>
                            {isSelected && (
                              <span className="ml-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                Selected
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono-code text-emerald-400 font-bold">{c.avg_salary}</td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)]">{c.difficulty_level}</td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono-code">{c.total_duration_weeks} Weeks</td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)]">
                          {c.career_id === 1 && 'React, Node.js, SQL, Docker'}
                          {c.career_id === 2 && 'Excel, SQL, Python, Tableau'}
                          {c.career_id === 3 && 'Figma, Design Systems, WCAG'}
                          {c.career_id === 4 && 'Kotlin, Jetpack Compose, Room'}
                          {c.career_id === 5 && 'SEO, GA4, Meta Ads, Funnels'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSelectCareerCard(c.career_id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition-all cursor-pointer"
                          >
                            Select &amp; Benchmark
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
      {/* STEP 2: DUAL BENCHMARK ENGINE & REAL-TIME ROADMAP SIMULATOR */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Active Career Banner + Benchmark Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[var(--app-card)] p-6 rounded-3xl border border-[var(--app-border)] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                {getCareerIcon(selectedCareer.icon_key, 'w-7 h-7')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-display">
                    Active Assessment Target
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[var(--text-subtle)] hover:text-emerald-400 underline cursor-pointer"
                  >
                    Change Career
                  </button>
                </div>
                <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-display">
                  {selectedCareer.career_name}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {selectedCareer.tagline} &bull; {careerSkills.length} Total Milestones
                </p>
              </div>
            </div>

            {/* Mode Switcher: Grid vs Quiz */}
            <div className="flex items-center bg-[var(--app-canvas)] p-1.5 rounded-2xl border border-[var(--app-border)] self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setDiagnosticMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  diagnosticMode === 'grid'
                    ? 'bg-[var(--app-card)] text-emerald-400 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Interactive Skill Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setDiagnosticMode('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  diagnosticMode === 'quiz'
                    ? 'bg-[var(--app-card)] text-emerald-400 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>5-Question Adaptive Quiz</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono-code font-bold">
                  AI Test
                </span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Split Layout: Left Benchmark Area + Right Real-Time Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: DIAGNOSTIC BENCHMARK WORKSPACE */}
            <div className="lg:col-span-8 space-y-6">
              {/* =================================================== */}
              {/* MODE A: INTERACTIVE SKILL MATRIX WITH PRESETS */}
              {/* =================================================== */}
              {diagnosticMode === 'grid' && (
                <div className="space-y-6">
                  {/* Preset Profiles Bar */}
                  <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Quick-Calibration Presets:</span>
                      </span>
                      <span className="text-[11px] text-[var(--text-subtle)] font-mono-code">
                        Select a persona to auto-fill
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => applyPreset('beginner')}
                        className="px-3 py-2 rounded-xl bg-[var(--app-canvas)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--app-border)] text-xs font-semibold text-left transition-all cursor-pointer"
                      >
                        <span className="block font-bold text-[var(--text-main)]">Fresh Beginner</span>
                        <span className="text-[10px] text-[var(--text-subtle)]">Start from Scratch</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyPreset('student')}
                        className="px-3 py-2 rounded-xl bg-[var(--app-canvas)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--app-border)] text-xs font-semibold text-left transition-all cursor-pointer"
                      >
                        <span className="block font-bold text-[var(--text-main)]">CS / Self-Taught</span>
                        <span className="text-[10px] text-[var(--text-subtle)]">Knows Basics (~50h)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyPreset('switcher')}
                        className="px-3 py-2 rounded-xl bg-[var(--app-canvas)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--app-border)] text-xs font-semibold text-left transition-all cursor-pointer"
                      >
                        <span className="block font-bold text-[var(--text-main)]">Career Switcher</span>
                        <span className="text-[10px] text-[var(--text-subtle)]">All Fundamentals</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyPreset('advanced')}
                        className="px-3 py-2 rounded-xl bg-[var(--app-canvas)] hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-400 border border-[var(--app-border)] text-xs font-semibold text-left transition-all cursor-pointer"
                      >
                        <span className="block font-bold text-[var(--text-main)]">Experienced Pro</span>
                        <span className="text-[10px] text-[var(--text-subtle)]">Skip to Advanced</span>
                      </button>
                    </div>
                  </div>

                  {/* Stage-by-Stage Skill Cards */}
                  {stages.map((stage) => {
                    const stageSkills = careerSkills.filter((s) => s.stage_label === stage);
                    if (stageSkills.length === 0) return null;

                    const allStageSelected = stageSkills.every((s) => knownSkills.includes(s.skill_id));
                    const selectedCount = stageSkills.filter((s) => knownSkills.includes(s.skill_id)).length;

                    return (
                      <div
                        key={stage}
                        className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 shadow-sm space-y-4"
                      >
                        {/* Stage Header & Bulk Action */}
                        <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold uppercase tracking-wider font-display">
                              {stage} Stage
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              {selectedCount} of {stageSkills.length} Pre-Credited
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectAllStage(stage)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {allStageSelected ? (
                              <>
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>Deselect Stage</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-3.5 h-3.5" />
                                <span>Pre-Credit All {stage}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Multi-Column Skill Cards for this Stage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {stageSkills.map((skill) => {
                            const isKnown = knownSkills.includes(skill.skill_id);

                            return (
                              <div
                                key={skill.skill_id}
                                onClick={() => toggleSkill(skill.skill_id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 relative ${
                                  isKnown
                                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                                    : 'bg-[var(--app-canvas)] border-[var(--app-border)] hover:border-[var(--text-muted)]'
                                }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isKnown
                                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                      : 'border border-[var(--app-border)] bg-[var(--app-card)] text-transparent'
                                  }`}
                                >
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>

                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4
                                      className={`text-xs font-bold leading-tight font-display ${
                                        isKnown ? 'text-emerald-400' : 'text-[var(--text-main)]'
                                      }`}
                                    >
                                      {skill.skill_name}
                                    </h4>
                                    <span className="text-[10px] font-mono-code font-bold text-[var(--text-subtle)] shrink-0">
                                      {skill.estimated_hours}h
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                                    {skill.description}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-1 pt-1">
                                    {skill.key_topics.slice(0, 2).map((t, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[9px] text-[var(--text-subtle)] bg-[var(--app-card)] px-1.5 py-0.5 rounded border border-[var(--app-border)] font-mono-code"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* =================================================== */}
              {/* MODE B: 5-QUESTION ADAPTIVE DIAGNOSTIC QUIZ */}
              {/* =================================================== */}
              {diagnosticMode === 'quiz' && (
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  {/* Quiz Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--app-border)] pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 inline-block">
                        Real-Time Competency Check
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-main)] font-display mt-2">
                        {selectedCareer.career_name} Diagnostic Test
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Answer 5 practical questions. Correct answers immediately pre-credit relevant milestones!
                      </p>
                    </div>

                    {quizSubmitted && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setActiveQuestionIndex(0);
                        }}
                        className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25 hover:bg-emerald-500/20 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>
                    )}
                  </div>

                  {/* Question Cards List */}
                  <div className="space-y-6">
                    {careerQuizzes.map((q, qIndex) => {
                      const selectedOption = quizAnswers[q.id];
                      const isAnswered = selectedOption !== undefined;
                      const isCorrect = isAnswered && selectedOption === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/40'
                                : 'bg-rose-500/10 border-rose-500/30'
                              : 'bg-[var(--app-canvas)] border-[var(--app-border)]'
                          }`}
                        >
                          {/* Question Number & Target Skill Tag */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-xs font-bold text-[var(--text-subtle)] font-mono-code">
                              Question {qIndex + 1} of {careerQuizzes.length} &bull; {q.topic}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30 font-mono-code">
                              Unlocks: {q.skillName}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[var(--text-main)] mb-4 font-display leading-relaxed">
                            {q.question}
                          </h4>

                          {/* Options */}
                          <div className="space-y-2">
                            {q.options.map((opt, optIndex) => {
                              const isThisSelected = selectedOption === optIndex;
                              let optClass =
                                'bg-[var(--app-card)] text-[var(--text-muted)] border-[var(--app-border)] hover:border-emerald-500/40 hover:text-[var(--text-main)]';

                              if (quizSubmitted) {
                                if (optIndex === q.correctIndex) {
                                  optClass = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
                                } else if (isThisSelected && !isCorrect) {
                                  optClass = 'bg-rose-500/20 text-rose-300 border-rose-500/50';
                                }
                              } else if (isThisSelected) {
                                optClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  type="button"
                                  disabled={quizSubmitted}
                                  onClick={() => handleSelectQuizOption(q.id, optIndex)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${optClass}`}
                                >
                                  <span className="w-5 h-5 rounded-md bg-black/10 flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation (Shown when submitted) */}
                          {quizSubmitted && (
                            <div className="mt-3.5 pt-3 border-t border-[var(--app-border)]/50 text-xs text-[var(--text-muted)] flex items-start gap-2">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="font-bold text-[var(--text-main)]">
                                  {isCorrect ? 'Correct! ' : 'Incorrect. '}
                                </span>
                                {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quiz Submit CTA */}
                  {!quizSubmitted && (
                    <button
                      type="button"
                      onClick={handleFinishQuiz}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm font-display tracking-tight shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Submit Diagnostic Answers &amp; Pre-Credit Skills</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: REAL-TIME ROADMAP SIMULATOR (STICKY HUD) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-7 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono-code">
                    Dynamic Trajectory Forecast
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-main)] font-display mt-0.5">
                    Personalized Roadmap Impact
                  </h3>
                </div>

                {/* Key Metrics Cards */}
                <div className="space-y-3">
                  <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-3.5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                          Fast-Tracked Hours
                        </span>
                        <span className="text-xs font-bold text-[var(--text-main)]">
                          {totalHoursSaved} hrs of {totalCareerHours} hrs
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono-code bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/25">
                      +{Math.round((totalHoursSaved / (totalCareerHours || 1)) * 100)}% Fast
                    </span>
                  </div>

                  <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-3.5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                          Curriculum Duration
                        </span>
                        <span className="text-xs font-bold text-[var(--text-main)]">
                          {estimatedWeeksRemaining} Weeks remaining
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-400 font-mono-code">
                      -{weeksSaved} wks saved
                    </span>
                  </div>

                  <div className="bg-[var(--app-canvas)] border border-[var(--app-border)] p-3.5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] block">
                          Starting Phase
                        </span>
                        <span className="text-xs font-bold text-[var(--text-main)]">
                          {startingStage} Level
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 font-mono-code">
                      Phase Gate
                    </span>
                  </div>
                </div>

                {/* Readiness Gauge Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-muted)]">Readiness Benchmark</span>
                    <span className="font-mono-code font-bold text-emerald-400">
                      {readinessPercentage}% Ready
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--app-canvas)] border border-[var(--app-border)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${readinessPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-[var(--text-subtle)] leading-tight">
                    {knownSkills.length} of {careerSkills.length} total milestones marked as mastered.
                  </p>
                </div>

                {/* Action CTA: Generate Customized Roadmap */}
                <form onSubmit={handleGenerateRoadmap} className="pt-2">
                  <button
                    id="btn-generate-tailored-roadmap"
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm font-display tracking-tight shadow-xl shadow-emerald-500/30 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Generate Tailored Roadmap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
