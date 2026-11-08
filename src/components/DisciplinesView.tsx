import React, { useState } from 'react';
import {
  Plus,
  Users,
  Clock,
  MapPin,
  BookOpen,
  ChevronRight,
  Calendar,
  Layers,
  GraduationCap,
  Library,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  UserCheck,
  Edit2,
  FileDown,
} from 'lucide-react';
import { Discipline, UserRole, Material, Course, Lesson, Professor } from '../types';
import { LessonsScheduleModal } from './LessonsScheduleModal';
import { AccessibleSyllabusModal } from './AccessibleSyllabusModal';
import {
  downloadDisciplinePDF,
  downloadCourseSyllabusPDF,
  downloadAllCoursesCatalogPDF,
} from '../utils/pdfGenerator';

interface DisciplinesViewProps {
  disciplines: Discipline[];
  materials: Material[];
  courses: Course[];
  lessons: Lesson[];
  professors?: Professor[];
  userRole: UserRole;
  selectedCourseId?: string;
  showToast?: (toast: any) => void;
  onOpenNewDisciplineModal: () => void;
  onEditDiscipline?: (discipline: Discipline) => void;
  onSelectCourseFilter?: (courseId: string) => void;
  onSelectDiscipline: (id: string) => void;
  onNavigateToMaterials: (disciplineId: string, lessonNumber?: number) => void;
  onToggleLessonStatus?: (lessonId: string, currentStatus: string) => void;
}

