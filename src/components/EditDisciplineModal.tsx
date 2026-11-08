import React, { useState, useEffect } from 'react';
import { X, BookOpen, Layers, Check, AlertCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { Discipline, Course } from '../types';

interface EditDisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  discipline: Discipline | null;
  courses: Course[];
  onSave: (discipline: Discipline) => void;
}

const COLOR_OPTIONS = [
  '#1e7e34', // Verde Institucional IF
  '#ce2029', // Vermelho Institucional IF
  '#2563eb', // Azul
  '#0d9488', // Teal
  '#d97706', // Âmbar
  '#7c3aed', // Violeta
  '#059669', // Esmeralda
  '#475569', // Grafite
];

export const EditDisciplineModal: React.FC<EditDisciplineModalProps> = ({
  isOpen,
  onClose,
  discipline,
  courses,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('');
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [workloadHours, setWorkloadHours] = useState('80');
  const [workloadLessons, setWorkloadLessons] = useState('96');
  const [theoryHours, setTheoryHours] = useState('40');
  const [practiceHours, setPracticeHours] = useState('40');
  const [weeklyHours, setWeeklyHours] = useState('4');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [description, setDescription] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [modulesText, setModulesText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (discipline) {
      setName(discipline.name || '');
      setCode(discipline.code || '');
      setCourseId(discipline.courseId || courses[0]?.id || '');
      setSemester(discipline.semester || '');
      setPeriodNumber(discipline.periodNumber || 1);
      setWorkloadHours(String(discipline.workloadHours || 0));
      setWorkloadLessons(String(discipline.workloadLessons || 0));
      setTheoryHours(String(discipline.theoryHours || 0));
      setPracticeHours(String(discipline.practiceHours || 0));
      setWeeklyHours(String(discipline.weeklyHours || 0));
      setRoom(discipline.room || '');
      setSchedule(discipline.schedule || '');
      setPrerequisites(discipline.prerequisites || 'Sem pré-requisito');
      setDescription(discipline.description || '');
      setSyllabus(discipline.syllabus || '');
      setColor(discipline.color || '#4f46e5');
      setModulesText((discipline.modules || []).join('\n'));
      setError(null);
    }
  }, [discipline, courses, isOpen]);

  if (!isOpen || !discipline) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Informe o nome da disciplina.');
      return;
    }
    if (!code.trim()) {
      setError('Informe o código da disciplina.');
      return;
    }

    const parsedModules = modulesText
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const updatedDiscipline: Discipline = {
      ...discipline,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      courseId,
      semester: semester.trim(),
      periodNumber: Number(periodNumber) || 1,
      workloadHours: parseInt(workloadHours) || 0,
      workloadLessons: parseInt(workloadLessons) || 0,
      theoryHours: parseInt(theoryHours) || 0,
      practiceHours: parseInt(practiceHours) || 0,
      weeklyHours: parseInt(weeklyHours) || 0,
      room: room.trim() || 'Laboratório de Informática - Campus Tobias Barreto',
      schedule: schedule.trim(),
      prerequisites: prerequisites.trim() || 'Sem pré-requisito',
      description: description.trim(),
      syllabus: syllabus.trim(),
      color,
      modules: parsedModules.length > 0 ? parsedModules : discipline.modules,
    };

    onSave(updatedDiscipline);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs"
              style={{ backgroundColor: color }}
            >
              {code || 'DISC'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Editar Componente Curricular / Disciplina
              </h2>
              <p className="text-xs text-slate-500">
                PPC Campus Tobias Barreto · {discipline.name}
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
              <label className="font-semibold text-slate-700">Nome da Disciplina *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Curso e Período */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Curso Vinculado</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
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
              <label className="font-semibold text-slate-700">Período / Ano</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={periodNumber}
                  onChange={(e) => setPeriodNumber(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center font-bold"
                />
                <input
                  type="text"
                  value={semester}
                  placeholder="Ex: 1º Ano ou 2º Período"
                  onChange={(e) => setSemester(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Carga Horária */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 text-[11px]">Horas-Aula (h/a)</label>
              <input
                type="number"
                value={workloadLessons}
                onChange={(e) => setWorkloadLessons(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 text-[11px]">Horas-Relógio (h)</label>
              <input
                type="number"
                value={workloadHours}
                onChange={(e) => setWorkloadHours(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 text-[11px]">Teórica (h)</label>
              <input
                type="number"
                value={theoryHours}
                onChange={(e) => setTheoryHours(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 text-[11px]">Prática (h)</label>
              <input
                type="number"
                value={practiceHours}
                onChange={(e) => setPracticeHours(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Local, Horário e Pré-requisitos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sala / Laboratório</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Horário Sugerido</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Pré-requisito</label>
            <input
              type="text"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Descrição & Ementa */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Descrição Geral</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Ementa Oficial do PPC</label>
            <textarea
              rows={3}
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-[11px]"
            />
          </div>

          {/* Módulos (um por linha) */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Módulos Didáticos (um por linha)</label>
            <textarea
              rows={3}
              value={modulesText}
              onChange={(e) => setModulesText(e.target.value)}
              placeholder="Módulo 1: Conceitos Iniciais&#10;Módulo 2: Estruturas de Dados&#10;Módulo 3: Projeto Final"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Cor da Disciplina */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Cor de Identificação</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    color === c ? 'border-slate-900 scale-110 shadow-xs' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
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
              <span>Salvar Alterações da Disciplina</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
