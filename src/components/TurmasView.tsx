import React, { useState } from 'react';
import { Plus, Users, Clock, MapPin, Trash2, X, CheckSquare, UserPlus, BookOpen, UserCheck, Edit2 } from 'lucide-react';
import { Turma, Discipline, Course, Student, UserRole, Professor } from '../types';

interface TurmasViewProps {
  turmas: Turma[];
  disciplines: Discipline[];
  courses: Course[];
  students: Student[];
  professors?: Professor[];
  userRole: UserRole;
  currentStudentId?: string;
  onAddTurma: (turma: Turma) => void;
  onEditTurma?: (turma: Turma) => void;
  onDeleteTurma: (turmaId: string) => void;
  onEnrollStudent: (turmaId: string, studentId: string) => void;
  onUnenrollStudent: (turmaId: string, studentId: string) => void;
}

export const TurmasView: React.FC<TurmasViewProps> = ({
  turmas,
  disciplines,
  courses,
  students,
  professors = [],
  userRole,
  currentStudentId,
  onAddTurma,
  onEditTurma,
  onDeleteTurma,
  onEnrollStudent,
  onUnenrollStudent,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTurmaForStudents, setSelectedTurmaForStudents] = useState<Turma | null>(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [disciplineId, setDisciplineId] = useState(disciplines[0]?.id || '');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [selectedProfId, setSelectedProfId] = useState(professors[0]?.id || 'prof-eber');
  const [shift, setShift] = useState<'Matutino' | 'Vespertino' | 'Noturno' | 'Integral'>('Matutino');
  const [room, setRoom] = useState('Laboratório de Informática 01 (Campus Tobias Barreto)');
  const [schedule, setSchedule] = useState('Segundas e Terças, 07:30 - 09:45');
  const [maxStudents, setMaxStudents] = useState('40');
  const [semester, setSemester] = useState('2026.1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const chosenProf = professors.find((p) => p.id === selectedProfId);

    const newTurma: Turma = {
      id: `turma-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      disciplineId,
      courseId,
      semester,
      shift,
      professorId: chosenProf ? chosenProf.id : 'prof-eber',
      professorName: chosenProf ? chosenProf.name : 'Prof. Eber Santana',
      room: room.trim() || 'Laboratório de Informática 01 (Campus Tobias Barreto)',
      schedule: schedule.trim(),
      maxStudents: parseInt(maxStudents) || 35,
      enrolledStudentIds: [],
    };

    onAddTurma(newTurma);
    setIsAddModalOpen(false);
    setCode('');
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Gestão Acadêmica</span>
            <span aria-hidden="true">·</span>
            <span>Turmas e Enturmação</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Cadastro e Controle de Turmas
          </h1>
        </div>

        {userRole === 'professor' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-bold rounded-lg transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Nova Turma
          </button>
        )}
      </div>

      {/* Course Filter Toolbar - Separação Clara de Curso e Turma */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1.5 shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Filtrar por Curso:</span>
        </span>
        <button
          onClick={() => setSelectedCourseFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${
            selectedCourseFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Todas as Turmas ({turmas.length})
        </button>
        {courses.map((c) => {
          const count = turmas.filter((t) => t.courseId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCourseFilter(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${
                selectedCourseFilter === c.id
                  ? 'bg-[#1e7e34] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Turmas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(selectedCourseFilter === 'all'
          ? turmas
          : turmas.filter((t) => t.courseId === selectedCourseFilter)
        ).map((turma) => {
          const discipline = disciplines.find((d) => d.id === turma.disciplineId);
          const course = courses.find((c) => c.id === turma.courseId);
          const enrolledCount = turma.enrolledStudentIds.length;
          const isFull = enrolledCount >= turma.maxStudents;
          const isStudentEnrolled = currentStudentId
            ? turma.enrolledStudentIds.includes(currentStudentId)
            : false;

          return (
            <div
              key={turma.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition ${
                isStudentEnrolled
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Enrolled Badge for Students */}
                {isStudentEnrolled && (
                  <div className="mb-2.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                    <span>✓ Você está matriculado(a) nesta Turma</span>
                    <span className="text-[10px] text-emerald-600 font-mono">Ativa</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                    {turma.code}
                  </span>
                  <span className="text-slate-400 font-mono">{turma.semester} · {turma.shift}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display mb-1 leading-snug">
                  {turma.name}
                </h3>

                <div className="text-xs text-slate-600 mb-3 space-y-0.5">
                  <div><strong>Matéria:</strong> {discipline?.name || 'Disciplina Geral'} ({discipline?.code})</div>
                  <div><strong>Curso:</strong> {course?.name || 'Curso Integrado'}</div>
                  <div className="text-indigo-700 font-medium"><strong>Docente:</strong> {turma.professorName || 'Prof. Eber Santana'}</div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{turma.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{turma.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Ocupação:{' '}
                      <strong className="text-slate-800 font-mono">
                        {enrolledCount} / {turma.maxStudents} alunos
                      </strong>{' '}
                      ({Math.round((enrolledCount / turma.maxStudents) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 mt-4 border-t border-slate-100 flex flex-col gap-2">
                {userRole === 'student' && currentStudentId && (
                  <div>
                    {isStudentEnrolled ? (
                      <button
                        onClick={() => onUnenrollStudent(turma.id, currentStudentId)}
                        className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition"
                      >
                        Cancelar Matrícula nesta Turma
                      </button>
                    ) : (
                      <button
                        onClick={() => !isFull && onEnrollStudent(turma.id, currentStudentId)}
                        disabled={isFull}
                        className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition ${
                          isFull
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isFull ? 'Turma Lotada (Sem Vagas)' : '+ Escolher esta Turma (Matricular-se)'}
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTurmaForStudents(turma)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#166534] bg-[#e8f5e9] hover:bg-[#d5ecd9] border border-[#248c3d]/30 rounded-lg transition"
                  >
                    <Users className="w-3.5 h-3.5 text-[#1e7e34]" />
                    <span>Alunos Matriculados ({enrolledCount})</span>
                  </button>

                  {userRole === 'professor' && (
                    <div className="flex items-center gap-1">
                      {onEditTurma && (
                        <button
                          onClick={() => onEditTurma(turma)}
                          title="Editar turma"
                          aria-label="Editar turma"
                          className="p-1.5 text-slate-400 hover:text-[#1e7e34] rounded transition hover:bg-[#e8f5e9]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {turmas.length > 1 && (
                        <button
                          onClick={() => onDeleteTurma(turma.id)}
                          aria-label="Excluir turma"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View & Manage Students in Turma */}
      {selectedTurmaForStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Alunos Matriculados na Turma
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedTurmaForStudents.code} - {selectedTurmaForStudents.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedTurmaForStudents(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <span className="font-semibold text-slate-700 block">
                Lista de Alunos Registrados ({selectedTurmaForStudents.enrolledStudentIds.length} de {selectedTurmaForStudents.maxStudents}):
              </span>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {students.map((student) => {
                  const isEnrolled = selectedTurmaForStudents.enrolledStudentIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[11px]">
                          {student.avatarInitials}
                        </span>
                        <div>
                          <strong className="text-slate-900 block">{student.name}</strong>
                          <span className="text-slate-400 font-mono text-[11px]">
                            Matrícula: {student.matricula} · {student.email}
                          </span>
                        </div>
                      </div>

                      {userRole === 'professor' && (
                        <div>
                          {isEnrolled ? (
                            <button
                              onClick={() => {
                                onUnenrollStudent(selectedTurmaForStudents.id, student.id);
                                setSelectedTurmaForStudents({
                                  ...selectedTurmaForStudents,
                                  enrolledStudentIds: selectedTurmaForStudents.enrolledStudentIds.filter(
                                    (id) => id !== student.id
                                  ),
                                });
                              }}
                              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md font-semibold text-[11px]"
                            >
                              Desmatricular
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onEnrollStudent(selectedTurmaForStudents.id, student.id);
                                setSelectedTurmaForStudents({
                                  ...selectedTurmaForStudents,
                                  enrolledStudentIds: [
                                    ...selectedTurmaForStudents.enrolledStudentIds,
                                    student.id,
                                  ],
                                });
                              }}
                              className="px-2.5 py-1 text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md font-semibold text-[11px]"
                            >
                              + Matricular
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTurmaForStudents(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Turma */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Cadastrar Nova Turma
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vincule a turma a uma matéria/disciplina e defina horário e sala.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código da Turma
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TURMA-CC301-B"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semestre
                  </label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome / Identificador da Turma
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Turma B - Estruturas de Dados Avançadas (Tarde)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Matéria / Disciplina
                  </label>
                  <select
                    value={disciplineId}
                    onChange={(e) => setDisciplineId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    {disciplines.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Curso Pertencente
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Docente / Professor Responsável
                </label>
                <select
                  value={selectedProfId}
                  onChange={(e) => setSelectedProfId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  {professors.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.title} · SIAPE: {p.siape})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Turno
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacidade Máxima (Vagas)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sala / Laboratório
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horário Semanal
                  </label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
                >
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
