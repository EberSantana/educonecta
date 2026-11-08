import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { Discipline, Course } from '../types';

interface AddDisciplineModalProps {
  courses?: Course[];
  onAddDiscipline: (discipline: Discipline) => void;
  onClose: () => void;
}

export const AddDisciplineModal: React.FC<AddDisciplineModalProps> = ({
  courses = [],
  onAddDiscipline,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-inf');
  const [credits, setCredits] = useState('4');
  const [workloadHours, setWorkloadHours] = useState('76');
  const [semester, setSemester] = useState('1º Período');
  const [department, setDepartment] = useState('COINF - Campus Tobias Barreto');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [description, setDescription] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [color, setColor] = useState('#1e7e34');
  const [modulesInput, setModulesInput] = useState(
    'Módulo 1: Fundamentos\nMódulo 2: Tópicos Intermediários\nMódulo 3: Prática e Aplicações'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const modules = modulesInput
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const newDiscipline: Discipline = {
      id: code.trim().toLowerCase().replace(/[^a-z0-9]/g, ''),
      code: code.trim().toUpperCase(),
      name: name.trim(),
      courseId,
      credits: parseInt(credits) || 4,
      workloadHours: parseInt(workloadHours) || 60,
      semester: semester.trim(),
      department: department.trim(),
      room: room.trim() || 'Sala a definir',
      schedule: schedule.trim() || 'Horário a definir',
      description: description.trim(),
      syllabus: syllabus.trim() || description.trim(),
      color,
      studentsCount: 0,
      modules: modules.length > 0 ? modules : ['Módulo Geral'],
    };

    onAddDiscipline(newDiscipline);
    onClose();
  };

  const presetColors = ['#1e7e34', '#ce2029', '#0284c7', '#059669', '#7c3aed', '#d97706', '#0d9488'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Cadastrar Nova Matéria / Disciplina
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Crie o espaço da disciplina para compartilhar materiais, ementas e receber dúvidas.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código da Matéria
              </label>
              <input
                type="text"
                placeholder="Ex: CC402"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 uppercase"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Matéria
              </label>
              <input
                type="text"
                placeholder="Ex: Inteligência Artificial e Aprendizado de Máquina"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Curso Pertencente
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs"
              >
                {courses.length > 0 ? (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="course-cc">Ciência da Computação</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Créditos
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Carga Horária (Horas)
              </label>
              <input
                type="number"
                min="15"
                max="240"
                value={workloadHours}
                onChange={(e) => setWorkloadHours(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semestre Letivo
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sala / Local de Aula
              </label>
              <input
                type="text"
                placeholder="Ex: Laboratório C-102"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Horário Semanal
              </label>
              <input
                type="text"
                placeholder="Ex: Terças e Quintas, 10:00 - 12:00"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição Geral / Objetivos da Matéria
            </label>
            <textarea
              rows={2}
              placeholder="Objetivos do curso e competências desenvolvidas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ementa / Conteúdo Programático
            </label>
            <textarea
              rows={2}
              placeholder="Tópicos da ementa oficial aprovada pelo colegiado..."
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Módulos / Unidades Iniciais (um por linha)
            </label>
            <textarea
              rows={3}
              value={modulesInput}
              onChange={(e) => setModulesInput(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cor de Identificação
            </label>
            <div className="flex items-center gap-3">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                  }`}
                  aria-label={`Selecionar cor ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1e7e34] text-white rounded-lg text-xs font-bold hover:bg-[#166534] transition shadow-sm"
            >
              Cadastrar Matéria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
