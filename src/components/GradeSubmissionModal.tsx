import React, { useState } from 'react';
import { X, Award, CheckCircle, FileText } from 'lucide-react';
import { Assignment, Submission } from '../types';

interface GradeSubmissionModalProps {
  assignment: Assignment;
  submission: Submission;
  onGrade: (submissionId: string, grade: number, feedback: string) => void;
  onClose: () => void;
}

export const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  assignment,
  submission,
  onGrade,
  onClose,
}) => {
  const [grade, setGrade] = useState<string>(
    submission.grade !== undefined ? String(submission.grade) : ''
  );
  const [feedback, setFeedback] = useState<string>(submission.feedback || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericGrade = parseFloat(grade.replace(',', '.'));
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > assignment.maxScore) {
      return;
    }

    onGrade(submission.id, numericGrade, feedback.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Avaliar Entrega de Aluno
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aluno: <span className="font-semibold text-slate-700">{submission.studentName}</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Submission Info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Arquivo enviado:</span>
              <span className="font-mono text-indigo-600 font-medium">
                {submission.fileName || 'arquivo_entrega.pdf'} ({submission.fileSize || '2.4 MB'})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Data de Envio:</span>
              <span className="text-slate-700">
                {new Date(submission.submittedAt).toLocaleString('pt-BR')}
              </span>
            </div>
            {submission.notes && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Observações do Aluno:</span>
                <p className="text-slate-700 italic">"{submission.notes}"</p>
              </div>
            )}
          </div>

          {/* Rubric Points Reference */}
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
            <span className="font-semibold text-indigo-900 block">
              Critérios da Atividade (Total Máximo: {assignment.maxScore} pontos):
            </span>
            <ul className="space-y-1 text-slate-600">
              {assignment.rubricCriteria.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span>{c.criterion}</span>
                  <span className="font-semibold text-slate-700 tabular-nums">até {c.points} pts</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nota Atribuída (0 a {assignment.maxScore})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max={assignment.maxScore}
                placeholder={`Ex: 9.5`}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 tabular-nums"
              />
              <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Feedback Qualitativo e Orientações Pedagógicas
            </label>
            <textarea
              rows={4}
              placeholder="Aponte os pontos fortes da entrega, eventuais correções de raciocínio ou sugestões de leitura complementar..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
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
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Salvar Avaliação & Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
