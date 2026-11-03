import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Bell,
  MessageSquare,
  FileText,
  Users,
  ArrowUpRight,
  TrendingUp,
  Award,
  Download,
  Filter,
  UserCheck,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Flame,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import {
  Course,
  Discipline,
  Turma,
  Student,
  Professor,
  Lesson,
  Material,
  Announcement,
  Discussion,
  UserProfile,
} from '../types';
import { IfLogo } from './IfLogo';
import { getDisciplineLessonsWithFallback } from '../utils/academic-logic';

interface GlassyDashboardV2Props {
  courses: Course[];
  disciplines: Discipline[];
  turmas: Turma[];
  students: Student[];
  professors: Professor[];
  lessons: Lesson[];
  materials: Material[];
  announcements: Announcement[];
  discussions: Discussion[];
  currentUser: UserProfile;
  onToggleRole: () => void;
  onLogout: () => void;
  onSelectDisciplineForSchedule: (discipline: Discipline) => void;
  onSelectMaterialPreview: (material: Material) => void;
  onSwitchToClassicTheme: () => void;
  onOpenAccessibilityModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const GlassyDashboardV2: React.FC<GlassyDashboardV2Props> = ({
  courses,
  disciplines,
  turmas,
  students,
  professors,
  lessons,
  materials,
  announcements,
  discussions,
  currentUser,
  onToggleRole,
  onLogout,
  onSelectDisciplineForSchedule,
  onSelectMaterialPreview,
  onSwitchToClassicTheme,
  onOpenAccessibilityModal,
  onSelectTab,
}) => {
  const isProfessor = currentUser.role === 'professor';
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGlassTab, setActiveGlassTab] = useState<'grade' | 'cronograma' | 'materiais' | 'avisos'>('grade');

