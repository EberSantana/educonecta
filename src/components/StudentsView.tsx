import React, { useState } from 'react';
import { Plus, Users, Search, GraduationCap, Mail, Phone, Calendar, Trash2, X, CheckCircle, Clock } from 'lucide-react';
import { Student, Course, Turma, UserRole } from '../types';

interface StudentsViewProps {
  students: Student[];
  courses: Course[];
  turmas: Turma[];
  userRole: UserRole;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateStudentStatus: (studentId: string, status: Student['status']) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  courses,
  turmas,
  userRole,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudentStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [entryYear, setEntryYear] = useState('2026');
  const [status, setStatus] = useState<Student['status']>('Ativo');
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);

  const filteredStudents = students.filter((s) => {
    if (courseFilter !== 'all' && s.courseId !== courseFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchMatricula = s.matricula.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      return matchName || matchMatricula || matchEmail;
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !matricula.trim() || !email.trim()) return;

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      matricula: matricula.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      courseId,
      entryYear,
      status,
      enrolledTurmaIds: selectedTurmas,
      avatarInitials: initials || 'AL',
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
    setName('');
    setMatricula('');
    setEmail('');
    setPhone('');
    setSelectedTurmas([]);
  };

  const toggleTurmaSelection = (turmaId: string) => {
    if (selectedTurmas.includes(turmaId)) {
      setSelectedTurmas(selectedTurmas.filter((id) => id !== turmaId));
    } else {
      setSelectedTurmas([...selectedTurmas, turmaId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Registro Acadêmico</span>
            <span aria-hidden="true">·</span>
            <span>Corpo Discente e Matrículas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Cadastro e Diretório de Alunos
          </h1>
        </div>

        {userRole === 'professor' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Aluno
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nome, matrícula ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
        >
          <option value="all">Todos os Cursos</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
        >
          <option value="all">Todas as Situações</option>
          <option value="Ativo">Ativo</option>
          <option value="Trancado">Trancado</option>
          <option value="Formando">Formando</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      {/* Students Table / Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1 font-display">
            Nenhum aluno encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Tente outros termos de busca ou cadastre novos estudantes no sistema.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          <div className="bg-slate-50 px-5 py-3 hidden md:grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="col-span-4">Aluno / Matrícula</span>
            <span className="col-span-3">Curso</span>
            <span className="col-span-2">Turmas Matriculadas</span>
            <span className="col-span-2">Situação</span>
            <span className="col-span-1 text-right">Ações</span>
          </div>

          {filteredStudents.map((student) => {
            const course = courses.find((c) => c.id === student.courseId);

            return (
              <div
                key={student.id}
                className="p-4 md:px-5 md:py-3.5 grid grid-cols-1 md:grid-cols-12 items-center gap-3 text-xs hover:bg-slate-50/80 transition"
              >
                {/* Col 1: Name and Matrícula */}
                <div className="col-span-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {student.avatarInitials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block text-xs truncate">{student.name}</strong>
                    <div className="text-slate-400 font-mono text-[11px] truncate">
                      Matrícula: {student.matricula}
                    </div>
                    <div className="text-slate-400 text-[10px] truncate">
                      {student.email}
                    </div>
                  </div>
                </div>

                {/* Col 2: Course */}
                <div className="col-span-3 text-slate-700">
                  <span className="font-medium block truncate">{course?.name || 'Curso Geral'}</span>
                  <span className="text-slate-400 text-[11px]">Ingresso: {student.entryYear}</span>
                </div>

                {/* Col 3: Enrolled Turmas */}
                <div className="col-span-2 text-slate-600">
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {student.enrolledTurmaIds.length} turma(s)
                  </span>
                </div>

                {/* Col 4: Status badge */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      student.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : student.status === 'Trancado'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ● {student.status}
                  </span>
                </div>

                {/* Col 5: Actions */}
                <div className="col-span-1 flex items-center justify-end gap-2">
                  {userRole === 'professor' && (
                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      aria-label="Excluir aluno"
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
      )}

      {/* Modal Add Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Cadastrar Novo Aluno
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Insira os dados cadastrais e realize a enturmação inicial.
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
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo do Estudante
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Luísa Martins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de Matrícula
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 20260789"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ano de Ingresso
                  </label>
                  <input
                    type="text"
                    value={entryYear}
                    onChange={(e) => setEntryYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail Acadêmico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ana.martins@aluno.universidade.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-8888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Curso de Graduação
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Situação Cadastral
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Trancado">Trancado</option>
                    <option value="Formando">Formando</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              {/* Multi-turma check - Filtrado por Curso */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Turmas do Curso ({courses.find((c) => c.id === courseId)?.name || 'Curso'}):
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {turmas.filter((t) => t.courseId === courseId).length} turma(s) disponível(is)
                  </span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-xs">
                  {turmas.filter((t) => t.courseId === courseId).length > 0 ? (
                    turmas
                      .filter((t) => t.courseId === courseId)
                      .map((t) => (
                        <label
                          key={t.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTurmas.includes(t.id)}
                            onChange={() => toggleTurmaSelection(t.id)}
                            className="w-4 h-4 text-[#1e7e34] rounded border-slate-300 focus:ring-[#1e7e34]"
                          />
                          <span>
                            <strong>{t.code}</strong> - {t.name} ({t.shift})
                          </span>
                        </label>
                      ))
                  ) : (
                    <p className="text-slate-400 text-xs py-1 italic">
                      Não há turmas abertas para este curso no momento.
                    </p>
                  )}
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
                  className="px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  Cadastrar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
