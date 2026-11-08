import React, { useState, useEffect } from 'react';
import { X, UserCheck, BookOpen, Layers, Check, AlertCircle } from 'lucide-react';
import { Professor, Discipline, Turma, Course } from '../types';

interface EditProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  professor: Professor | null; // null means creating a new professor
  disciplines: Discipline[];
  turmas: Turma[];
  courses: Course[];
  onSave: (savedProfessor: Professor) => void;
}

export const EditProfessorModal: React.FC<EditProfessorModalProps> = ({
  isOpen,
  onClose,
  professor,
  disciplines,
  turmas,
  courses,
  onSave,
}) => {
  const isEditing = !!professor;

  const [name, setName] = useState('');
  const [siape, setSiape] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState<Professor['title']>('Mestre');
  const [department, setDepartment] = useState('Coordenação de Informática (COINF)');
  const [campus, setCampus] = useState('IFS Campus Tobias Barreto');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [bio, setBio] = useState('');
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>([]);
  const [selectedTurmaIds, setSelectedTurmaIds] = useState<string[]>([]);
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (professor) {
      setName(professor.name || '');
      setSiape(professor.siape || '');
      setEmail(professor.email || '');
      setTitle(professor.title || 'Mestre');
      setDepartment(professor.department || 'Coordenação de Informática (COINF)');
      setCampus(professor.campus || 'IFS Campus Tobias Barreto');
      setPhone(professor.phone || '');
      setRoom(professor.room || '');
      setBio(professor.bio || '');
      setSelectedDisciplineIds(professor.assignedDisciplineIds || []);
      setSelectedTurmaIds(professor.assignedTurmaIds || []);
    } else {
      setName('');
      setSiape('');
      setEmail('');
      setTitle('Mestre');
      setDepartment('Coordenação de Informática (COINF)');
      setCampus('IFS Campus Tobias Barreto');
      setPhone('');
      setRoom('');
      setBio('');
      setSelectedDisciplineIds([]);
      setSelectedTurmaIds([]);
    }
    setError(null);
  }, [professor, isOpen]);

  if (!isOpen) return null;

  const toggleDiscipline = (discId: string) => {
    setSelectedDisciplineIds((prev) =>
      prev.includes(discId) ? prev.filter((id) => id !== discId) : [...prev, discId]
    );
  };

  const toggleTurma = (turmaId: string) => {
    setSelectedTurmaIds((prev) =>
      prev.includes(turmaId) ? prev.filter((id) => id !== turmaId) : [...prev, turmaId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome do professor.');
      return;
    }
    if (!siape.trim()) {
      setError('Por favor, informe a matrícula SIAPE.');
      return;
    }
    if (!email.trim()) {
      setError('Por favor, informe o e-mail institucional.');
      return;
    }

    const parts = name.trim().split(' ').filter(Boolean);
    const initials =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

    const saved: Professor = {
      id: professor?.id || `prof-${Date.now()}`,
      name: name.trim(),
      siape: siape.trim(),
      email: email.trim(),
      title,
      department: department.trim(),
      campus: campus.trim(),
      phone: phone.trim() || undefined,
      room: room.trim() || undefined,
      bio: bio.trim() || undefined,
      assignedDisciplineIds: selectedDisciplineIds,
      assignedTurmaIds: selectedTurmaIds,
      avatarInitials: initials,
      googleConnected: professor?.googleConnected || false,
    };

    onSave(saved);
    onClose();
  };

  const filteredDisciplines = disciplines.filter(
    (d) => courseFilter === 'all' || d.courseId === courseFilter
  );

  const filteredTurmas = turmas.filter(
    (t) => courseFilter === 'all' || t.courseId === courseFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                {isEditing ? 'Editar Dados do Professor' : 'Cadastrar Novo Professor'}
              </h2>
              <p className="text-xs text-slate-500">
                Associação de disciplinas e turmas no IFS Campus Tobias Barreto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo do Docente *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Prof. Eber Santana"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula SIAPE *
              </label>
              <input
                type="text"
                value={siape}
                onChange={(e) => setSiape(e.target.value)}
                placeholder="Ex: 1984210"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Titulação Acadêmica
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value as Professor['title'])}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Graduado">Graduado</option>
                <option value="Especialista">Especialista</option>
                <option value="Mestre">Mestre</option>
                <option value="Doutor">Doutor</option>
                <option value="Pós-Doutor">Pós-Doutor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Institucional *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: eber.santana@ifs.edu.br"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone / Contato
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (79) 3541-1200"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gabinete / Sala
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Ex: Coordenação de Informática - Sala 12"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus / Lotação
              </label>
              <input
                type="text"
                value={campus}
                disabled
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-100 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Biografia / Área de Atuação
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Ex: Docente permanente da COINF. Atua com Programação Web, Banco de Dados e Projeto Integrador."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Seletor de Curso para Filtrar Associações */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Filtrar Componentes por Curso:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCourseFilter('all')}
                  className={`px-2 py-1 text-[11px] rounded font-semibold transition ${
                    courseFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                {courses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCourseFilter(c.id)}
                    className={`px-2 py-1 text-[11px] rounded font-semibold transition ${
                      courseFilter === c.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Associação de Disciplinas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Disciplinas Ministradas ({selectedDisciplineIds.length} selecionadas)</span>
              </label>
              <span className="text-[10px] text-slate-500">
                Marque as disciplinas sob responsabilidade deste docente
              </span>
            </div>

            <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-lg p-2 divide-y divide-slate-100 bg-slate-50/50 space-y-1">
              {filteredDisciplines.map((d) => {
                const isSelected = selectedDisciplineIds.includes(d.id);
                const courseObj = courses.find((c) => c.id === d.courseId);

                return (
                  <div
                    key={d.id}
                    onClick={() => toggleDiscipline(d.id)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950 font-medium'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-indigo-700 bg-indigo-100/60 px-1 rounded">
                            {d.code}
                          </span>
                          <span>{d.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {courseObj?.code || d.courseId} · {d.semester} · {d.workloadHours}h
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Associação de Turmas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Turmas Atribuídas ({selectedTurmaIds.length} selecionadas)</span>
              </label>
              <span className="text-[10px] text-slate-500">
                Selecione as turmas em que o docente leciona
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 divide-y divide-slate-100 bg-slate-50/50 space-y-1">
              {filteredTurmas.map((t) => {
                const isSelected = selectedTurmaIds.includes(t.id);
                const parentDisc = disciplines.find((d) => d.id === t.disciplineId);

                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTurma(t.id)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950 font-medium'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-indigo-700 bg-indigo-100/60 px-1 rounded">
                            {t.code}
                          </span>
                          <span>{t.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {t.shift} · {t.room} · Matéria: {parentDisc?.name || t.disciplineId}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Professor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
