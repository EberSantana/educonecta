import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Video,
  Code,
  Link2,
  Download,
  Eye,
  Plus,
  Search,
  CheckCircle,
  Filter,
  Trash2,
  Edit2,
  HardDrive,
  Cloud,
  GraduationCap,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Material, Discipline, UserRole, MaterialType, Course } from '../types';
import { filterMaterials, calculateDisciplineProgress } from '../utils/academic-logic';

interface MaterialsViewProps {
  disciplines: Discipline[];
  materials: Material[];
  courses: Course[];
  selectedDisciplineId: string;
  selectedCourseId?: string;
  userRole: UserRole;
  completedMaterialIds: string[];
  initialLessonFilter?: number | null;
  onSelectCourse?: (courseId: string) => void;
  onSelectDiscipline?: (disciplineId: string) => void;
  onToggleCompleted: (materialId: string) => void;
  onOpenNewMaterialModal: () => void;
  onOpenPreview: (material: Material) => void;
  onEditMaterial?: (material: Material) => void;
  onDeleteMaterial: (materialId: string) => void;
  onDownloadMaterial: (material: Material) => void;
  onOpenStorageInfo?: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  disciplines,
  materials,
  courses,
  selectedDisciplineId,
  selectedCourseId = 'all',
  userRole,
  completedMaterialIds,
  initialLessonFilter = null,
  onSelectCourse,
  onSelectDiscipline,
  onToggleCompleted,
  onOpenNewMaterialModal,
  onOpenPreview,
  onEditMaterial,
  onDeleteMaterial,
  onDownloadMaterial,
  onOpenStorageInfo,
}) => {
  const [periodFilter, setPeriodFilter] = useState<number | 'all'>('all');
  const [internalCourseFilter, setInternalCourseFilter] = useState<string>(selectedCourseId);
  const [internalDisciplineFilter, setInternalDisciplineFilter] = useState<string>(selectedDisciplineId);
  const [lessonFilter, setLessonFilter] = useState<number | 'all'>(initialLessonFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const effectiveCourseFilter = internalCourseFilter;
  const effectiveDisciplineFilter = internalDisciplineFilter;

  // Handle period change
  const handlePeriodChange = (newPeriod: number | 'all') => {
    setPeriodFilter(newPeriod);
    setInternalDisciplineFilter('all');
    setLessonFilter('all');
    setModuleFilter('all');
    if (onSelectDiscipline) onSelectDiscipline('all');
  };

  // Handle course change
  const handleCourseChange = (newCourseId: string) => {
    setInternalCourseFilter(newCourseId);
    setInternalDisciplineFilter('all');
    setLessonFilter('all');
    setModuleFilter('all');
    if ((newCourseId === 'course-tds' || newCourseId === 'tds-int') && periodFilter === 4) {
      setPeriodFilter('all');
    }
    if (onSelectCourse) onSelectCourse(newCourseId);
    if (onSelectDiscipline) onSelectDiscipline('all');
  };

  // Handle discipline change
  const handleDisciplineChange = (newDisciplineId: string) => {
    setInternalDisciplineFilter(newDisciplineId);
    setLessonFilter('all');
    setModuleFilter('all');
    if (onSelectDiscipline) onSelectDiscipline(newDisciplineId);
  };

  // Disciplines available for the currently selected course and period
  const availableDisciplinesForCourse = disciplines
    .filter((d) => effectiveCourseFilter === 'all' || d.courseId === effectiveCourseFilter)
    .filter((d) => periodFilter === 'all' || d.periodNumber === periodFilter);

  // 1. Filter materials by Course
  let courseFilteredMaterials =
    effectiveCourseFilter === 'all'
      ? materials
      : materials.filter((m) => {
          if (m.courseId) return m.courseId === effectiveCourseFilter;
          const parentDisc = disciplines.find((d) => d.id === m.disciplineId);
          return parentDisc ? parentDisc.courseId === effectiveCourseFilter : false;
        });

  // 1.5. Filter materials by Period
  if (periodFilter !== 'all') {
    courseFilteredMaterials = courseFilteredMaterials.filter((m) => {
      const parentDisc = disciplines.find((d) => d.id === m.disciplineId);
      return parentDisc ? parentDisc.periodNumber === periodFilter : true;
    });
  }

  // 2. Filter by Discipline
  if (effectiveDisciplineFilter !== 'all') {
    courseFilteredMaterials = courseFilteredMaterials.filter(
      (m) => m.disciplineId === effectiveDisciplineFilter
    );
  }

  // 3. Filter by Lesson
  if (lessonFilter !== 'all') {
    courseFilteredMaterials = courseFilteredMaterials.filter(
      (m) => m.lessonNumber === lessonFilter
    );
  }

  // 4. Apply search, type, and module filters
  const filteredList = filterMaterials(
    courseFilteredMaterials,
    searchQuery,
    typeFilter,
    moduleFilter
  );

  // Active discipline object for metadata
  const activeDiscipline = disciplines.find((d) => d.id === effectiveDisciplineFilter);
  const activeCourse = courses.find((c) => c.id === effectiveCourseFilter);

  const isTds = effectiveCourseFilter === 'course-tds' || activeCourse?.code === 'TDS-INT' || activeCourse?.degree === 'Técnico Integrado';
  const isSub = effectiveCourseFilter === 'course-inf' || activeCourse?.code === 'INF-SUB' || activeCourse?.degree === 'Técnico Subsequente';

  const periodTabs = isTds
    ? [
        { id: 'all', label: 'Todos os 3 Anos' },
        { id: 1, label: '1º Ano' },
        { id: 2, label: '2º Ano' },
        { id: 3, label: '3º Ano' },
      ]
    : isSub
    ? [
        { id: 'all', label: 'Todos os 4 Períodos' },
        { id: 1, label: '1º Período' },
        { id: 2, label: '2º Período' },
        { id: 3, label: '3º Período' },
        { id: 4, label: '4º Período' },
      ]
    : [
        { id: 'all', label: 'Todos os Anos / Períodos' },
        { id: 1, label: '1º Ano / 1º Período' },
        { id: 2, label: '2º Ano / 2º Período' },
        { id: 3, label: '3º Ano / 3º Período' },
        { id: 4, label: '4º Período (Subsequente)' },
      ];

  const periodLabel = isTds
    ? 'Filtrar por Ano Letivo (TDS):'
    : isSub
    ? 'Filtrar por Período Letivo (Subsequente):'
    : 'Filtrar por Período:';

  // Student progress in this context
  const progressPercent = calculateDisciplineProgress(
    courseFilteredMaterials,
    completedMaterialIds
  );

  // Get available modules for filter dropdown
  const availableModules = Array.from(
    new Set(courseFilteredMaterials.map((m) => m.module))
  ).filter(Boolean);

  // Get available lessons for filter
  const availableLessons = Array.from(
    new Set(courseFilteredMaterials.map((m) => m.lessonNumber).filter((n): n is number => typeof n === 'number'))
  ).sort((a, b) => a - b);

  // Group materials by module
  const groupedByModule: { [moduleName: string]: Material[] } = {};
  filteredList.forEach((item) => {
    const mod = item.module || 'Materiais Gerais';
    if (!groupedByModule[mod]) {
      groupedByModule[mod] = [];
    }
    groupedByModule[mod].push(item);
  });

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'slides':
        return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'exercise':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'code':
        return <Code className="w-4 h-4 text-indigo-600" />;
      case 'link':
        return <Link2 className="w-4 h-4 text-teal-600" />;
    }
  };

  const getTypeLabel = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return 'Apostila / PDF';
      case 'slides':
        return 'Slides de Aula';
      case 'video':
        return 'Gravação / Vídeo';
      case 'exercise':
        return 'Lista de Exercícios';
      case 'code':
        return 'Código-Fonte';
      case 'link':
        return 'Link Web';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Repositório Didático IFS</span>
            <span aria-hidden="true">·</span>
            <span>{activeCourse ? activeCourse.name : 'Todos os Cursos'}</span>
            {activeDiscipline && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-700">{activeDiscipline.name}</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Materiais de Estudo por Curso & Disciplinas do PPC
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenStorageInfo && (
            <button
              onClick={onOpenStorageInfo}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-200 shadow-xs shrink-0"
              title="Informações sobre banco de dados, upload e limites de armazenamento"
            >
              <HardDrive className="w-4 h-4 text-[#1e7e34]" />
              <span>Armazenamento & Nuvem</span>
            </button>
          )}

          {userRole === 'professor' && (
            <button
              onClick={onOpenNewMaterialModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-bold rounded-lg transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Publicar Novo Material
            </button>
          )}
        </div>
      </div>

      {/* Course Separation Banner (Prompt requirement: "separe por cursos o material de aula") */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#1e7e34] shrink-0" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Separar Materiais por Curso:
              </span>
            </div>
            <span className="text-xs text-slate-500">
              <strong>{filteredList.length}</strong> materiais encontrados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => handleCourseChange('all')}
              className={`p-3 rounded-lg text-left transition border ${
                effectiveCourseFilter === 'all'
                  ? 'bg-[#e8f5e9] border-[#248c3d] ring-2 ring-[#248c3d]/20'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 mb-0.5">Todos os Cursos</div>
              <div className="text-[11px] text-slate-500">
                {materials.length} materiais em todo o IFS
              </div>
            </button>

            {courses.map((course) => {
              const courseMats = materials.filter((m) => {
                if (m.courseId) return m.courseId === course.id;
                const parentDisc = disciplines.find((d) => d.id === m.disciplineId);
                return parentDisc ? parentDisc.courseId === course.id : false;
              });
              const isSelected = effectiveCourseFilter === course.id;

              return (
                <button
                  key={course.id}
                  onClick={() => handleCourseChange(course.id)}
                  className={`p-3 rounded-lg text-left transition border ${
                    isSelected
                      ? 'bg-[#e8f5e9] border-[#248c3d] ring-2 ring-[#248c3d]/20'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1e7e34] text-white">
                      {courseMats.length} mats
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1">
                    {course.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Progress Overview */}
      {userRole === 'student' && courseFilteredMaterials.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-800">
              Progresso no Curso {activeCourse ? activeCourse.code : 'Geral'}:
            </span>
            <span className="font-mono font-bold text-[#1e7e34] tabular-nums">
              {progressPercent}% concluído
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#1e7e34] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Marque as apostilas, slides e exercícios como concluídos após seus estudos.
          </p>
        </div>
      )}

      {/* Search & Multi-level Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-3">
        {/* Period / Year Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs border-b border-slate-100 pb-2.5">
          <span className="font-bold text-slate-700 shrink-0 mr-1">{periodLabel}</span>
          {periodTabs.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePeriodChange(p.id as number | 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                periodFilter === p.id
                  ? 'bg-[#1e7e34] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Search */}
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Buscar por título, aula, assunto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Discipline Selector */}
          <div>
            <select
              value={effectiveDisciplineFilter}
              onChange={(e) => handleDisciplineChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            >
              <option value="all">
                {effectiveCourseFilter === 'all'
                  ? 'Todas as Matérias'
                  : `Todas as Matérias de ${activeCourse?.code}`}
              </option>
              {availableDisciplinesForCourse.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Module or Lesson Selector */}
          <div className="flex gap-2">
            {availableModules.length > 0 && (
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34] truncate"
              >
                <option value="all">Todos os Módulos</option>
                {availableModules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}

            {availableLessons.length > 0 && (
              <select
                value={lessonFilter}
                onChange={(e) => setLessonFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-36 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
              >
                <option value="all">Todas as Aulas</option>
                {availableLessons.map((num) => (
                  <option key={num} value={num}>
                    Aula {String(num).padStart(2, '0')}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Todos os Tipos' },
            { id: 'pdf', label: 'PDFs & Apostilas' },
            { id: 'slides', label: 'Slides' },
            { id: 'code', label: 'Códigos' },
            { id: 'exercise', label: 'Exercícios' },
            { id: 'video', label: 'Vídeos' },
            { id: 'link', label: 'Links' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 whitespace-nowrap ${
                typeFilter === tab.id
                  ? 'bg-[#e8f5e9] text-[#166534] font-bold border border-[#248c3d]'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List Grouped by Module */}
      {Object.keys(groupedByModule).length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1 font-display">
            Nenhum material encontrado para esta seleção
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? 'Nenhum material corresponde aos termos da busca.'
              : 'Experimente selecionar outro curso, matéria ou limpar os filtros de módulo/aula.'}
          </p>
          {userRole === 'professor' && (
            <button
              onClick={onOpenNewMaterialModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Publicar Material Neste Curso
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByModule).map(([moduleName, items]) => (
            <div key={moduleName} className="space-y-3">
              {/* Module Title Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#1e7e34]" />
                  {moduleName}
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {items.length} item(ns)
                </span>
              </div>

              {/* Grid of Materials in this module */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => {
                  const isCompleted = completedMaterialIds.includes(item.id);
                  const parentDiscipline = disciplines.find(
                    (d) => d.id === item.disciplineId
                  );
                  const parentCourse = courses.find((c) => {
                    if (item.courseId) return c.id === item.courseId;
                    return parentDiscipline ? c.id === parentDiscipline.courseId : false;
                  });

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl border p-4.5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                        isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Course & Discipline Header Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-500 mb-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {parentCourse && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#166534] border border-[#248c3d]/40">
                                {parentCourse.code}
                              </span>
                            )}
                            <span className="font-semibold text-slate-700 text-xs">
                              {parentDiscipline?.code || 'Geral'}
                            </span>
                            {item.lessonNumber && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                                Aula {String(item.lessonNumber).padStart(2, '0')}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">{item.dateAdded}</span>
                        </div>

                        {/* Type Icon & Label */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5">
                          {getTypeIcon(item.type)}
                          <span className="font-medium text-[11px] text-slate-700">
                            {getTypeLabel(item.type)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          {userRole === 'student' && (
                            <button
                              onClick={() => onToggleCompleted(item.id)}
                              title={isCompleted ? 'Marcar como não lido' : 'Marcar como lido'}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <CheckCircle className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                              <span className="text-[11px]">
                                {isCompleted ? 'Concluído' : 'Não lido'}
                              </span>
                            </button>
                          )}
                          <span className="text-slate-400 text-[11px] tabular-nums">
                            {item.fileSize || `${item.downloadCount} downloads`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenPreview(item)}
                            className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Visualizar</span>
                          </button>
                          <button
                            onClick={() => onDownloadMaterial(item)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[#166534] bg-[#e8f5e9] hover:bg-[#d5ecd9] border border-[#248c3d]/30 rounded-md font-semibold transition"
                          >
                            <Download className="w-3.5 h-3.5 text-[#1e7e34]" />
                            <span>Baixar</span>
                          </button>
                          {userRole === 'professor' && (
                            <div className="flex items-center gap-1">
                              {onEditMaterial && (
                                <button
                                  onClick={() => onEditMaterial(item)}
                                  title="Editar material e anexar arquivo"
                                  aria-label="Editar material"
                                  className="p-1 text-slate-400 hover:text-[#1e7e34] rounded-md hover:bg-[#e8f5e9] transition"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteMaterial(item.id)}
                                title="Remover material"
                                aria-label="Excluir material"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
