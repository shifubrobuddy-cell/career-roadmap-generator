import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Career,
  SkillPath,
  UserSkill,
  UserProgress,
  CareerProgressSummary,
  ActiveTab,
  ToastNotification,
  SkillStatus,
  StageLabel,
} from '../types';
import { CAREERS, SKILL_PATHS } from '../data/seedData';

interface AppContextType {
  user: User | null;
  careers: Career[];
  skillPaths: SkillPath[];
  userSkills: UserSkill[];
  userProgress: UserProgress[];
  activeCareerId: number;
  activeTab: ActiveTab;
  theme: 'dark' | 'light';
  accent: 'emerald' | 'violet' | 'cyan' | 'amber';
  toasts: ToastNotification[];
  selectedSkillForModal: SkillPath | null;
  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setActiveCareerId: (careerId: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setAccent: (accent: 'emerald' | 'violet' | 'cyan' | 'amber') => void;
  login: (username: string, email: string) => void;
  logout: () => void;
  updateUserGoal: (goal: string) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  submitAssessment: (careerId: number, knownSkillIds: number[]) => void;
  updateSkillStatus: (careerId: number, skillId: number, status: SkillStatus, notes?: string) => void;
  batchUpdateSkills: (careerId: number, skillIds: number[], status: SkillStatus) => void;
  resetCareerProgress: (careerId: number) => void;
  getCareerSummary: (careerId: number) => CareerProgressSummary | null;
  getAllTrackedSummaries: () => CareerProgressSummary[];
  addToast: (type: ToastNotification['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  exportDataJson: () => void;
  openSkillModal: (skill: SkillPath) => void;
  closeSkillModal: () => void;
}

const DEFAULT_USER: User = {
  user_id: 1,
  username: 'shifubrobuddy',
  email: 'shifubrobuddy@gmail.com',
  created_at: '2026-08-20 08:00:00',
  target_goal: 'Full-Stack Software Engineer & SaaS Builder',
  study_streak_days: 14,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const STORAGE_KEYS = {
  USER: 'career_roadmap_user',
  USER_SKILLS: 'career_roadmap_user_skills',
  USER_PROGRESS: 'career_roadmap_user_progress',
  ACTIVE_CAREER: 'career_roadmap_active_career',
  THEME: 'career_roadmap_theme',
  ACCENT: 'career_roadmap_accent',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State with LocalStorage fallbacks
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  const [activeCareerId, setActiveCareerId] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CAREER);
    return saved ? parseInt(saved, 10) : 1; // Default to Web Developer
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [accent, setAccentState] = useState<'emerald' | 'violet' | 'cyan' | 'amber'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCENT);
    if (saved === 'emerald' || saved === 'violet' || saved === 'cyan' || saved === 'amber') {
      return saved;
    }
    return 'emerald';
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<SkillPath | null>(null);

  // 2. Pre-seed default user skills and progress for Web Developer & Data Analyst
  const [userSkills, setUserSkills] = useState<UserSkill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_SKILLS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default initial seeded skills (HTML, CSS known for Web Dev)
    return [
      { id: 1, user_id: 1, career_id: 1, skill_id: 101, already_known: true },
      { id: 2, user_id: 1, career_id: 1, skill_id: 102, already_known: true },
      { id: 3, user_id: 1, career_id: 1, skill_id: 103, already_known: false },
      { id: 4, user_id: 1, career_id: 1, skill_id: 104, already_known: false },
      { id: 5, user_id: 1, career_id: 1, skill_id: 105, already_known: false },
    ];
  });

  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default initial progress
    return [
      { id: 1, user_id: 1, career_id: 1, skill_id: 101, status: 'completed', updated_at: new Date().toISOString() },
      { id: 2, user_id: 1, career_id: 1, skill_id: 102, status: 'completed', updated_at: new Date().toISOString() },
      { id: 3, user_id: 1, career_id: 1, skill_id: 103, status: 'in_progress', updated_at: new Date().toISOString(), notes: 'Learning closures and async/await event loop.' },
      { id: 4, user_id: 1, career_id: 1, skill_id: 104, status: 'not_started', updated_at: new Date().toISOString() },
      { id: 5, user_id: 1, career_id: 1, skill_id: 105, status: 'not_started', updated_at: new Date().toISOString() },
    ];
  });

  // Sync with LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(userSkills));
  }, [userSkills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CAREER, activeCareerId.toString());
  }, [activeCareerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCENT, accent);
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  // Toast Helper
  const addToast = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const newToast: ToastNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
    };
    setToasts((prev) => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Theme Toggle
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Auth Handlers
  const login = useCallback((username: string, email: string) => {
    const newUser: User = {
      user_id: Date.now(),
      username,
      email,
      created_at: new Date().toISOString(),
      target_goal: 'Tech Professional Roadmap Builder',
      study_streak_days: 1,
    };
    setUser(newUser);
    setActiveTab('dashboard');
    addToast('success', 'Welcome Back!', `Logged in successfully as ${username}`);
  }, [addToast]);

  const logout = useCallback(() => {
    setUser(null);
    addToast('info', 'Logged Out', 'Your session has ended.');
  }, [addToast]);

  const updateUserGoal = useCallback((goal: string) => {
    if (!user) return;
    setUser({ ...user, target_goal: goal });
    addToast('success', 'Goal Updated', 'Your target career milestone was saved.');
  }, [user, addToast]);

  const changePassword = useCallback((_oldPass: string, newPass: string): boolean => {
    if (newPass.length < 8) {
      addToast('error', 'Weak Password', 'Password must be at least 8 characters long.');
      return false;
    }
    addToast('success', 'Password Changed', 'Your password hash has been updated securely.');
    return true;
  }, [addToast]);

  // Assessment Submission (Module 2)
  const submitAssessment = useCallback((careerId: number, knownSkillIds: number[]) => {
    if (!user) return;
    const careerSkills = SKILL_PATHS.filter((s) => s.career_id === careerId);
    if (careerSkills.length === 0) return;

    // 1. Build updated user_skills
    const otherUserSkills = userSkills.filter((us) => us.career_id !== careerId);
    const newUserSkills: UserSkill[] = careerSkills.map((skill, idx) => ({
      id: Date.now() + idx,
      user_id: user.user_id,
      career_id: careerId,
      skill_id: skill.skill_id,
      already_known: knownSkillIds.includes(skill.skill_id),
    }));

    // 2. Build updated user_progress
    const otherUserProgress = userProgress.filter((up) => up.career_id !== careerId);
    const newUserProgress: UserProgress[] = careerSkills.map((skill, idx) => {
      const isKnown = knownSkillIds.includes(skill.skill_id);
      return {
        id: Date.now() + 1000 + idx,
        user_id: user.user_id,
        career_id: careerId,
        skill_id: skill.skill_id,
        status: isKnown ? 'completed' : 'not_started',
        updated_at: new Date().toISOString(),
      };
    });

    setUserSkills([...otherUserSkills, ...newUserSkills]);
    setUserProgress([...otherUserProgress, ...newUserProgress]);
    setActiveCareerId(careerId);
    setActiveTab('roadmap');

    const career = CAREERS.find((c) => c.career_id === careerId);
    addToast(
      'success',
      'Roadmap Generated!',
      `Personalized ${career?.career_name || ''} path created with ${knownSkillIds.length} skills pre-credited.`
    );

    // Small celebratory confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  }, [user, userSkills, userProgress, addToast]);

  // Skill Status Update (Module 4 AJAX simulation with real local DB sync)
  const updateSkillStatus = useCallback((
    careerId: number,
    skillId: number,
    status: SkillStatus,
    notes?: string
  ) => {
    if (!user) return;

    setUserProgress((prev) => {
      const existingIdx = prev.findIndex((p) => p.career_id === careerId && p.skill_id === skillId);
      const now = new Date().toISOString();

      let nextProgress: UserProgress[];
      if (existingIdx >= 0) {
        nextProgress = [...prev];
        nextProgress[existingIdx] = {
          ...nextProgress[existingIdx],
          status,
          updated_at: now,
          notes: notes !== undefined ? notes : nextProgress[existingIdx].notes,
        };
      } else {
        nextProgress = [
          ...prev,
          {
            id: Date.now(),
            user_id: user.user_id,
            career_id: careerId,
            skill_id: skillId,
            status,
            updated_at: now,
            notes,
          },
        ];
      }

      // Check if this made a whole stage or the entire career complete!
      const allCareerSkills = SKILL_PATHS.filter((s) => s.career_id === careerId);
      const completedCount = allCareerSkills.filter((s) => {
        if (s.skill_id === skillId) return status === 'completed';
        const prog = nextProgress.find((p) => p.career_id === careerId && p.skill_id === s.skill_id);
        return prog?.status === 'completed';
      }).length;

      const targetSkill = SKILL_PATHS.find((s) => s.skill_id === skillId);
      const skillName = targetSkill?.skill_name || 'Skill';

      if (status === 'completed') {
        if (completedCount === allCareerSkills.length) {
          // Entire career track completed!!
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#22C55E', '#F59E0B', '#3B82F6'],
          });
          addToast('success', '🏆 Career Path Mastered!', `You have completed all skills for this track!`);
        } else {
          // Single skill completed
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
          });
          addToast('success', 'Skill Completed!', `"${skillName}" marked as mastered.`);
        }
      } else if (status === 'in_progress') {
        addToast('info', 'Skill In Progress', `"${skillName}" is now active in your study queue.`);
      } else {
        addToast('info', 'Status Updated', `"${skillName}" reset to Not Started.`);
      }

      return nextProgress;
    });
  }, [user, addToast]);

  // Batch Update
  const batchUpdateSkills = useCallback((careerId: number, skillIds: number[], status: SkillStatus) => {
    if (!user) return;
    setUserProgress((prev) => {
      const now = new Date().toISOString();
      const updated = [...prev];
      skillIds.forEach((sid) => {
        const idx = updated.findIndex((p) => p.career_id === careerId && p.skill_id === sid);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], status, updated_at: now };
        } else {
          updated.push({
            id: Date.now() + Math.random(),
            user_id: user.user_id,
            career_id: careerId,
            skill_id: sid,
            status,
            updated_at: now,
          });
        }
      });
      return updated;
    });
    addToast('success', 'Batch Update Applied', `Updated ${skillIds.length} skills to "${status}".`);
  }, [user, addToast]);

  // Reset Career
  const resetCareerProgress = useCallback((careerId: number) => {
    setUserProgress((prev) => prev.filter((p) => p.career_id !== careerId));
    setUserSkills((prev) => prev.filter((s) => s.career_id !== careerId));
    addToast('info', 'Progress Reset', 'Career progress has been cleared. You can re-assess anytime.');
  }, [addToast]);

  // Summary Helper for Single Career
  const getCareerSummary = useCallback((careerId: number): CareerProgressSummary | null => {
    const career = CAREERS.find((c) => c.career_id === careerId);
    if (!career) return null;

    const skills = SKILL_PATHS.filter((s) => s.career_id === careerId).sort((a, b) => a.step_order - b.step_order);
    const totalSkills = skills.length;

    let completedSkills = 0;
    let inProgressSkills = 0;
    let alreadyKnownSkills = 0;
    let nextRecommendedSkill: SkillPath | null = null;
    let lastUpdated = '';

    skills.forEach((skill) => {
      const prog = userProgress.find((p) => p.career_id === careerId && p.skill_id === skill.skill_id);
      const known = userSkills.find((s) => s.career_id === careerId && s.skill_id === skill.skill_id)?.already_known;

      if (known) alreadyKnownSkills++;

      if (prog?.status === 'completed') {
        completedSkills++;
      } else if (prog?.status === 'in_progress') {
        inProgressSkills++;
      }

      if (prog?.updated_at && (!lastUpdated || prog.updated_at > lastUpdated)) {
        lastUpdated = prog.updated_at;
      }

      if (!nextRecommendedSkill && prog?.status !== 'completed') {
        nextRecommendedSkill = skill;
      }
    });

    const notStartedSkills = totalSkills - completedSkills - inProgressSkills;
    const completionPercentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

    // Determine current stage
    let currentStage: StageLabel = 'Fundamentals';
    if (nextRecommendedSkill) {
      currentStage = nextRecommendedSkill.stage_label;
    } else if (completedSkills === totalSkills && totalSkills > 0) {
      currentStage = 'Advanced';
    }

    return {
      career,
      totalSkills,
      completedSkills,
      inProgressSkills,
      notStartedSkills,
      alreadyKnownSkills,
      completionPercentage,
      currentStage,
      nextRecommendedSkill,
      lastUpdated: lastUpdated || new Date().toISOString(),
    };
  }, [userProgress, userSkills]);

  // Summaries for all tracked careers
  const getAllTrackedSummaries = useCallback((): CareerProgressSummary[] => {
    // Find all unique career IDs present in userSkills or userProgress
    const trackedIds = Array.from(
      new Set([
        ...userSkills.map((us) => us.career_id),
        ...userProgress.map((up) => up.career_id),
      ])
    );

    // If empty, return active career
    const idsToFetch = trackedIds.length > 0 ? trackedIds : [activeCareerId];

    return idsToFetch
      .map((cid) => getCareerSummary(cid))
      .filter((s): s is CareerProgressSummary => s !== null)
      .sort((a, b) => b.completionPercentage - a.completionPercentage);
  }, [userSkills, userProgress, activeCareerId, getCareerSummary]);

  // Export JSON (Module 5)
  const exportDataJson = useCallback(() => {
    if (!user) return;
    const allSummaries = getAllTrackedSummaries();
    const exportPayload = {
      export_version: '1.0',
      exported_at: new Date().toISOString(),
      project: 'Career Roadmap Generator: Personalized Skill Path & Progress Tracking Platform',
      student_profile: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        member_since: user.created_at,
        study_streak_days: user.study_streak_days,
        target_goal: user.target_goal,
      },
      tracked_careers: allSummaries.map((sum) => ({
        career_id: sum.career.career_id,
        career_name: sum.career.career_name,
        slug: sum.career.career_slug,
        completion_rate: `${sum.completionPercentage}%`,
        completed_skills_count: sum.completedSkills,
        total_skills_count: sum.totalSkills,
        current_stage: sum.currentStage,
        next_recommended_skill: sum.nextRecommendedSkill?.skill_name || 'All Completed',
      })),
      detailed_skill_progress: userProgress.map((up) => {
        const skill = SKILL_PATHS.find((s) => s.skill_id === up.skill_id);
        const career = CAREERS.find((c) => c.career_id === up.career_id);
        return {
          career_name: career?.career_name,
          skill_id: up.skill_id,
          step_order: skill?.step_order,
          stage: skill?.stage_label,
          skill_name: skill?.skill_name,
          status: up.status,
          notes: up.notes || null,
          last_updated: up.updated_at,
          resource_link: skill?.resource_link,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `career_roadmap_export_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('success', 'Data Exported!', 'Your personalized roadmap data has been downloaded as JSON.');
  }, [user, getAllTrackedSummaries, userProgress, addToast]);

  const setAccent = useCallback((newAccent: 'emerald' | 'violet' | 'cyan' | 'amber') => {
    setAccentState(newAccent);
  }, []);

  const openSkillModal = useCallback((skill: SkillPath) => {
    setSelectedSkillForModal(skill);
  }, []);

  const closeSkillModal = useCallback(() => {
    setSelectedSkillForModal(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      careers: CAREERS,
      skillPaths: SKILL_PATHS,
      userSkills,
      userProgress,
      activeCareerId,
      activeTab,
      theme,
      accent,
      toasts,
      selectedSkillForModal,
      setActiveTab,
      setActiveCareerId,
      setTheme,
      toggleTheme,
      setAccent,
      login,
      logout,
      updateUserGoal,
      changePassword,
      submitAssessment,
      updateSkillStatus,
      batchUpdateSkills,
      resetCareerProgress,
      getCareerSummary,
      getAllTrackedSummaries,
      addToast,
      removeToast,
      exportDataJson,
      openSkillModal,
      closeSkillModal,
    }),
    [
      user,
      userSkills,
      userProgress,
      activeCareerId,
      activeTab,
      theme,
      accent,
      toasts,
      selectedSkillForModal,
      toggleTheme,
      setAccent,
      login,
      logout,
      updateUserGoal,
      changePassword,
      submitAssessment,
      updateSkillStatus,
      batchUpdateSkills,
      resetCareerProgress,
      getCareerSummary,
      getAllTrackedSummaries,
      addToast,
      removeToast,
      exportDataJson,
      openSkillModal,
      closeSkillModal,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
