import { Material, Submission, Discussion, Turma, Lesson, Discipline, Assignment } from '../types';

/**
 * Calculates percentage of materials completed by a student.
 */
export function calculateDisciplineProgress(
  materials: Material[],
  completedMaterialIds: string[]
): number {
  if (!materials || materials.length === 0) return 0;
  const completedCount = materials.filter((m) =>
    completedMaterialIds.includes(m.id)
  ).length;
  return Math.round((completedCount / materials.length) * 100);
}

/**
 * Formats deadline status and remaining time in Portuguese.
 */
export function formatDaysRemaining(dueDateStr: string): {
  label: string;
  isUrgent: boolean;
  isPast: boolean;
  daysRemaining: number;
} {
  const now = new Date();
  const due = new Date(dueDateStr);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime < 0) {
    const daysAgo = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    return {
      label: daysAgo === 0 ? 'Prazo expirou hoje' : `Encerrado há ${daysAgo} dia(s)`,
      isUrgent: true,
      isPast: true,
      daysRemaining: diffDays,
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Entrega hoje',
      isUrgent: true,
      isPast: false,
      daysRemaining: 0,
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Entrega amanhã',
      isUrgent: true,
      isPast: false,
      daysRemaining: 1,
    };
  }

  return {
    label: `${diffDays} dias restantes`,
    isUrgent: diffDays <= 3,
    isPast: false,
    daysRemaining: diffDays,
  };
}

/**
 * Calculates average grade of graded submissions.
 */
export function calculateClassAverageGrade(submissions: Submission[]): number | null {
  if (!submissions || submissions.length === 0) return null;
  const graded = submissions.filter(
    (s) => typeof s.grade === 'number' && !isNaN(s.grade)
  );
  if (graded.length === 0) return null;
  const sum = graded.reduce((acc, curr) => acc + (curr.grade || 0), 0);
  return Number((sum / graded.length).toFixed(1));
}

/**
 * Filters materials based on search terms, type filter, and module filter.
 */
export function filterMaterials(
  materials: Material[],
  searchQuery: string,
  typeFilter: string,
  moduleFilter: string
): Material[] {
  const cleanQuery = searchQuery.trim().toLowerCase();

  return materials.filter((item) => {
    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }
    // Module filter
    if (moduleFilter !== 'all' && item.module !== moduleFilter) {
      return false;
    }
    // Search query
    if (cleanQuery) {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description.toLowerCase().includes(cleanQuery);
      const matchModule = item.module.toLowerCase().includes(cleanQuery);
      return matchTitle || matchDesc || matchModule;
    }
    return true;
  });
}

/**
 * Filters discussions based on search, status and discipline.
 */
