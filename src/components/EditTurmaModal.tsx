import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen, Clock, MapPin, Check, AlertCircle, UserCheck } from 'lucide-react';
import { Turma, Discipline, Course, Professor } from '../types';

interface EditTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  turma: Turma | null;
  disciplines: Discipline[];
  courses: Course[];
  professors: Professor[];
  onSave: (turma: Turma) => void;
}

export const EditTurmaModal: React.FC<EditTurmaModalProps> = ({
  isOpen,
  onClose,
  turma,
  disciplines,
  courses,
  professors,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [shift, setShift] = useState<'Matutino' | 'Vespertino' | 'Noturno' | 'Integral'>('Matutino');
  const [semester, setSemester] = useState('2026.1');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [maxStudents, setMaxStudents] = useState('35');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (turma) {
      setCode(turma.code || '');
      setName(turma.name || '');
      setCourseId(turma.courseId || courses[0]?.id || '');
      setDisciplineId(turma.disciplineId || disciplines[0]?.id || '');
      setProfessorId(turma.professorId || professors[0]?.id || 'prof-eber');
      setShift(turma.shift || 'Matutino');
      setSemester(turma.semester || '2026.1');
      setRoom(turma.room || '');
      setSchedule(turma.schedule || '');
      setMaxStudents(String(turma.maxStudents || 35));
      setError(null);
    }
  }, [turma, courses, disciplines, professors, isOpen]);

  if (!isOpen || !turma) return null;

  // Disciplines filtered by selected course
  const availableDisciplines = disciplines.filter(
    (d) => !courseId || d.courseId === courseId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Informe o nome da turma.');
      return;
    }
    if (!code.trim()) {
      setError('Informe o código da turma.');
      return;
    }

    const selectedProf = professors.find((p) => p.id === professorId);

    const updatedTurma: Turma = {
      ...turma,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      courseId,
      disciplineId,
      professorId,
      professorName: selectedProf ? selectedProf.name : turma.professorName,
      shift,
      semester: semester.trim(),
      room: room.trim() || 'Laboratório de Informática 01 (Campus Tobias Barreto)',
      schedule: schedule.trim(),
      maxStudents: parseInt(maxStudents) || 35,
    };

    onSave(updatedTurma);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Editar Turma & Enturmação
              </h2>
              <p className="text-xs text-slate-500">
                {turma.code} · {turma.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nome e Código */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Nome da Turma *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Turma A - Matutino"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Código *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: TDS-2026.1-A"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Curso e Disciplina */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Curso</label>
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  const firstDisc = disciplines.find((d) => d.courseId === e.target.value);
                  if (firstDisc) setDisciplineId(firstDisc.id);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Disciplina Principal</label>
              <select
                value={disciplineId}
                onChange={(e) => setDisciplineId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {availableDisciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Professor Responsável */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Professor / Docente Responsável</label>
            <select
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {professors.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.title} · SIAPE {p.siape})
                </option>
              ))}
            </select>
          </div>

          {/* Turno, Semestre e Limite de Vagas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Turno</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
                <option value="Integral">Integral</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Semestre / Ano Letivo</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Capacidade (Vagas)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Sala e Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Local / Laboratório</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ex: Laboratório de Informática 01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Horário das Aulas</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Ex: Segundas e Quartas, 07:30 - 09:45"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white font-bold rounded-lg shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações da Turma</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