export const DisciplinesView: React.FC<DisciplinesViewProps> = ({
  disciplines,
  materials,
  courses,
  lessons,
  professors = [],
  userRole,
  selectedCourseId = 'all',
  showToast,
  onOpenNewDisciplineModal,
  onEditDiscipline,
  onSelectCourseFilter,
  onSelectDiscipline,
  onNavigateToMaterials,
  onToggleLessonStatus,
}) => {
  const [internalCourseFilter, setInternalCourseFilter] = useState<string>(selectedCourseId);
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<number | 'all'>('all');
  const [expandedSyllabusId, setExpandedSyllabusId] = useState<string | null>(null);
  const [expandedBiblioId, setExpandedBiblioId] = useState<string | null>(null);
  const [selectedDisciplineForSchedule, setSelectedDisciplineForSchedule] = useState<Discipline | null>(null);
  const [selectedDisciplineForSyllabusModal, setSelectedDisciplineForSyllabusModal] = useState<Discipline | null>(null);
  const [downloadingDisciplineId, setDownloadingDisciplineId] = useState<string | null>(null);
  const [isDownloadingCourseSyllabus, setIsDownloadingCourseSyllabus] = useState(false);

  const activeCourseFilter = internalCourseFilter;

  const handleCourseChange = (courseId: string) => {
    setInternalCourseFilter(courseId);
    setSelectedPeriodFilter('all');
    if (onSelectCourseFilter) {
      onSelectCourseFilter(courseId);
    }
  };

  const handleDownloadSingleDisciplinePDF = (discipline: Discipline) => {
    setDownloadingDisciplineId(discipline.id);
    const courseObj = courses.find((c) => c.id === discipline.courseId);
    showToast?.({
      message: `Gerando PDF oficial da ementa de ${discipline.code} - ${discipline.name}...`,
      type: 'info',
    });

    setTimeout(() => {
      try {
        downloadDisciplinePDF(discipline, courseObj);
        setDownloadingDisciplineId(null);
        showToast?.({
          message: `Ementa em PDF de ${discipline.code} baixada com sucesso!`,
          type: 'success',
        });
      } catch (err) {
        console.error('Erro ao gerar PDF da disciplina:', err);
        setDownloadingDisciplineId(null);
        showToast?.({
          message: 'Erro ao gerar o PDF da ementa.',
          type: 'error',
        });
      }
    }, 150);
  };

  const handleDownloadCurrentCourseSyllabus = () => {
    setIsDownloadingCourseSyllabus(true);
    const targetCourse = courses.find((c) => c.id === activeCourseFilter);

    if (targetCourse) {
      const courseDiscs = disciplines.filter((d) => d.courseId === targetCourse.id);
      showToast?.({
        message: `Gerando Ementário Completo em PDF do curso ${targetCourse.code}...`,
        type: 'info',
      });

      setTimeout(() => {
        try {
          downloadCourseSyllabusPDF(targetCourse, courseDiscs);
          setIsDownloadingCourseSyllabus(false);
          showToast?.({
            message: `Ementário do curso ${targetCourse.code} baixado com sucesso!`,
            type: 'success',
          });
        } catch (err) {
          console.error('Erro ao gerar ementário do curso:', err);
          setIsDownloadingCourseSyllabus(false);
          showToast?.({
            message: 'Erro ao gerar o ementário em PDF.',
            type: 'error',
          });
        }
      }, 150);
    } else {
      // Baixar catálogo de todos os cursos
      showToast?.({
        message: 'Gerando Catálogo Geral de todos os Cursos e Ementas em PDF...',
        type: 'info',
      });

      setTimeout(() => {
        try {
          downloadAllCoursesCatalogPDF(courses, disciplines);
          setIsDownloadingCourseSyllabus(false);
          showToast?.({
            message: 'Catálogo Geral de Ementas baixado com sucesso!',
            type: 'success',
          });
        } catch (err) {
          console.error('Erro ao gerar catálogo geral:', err);
          setIsDownloadingCourseSyllabus(false);
          showToast?.({
            message: 'Erro ao gerar catálogo geral em PDF.',
            type: 'error',
          });
        }
      }, 150);
    }
  };

  // Filter disciplines by course and period/year
  const filteredDisciplines = disciplines
    .filter((d) => {
      if (activeCourseFilter !== 'all' && d.courseId !== activeCourseFilter) {
        return false;
      }
      if (selectedPeriodFilter !== 'all' && d.periodNumber !== selectedPeriodFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort first by course
      if (a.courseId !== b.courseId) {
        return a.courseId.localeCompare(b.courseId);
      }
      // Then by period/ano
      if ((a.periodNumber || 0) !== (b.periodNumber || 0)) {
        return (a.periodNumber || 0) - (b.periodNumber || 0);
      }
      return a.code.localeCompare(b.code);
    });

  const activeCourseObj = courses.find((c) => c.id === activeCourseFilter);
  const isTdsActive = activeCourseFilter === 'course-tds';
  const isInfActive = activeCourseFilter === 'course-inf';

  // Period / Year statistics based on active course
  const tdsPeriods = [
    { num: 1, name: '1º Ano', count: disciplines.filter((d) => d.courseId === 'course-tds' && d.periodNumber === 1).length, workload: '400 h/a (333,4h)', desc: 'Prog. 1, Sites 1 e Int. Informática' },
    { num: 2, name: '2º Ano', count: disciplines.filter((d) => d.courseId === 'course-tds' && d.periodNumber === 2).length, workload: '440 h/a (366,7h)', desc: 'Prog. 2, Sites 2, BD & Eng. Soft., Proj. Integ. 1' },
    { num: 3, name: '3º Ano', count: disciplines.filter((d) => d.courseId === 'course-tds' && d.periodNumber === 3).length, workload: '400 h/a (333,3h)', desc: 'Redes & Seg., Tópicos Espec., Proj. Integ. 2' },
  ];

  const infPeriods = [
    { num: 1, name: '1º Período', count: disciplines.filter((d) => d.courseId === 'course-inf' && d.periodNumber === 1).length, workload: '380 h/a (317h)', desc: 'Int. Computação, SO, Lógica e Fund. Redes' },
    { num: 2, name: '2º Período', count: disciplines.filter((d) => d.courseId === 'course-inf' && d.periodNumber === 2).length, workload: '342 h/a (285h)', desc: 'Prog. 1, Web 1, Banco de Dados e Redes 2' },
    { num: 3, name: '3º Período', count: disciplines.filter((d) => d.courseId === 'course-inf' && d.periodNumber === 3).length, workload: '342 h/a (285h)', desc: 'Prog. 2, Web 2, BD Avançado e Seg. Informação' },
    { num: 4, name: '4º Período', count: disciplines.filter((d) => d.courseId === 'course-inf' && d.periodNumber === 4).length, workload: '380 h/a (317h)', desc: 'Prog. Web/Mobile, Tópicos Especiais e TCC' },
  ];

  const genericPeriods = [
    { num: 1, name: '1º Ano / 1º Período', count: disciplines.filter((d) => d.periodNumber === 1).length },
    { num: 2, name: '2º Ano / 2º Período', count: disciplines.filter((d) => d.periodNumber === 2).length },
    { num: 3, name: '3º Ano / 3º Período', count: disciplines.filter((d) => d.periodNumber === 3).length },
    { num: 4, name: '4º Período (Subsequente)', count: disciplines.filter((d) => d.periodNumber === 4).length },
  ];

  const selectedDisciplineCourse = selectedDisciplineForSchedule
    ? courses.find((c) => c.id === selectedDisciplineForSchedule.courseId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner - Instituto Federal de Sergipe (Inspirado no card oficial) */}
      <div className="bg-gradient-to-br from-[#145a27] via-[#1e7e34] to-[#145a27] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <div className="relative z-10 max-w-4xl space-y-3">
          {/* Top Badge (Inspired by EDITAL ABERTO in reference card) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="if-badge-red text-[11px] shadow-sm">
              PPC OFICIAL HOMOLOGADO
            </span>
            <span className="text-xs font-semibold text-emerald-100 bg-white/10 px-2.5 py-0.5 rounded-full">
              Instituto Federal de Sergipe · Campus Tobias Barreto
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white text-balance">
            {isTdsActive ? (
              <>
                Técnico Integrado em <span className="text-emerald-200">Desenvolvimento de Sistemas</span>
              </>
            ) : isInfActive ? (
              <>
                Técnico em Informática <span className="text-emerald-200">(Subsequente)</span> — Matriz dos 4 Períodos
              </>
            ) : (
              <>
                Matrizes Curriculares e Planos Didáticos da <span className="text-emerald-200">COINF</span>
              </>
            )}
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {isTdsActive
              ? 'Matriz curricular do Núcleo Tecnológico e Práticas Profissionais Integradoras (Resolução CS/IFS nº 216/2023). 10 disciplinas oficiais (1.000h relógio / 1.200 h/a) estruturadas nos 3 anos letivos da formação técnica.'
              : isInfActive
              ? 'Estrutura curricular do Curso Técnico de Nível Médio em Informática Subsequente do IFS Campus Tobias Barreto (Resolução nº 09/2017/CS/IFS). 15 disciplinas distribuídas nos 4 períodos letivos (1.203h relógio / 1.444 h/a).'
              : 'Consulte os componentes curriculares oficiais dos cursos do IFS Campus Tobias Barreto: Técnico Integrado em Desenvolvimento de Sistemas (TDS) e Técnico em Informática (Subsequente), com ementário normatizado, cronogramas de aula e acervo didático.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {userRole === 'professor' && (
              <button
                onClick={onOpenNewDisciplineModal}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-emerald-50 text-[#1e7e34] font-bold text-xs rounded-lg transition shadow-md"
              >
                <Plus className="w-4 h-4 text-[#ce2029]" />
                <span>Cadastrar Nova Matéria</span>
              </button>
            )}

            <div className="text-xs text-emerald-100 flex flex-wrap items-center gap-3 py-1 font-medium">
              <span>
                <strong className="text-white font-bold">{filteredDisciplines.length}</strong> disciplinas ativas
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-white font-bold">2</strong> cursos oficiais (TDS & Subsequente)
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-white font-bold">{materials.length}</strong> materiais disponíveis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Tone Information Cards directly inspired by card1_d97a7123.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: IF Red Block */}
        <div className="bg-[#ce2029] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 bg-white/20 px-2 py-0.5 rounded-md inline-block mb-2">
              PPC Integrado · 3 Anos Letivos
            </span>
            <div className="text-xl font-black font-display tracking-tight mb-1">
              TDS Integrado
            </div>
            <p className="text-xs text-red-100 font-medium leading-relaxed">
              Resolução CS/IFS nº 216/2023 · 10 matérias do Núcleo Tecnológico e Práticas Integradoras.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/20 text-[11px] font-bold text-white flex items-center justify-between">
            <span>Ensino Médio + Técnico</span>
            <span className="bg-white text-[#ce2029] px-2.5 py-0.5 rounded-full text-[10px] font-black">
              3.333,3h
            </span>
          </div>
        </div>

        {/* Card 2: IF Green Block */}
        <div className="bg-[#1e7e34] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 bg-white/20 px-2 py-0.5 rounded-md inline-block mb-2">
              PPC Subsequente · 4 Períodos
            </span>
            <div className="text-xl font-black font-display tracking-tight mb-1">
              Técnico em Informática
            </div>
            <p className="text-xs text-emerald-100 font-medium leading-relaxed">
              Resolução nº 09/2017/CS/IFS · 15 matérias distribuídas nos 4 períodos letivos oficiais.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-white/20 text-[11px] font-bold text-white flex items-center justify-between">
            <span>Pós-Médio (Noturno)</span>
            <span className="bg-white text-[#1e7e34] px-2.5 py-0.5 rounded-full text-[10px] font-black">
              1.203h
            </span>
          </div>
        </div>

        {/* Card 3: White Card with Organic IF Tags (Style from reference card) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e7e34] bg-[#e8f5e9] px-2 py-0.5 rounded-md">
                Competências COINF
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Campus Tobias Barreto</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Eixos Tecnológicos Normatizados:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="if-tag text-[11px]">Programação Web</span>
              <span className="if-tag text-[11px]">Banco de Dados</span>
              <span className="if-tag text-[11px]">Redes & Segurança</span>
              <span className="if-tag text-[11px]">Projeto Integrador</span>
              <span className="if-tag text-[11px]">Eng. Software</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
            <span>Coordenação</span>
            <span className="text-[#1e7e34] font-bold">Prof. Eber Santana</span>
          </div>
        </div>
      </div>

      {/* Course Filter Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filtrar Disciplinas por Curso:
            </span>
          </div>
          <span className="text-xs text-slate-500">
            IFS Campus Tobias Barreto
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleCourseChange('all')}
            className={`p-3.5 rounded-xl text-left transition border ${
              activeCourseFilter === 'all'
                ? 'bg-[#e8f5e9] border-[#248c3d] ring-2 ring-[#248c3d]/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">Todos os Cursos</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {disciplines.length} matérias
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Visualizar disciplinas de TDS Integrado e Informática Subsequente
            </p>
          </button>

          {courses.map((c) => {
            const courseDiscs = disciplines.filter((d) => d.courseId === c.id);
            const isSelected = activeCourseFilter === c.id;

            return (
              <button
                key={c.id}
                onClick={() => handleCourseChange(c.id)}
                className={`p-3.5 rounded-xl text-left transition border ${
                  isSelected
                    ? 'bg-[#e8f5e9] border-[#248c3d] ring-2 ring-[#248c3d]/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-[#1e7e34] bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {c.degree}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1e7e34] text-white shrink-0">
                    {courseDiscs.length} matérias
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                  {c.name}
                </p>
                <div className="text-[10px] text-slate-500 mt-1">
                  {c.resolution || `${c.workloadTotalHours || 0}h`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Period / Year Selection Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1e7e34] shrink-0" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isTdsActive
                ? 'Navegar pelos Anos Letivos do PPC (TDS Integrado):'
                : isInfActive
                ? 'Navegar pelos Períodos Letivos do PPC (Subsequente):'
                : 'Navegar por Ano / Período:'}
            </span>
          </div>

          <span className="text-xs text-slate-500">
            {isTdsActive
              ? 'Núcleo Tecnológico: 10 disciplinas (1.000h relógio / 1.200 h/a)'
              : isInfActive
              ? 'Matriz Subsequente: 15 disciplinas (1.203h relógio / 1.444 h/a)'
              : 'Selecione um ano/período ou exiba todas'}
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedPeriodFilter('all')}
            className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left sm:text-center ${
              selectedPeriodFilter === 'all'
                ? 'bg-[#1e7e34] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <div className="font-bold">Todos os Anos / Períodos</div>
            <div className={`text-[11px] ${selectedPeriodFilter === 'all' ? 'text-emerald-100' : 'text-slate-500'}`}>
              {filteredDisciplines.length} disciplinas
            </div>
          </button>

          {isTdsActive &&
            tdsPeriods.map((p) => (
              <button
                key={p.num}
                onClick={() => setSelectedPeriodFilter(p.num)}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left sm:text-center ${
                  selectedPeriodFilter === p.num
                    ? 'bg-[#1e7e34] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="font-bold">{p.name} (TDS)</div>
                <div className={`text-[11px] ${selectedPeriodFilter === p.num ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {p.count} mat. · {p.workload}
                </div>
              </button>
            ))}

          {isInfActive &&
            infPeriods.map((p) => (
              <button
                key={p.num}
                onClick={() => setSelectedPeriodFilter(p.num)}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left sm:text-center ${
                  selectedPeriodFilter === p.num
                    ? 'bg-[#1e7e34] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="font-bold">{p.name}</div>
                <div className={`text-[11px] ${selectedPeriodFilter === p.num ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {p.count} mat. · {p.workload}
                </div>
              </button>
            ))}

          {!isTdsActive &&
            !isInfActive &&
            genericPeriods.map((p) => (
              <button
                key={p.num}
                onClick={() => setSelectedPeriodFilter(p.num)}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition text-left sm:text-center ${
                  selectedPeriodFilter === p.num
                    ? 'bg-[#1e7e34] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="font-bold">{p.name}</div>
                <div className={`text-[11px] ${selectedPeriodFilter === p.num ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {p.count} matérias
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Disciplines Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {activeCourseFilter === 'all'
                ? `Todas as Disciplinas Oficiais (${filteredDisciplines.length})`
                : `${activeCourseObj?.name} (${filteredDisciplines.length} disciplinas)`}
            </h2>
            <p className="text-xs text-slate-500">
              Ementas oficiais normatizadas, bibliografia básica e complementar, plano de aulas e acervo de material didático.
            </p>
          </div>

          {/* Botão Acessível Baixar Ementário Completo em PDF */}
          <button
            onClick={handleDownloadCurrentCourseSyllabus}
            disabled={isDownloadingCourseSyllabus}
            aria-label={`Baixar ementário completo e matriz curricular em PDF ${activeCourseObj ? `do curso ${activeCourseObj.name}` : 'de todos os cursos'}`}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs shrink-0 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 text-[#1e7e34]" />
            <span>
              {isDownloadingCourseSyllabus
                ? 'Gerando Ementário...'
                : activeCourseObj
                ? `Baixar Ementário ${activeCourseObj.code} (PDF)`
                : 'Baixar Ementário Completo (PDF)'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDisciplines.map((discipline) => {
            const disciplineMaterials = materials.filter((m) => m.disciplineId === discipline.id);
            const disciplineLessons = lessons.filter((l) => l.disciplineId === discipline.id);
            const isSyllabusExpanded = expandedSyllabusId === discipline.id;
            const isBiblioExpanded = expandedBiblioId === discipline.id;
            const courseObj = courses.find((c) => c.id === discipline.courseId);
            const isTdsDiscipline = discipline.courseId === 'course-tds';
            const isIntegrador = discipline.code.includes('TDS204') || discipline.code.includes('TDS303');

            return (
              <div
                key={discipline.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Discipline Header Bar */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-xs font-mono"
                        style={{ backgroundColor: discipline.color }}
                      >
                        {discipline.code}
                      </span>
                      {isTdsDiscipline && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isIntegrador ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {isIntegrador ? 'Prática Profissional' : 'Núcleo Tecnológico'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {discipline.semester}
                      </span>
                      {userRole === 'professor' && onEditDiscipline && (
                        <button
                          onClick={() => onEditDiscipline(discipline)}
                          title="Editar dados da disciplina"
                          aria-label="Editar disciplina"
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display mb-1.5 leading-snug">
                    {discipline.name}
                  </h3>

                  <div className="text-[11px] text-slate-500 font-medium mb-2">
                    {courseObj?.name}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {discipline.description}
                  </p>

                  {/* Workload and Prerequisites Box */}
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs space-y-1 mb-3">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">Carga Horária:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {discipline.workloadLessons || 0} h/a ({discipline.workloadHours}h relógio)
                      </span>
                    </div>
                    {discipline.theoryHours !== undefined && discipline.practiceHours !== undefined && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Teórica / Prática:</span>
                        <span>{discipline.theoryHours}h teórica · {discipline.practiceHours}h prática</span>
                      </div>
                    )}
                    {discipline.weeklyHours && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Aulas Semanais:</span>
                        <span>{discipline.weeklyHours} aulas/semana</span>
                      </div>
                    )}
                    {discipline.prerequisites && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                        <span className="font-semibold text-slate-600">Pré-requisito:</span>
                        <span className={`font-medium ${discipline.prerequisites.includes('Sem') ? 'text-slate-500' : 'text-amber-700 font-semibold'}`}>
                          {discipline.prerequisites}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata: Schedule & Room */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{discipline.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{discipline.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{discipline.studentsCount} alunos matriculados</span>
                    </div>
                    {professors.find((p) => p.assignedDisciplineIds.includes(discipline.id)) && (
                      <div className="flex items-center gap-2 text-indigo-700 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">
                          Docente: {professors.find((p) => p.assignedDisciplineIds.includes(discipline.id))?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modules list, Syllabus & Bibliography */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600 mb-2">
                    <span className="font-semibold text-slate-700">Módulos ({discipline.modules.length})</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedBiblioId(isBiblioExpanded ? null : discipline.id)}
                        className="text-slate-600 hover:text-indigo-600 text-[11px] underline"
                      >
                        {isBiblioExpanded ? 'Ocultar Bibliografia' : 'Bibliografia'}
                      </button>
                      <button
                        onClick={() => setExpandedSyllabusId(isSyllabusExpanded ? null : discipline.id)}
                        className="text-indigo-600 hover:underline text-[11px] font-semibold"
                      >
                        {isSyllabusExpanded ? 'Ocultar Ementa' : 'Ver Ementa'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Syllabus */}
                  {isSyllabusExpanded && (
                    <div className="p-3 bg-white rounded-lg border border-indigo-200 text-slate-700 text-xs leading-relaxed mb-2 shadow-2xs">
                      <strong className="block text-indigo-950 mb-1 font-bold">
                        Ementa Oficial do PPC ({isTdsDiscipline ? 'Resolução CS/IFS nº 216/2023' : 'Resolução nº 09/2017/CS/IFS'}):
                      </strong>
                      <p className="text-slate-700 text-[11px] leading-relaxed mb-2">{discipline.syllabus}</p>
                      {discipline.objectives && (
                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <strong className="text-slate-800">Objetivo Geral:</strong> {discipline.objectives}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expanded Bibliography */}
                  {isBiblioExpanded && discipline.bibliography && (
                    <div className="p-3 bg-white rounded-lg border border-amber-200 text-slate-700 text-xs leading-relaxed mb-2 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                        <Library className="w-3.5 h-3.5 text-amber-700" />
                        <span>Bibliografia do PPC:</span>
                      </div>
                      <div className="mb-2">
                        <strong className="text-[11px] text-slate-900 block font-semibold">Básica:</strong>
                        <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5">
                          {discipline.bibliography.basic.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-[11px] text-slate-900 block font-semibold">Complementar:</strong>
                        <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5">
                          {(discipline.bibliography.complementar || discipline.bibliography.complementary || []).map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {!isSyllabusExpanded && !isBiblioExpanded && (
                    <ul className="space-y-1 text-slate-600 mb-2 text-[11px]">
                      {discipline.modules.slice(0, 3).map((m, idx) => (
                        <li key={idx} className="truncate">
                          · {m}
                        </li>
                      ))}
                      {discipline.modules.length > 3 && (
                        <li className="text-[10px] text-slate-400">
                          + {discipline.modules.length - 3} outros tópicos
                        </li>
                      )}
                    </ul>
                  )}

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1.5">
                    {/* Botão Acessível Baixar Ementa Oficial em PDF */}
                    <button
                      onClick={() => handleDownloadSingleDisciplinePDF(discipline)}
                      disabled={downloadingDisciplineId === discipline.id}
                      aria-label={`Baixar ementa oficial em PDF da disciplina ${discipline.name} (${discipline.code})`}
                      className="w-full flex items-center justify-between px-3 py-2 bg-[#e8f5e9] hover:bg-[#d5ecd9] text-[#166534] border border-[#248c3d]/40 rounded-lg text-xs font-bold transition shadow-2xs disabled:opacity-50"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileDown className="w-3.5 h-3.5 text-[#1e7e34]" />
                        <span>
                          {downloadingDisciplineId === discipline.id
                            ? 'Gerando Ementa em PDF...'
                            : 'Baixar Ementa Oficial (PDF)'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-[#1e7e34] text-white px-1.5 py-0.5 rounded">
                        PDF
                      </span>
                    </button>

                    {/* Botão Ver Ementa Acessível & Áudio */}
                    <button
                      onClick={() => setSelectedDisciplineForSyllabusModal(discipline)}
                      aria-label={`Visualizar ementa completa com leitura por voz da disciplina ${discipline.name}`}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition"
                    >
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Ementa Acessível & Áudio</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Botão de Material de Apoio ao Aluno */}
                    <button
                      onClick={() => onNavigateToMaterials(discipline.id)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition"
                    >
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#1e7e34]" />
                        <span>Material de Apoio ({disciplineMaterials.length})</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Botão de Cronograma de Aulas */}
                    <button
                      onClick={() => setSelectedDisciplineForSchedule(discipline)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition"
                    >
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Cronograma de Aulas ({disciplineLessons.length || discipline.lessonsCount || 0})</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Acessível de Ementa Oficial */}
      {selectedDisciplineForSyllabusModal && (
        <AccessibleSyllabusModal
          discipline={selectedDisciplineForSyllabusModal}
          course={courses.find((c) => c.id === selectedDisciplineForSyllabusModal.courseId)}
          onClose={() => setSelectedDisciplineForSyllabusModal(null)}
          onShowToast={(msg, type) => showToast?.({ message: msg, type })}
        />
      )}

      {/* Modal de Cronograma Detalhado */}
      {selectedDisciplineForSchedule && (
        <LessonsScheduleModal
          discipline={selectedDisciplineForSchedule}
          course={selectedDisciplineCourse}
          lessons={lessons}
          userRole={userRole}
          onClose={() => setSelectedDisciplineForSchedule(null)}
          onNavigateToMaterials={(discId, lessonNum) => {
            setSelectedDisciplineForSchedule(null);
            onNavigateToMaterials(discId, lessonNum);
          }}
          onToggleLessonStatus={onToggleLessonStatus}
        />
      )}
    </div>
  );
};
