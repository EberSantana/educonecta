import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  FileSpreadsheet,
  Search,
  BookOpen,
  Layers,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Award,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { Professor, Discipline, Turma, Course, UserRole } from '../types';

interface ProfessorsViewProps {
  professors: Professor[];
  disciplines: Discipline[];
  turmas: Turma[];
  courses: Course[];
  userRole: UserRole;
  onOpenAddModal: () => void;
  onEditProfessor: (professor: Professor) => void;
  onDeleteProfessor: (professorId: string) => void;
  onOpenGoogleSheetsModal: () => void;
  onNavigateToDiscipline?: (disciplineId: string) => void;
}

export const ProfessorsView: React.FC<ProfessorsViewProps> = ({
  professors,
  disciplines,
  turmas,
  courses,
  userRole,
  onOpenAddModal,
  onEditProfessor,
  onDeleteProfessor,
  onOpenGoogleSheetsModal,
  onNavigateToDiscipline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [titleFilter, setTitleFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProfessors = professors.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.siape.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTitle = titleFilter === 'all' || p.title === titleFilter;

    const matchesCourse =
      courseFilter === 'all' ||
      p.assignedDisciplineIds.some((discId) => {
        const disc = disciplines.find((d) => d.id === discId);
        return disc?.courseId === courseFilter;
      });

    return matchesSearch && matchesTitle && matchesCourse;
  });

  const handleDeleteConfirm = (id: string) => {
    onDeleteProfessor(id);
    setDeletingId(null);
  };

  const getTitleBadgeColor = (title: Professor['title']) => {
    switch (title) {
      case 'Doutor':
      case 'Pós-Doutor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Mestre':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Especialista':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-[#145a27] via-[#1e7e34] to-[#145a27] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="if-badge-red text-[11px] shadow-sm">
              CORPO DOCENTE COINF
            </span>
            <span className="text-xs font-semibold text-emerald-100 bg-white/10 px-2.5 py-0.5 rounded-full">
              Instituto Federal de Sergipe · Campus Tobias Barreto
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] text-white font-semibold">
              Google Sheets Integrado
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white text-balance">
            Corpo Docente, Atribuição de Disciplinas e Turmas
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Gestão do quadro de professores da COINF do IFS Campus Tobias Barreto. Cadastre e edite docentes, consulte matrículas SIAPE, e-mails institucionais e faça a alocação das turmas e componentes curriculares dos cursos de <strong>TDS Integrado</strong> (Resolução CS/IFS nº 216/2023) e <strong>Técnico Subsequente</strong> (Resolução nº 09/2017/CS/IFS).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {userRole === 'professor' && (
              <>
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-emerald-50 text-[#1e7e34] font-bold text-xs rounded-lg transition shadow-md"
                >
                  <Plus className="w-4 h-4 text-[#ce2029]" />
                  <span>Cadastrar Novo Professor</span>
                </button>

                <button
                  onClick={onOpenGoogleSheetsModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ce2029] hover:bg-[#a8171e] text-white font-bold text-xs rounded-lg transition shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Integrar Dados no Google Sheets</span>
                </button>
              </>
            )}

            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 py-1">
              <span>
                <strong className="text-white font-bold">{professors.length}</strong> professores cadastrados
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-white font-bold">{disciplines.length}</strong> disciplinas atendidas
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-white font-bold">{turmas.length}</strong> turmas ativas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome do professor, SIAPE, e-mail ou área..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todas as Titulações</option>
              <option value="Doutor">Doutores</option>
              <option value="Mestre">Mestres</option>
              <option value="Especialista">Especialistas</option>
              <option value="Graduado">Graduados</option>
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todos os Cursos</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.degree}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Professors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProfessors.map((professor) => {
          const assignedDisciplines = disciplines.filter((d) =>
            professor.assignedDisciplineIds.includes(d.id)
          );
          const assignedTurmasList = turmas.filter((t) =>
            professor.assignedTurmaIds.includes(t.id)
          );

          return (
            <div
              key={professor.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-5 pb-4">
                {/* Professor Header Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      {professor.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 font-display">
                          {professor.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTitleBadgeColor(
                            professor.title
                          )}`}
                        >
                          {professor.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-[11px] font-semibold text-slate-700">
                          SIAPE: {professor.siape}
                        </span>
                        <span>·</span>
                        <span>{professor.department}</span>
                      </div>
                    </div>
                  </div>

                  {userRole === 'professor' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditProfessor(professor)}
                        title="Editar Professor e Associações"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(professor.id)}
                        title="Excluir Professor"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bio / Área */}
                {professor.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                    {professor.bio}
                  </p>
                )}

                {/* Contact & Location */}
                <div className="space-y-1 text-xs text-slate-600 mb-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{professor.email}</span>
                  </div>
                  {professor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{professor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {professor.room ? `${professor.room} · ` : ''}
                      {professor.campus}
                    </span>
                  </div>
                </div>

                {/* Associated Disciplines */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Disciplinas Ministradas ({assignedDisciplines.length})</span>
                    </span>
                  </div>

                  {assignedDisciplines.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedDisciplines.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => onNavigateToDiscipline && onNavigateToDiscipline(d.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition border border-slate-200"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="font-mono font-bold">{d.code}</span>
                          <span className="truncate max-w-[130px]">{d.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Nenhuma disciplina atribuída no momento.
                    </span>
                  )}
                </div>

                {/* Associated Turmas */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Turmas Atribuídas ({assignedTurmasList.length})</span>
                    </span>
                  </div>

                  {assignedTurmasList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedTurmasList.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          <span className="font-mono font-bold text-indigo-700">{t.code}</span>
                          <span>·</span>
                          <span>{t.shift}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Nenhuma turma atribuída no momento.
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {professor.googleConnected
                    ? '✓ Sincronizado com Google Workspace'
                    : 'Docente Cadastrado no IFS'}
                </span>
                {userRole === 'professor' && (
                  <button
                    onClick={() => onEditProfessor(professor)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Editar Associações →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProfessors.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          Nenhum professor encontrado com os filtros aplicados.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Excluir Professor?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Tem certeza que deseja remover este docente? As disciplinas e turmas associadas a ele ficarão desvinculadas.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
