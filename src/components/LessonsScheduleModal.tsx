import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Hourglass,
  CircleDashed,
  Award,
  Layers,
  FileText,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { Discipline, Lesson, Course, UserRole } from '../types';
import { getDisciplineLessonsWithFallback } from '../utils/academic-logic';

interface LessonsScheduleModalProps {
  discipline: Discipline;
  course?: Course;
  lessons: Lesson[];
  userRole: UserRole;
  onClose: () => void;
  onNavigateToMaterials: (disciplineId: string, lessonNumber?: number) => void;
  onToggleLessonStatus?: (lessonId: string, currentStatus: string) => void;
}

export const LessonsScheduleModal: React.FC<LessonsScheduleModalProps> = ({
  discipline,
  course,
  lessons,
  userRole,
  onClose,
  onNavigateToMaterials,
  onToggleLessonStatus,
}) => {
  const [selectedBimestre, setSelectedBimestre] = useState<number | 'all'>('all');
  const [filterOnlyEvaluations, setFilterOnlyEvaluations] = useState(false);

  // Filter lessons for this discipline or generate official PPC timeline so it is never 0
  const disciplineLessons = getDisciplineLessonsWithFallback(
    lessons,
    discipline,
    course?.id
  );

  const filteredLessons = disciplineLessons.filter((l) => {
    if (selectedBimestre !== 'all' && l.bimestre !== selectedBimestre) {
      return false;
    }
    if (filterOnlyEvaluations && !l.isEvaluation) {
      return false;
    }
    return true;
  });

  const bimestresPresent = Array.from(new Set(disciplineLessons.map((l) => l.bimestre))).sort();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'concluida':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Concluída
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 animate-pulse">
            <Hourglass className="w-3 h-3 text-amber-600" />
            Em Andamento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
            <CircleDashed className="w-3 h-3 text-slate-400" />
            Prevista
          </span>
        );
    }
  };

  const getEvaluationBadge = (lesson: Lesson) => {
    if (!lesson.isEvaluation) return null;
    switch (lesson.evaluationType) {
      case 'prova':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#fef2f2] text-[#ce2029] border border-[#fca5a5]">
            <Award className="w-3 h-3 text-[#ce2029]" />
            Prova Bimestral
          </span>
        );
      case 'trabalho':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#e8f5e9] text-[#166534] border border-[#248c3d]/40">
            <FileText className="w-3 h-3 text-[#1e7e34]" />
            Trabalho Prático
          </span>
        );
      case 'projeto':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#fef2f2] text-[#ce2029] border border-[#fca5a5]">
            <Layers className="w-3 h-3 text-[#ce2029]" />
            Projeto Integrador
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Avaliação Oficial
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-schedule-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Institucional IF */}
        <div className="px-6 py-5 bg-[#1e7e34] text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-100 font-medium mb-1">
              <span className="px-2 py-0.5 bg-[#145a27] rounded text-[11px] font-semibold text-white">
                {discipline.code}
              </span>
              <span>·</span>
              <span>{course ? course.name : 'Curso Técnico IFS'}</span>
              <span>·</span>
              <span>{discipline.workloadHours} horas ({disciplineLessons.length} Aulas Oficiais COINF)</span>
            </div>
            <h2 id="modal-schedule-title" className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Cronograma de Aulas & Ementa do PPC
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              {discipline.name} · Planejamento aula a aula de acordo com a ementa do Projeto Pedagógico de Curso
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#166534] transition"
            aria-label="Fechar cronograma"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faixa Vermelha Oficial IF */}
        <div className="h-1 bg-[#ce2029]" />

        {/* Ementa Accordion preview */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[#1e7e34] shrink-0" />
            <span className="font-semibold text-slate-900">Ementa Oficial do PPC:</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px] pl-6">
            {discipline.syllabus}
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs text-slate-500 font-medium mr-1">Filtrar:</span>
            <button
              onClick={() => {
                setSelectedBimestre('all');
                setFilterOnlyEvaluations(false);
              }}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition ${
                selectedBimestre === 'all' && !filterOnlyEvaluations
                  ? 'bg-[#1e7e34] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas as Aulas ({disciplineLessons.length})
            </button>
            {bimestresPresent.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setSelectedBimestre(b);
                  setFilterOnlyEvaluations(false);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition ${
                  selectedBimestre === b && !filterOnlyEvaluations
                    ? 'bg-[#1e7e34] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}º Bimestre ({disciplineLessons.filter((l) => l.bimestre === b).length})
              </button>
            ))}
            <button
              onClick={() => setFilterOnlyEvaluations(!filterOnlyEvaluations)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition flex items-center gap-1 ${
                filterOnlyEvaluations
                  ? 'bg-[#ce2029] text-white shadow-xs'
                  : 'bg-[#fef2f2] text-[#ce2029] hover:bg-rose-100 border border-[#fca5a5]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Provas & Avaliações ({disciplineLessons.filter((l) => l.isEvaluation).length})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Exibindo <strong>{filteredLessons.length}</strong> de <strong>{disciplineLessons.length}</strong> aulas
          </div>
        </div>

        {/* Lessons List Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhuma aula encontrada para o filtro selecionado.</p>
              <p className="text-xs text-slate-500 mt-1">Experimente limpar os filtros acima para visualizar o cronograma completo.</p>
            </div>
          ) : (
            filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`bg-white rounded-xl border p-4.5 transition hover:shadow-md ${
                  lesson.isEvaluation
                    ? 'border-[#fca5a5] shadow-xs'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      Aula {String(lesson.lessonNumber).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-[#166534] bg-[#e8f5e9] border border-[#248c3d]/30 px-2 py-0.5 rounded">
                      {lesson.bimestre}º Bimestre
                    </span>
                    {getEvaluationBadge(lesson)}
                    {getStatusBadge(lesson.status)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-[#1e7e34]" />
                      {lesson.durationHours} horas/aula
                    </span>
                    {userRole === 'professor' && onToggleLessonStatus && (
                      <button
                        onClick={() =>
                          onToggleLessonStatus(
                            lesson.id,
                            lesson.status === 'concluida'
                              ? 'prevista'
                              : lesson.status === 'em_andamento'
                              ? 'concluida'
                              : 'em_andamento'
                          )
                        }
                        className="text-[11px] font-semibold text-[#1e7e34] hover:text-[#166534] underline"
                      >
                        Alterar status
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display mb-1.5">
                  {lesson.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {lesson.summary}
                </p>

                {lesson.contentDetails && lesson.contentDetails.length > 0 && (
                  <div className="mb-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Tópicos Abordados:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                      {lesson.contentDetails.map((topic, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1e7e34] shrink-0" />
                          <span className="truncate">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {lesson.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToMaterials(discipline.id, lesson.lessonNumber);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e7e34] hover:text-[#166534] hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Materiais desta Aula</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-medium">
            <strong className="text-[#1e7e34]">
              {disciplineLessons.filter((l) => l.status === 'concluida').length}
            </strong>{' '}
            aulas concluídas de <strong>{disciplineLessons.length}</strong> planejadas
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Fechar Cronograma
          </button>
        </div>
      </div>
    </div>
  );
};
