export type StageLabel = 'Fundamentals' | 'Intermediate' | 'Advanced';

export type SkillStatus = 'not_started' | 'in_progress' | 'completed';

export interface User {
  user_id: number;
  username: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  target_goal?: string;
  study_streak_days?: number;
}

export interface Career {
  career_id: number;
  career_slug: string;
  career_name: string;
  description: string;
  icon_key: string;
  avg_salary: string;
  difficulty_level: string;
  total_duration_weeks: number;
  tagline: string;
  badge_color: string;
}

export interface SkillPath {
  skill_id: number;
  career_id: number;
  step_order: number;
  stage_label: StageLabel;
  skill_name: string;
  description: string;
  resource_link: string;
  resource_title: string;
  resource_type: 'Documentation' | 'Video Course' | 'Interactive' | 'Article' | 'Book';
  estimated_hours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  key_topics: string[];
  prerequisites?: string[];
}

export interface UserSkill {
  id: number;
  user_id: number;
  career_id: number;
  skill_id: number;
  already_known: boolean;
}

export interface UserProgress {
  id: number;
  user_id: number;
  career_id: number;
  skill_id: number;
  status: SkillStatus;
  updated_at: string;
  notes?: string;
  confidence_rating?: number; // 1-5
}

export interface CareerProgressSummary {
  career: Career;
  totalSkills: number;
  completedSkills: number;
  inProgressSkills: number;
  notStartedSkills: number;
  alreadyKnownSkills: number;
  completionPercentage: number;
  currentStage: StageLabel;
  nextRecommendedSkill: SkillPath | null;
  lastUpdated: string;
}

export type ActiveTab = 'dashboard' | 'assessment' | 'roadmap' | 'resources' | 'profile' | 'academic_code';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}