export function filterDiscussions(
  discussions: Discussion[],
  query: string,
  statusFilter: 'all' | 'aberta' | 'resolvida',
  disciplineId: string
): Discussion[] {
  const cleanQuery = query.trim().toLowerCase();

  return discussions.filter((item) => {
    if (disciplineId !== 'all' && item.disciplineId !== disciplineId) {
      return false;
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (cleanQuery) {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchContent = item.content.toLowerCase().includes(cleanQuery);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      return matchTitle || matchContent || matchTag;
    }
    return true;
  });
}

/**
 * Filters turmas by a specific course ID or returns all if 'all'.
 */
export function filterTurmasByCourse(turmas: Turma[], courseId: string): Turma[] {
  if (!turmas) return [];
  if (!courseId || courseId === 'all') return turmas;
  return turmas.filter((t) => t.courseId === courseId);
}

/**
 * Returns the turmas in which a student is enrolled.
 */
export function getEnrolledTurmasForStudent(
  turmas: Turma[],
  enrolledTurmaIds: string[] = []
): Turma[] {
  if (!turmas || !enrolledTurmaIds) return [];
  return turmas.filter((t) => enrolledTurmaIds.includes(t.id));
}

/**
 * Validates if a student can enroll in a given turma (e.g. check max capacity).
 */
export function canEnrollInTurma(
  turma: Turma,
  studentId: string
): { allowed: boolean; reason?: string } {
  if (!turma) {
    return { allowed: false, reason: 'Turma inexistente.' };
  }
  if (turma.enrolledStudentIds.includes(studentId)) {
    return { allowed: false, reason: 'Aluno já matriculado nesta turma.' };
  }
  if (turma.enrolledStudentIds.length >= turma.maxStudents) {
    return { allowed: false, reason: 'A turma já atingiu a capacidade máxima de vagas.' };
  }
  return { allowed: true };
}

/**
 * Segregates materials strictly by course ID (or returns all if courseId === 'all').
 */
export function filterMaterialsByCourse(
  materials: Material[],
  courseId: string
): Material[] {
  if (!materials) return [];
  if (!courseId || courseId === 'all') return materials;
  return materials.filter((m) => m.courseId === courseId);
}

/**
 * Filters lessons for a given discipline sorted by lessonNumber.
 */
export function filterLessonsByDiscipline(
  lessons: Lesson[],
  disciplineId: string
): Lesson[] {
  if (!lessons) return [];
  if (!disciplineId || disciplineId === 'all') {
    return [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber);
  }
  return lessons
    .filter((l) => l.disciplineId === disciplineId)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
}

/**
 * Filters lessons by bimestre (1, 2, 3, or 4).
 */
export function getLessonsByBimestre(
  lessons: Lesson[],
  bimestre: number
): Lesson[] {
  if (!lessons) return [];
  return lessons.filter((l) => l.bimestre === bimestre);
}

/**
 * Generates structured official lessons according to the discipline's modules and syllabus
 * so that no discipline in the PPC ever displays 0 lessons in its timeline.
 */
export function generateLessonsFromDisciplineModules(
  discipline: Discipline,
  courseId?: string
): Lesson[] {
  if (!discipline) return [];

  const modules =
    discipline.modules && discipline.modules.length > 0
      ? discipline.modules
      : [
          'Fundamentos e Introdução à Ementa',
          'Desenvolvimento Teórico e Aplicações Práticas',
          'Aprofundamento de Conceitos e Laboratório',
          'Projeto Integrador e Avaliação Final',
        ];

  const totalLessons =
    discipline.lessonsCount && discipline.lessonsCount > 0
      ? discipline.lessonsCount
      : Math.max(12, Math.round(discipline.workloadHours / 4));

  const lessonsPerModule = Math.max(2, Math.floor(totalLessons / modules.length));
  const generated: Lesson[] = [];
  let currentLessonNumber = 1;

  modules.forEach((moduleName, modIdx) => {
    // 4 bimestres across the modules
    const bimestre = Math.min(4, Math.floor((modIdx / modules.length) * 4) + 1);

    for (let i = 0; i < lessonsPerModule; i++) {
      const isLastInModule = i === lessonsPerModule - 1;
      const isEvaluation =
        isLastInModule && (modIdx % 2 === 1 || modIdx === modules.length - 1);

      const title = isEvaluation
        ? `Aula ${String(currentLessonNumber).padStart(2, '0')}: Avaliação Oficial: ${
            modIdx === modules.length - 1 ? 'Projeto Prático Final' : `Módulo ${modIdx + 1}`
          } (${moduleName})`
        : `Aula ${String(currentLessonNumber).padStart(2, '0')}: ${moduleName} - Tópico ${i + 1}`;

      generated.push({
        id: `gen-${discipline.id}-${currentLessonNumber}`,
        disciplineId: discipline.id,
        courseId: courseId || discipline.courseId,
        lessonNumber: currentLessonNumber,
        bimestre,
        title,
        summary: `Planejamento de aula pedagógica oficial do PPC para o tópico: ${moduleName}.`,
        contentDetails: [
          `Estudo detalhado do módulo ${moduleName}`,
          `Atividades teóricas e práticas em laboratório da COINF`,
          isEvaluation
            ? 'Instrumento de avaliação oficial de competências da COINF'
            : 'Exercícios práticos e fixação de conteúdo didático',
        ],
        technologies: [discipline.code, 'PPC COINF'],
        durationHours: Math.max(2, Math.round(discipline.workloadHours / totalLessons)),
        status:
          currentLessonNumber <= 3
            ? 'concluida'
            : currentLessonNumber === 4
            ? 'em_andamento'
            : 'prevista',
        isEvaluation,
        evaluationType: isEvaluation
          ? modIdx === modules.length - 1
            ? 'projeto'
            : 'prova'
          : undefined,
      });

      currentLessonNumber++;
    }
  });

  return generated;
}

/**
 * Returns explicit lessons if available for the discipline; otherwise generates
 * the official PPC timeline so the schedule is never empty (prevents "0 de 0 aulas").
 */
export function getDisciplineLessonsWithFallback(
  allLessons: Lesson[],
  discipline: Discipline,
  courseId?: string
): Lesson[] {
  if (!discipline) return [];
  const existing = filterLessonsByDiscipline(allLessons, discipline.id);
  if (existing.length > 0) {
    return existing;
  }
  return generateLessonsFromDisciplineModules(discipline, courseId);
}

export interface StudentTaskAlert {
  assignment: Assignment;
  turma?: Turma;
  disciplineId: string;
  daysRemaining: number;
  label: string;
  isUrgent: boolean;
  isPast: boolean;
  type: 'upcoming_deadline' | 'new_task';
}

/**
 * Returns turmas the student is enrolled in.
 */
export function getStudentEnrolledTurmas(
  turmas: Turma[],
  studentUser: { id: string; enrolledTurmaIds?: string[] }
): Turma[] {
  if (!turmas || !studentUser) return [];
  const userEnrolledIds = studentUser.enrolledTurmaIds || [];
  return turmas.filter(
    (t) =>
      userEnrolledIds.includes(t.id) ||
      (t.enrolledStudentIds && t.enrolledStudentIds.includes(studentUser.id))
  );
}

/**
 * Identifies assignments relevant for the student's enrolled turmas that have not been submitted yet.
 */
export function getStudentPendingTasks(
  assignments: Assignment[],
  turmas: Turma[],
  studentUser: { id: string; enrolledTurmaIds?: string[]; courseId?: string }
): StudentTaskAlert[] {
  if (!assignments || !studentUser) return [];
  const enrolledTurmas = getStudentEnrolledTurmas(turmas, studentUser);
  const enrolledDisciplineIds = new Set(enrolledTurmas.map((t) => t.disciplineId));

  const pending: StudentTaskAlert[] = [];

  for (const assign of assignments) {
    // If student has enrolled turmas, check if assignment matches one of their turma's disciplines
    const matchingTurma = enrolledTurmas.find((t) => t.disciplineId === assign.disciplineId);
    const isEnrolledDiscipline = enrolledDisciplineIds.has(assign.disciplineId);

    // Only consider assignments belonging to the student's enrolled turmas or enrolled course
    if (!isEnrolledDiscipline && enrolledTurmas.length > 0) {
      continue;
    }

    // Check if student has already submitted
    const isSubmitted = assign.submissions?.some((s: Submission) => s.studentId === studentUser.id);
    if (isSubmitted) {
      continue;
    }

    const remaining = formatDaysRemaining(assign.dueDate);
    pending.push({
      assignment: assign,
      turma: matchingTurma,
      disciplineId: assign.disciplineId,
      daysRemaining: remaining.daysRemaining,
      label: remaining.label,
      isUrgent: remaining.isUrgent,
      isPast: remaining.isPast,
      type: remaining.isUrgent ? 'upcoming_deadline' : 'new_task',
    });
  }

  // Sort by urgency: upcoming deadlines closest to expiring first
  return pending.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Generates alert messages and toast data for approaching deadlines or newly assigned tasks for enrolled turmas.
 */
export function getStudentNotificationAlerts(
  assignments: Assignment[],
  turmas: Turma[],
  studentUser: { id: string; enrolledTurmaIds?: string[]; courseId?: string },
  disciplines: Discipline[],
  options?: { maxDaysForUpcoming?: number }
): {
  alerts: StudentTaskAlert[];
  urgentCount: number;
  toastMessage?: string;
  toastType?: 'warning' | 'urgent' | 'info';
} {
  const maxDays = options?.maxDaysForUpcoming ?? 3;
  const pending = getStudentPendingTasks(assignments, turmas, studentUser);

  // Urgent: overdue or deadline within maxDays
  const urgent = pending.filter((p) => p.isPast || p.daysRemaining <= maxDays);

  if (urgent.length === 0 && pending.length === 0) {
    return { alerts: [], urgentCount: 0 };
  }

  // Determine top alert
  const top = urgent[0] || pending[0];
  const disc = disciplines.find((d) => d.id === top.disciplineId);
  const discName = disc ? disc.name : 'sua turma';
  const turmaName = top.turma ? ` (${top.turma.name})` : '';

  let message = '';
  let toastType: 'warning' | 'urgent' | 'info' = 'info';

  if (top.isPast) {
    message = `⚠️ Prazo expirado: Atividade "${top.assignment.title}" em ${discName}${turmaName} encerrou (${top.label.toLowerCase()}).`;
    toastType = 'urgent';
  } else if (top.daysRemaining === 0) {
    message = `🚨 Prazo Próximo: Atividade "${top.assignment.title}" em ${discName}${turmaName} vence HOJE!`;
    toastType = 'urgent';
  } else if (top.daysRemaining === 1) {
    message = `⏰ Prazo Próximo: Atividade "${top.assignment.title}" em ${discName}${turmaName} vence AMANHÃ!`;
    toastType = 'warning';
  } else if (top.daysRemaining <= maxDays) {
    message = `🔔 Prazo Próximo: Atividade "${top.assignment.title}" em ${discName}${turmaName} vence em ${top.daysRemaining} dias.`;
    toastType = 'warning';
  } else {
    message = `📝 Nova Tarefa: "${top.assignment.title}" disponível para entrega em ${discName}${turmaName}.`;
    toastType = 'info';
  }

  if (urgent.length > 1) {
    message += ` (+${urgent.length - 1} outra${urgent.length > 2 ? 's' : ''} pendência${urgent.length > 2 ? 's' : ''})`;
  }

  return {
    alerts: pending,
    urgentCount: urgent.length,
    toastMessage: message,
    toastType,
  };
}