  // Filtered disciplines based on course & search
  const filteredDisciplines = disciplines.filter((d) => {
    if (selectedCourseFilter !== 'all' && d.courseId !== selectedCourseFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.syllabus?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate global metrics
  const totalStudents = students.length;
  const totalDisciplines = disciplines.length;
  const totalMaterials = materials.length;
  const totalDownloads = materials.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  const urgentAnnouncements = announcements.filter((a) => a.priority === 'urgente');

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 relative overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* =========================================================================
          Ambient Background Mesh & Glowing Orbs (Code XR Glassy v2 Signature)
          ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left Emerald Orb */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-emerald-500/15 rounded-full blur-[140px]" />
        {/* Top-right Teal/Cyan Orb */}
        <div className="absolute top-1/4 -right-24 w-[480px] h-[480px] bg-teal-500/10 rounded-full blur-[150px]" />
        {/* Bottom-left IFS Crimson Glow */}
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-[#ce2029]/10 rounded-full blur-[160px]" />
        {/* Center subtle mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* =========================================================================
            1. Glassy Top Navigation Header
            ========================================================================= */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b12]/70 border-b border-white/[0.08] shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 h-18">
              {/* Brand & Glassy Mode Pill */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onSwitchToClassicTheme}
                  className="flex items-center gap-2 group transition text-left"
                  title="Clique para ver no estilo clássico oficial"
                >
                  <IfLogo size="md" />
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm tracking-tight font-display">
                        EduConecta IFS
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Code XR Glassy v2
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Campus Tobias Barreto · Modern & Minimal UI
                    </div>
                  </div>
                </button>
              </div>

              {/* Center Search Input in Frosted Glass */}
              <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Buscar matérias, turmas, ementas do PPC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.12] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/20 transition backdrop-blur-md"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] text-slate-400 hover:text-white absolute right-3 top-2.5"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Right Controls: Theme Switcher, Role, Profile */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Switch back to Classic Official Theme Button */}
                <button
                  onClick={onSwitchToClassicTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.15] transition shadow-xs"
                  title="Voltar para a identidade visual clássica do IFS"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">Tema Clássico IFS</span>
                </button>

                {/* Role Switcher */}
                <button
                  onClick={onToggleRole}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs border ${
                    isProfessor
                      ? 'bg-emerald-600/80 hover:bg-emerald-600 text-white border-emerald-400/40'
                      : 'bg-[#ce2029]/80 hover:bg-[#ce2029] text-white border-rose-400/40'
                  }`}
                  title="Alternar entre Docente e Discente"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isProfessor ? 'Docente (Prof.)' : 'Estudante'}
                  </span>
                </button>

                {/* Accessibility Link */}
                <button
                  onClick={onOpenAccessibilityModal}
                  className="p-2 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-xl border border-white/[0.1] transition"
                  title="Acessibilidade Digital & Base Legal (Alt + 3)"
                  aria-label="Acessibilidade e Normas Legais"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl border border-white/[0.1] transition"
                  title="Sair do Portal"
                  aria-label="Sair do sistema"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================================
            2. Main Glassy Container
            ========================================================================= */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero Welcome Glass Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Portal Acadêmico Ativo · Semestre 2026.1</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
                  {isProfessor ? `Olá, ${currentUser.name}` : `Bem-vindo(a), ${currentUser.name}`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Coordenação de Informática (COINF) · Campus Tobias Barreto. Ambiente integrado com visual translúcido, ementas completas do PPC e materiais em nuvem.
                </p>
              </div>

              {/* Action Buttons in Glass */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onSelectTab('materials')}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-emerald-500/90 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Repositório de Materiais</span>
                </button>
                <button
                  onClick={() => onSelectTab('turmas')}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.15] transition flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Ver Turmas ({turmas.length})</span>
                </button>
              </div>
            </div>

            {/* 4 Glass KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
              {/* Card 1 */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 transition hover:bg-white/[0.06] hover:border-emerald-500/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Disciplinas no PPC</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display">
                  {totalDisciplines}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>100% alinhadas à Resolução</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 transition hover:bg-white/[0.06] hover:border-emerald-500/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Estudantes Matriculados</span>
                  <Users className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display">
                  {totalStudents}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Distribuídos em {turmas.length} turmas ativas
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 transition hover:bg-white/[0.06] hover:border-emerald-500/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Materiais Didáticos</span>
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display">
                  {totalMaterials}
                </div>
                <div className="text-[11px] text-cyan-400 flex items-center gap-1 mt-1">
                  <span>{totalDownloads} downloads efetuados</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 transition hover:bg-white/[0.06] hover:border-[#ce2029]/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Comunicados Oficiais</span>
                  <Bell className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display">
                  {announcements.length}
                </div>
                <div className="text-[11px] text-rose-300 mt-1">
                  {urgentAnnouncements.length} classificado(s) como urgente
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. Glass Segmented Navigation & Course Selector
              ========================================================================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Tab Selector */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setActiveGlassTab('grade')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeGlassTab === 'grade'
                    ? 'bg-emerald-500/90 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Matriz & Matérias</span>
              </button>
              <button
                onClick={() => setActiveGlassTab('cronograma')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeGlassTab === 'cronograma'
                    ? 'bg-emerald-500/90 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Aulas do PPC</span>
              </button>
              <button
                onClick={() => setActiveGlassTab('materiais')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeGlassTab === 'materiais'
                    ? 'bg-emerald-500/90 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Materiais ({materials.length})</span>
              </button>
              <button
                onClick={() => setActiveGlassTab('avisos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeGlassTab === 'avisos'
                    ? 'bg-emerald-500/90 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Mural de Avisos</span>
              </button>
            </div>

            {/* Course Filter Pills in Frosted Glass */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-slate-400 font-medium">Filtrar Curso:</span>
              <button
                onClick={() => setSelectedCourseFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  selectedCourseFilter === 'all'
                    ? 'bg-white/[0.12] text-white border-white/[0.25]'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.08]'
                }`}
              >
                Todos
              </button>
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border whitespace-nowrap ${
                    selectedCourseFilter === c.id
                      ? 'bg-white/[0.12] text-white border-white/[0.25]'
                      : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.08]'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================================
              4. Tab Content: Matriz Curricular & Disciplinas
              ========================================================================= */}
          {activeGlassTab === 'grade' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Exibindo <strong>{filteredDisciplines.length}</strong> matérias cadastradas no PPC</span>
                <span className="font-mono">PPC Resolução CS/IFS nº 216/2023 & nº 09/2017</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredDisciplines.map((discipline) => {
                  const parentCourse = courses.find((c) => c.id === discipline.courseId);
                  const disciplineLessons = getDisciplineLessonsWithFallback(
                    lessons,
                    discipline,
                    discipline.courseId
                  );
                  const completedLessons = disciplineLessons.filter((l) => l.status === 'concluida').length;
                  const percent = disciplineLessons.length > 0 ? Math.round((completedLessons / disciplineLessons.length) * 100) : 0;
                  const isTds = discipline.courseId === 'course-tds';

                  return (
                    <div
                      key={discipline.id}
                      className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top Accent Line */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 ${
                          isTds ? 'bg-[#ce2029]' : 'bg-[#1e7e34]'
                        }`}
                      />

                      <div>
                        {/* Header Badge Row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono tracking-wider border ${
                              isTds
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {discipline.code}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {discipline.periodNumber}º Período ({discipline.workloadHours}h)
                          </span>
                        </div>

                        {/* Title & Ementa */}
                        <h3 className="text-base font-bold text-white font-display group-hover:text-emerald-300 transition mb-1.5">
                          {discipline.name}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                          {discipline.syllabus || discipline.description}
                        </p>

                        {/* Modules preview */}
                        {discipline.modules && discipline.modules.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {discipline.modules.slice(0, 2).map((mod, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.06] truncate max-w-[200px]"
                              >
                                {mod}
                              </span>
                            ))}
                            {discipline.modules.length > 2 && (
                              <span className="text-[10px] text-slate-500 self-center">
                                +{discipline.modules.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Progress Bar of Lessons */}
                        <div className="space-y-1 mb-4 pt-2 border-t border-white/[0.06]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Progresso do Cronograma:</span>
                            <span className="font-bold text-emerald-400">{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {completedLessons} de {disciplineLessons.length} aulas cumpridas
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/[0.08]">
                        <button
                          onClick={() => onSelectDisciplineForSchedule(discipline)}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-emerald-500/20 hover:border-emerald-500/40 text-white text-xs font-semibold border border-white/[0.1] transition flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ver Cronograma</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectTab('materials');
                          }}
                          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition"
                          title="Ver materiais didáticos"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              5. Tab Content: Cronograma de Aulas PPC
              ========================================================================= */}
          {activeGlassTab === 'cronograma' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Linha do Tempo de Aulas Oficiais (COINF)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Cronograma detalhado aula a aula de acordo com a carga horária das resoluções do IFS.
                  </p>
                </div>
                <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  Total de {lessons.length} aulas registradas
                </div>
              </div>

              <div className="space-y-3">
                {lessons.slice(0, 8).map((lesson) => {
                  const parentDisc = disciplines.find((d) => d.id === lesson.disciplineId);

                  return (
                    <div
                      key={lesson.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                            Aula {String(lesson.lessonNumber).padStart(2, '0')}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">
                            {parentDisc ? parentDisc.code : 'COINF'} · {parentDisc?.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({lesson.bimestre}º Bimestre)
                          </span>
                          {lesson.isEvaluation && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Avaliação
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {lesson.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {lesson.durationHours}h
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                            lesson.status === 'concluida'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : lesson.status === 'em_andamento'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-white/[0.05] text-slate-400 border-white/[0.1]'
                          }`}
                        >
                          {lesson.status === 'concluida' ? 'Concluída' : lesson.status === 'em_andamento' ? 'Em Andamento' : 'Prevista'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              6. Tab Content: Materiais Didáticos em Vidro
              ========================================================================= */}
          {activeGlassTab === 'materiais' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Acervo de Materiais Didáticos & Apostilas
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Documentos oficiais, slides de aula, apostilas em PDF e links do curso.
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab('materials')}
                  className="px-4 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Acessar Gerenciador Completo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:border-emerald-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-mono text-[10px] text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                          {mat.type.toUpperCase()}
                        </span>
                        <span>{mat.fileSize || 'Link'}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5">
                        {mat.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {mat.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                      <span className="text-slate-500 text-[11px]">{mat.downloadCount} downloads</span>
                      <button
                        onClick={() => onSelectMaterialPreview(mat)}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <span>Abrir</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              7. Tab Content: Mural de Avisos
              ========================================================================= */}
          {activeGlassTab === 'avisos' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Mural de Comunicados Oficiais
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Avisos da Coordenação de Informática (COINF) e comunicados para discentes.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-5 rounded-2xl border transition ${
                      ann.priority === 'urgente'
                        ? 'bg-rose-500/[0.06] border-rose-500/30'
                        : 'bg-white/[0.03] border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <div className="flex items-center gap-2">
                        {ann.pinned && (
                          <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                            ★ Fixado
                          </span>
                        )}
                        <span
                          className={`font-semibold ${
                            ann.priority === 'urgente' ? 'text-rose-400' : 'text-slate-300'
                          }`}
                        >
                          {ann.priority.toUpperCase()}
                        </span>
                      </div>
                      <span>{ann.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5 font-display">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* =========================================================================
            8. Glassy Footer with Theme Switch Action
            ========================================================================= */}
        <footer className="border-t border-white/[0.08] bg-[#070b12]/80 backdrop-blur-xl py-6 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white">
                Instituto Federal de Sergipe · Campus Tobias Barreto (COINF)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Exibindo no layout Code XR Glassy Dashboard v2 · Modern & Minimal UI.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSwitchToClassicTheme}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-semibold transition flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Retornar ao Tema Clássico Oficial IFS</span>
              </button>
              <button
                onClick={onOpenAccessibilityModal}
                className="text-slate-300 hover:text-white underline"
              >
                Acessibilidade [Alt + 3]
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
