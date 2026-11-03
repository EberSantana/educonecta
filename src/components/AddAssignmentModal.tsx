import React, { useState } from 'react';
import { X, Calendar, Award, Plus, Trash2 } from 'lucide-react';
import { Discipline, Assignment } from '../types';

interface AddAssignmentModalProps {
  disciplines: Discipline[];
  defaultDisciplineId: string;
  onAddAssignment: (assignment: Assignment) => void;
  onClose: () => void;
}

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  disciplines,
  defaultDisciplineId,
  onAddAssignment,
  onClose,
}) => {
  const [disciplineId, setDisciplineId] = useState(
    defaultDisciplineId !== 'all' ? defaultDisciplineId : disciplines[0]?.id || ''
  );
  const selectedDiscipline = disciplines.find((d) => d.id === disciplineId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState(selectedDiscipline?.modules[0] || 'Módulo Geral');
  const [dueDate, setDueDate] = useState('2026-11-20T23:59');
  const [maxScore, setMaxScore] = useState('10.0');
  const [weight, setWeight] = useState('20');
  const [instructions, setInstructions] = useState('');
  const [rubrics, setRubrics] = useState<{ criterion: string; points: number }[]>([
    { criterion: 'Corretude conceitual e resolução técnica', points: 6.0 },
    { criterion: 'Clareza metodológica e apresentação dos resultados', points: 4.0 },
  ]);

  const handleAddCriterion = () => {
    setRubrics([...rubrics, { criterion: '', points: 2.0 }]);
  };

  const handleRemoveCriterion = (index: number) => {
    setRubrics(rubrics.filter((_, i) => i !== index));
  };

  const handleUpdateCriterion = (index: number, field: 'criterion' | 'points', val: any) => {
    const updated = [...rubrics];
    if (field === 'criterion') updated[index].criterion = val;
    if (field === 'points') updated[index].points = parseFloat(val) || 0;
    setRubrics(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      disciplineId,
      title: title.trim(),
      description: description.trim(),
      module,
      dueDate,
      maxScore: parseFloat(maxScore) || 10.0,
      weight: parseInt(weight) || 20,
      instructions: instructions.trim() || description.trim(),
      rubricCriteria: rubrics.filter((r) => r.criterion.trim().length > 0),
      attachmentName: 'roteiro_da_atividade.pdf',
      submissions: [],
    };

    onAddAssignment(newAssignment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Criar Nova Atividade Avaliativa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cadastre listas, trabalhos práticos ou projetos com rubrica e prazo limite.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disciplina
              </label>
              <select
                value={disciplineId}
                onChange={(e) => {
                  setDisciplineId(e.target.value);
                  const disc = disciplines.find((d) => d.id === e.target.value);
                  if (disc && disc.modules.length > 0) {
                    setModule(disc.modules[0]);
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
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
                Módulo Relacionado
              </label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {selectedDiscipline?.modules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Atividade
            </label>
            <input
              type="text"
              placeholder="Ex: Trabalho Prático 3: Árvores B e Índices de Busca"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição e Enunciado
            </label>
            <textarea
              rows={2}
              placeholder="Descreva o objetivo da atividade e o que é esperado dos alunos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data e Horário Limite
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nota Máxima
              </label>
              <input
                type="number"
                step="0.5"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peso na Média (%)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Rubric criteria */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Critérios de Avaliação (Rubrica)
              </label>
              <button
                type="button"
                onClick={handleAddCriterion}
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Critério
              </button>
            </div>

            <div className="space-y-2">
              {rubrics.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Descrição do critério (ex: Testes automatizados)"
                    value={r.criterion}
                    onChange={(e) => handleUpdateCriterion(idx, 'criterion', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Pontos"
                    value={r.points}
                    onChange={(e) => handleUpdateCriterion(idx, 'points', e.target.value)}
                    className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs tabular-nums text-center"
                  />
                  {rubrics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              Cadastrar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
