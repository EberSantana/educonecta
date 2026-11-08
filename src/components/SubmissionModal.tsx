import React, { useState } from 'react';
import { X, Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { Assignment, Submission, UserProfile } from '../types';

interface SubmissionModalProps {
  assignment: Assignment;
  currentUser: UserProfile;
  existingSubmission?: Submission;
  onSubmit: (submission: Submission) => void;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  assignment,
  currentUser,
  existingSubmission,
  onSubmit,
  onClose,
}) => {
  const [fileName, setFileName] = useState(
    existingSubmission?.fileName || `${currentUser.name.toLowerCase().replace(/\s+/g, '_')}_entrega.zip`
  );
  const [fileSize, setFileSize] = useState(existingSubmission?.fileSize || '2.8 MB');
  const [notes, setNotes] = useState(existingSubmission?.notes || '');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setIsSimulatingUpload(true);
    setTimeout(() => {
      const submission: Submission = {
        id: existingSubmission?.id || `sub-${Date.now()}`,
        assignmentId: assignment.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        submittedAt: new Date().toISOString(),
        fileName: fileName.trim(),
        fileSize,
        notes: notes.trim(),
        grade: existingSubmission?.grade,
        feedback: existingSubmission?.feedback,
        gradedAt: existingSubmission?.gradedAt,
      };

      onSubmit(submission);
      setIsSimulatingUpload(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {existingSubmission ? 'Atualizar Entrega' : 'Enviar Atividade / Trabalho'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              {assignment.title}
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
          {/* Rubric overview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 block">Critérios de Avaliação (Pontuação Máxima: {assignment.maxScore}):</span>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
              {assignment.rubricCriteria.map((r, i) => (
                <li key={i}>
                  {r.criterion}: <span className="font-semibold">{r.points} pts</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Arquivo a Enviar
            </label>
            <div className="relative">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-xs"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Formatos aceitos: .pdf, .zip, .cpp, .py, .ipynb (Simulação de upload)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Comentários / Observações do Aluno para o Professor
            </label>
            <textarea
              rows={3}
              placeholder="Descreva detalhes da sua solução, bibliotecas utilizadas ou instruções para execução..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              disabled={isSimulatingUpload}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-60"
            >
              <Upload className="w-3.5 h-3.5" />
              {isSimulatingUpload ? 'Enviando...' : existingSubmission ? 'Reenviar Trabalho' : 'Confirmar Envio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
