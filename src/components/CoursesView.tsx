import React, { useState } from 'react';
import { Plus, GraduationCap, Users, Clock, Building, Trash2, X, BookOpen, Layers, FileDown, CheckCircle2 } from 'lucide-react';
import { Course, Discipline, Turma, UserRole } from '../types';
import { downloadCourseSyllabusPDF, downloadAllCoursesCatalogPDF } from '../utils/pdfGenerator';

interface CoursesViewProps {
  courses: Course[];
  disciplines: Discipline[];
  turmas: Turma[];
  userRole: UserRole;
  showToast?: (toast: any) => void;
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  disciplines,
  turmas,
  userRole,
  showToast,
  onAddCourse,
  onDeleteCourse,
}) => {
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);
  const [isDownloadingCatalog, setIsDownloadingCatalog] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState<Course['degree']>('Técnico Integrado');
  const [duration, setDuration] = useState('6');
  const [coordinator, setCoordinator] = useState('Prof. Eber Santana');
  const [department, setDepartment] = useState('Coordenação de Informática (COINF)');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      degree,
      durationSemesters: parseInt(duration) || 8,
      coordinator: coordinator.trim(),
      department: department.trim(),
      description: description.trim(),
      activeStudentsCount: 0,
    };

    onAddCourse(newCourse);
    setIsAddModalOpen(false);
    setCode('');
    setName('');
    setDescription('');
  };

  const handleDownloadCoursePDF = (course: Course, courseDisciplines: Discipline[]) => {
    setDownloadingCourseId(course.id);
    showToast?.({
      message: `Gerando PDF oficial do PPC e ementário de ${course.name}...`,
      type: 'info',
    });

    setTimeout(() => {
      try {
        downloadCourseSyllabusPDF(course, courseDisciplines);
        setDownloadingCourseId(null);
        showToast?.({
          message: `Ementário completo em PDF de ${course.code} baixado com sucesso!`,
          type: 'success',
        });
      } catch (err) {
        console.error('Erro ao gerar PDF do curso:', err);
        setDownloadingCourseId(null);
        showToast?.({
          message: 'Erro ao gerar documento PDF do curso.',
          type: 'error',
        });
      }
    }, 150);
  };

  const handleDownloadCatalog = () => {
    setIsDownloadingCatalog(true);
    showToast?.({
      message: 'Gerando Catálogo Geral de Cursos e Ementários em PDF...',
      type: 'info',
    });

    setTimeout(() => {
      try {
        downloadAllCoursesCatalogPDF(courses, disciplines);
        setIsDownloadingCatalog(false);
        showToast?.({
          message: 'Catálogo Geral em PDF baixado com sucesso!',
          type: 'success',
        });
      } catch (err) {
        console.error('Erro ao gerar catálogo em PDF:', err);
        setIsDownloadingCatalog(false);
        showToast?.({
          message: 'Erro ao gerar catálogo em PDF.',
          type: 'error',
        });
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Estrutura Acadêmica</span>
            <span aria-hidden="true">·</span>
            <span>Cursos e Graduações</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Cadastro e Gestão de Cursos
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Botão Baixar Catálogo Geral em PDF */}
          <button
            onClick={handleDownloadCatalog}
            disabled={isDownloadingCatalog}
            aria-label="Baixar Catálogo Geral de todos os Cursos e Ementários em PDF do IFS Campus Tobias Barreto"
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold rounded-lg transition shadow-2xs disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 text-[#1e7e34]" />
            <span>{isDownloadingCatalog ? 'Gerando Catálogo...' : 'Baixar Catálogo Geral (PDF)'}</span>
          </button>

          {userRole === 'professor' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-bold rounded-lg transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Novo Curso
            </button>
          )}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const courseDisciplines = disciplines.filter((d) => d.courseId === course.id);
          const courseTurmas = turmas.filter((t) => t.courseId === course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-mono font-bold text-[#1e7e34] bg-[#e8f5e9] border border-[#248c3d]/30 px-2 py-0.5 rounded text-[11px]">
                    {course.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{course.degree}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display mb-1.5 leading-snug">
                  {course.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  {course.campus && (
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-800">{course.campus}</span>
                    </div>
                  )}
                  {course.resolution && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-[11px] text-slate-600 font-mono">{course.resolution}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Duração: {course.durationSemesters} semestres ({course.durationSemesters / 2} anos)
                      {course.workloadTotalHours ? ` · ${course.workloadTotalHours}h` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Coordenação: {course.coordinator}</span>
                  </div>
                </div>

                {/* Turmas abertas deste curso */}
                <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Turmas Ofertadas ({courseTurmas.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {courseTurmas.length > 0 ? (
                      courseTurmas.map((t) => (
                        <span
                          key={t.id}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold"
                          title={`${t.name} - ${t.schedule}`}
                        >
                          {t.code} ({t.shift})
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Nenhuma turma aberta</span>
                    )}
                  </div>
                </div>

                {/* Botão Acessível de Download do Ementário do Curso */}
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleDownloadCoursePDF(course, courseDisciplines)}
                    disabled={downloadingCourseId === course.id}
                    aria-label={`Baixar ementário completo e matriz curricular em PDF do curso ${course.name} (${course.code})`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#e8f5e9] hover:bg-[#d5ecd9] text-[#166534] border border-[#248c3d]/40 rounded-lg text-xs font-bold transition shadow-2xs disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#1e7e34]" />
                    <span>
                      {downloadingCourseId === course.id
                        ? 'Gerando Ementário...'
                        : 'Baixar PPC & Ementário (PDF)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span><strong>{courseDisciplines.length}</strong> matérias</span>
                  <span aria-hidden="true">·</span>
                  <span><strong>{courseTurmas.length}</strong> turmas</span>
                </div>

                {userRole === 'professor' && courses.length > 1 && (
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    aria-label="Excluir curso"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Course */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Cadastrar Novo Curso Acadêmico
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Insira as diretrizes curriculares e informações de coordenação.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código do Curso
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ENG-ELET"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grau Acadêmico
                  </label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Técnico Integrado">Técnico Integrado (Médio Integrado)</option>
                    <option value="Técnico Subsequente">Técnico Subsequente (Pós-Médio)</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Bacharelado">Bacharelado</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Pós-Graduação">Pós-Graduação</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Curso
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Engenharia Elétrica com Ênfase em Automação"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duração em Semestres
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="14"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coordenador(a)
                  </label>
                  <input
                    type="text"
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departamento Responsável
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição do Curso
                </label>
                <textarea
                  rows={3}
                  placeholder="Objetivos do curso e perfil do egresso..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e7e34] text-white rounded-lg text-xs font-bold hover:bg-[#166534] transition shadow-sm"
                >
                  Salvar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
