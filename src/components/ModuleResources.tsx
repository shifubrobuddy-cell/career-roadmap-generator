import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  ExternalLink,
  Filter,
  Globe,
  BarChart3,
  Palette,
  Smartphone,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const ModuleResources: React.FC = () => {
  const { careers, skillPaths, activeCareerId, setActiveCareerId, setActiveTab } = useApp();

  const [selectedCareerFilter, setSelectedCareerFilter] = useState<number>(0); // 0 = all
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResources = useMemo(() => {
    return skillPaths.filter((s) => {
      const matchesCareer = selectedCareerFilter === 0 || s.career_id === selectedCareerFilter;
      const matchesStage = selectedStageFilter === 'all' || s.stage_label === selectedStageFilter;
      const matchesSearch =
        s.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.resource_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.key_topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCareer && matchesStage && matchesSearch;
    });
  }, [skillPaths, selectedCareerFilter, selectedStageFilter, searchQuery]);

  return (
    <div id="module-resources-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--app-card)] border border-[var(--app-border)] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              <span>Curated Documentation & Tutorial Hub</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
            Curated Tech Career Resources
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
            Direct links to official documentation, sandbox courses, and high-yield video tutorials mapped across all 50 roadmap milestones.
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full md:w-80 relative z-10">
          <Search className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-global-search-resources"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs, topics, frameworks..."
            className="w-full bg-[var(--app-canvas)] border border-[var(--app-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-2xl shadow-sm">
        {/* Career Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[var(--text-muted)] mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Track:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCareerFilter(0)}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
              selectedCareerFilter === 0
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-canvas)]'
            }`}
          >
            All Tracks ({skillPaths.length})
          </button>
          {careers.map((c) => (
            <button
              key={c.career_id}
              type="button"
              onClick={() => setSelectedCareerFilter(c.career_id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                selectedCareerFilter === c.career_id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--app-canvas)]'
              }`}
            >
              {c.career_name}
            </button>
          ))}
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1.5">
          {['all', 'Fundamentals', 'Intermediate', 'Advanced'].map((stg) => (
            <button
              key={stg}
              onClick={() => setSelectedStageFilter(stg)}
              className={`px-3 py-1 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                selectedStageFilter === stg
                  ? 'bg-[var(--app-canvas)] text-emerald-400 border border-emerald-500/40'
                  : 'text-[var(--text-subtle)] hover:text-[var(--text-muted)]'
              }`}
            >
              {stg === 'all' ? 'All Tiers' : stg}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((skill) => {
          const career = careers.find((c) => c.career_id === skill.career_id);
          return (
            <div
              key={skill.skill_id}
              className="bg-[var(--app-card)] border border-[var(--app-border)] hover:border-emerald-500/40 rounded-3xl p-6 transition-all flex flex-col justify-between shadow-lg group hover:shadow-xl hover:scale-[1.01]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {career?.career_name}
                  </span>
                  <span className="text-[10px] font-mono-code text-[var(--text-subtle)]">
                    ~{skill.estimated_hours}h est.
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)] font-display group-hover:text-emerald-400 transition-colors">
                    {skill.skill_name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--app-canvas)] border border-[var(--app-border)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] block">
                    Curated Documentation
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-main)] line-clamp-1">
                    {skill.resource_title}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {skill.key_topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[var(--app-canvas)] text-[var(--text-subtle)] px-2 py-0.5 rounded-lg border border-[var(--app-border)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[var(--app-border)] flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveCareerId(skill.career_id);
                    setActiveTab('roadmap');
                  }}
                  className="text-xs font-bold text-[var(--text-muted)] hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  View in Roadmap &rarr;
                </button>

                <a
                  href={skill.resource_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-bold transition-all border border-emerald-500/20 hover:border-emerald-400"
                >
                  <span>Open Docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
