import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Award,
  Upload,
  User,
  CheckCircle,
  FileText,
  AlertCircle,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { Assignment, Submission, Discipline, UserRole, UserProfile } from '../types';
import { formatDaysRemaining, calculateClassAverageGrade } from '../utils/academic-logic';

interface AssignmentsViewProps {
  disciplines: Discipline[];
  assignments: Assignment[];
  selectedDisciplineId: string;
  userRole: UserRole;
  currentUser: UserProfile;
  onOpenSubmitModal: (assignment: Assignment) => void;
  onOpenGradeModal: (assignment: Assignment, submission: Submission) => void;
  onOpenCreateAssignmentModal: () => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  disciplines,
  assignments,
  selectedDisciplineId,
  userRole,
  currentUser,
  onOpenSubmitModal,
  onOpenGradeModal,
  onOpenCreateAssignmentModal,
}) => {
  const filteredAssignments =
    selectedDisciplineId === 'all'
      ? assignments
      : assignments.filter((a) => a.disciplineId === selectedDisciplineId);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Avaliações e Trabalhos</span>
            <span aria-hidden="true">·</span>
            <span>Gestão de Entregas e Notas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Tarefas, Listas & Trabalhos Práticos
          </h1>
        </div>

        {userRole === 'professor' && (
          <button
            onClick={onOpenCreateAssignmentModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nova Atividade Avaliativa
          </button>
        )}
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1 font-display">
            Nenhuma atividade cadastrada
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Não há tarefas ativas ou pendentes nesta disciplina no momento.
          </p>
          {userRole === 'professor' && (
            <button
              onClick={onOpenCreateAssignmentModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Criar Primeira Atividade
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => {
            const discipline = disciplines.find((d) => d.id === assignment.disciplineId);
            const remaining = formatDaysRemaining(assignment.dueDate);
            const averageGrade = calculateClassAverageGrade(assignment.submissions);

            // Check if current student submitted
            const studentSubmission = assignment.submissions.find(
              (s) => s.studentId === currentUser.id
            );

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition"
              >
                {/* Assignment Top Header */}
                <div className="p-5 pb-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">
                        {discipline?.code || 'Geral'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{assignment.module}</span>
                      <span aria-hidden="true">·</span>
                      <span>Peso: {assignment.weight}% da média</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`font-semibold ${
                          remaining.isPast
                            ? 'text-slate-400'
                            : remaining.isUrgent
                            ? 'text-rose-600'
                            : 'text-indigo-600'
                        }`}
                      >
                        {remaining.label}
                      </span>
                      <span className="text-slate-400">
                        (Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5">
                    {assignment.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {assignment.description}
                  </p>

                  {/* Rubric Criteria List */}
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Critérios da Rubrica Avaliativa (Nota Máxima: {assignment.maxScore}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                      {assignment.rubricCriteria.map((c, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span>• {c.criterion}</span>
                          <span className="font-semibold text-slate-700 ml-2">
                            {c.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submissions Section */}
                <div className="p-5 bg-slate-50/40">
                  {userRole === 'student' ? (
                    /* Student Submission View */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">
                          Sua Situação de Entrega:
                        </span>

                        {studentSubmission ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Trabalho Entregue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Pendente de Envio
                          </span>
                        )}
                      </div>

                      {studentSubmission ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Arquivo submetido:</span>
                              <span className="font-mono text-indigo-600 font-medium">
                                {studentSubmission.fileName} ({studentSubmission.fileSize})
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              Enviado em: {new Date(studentSubmission.submittedAt).toLocaleString('pt-BR')}
                            </div>
                          </div>

                          {studentSubmission.notes && (
                            <p className="text-slate-600 italic border-l-2 border-slate-200 pl-2">
                              "{studentSubmission.notes}"
                            </p>
                          )}

                          {studentSubmission.grade !== undefined ? (
                            <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-indigo-950 flex items-center gap-1.5">
                                  <Award className="w-4 h-4 text-indigo-600" />
                                  Avaliação do Professor:
                                </span>
                                <span className="text-base font-bold font-mono text-indigo-700 tabular-nums">
                                  {studentSubmission.grade} / {assignment.maxScore}
                                </span>
                              </div>
                              {studentSubmission.feedback && (
                                <p className="text-slate-700 leading-relaxed text-xs">
                                  <strong className="text-slate-900 block mb-0.5">Feedback Docente:</strong>
                                  {studentSubmission.feedback}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-slate-500 italic text-[11px]">
                              Aguardando correção pelo professor.
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => onOpenSubmitModal(assignment)}
                              className="text-xs text-indigo-600 hover:underline font-semibold"
                            >
                              Reenviar nova versão do arquivo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                          <div className="text-xs text-slate-600">
                            Envie seu relatório ou código antes da data limite para garantir a pontuação integral.
                          </div>
                          <button
                            onClick={() => onOpenSubmitModal(assignment)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition shadow-sm shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Enviar Trabalho
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Professor Submissions Overview */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            Entregas dos Estudantes ({assignment.submissions.length})
                          </span>
                          {averageGrade !== null && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>
                                Média da turma:{' '}
                                <strong className="font-mono text-indigo-600 font-bold">
                                  {averageGrade}
                                </strong>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {assignment.submissions.length === 0 ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center text-xs text-slate-500">
                          Nenhum estudante submeteu esta atividade até o momento.
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
                          {assignment.submissions.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900">
                                    {sub.studentName}
                                  </span>
                                  <span className="text-slate-400 text-[11px]">
                                    ({sub.studentEmail})
                                  </span>
                                </div>
                                <div className="text-slate-500 text-[11px] font-mono">
                                  Arquivo: {sub.fileName} ({sub.fileSize}) · Entregue em{' '}
                                  {new Date(sub.submittedAt).toLocaleDateString('pt-BR')}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {sub.grade !== undefined ? (
                                  <div className="text-right">
                                    <span className="font-bold text-emerald-700 font-mono text-sm block tabular-nums">
                                      {sub.grade} / {assignment.maxScore}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Avaliado</span>
                                  </div>
                                ) : (
                                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                    Pendente de nota
                                  </span>
                                )}

                                <button
                                  onClick={() => onOpenGradeModal(assignment, sub)}
                                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-semibold transition text-xs"
                                >
                                  {sub.grade !== undefined ? 'Alterar Nota' : 'Avaliar'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
