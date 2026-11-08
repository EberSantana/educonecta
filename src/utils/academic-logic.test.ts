import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDisciplineProgress,
  formatDaysRemaining,
  calculateClassAverageGrade,
  filterMaterials,
  filterDiscussions,
  filterTurmasByCourse,
  getEnrolledTurmasForStudent,
  canEnrollInTurma,
  filterMaterialsByCourse,
  filterLessonsByDiscipline,
  getLessonsByBimestre,
  generateLessonsFromDisciplineModules,
  getDisciplineLessonsWithFallback,
  getStudentPendingTasks,
  getStudentNotificationAlerts,
} from './academic-logic';
import { Material, Submission, Discussion, Turma, Lesson, Discipline, Assignment, Course } from '../types';

test('calculateDisciplineProgress calculates correct completion percentage', () => {
  const dummyMaterials: Material[] = [
    {
      id: 'm1',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Módulo 1',
      title: 'Apostila 1',
      description: 'Intro',
      type: 'pdf',
      dateAdded: '2026-10-01',
      downloadCount: 10,
    },
    {
      id: 'm2',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Módulo 1',
      title: 'Slides 1',
      description: 'Slides',
      type: 'slides',
      dateAdded: '2026-10-02',
      downloadCount: 5,
    },
    {
      id: 'm3',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Módulo 2',
      title: 'Vídeo 1',
      description: 'Vídeo aula',
      type: 'video',
      dateAdded: '2026-10-03',
      downloadCount: 15,
    },
    {
      id: 'm4',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Módulo 2',
      title: 'Exercício 1',
      description: 'Lista',
      type: 'exercise',
      dateAdded: '2026-10-04',
      downloadCount: 8,
    },
  ];

  // 0 completed
  assert.equal(calculateDisciplineProgress(dummyMaterials, []), 0);

  // 2 of 4 completed -> 50%
  assert.equal(calculateDisciplineProgress(dummyMaterials, ['m1', 'm3']), 50);

  // 4 of 4 completed -> 100%
  assert.equal(calculateDisciplineProgress(dummyMaterials, ['m1', 'm2', 'm3', 'm4']), 100);

  // Empty materials array returns 0
  assert.equal(calculateDisciplineProgress([], ['m1']), 0);
});

test('calculateClassAverageGrade correctly handles empty, partial, and graded submissions', () => {
  const emptySubmissions: Submission[] = [];
  assert.equal(calculateClassAverageGrade(emptySubmissions), null);

  const ungradedSubmissions: Submission[] = [
    {
      id: 's1',
      assignmentId: 'a1',
      studentId: 'st1',
      studentName: 'Ana',
      studentEmail: 'ana@uni.br',
      submittedAt: '2026-10-15',
    },
  ];
  assert.equal(calculateClassAverageGrade(ungradedSubmissions), null);

  const mixedSubmissions: Submission[] = [
    {
      id: 's1',
      assignmentId: 'a1',
      studentId: 'st1',
      studentName: 'Ana',
      studentEmail: 'ana@uni.br',
      submittedAt: '2026-10-15',
      grade: 9.0,
    },
    {
      id: 's2',
      assignmentId: 'a1',
      studentId: 'st2',
      studentName: 'Bruno',
      studentEmail: 'bruno@uni.br',
      submittedAt: '2026-10-16',
      grade: 7.5,
    },
    {
      id: 's3',
      assignmentId: 'a1',
      studentId: 'st3',
      studentName: 'Carla',
      studentEmail: 'carla@uni.br',
      submittedAt: '2026-10-16',
      // Ungraded yet
    },
  ];
  // Average of 9.0 and 7.5 = 8.25 -> 8.3 or 8.25 rounded to 1 decimal: 8.3
  assert.equal(calculateClassAverageGrade(mixedSubmissions), 8.3);
});

test('filterMaterials accurately filters by query, type, and module', () => {
  const materials: Material[] = [
    {
      id: 'm1',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Árvores Binárias',
      title: 'Slides sobre AVL e Rubro-Negra',
      description: 'Conceitos de balanceamento',
      type: 'slides',
      dateAdded: '2026-10-01',
      downloadCount: 12,
    },
    {
      id: 'm2',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Grafos',
      title: 'Algoritmo de Dijkstra em C++',
      description: 'Implementação prática',
      type: 'code',
      dateAdded: '2026-10-05',
      downloadCount: 30,
    },
    {
      id: 'm3',
      courseId: 'course-tds',
      disciplineId: 'd1',
      module: 'Grafos',
      title: 'Lista de Exercícios: Grafos e Busca',
      description: 'Exercícios preparatórios para a prova',
      type: 'exercise',
      dateAdded: '2026-10-06',
      downloadCount: 45,
    },
  ];

  // Filter by type 'code'
  const codeOnly = filterMaterials(materials, '', 'code', 'all');
  assert.equal(codeOnly.length, 1);
  assert.equal(codeOnly[0].id, 'm2');

  // Filter by module 'Grafos'
  const grafosModule = filterMaterials(materials, '', 'all', 'Grafos');
  assert.equal(grafosModule.length, 2);

  // Search query 'dijkstra'
  const dijkstraSearch = filterMaterials(materials, 'dijkstra', 'all', 'all');
  assert.equal(dijkstraSearch.length, 1);
  assert.equal(dijkstraSearch[0].id, 'm2');
});

test('filterDiscussions properly filters by discipline, status and keyword', () => {
  const discussions: Discussion[] = [
    {
      id: 'disc1',
      disciplineId: 'cc301',
      title: 'Dúvida sobre complexidade de tempo da árvore AVL',
      content: 'Qual o pior caso de rotação dupla?',
      authorName: 'Marcos',
      authorRole: 'student',
      date: '2026-10-20',
      likes: 3,
      status: 'aberta',
      tags: ['AVL', 'Complexidade'],
      responses: [],
    },
    {
      id: 'disc2',
      disciplineId: 'mat102',
      title: 'Como resolver a integral por partes do exercício 4?',
      content: 'Tentei usar u = ln(x) mas empaquei.',
      authorName: 'Camila',
      authorRole: 'student',
      date: '2026-10-21',
      likes: 5,
      status: 'resolvida',
      tags: ['Integrais', 'Lista 2'],
      responses: [
        {
          id: 'resp1',
          authorName: 'Prof. Marcelo',
          authorRole: 'professor',
          date: '2026-10-21',
          content: 'Lembre-se da regra LIATE: logarítmicas têm prioridade para u.',
          isOfficialAnswer: true,
        },
      ],
    },
  ];

  // Filter by discipline mat102
  const matDiscussions = filterDiscussions(discussions, '', 'all', 'mat102');
  assert.equal(matDiscussions.length, 1);
  assert.equal(matDiscussions[0].id, 'disc2');

  // Filter by status 'aberta'
  const openDiscussions = filterDiscussions(discussions, '', 'aberta', 'all');
  assert.equal(openDiscussions.length, 1);
  assert.equal(openDiscussions[0].id, 'disc1');

  // Search by tag
  const searchTag = filterDiscussions(discussions, 'LIATE', 'all', 'all');
  assert.equal(searchTag.length, 0); // Search checks title, content, tags
  const searchTagFound = filterDiscussions(discussions, 'Complexidade', 'all', 'all');
  assert.equal(searchTagFound.length, 1);
});

test('filterTurmasByCourse separates and filters turmas by course correctly', () => {
  const dummyTurmas: Turma[] = [
    {
      id: 't-cc1',
      code: 'CC-01',
      courseId: 'course-cc',
      disciplineId: 'd1',
      name: 'Turma A',
      semester: '2026.2',
      shift: 'Matutino',
      professorId: 'p1',
      professorName: 'Prof. X',
      room: 'Sala 1',
      schedule: 'Seg 10h',
      maxStudents: 30,
      enrolledStudentIds: ['st1'],
    },
    {
      id: 't-es1',
      code: 'ES-01',
      courseId: 'course-es',
      disciplineId: 'd2',
      name: 'Turma B',
      semester: '2026.2',
      shift: 'Noturno',
      professorId: 'p1',
      professorName: 'Prof. X',
      room: 'Sala 2',
      schedule: 'Ter 19h',
      maxStudents: 40,
      enrolledStudentIds: ['st2'],
    },
    {
      id: 't-mat1',
      code: 'MAT-01',
      courseId: 'course-mat',
      disciplineId: 'd3',
      name: 'Turma C',
      semester: '2026.2',
      shift: 'Matutino',
      professorId: 'p1',
      professorName: 'Prof. X',
      room: 'Sala 3',
      schedule: 'Qua 8h',
      maxStudents: 2,
      enrolledStudentIds: ['st1', 'st3'],
    },
  ];

  // Filtering for course-cc returns only CC turmas
  const ccTurmas = filterTurmasByCourse(dummyTurmas, 'course-cc');
  assert.equal(ccTurmas.length, 1);
  assert.equal(ccTurmas[0].id, 't-cc1');

  // Filtering for 'all' returns all turmas
  const allTurmas = filterTurmasByCourse(dummyTurmas, 'all');
  assert.equal(allTurmas.length, 3);

  // Student enrolled turmas
  const st1Turmas = getEnrolledTurmasForStudent(dummyTurmas, ['t-cc1', 't-mat1']);
  assert.equal(st1Turmas.length, 2);

  // canEnrollInTurma checks
  // st1 already enrolled in t-cc1
  const checkAlreadyEnrolled = canEnrollInTurma(dummyTurmas[0], 'st1');
  assert.equal(checkAlreadyEnrolled.allowed, false);

  // t-mat1 has maxStudents: 2 and already has 2 enrolled -> full
  const checkFull = canEnrollInTurma(dummyTurmas[2], 'st4');
  assert.equal(checkFull.allowed, false);
  assert.match(checkFull.reason || '', /capacidade máxima/);

  // t-es1 has room and st1 not enrolled -> allowed
  const checkAllowed = canEnrollInTurma(dummyTurmas[1], 'st1');
  assert.equal(checkAllowed.allowed, true);
});

test('filterMaterialsByCourse segregates study materials strictly by course ID', () => {
  const materials: Material[] = [
    {
      id: 'm-tds-1',
      courseId: 'course-tds',
      disciplineId: 'tds-prog1',
      module: 'Lógica',
      title: 'Apostila JS',
      description: 'Intro',
      type: 'pdf',
      dateAdded: '2026-10-01',
      downloadCount: 10,
    },
    {
      id: 'm-pjd-1',
      courseId: 'course-pjd',
      disciplineId: 'pjd-prog1',
      module: 'Game Loop',
      title: 'Slides Game Loop',
      description: 'Jogos 2D',
      type: 'slides',
      dateAdded: '2026-10-02',
      downloadCount: 15,
    },
    {
      id: 'm-inf-1',
      courseId: 'course-inf',
      disciplineId: 'inf-orgso',
      module: 'Linux',
      title: 'Terminal Bash',
      description: 'Comandos',
      type: 'pdf',
      dateAdded: '2026-10-03',
      downloadCount: 20,
    },
  ];

  // Filtering by course-tds returns only TDS materials
  const tdsMats = filterMaterialsByCourse(materials, 'course-tds');
  assert.equal(tdsMats.length, 1);
  assert.equal(tdsMats[0].id, 'm-tds-1');

  // Filtering by course-pjd returns only PJD materials
  const pjdMats = filterMaterialsByCourse(materials, 'course-pjd');
  assert.equal(pjdMats.length, 1);
  assert.equal(pjdMats[0].id, 'm-pjd-1');

  // Filtering by course-inf returns only INF materials
  const infMats = filterMaterialsByCourse(materials, 'course-inf');
  assert.equal(infMats.length, 1);
  assert.equal(infMats[0].id, 'm-inf-1');

  // Filtering by 'all' returns all materials
  const allMats = filterMaterialsByCourse(materials, 'all');
  assert.equal(allMats.length, 3);
});

test('filterLessonsByDiscipline and getLessonsByBimestre correctly sort and partition lessons', () => {
  const dummyLessons: Lesson[] = [
    {
      id: 'l3',
      disciplineId: 'tds-prog1',
      courseId: 'course-tds',
      lessonNumber: 3,
      bimestre: 1,
      title: 'Aula 03: Prática em Laboratório',
      summary: 'Lab',
      durationHours: 2,
    },
    {
      id: 'l1',
      disciplineId: 'tds-prog1',
      courseId: 'course-tds',
      lessonNumber: 1,
      bimestre: 1,
      title: 'Aula 01: Introdução',
      summary: 'Intro',
      durationHours: 2,
    },
    {
      id: 'l10',
      disciplineId: 'tds-prog1',
      courseId: 'course-tds',
      lessonNumber: 10,
      bimestre: 2,
      title: 'Aula 10: Laços de Repetição',
      summary: 'While loops',
      durationHours: 2,
    },
    {
      id: 'l-web-1',
      disciplineId: 'tds-web1',
      courseId: 'course-tds',
      lessonNumber: 1,
      bimestre: 1,
      title: 'Aula 01: Web e HTTP',
      summary: 'HTML',
      durationHours: 2,
    },
  ];

  // filterLessonsByDiscipline returns lessons for tds-prog1 sorted by lessonNumber
  const progLessons = filterLessonsByDiscipline(dummyLessons, 'tds-prog1');
  assert.equal(progLessons.length, 3);
  assert.equal(progLessons[0].lessonNumber, 1);
  assert.equal(progLessons[1].lessonNumber, 3);
  assert.equal(progLessons[2].lessonNumber, 10);

  // getLessonsByBimestre for 1º Bimestre
  const b1Lessons = getLessonsByBimestre(progLessons, 1);
  assert.equal(b1Lessons.length, 2);

  // getLessonsByBimestre for 2º Bimestre
  const b2Lessons = getLessonsByBimestre(progLessons, 2);
  assert.equal(b2Lessons.length, 1);
  assert.equal(b2Lessons[0].id, 'l10');
});

test('parseSheetRowsToProfessors correctly extracts and maps professors from spreadsheet rows', async () => {
  const { parseSheetRowsToProfessors, extractSpreadsheetId } = await import('../services/googleSheets.js');
  
  // Test spreadsheet ID extractor
  const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
  assert.equal(extractSpreadsheetId(url), '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  assert.equal(extractSpreadsheetId('bare-id-12345'), 'bare-id-12345');

  const dummyDisciplines: any[] = [
    { id: 'tds-prog1', code: 'TDS101', name: 'Programação 1' },
    { id: 'tds-sites1', code: 'TDS102', name: 'Construção de Sites 1' },
  ];
  const dummyTurmas: any[] = [
    { id: 'turma-tds-1a', code: 'TDS-1A', name: 'Turma TDS 1º Ano' },
  ];

  const sampleRows = [
    ['SIAPE', 'Nome Completo', 'Email Institucional', 'Titulação', 'Disciplinas Ministradas', 'Turmas'],
    ['1984210', 'Prof. Eber Santana', 'eberss@gmail.com', 'Mestre', 'TDS101', 'TDS-1A'],
    ['2104592', 'Profª. Camila Rodrigues', 'camila.rodrigues@ifs.edu.br', 'Doutora', 'TDS102', 'TDS-1A'],
  ];

  const { professors, warnings } = parseSheetRowsToProfessors(sampleRows, dummyDisciplines, dummyTurmas);
  assert.equal(professors.length, 2);
  assert.equal(professors[0].name, 'Prof. Eber Santana');
  assert.equal(professors[0].siape, '1984210');
  assert.equal(professors[0].title, 'Mestre');
  assert.deepEqual(professors[0].assignedDisciplineIds, ['tds-prog1']);
  assert.deepEqual(professors[0].assignedTurmaIds, ['turma-tds-1a']);

  assert.equal(professors[1].name, 'Profª. Camila Rodrigues');
  assert.equal(professors[1].title, 'Doutor');
  assert.deepEqual(professors[1].assignedDisciplineIds, ['tds-sites1']);
});

test('getDisciplineLessonsWithFallback provides complete PPC schedule when discipline has 0 manual lessons', () => {
  const dummyDiscipline: Discipline = {
    id: 'tds-sites1',
    code: 'TDS102',
    name: 'Construção de Sites 1',
    courseId: 'course-tds',
    credits: 2,
    room: 'Lab 02',
    schedule: 'Quartas, 07:30',
    color: '#06b6d4',
    studentsCount: 38,
    workloadHours: 67,
    workloadLessons: 80,
    semester: '1º Ano',
    periodNumber: 1,
    department: 'COINF',
    description: 'HTML e CSS',
    syllabus: 'Layout estático, HTML5 e CSS3',
    modules: [
      'Estrutura Semântica HTML5',
      'Hiperlinks, Mídias e Formulários',
      'Estilização com CSS3 e Box Model',
      'Web Design e Publicação',
    ],
    lessonsCount: 16,
  };

  // With empty lessons array, fallback generates 16 structured lessons across 4 bimestres
  const fallbackSchedule = getDisciplineLessonsWithFallback([], dummyDiscipline);
  assert.equal(fallbackSchedule.length, 16);
  assert.equal(fallbackSchedule[0].lessonNumber, 1);
  assert.equal(fallbackSchedule[0].bimestre, 1);
  assert.equal(fallbackSchedule[fallbackSchedule.length - 1].lessonNumber, 16);
  assert.equal(fallbackSchedule[fallbackSchedule.length - 1].bimestre, 4);

  // When explicit lessons exist, it respects the existing lessons
  const explicitLesson: Lesson = {
    id: 'les-custom-1',
    disciplineId: 'tds-sites1',
    courseId: 'course-tds',
    lessonNumber: 1,
    bimestre: 1,
    title: 'Aula Customizada 1',
    summary: 'Resumo',
    durationHours: 2,
  };
  const resultWithExplicit = getDisciplineLessonsWithFallback([explicitLesson], dummyDiscipline);
  assert.equal(resultWithExplicit.length, 1);
  assert.equal(resultWithExplicit[0].id, 'les-custom-1');
});

test('getStudentPendingTasks filters tasks for enrolled turmas and ignores submitted ones', () => {
  const dummyTurmas: Turma[] = [
    {
      id: 'turma-1',
      code: 'T1',
      courseId: 'c1',
      disciplineId: 'disc-prog',
      name: 'Turma Programação',
      semester: '2026.1',
      shift: 'Matutino',
      professorId: 'p1',
      professorName: 'Prof. Eber',
      room: 'Lab 1',
      schedule: 'Seg',
      maxStudents: 30,
      enrolledStudentIds: ['student-1'],
    },
    {
      id: 'turma-2',
      code: 'T2',
      courseId: 'c1',
      disciplineId: 'disc-redes',
      name: 'Turma Redes',
      semester: '2026.1',
      shift: 'Matutino',
      professorId: 'p1',
      professorName: 'Prof. Eber',
      room: 'Lab 2',
      schedule: 'Ter',
      maxStudents: 30,
      enrolledStudentIds: ['student-2'], // student-1 is NOT here
    },
  ];

  // 3 assignments:
  // 1: disc-prog, due in 2 days, not submitted -> should be included
  // 2: disc-prog, due in 5 days, submitted by student-1 -> should be filtered out
  // 3: disc-redes, due in 1 day, student-1 not enrolled -> should be filtered out
  const today = new Date();
  const in2Days = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const in5Days = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const in1Day = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();

  const dummyAssignments: Assignment[] = [
    {
      id: 'a1',
      disciplineId: 'disc-prog',
      title: 'Lista de Exercícios Java',
      description: 'Desc 1',
      module: 'Mod 1',
      dueDate: in2Days,
      maxScore: 10,
      weight: 10,
      instructions: 'Inst',
      rubricCriteria: [],
      submissions: [],
    },
    {
      id: 'a2',
      disciplineId: 'disc-prog',
      title: 'Projeto Banco de Dados',
      description: 'Desc 2',
      module: 'Mod 2',
      dueDate: in5Days,
      maxScore: 10,
      weight: 20,
      instructions: 'Inst',
      rubricCriteria: [],
      submissions: [
        {
          id: 'sub-1',
          assignmentId: 'a2',
          studentId: 'student-1',
          studentName: 'Aluno 1',
          studentEmail: 'aluno1@ifs.edu.br',
          submittedAt: '2026-11-01',
        },
      ],
    },
    {
      id: 'a3',
      disciplineId: 'disc-redes',
      title: 'Configuração Roteador',
      description: 'Desc 3',
      module: 'Mod 1',
      dueDate: in1Day,
      maxScore: 10,
      weight: 15,
      instructions: 'Inst',
      rubricCriteria: [],
      submissions: [],
    },
  ];

  const studentUser = {
    id: 'student-1',
    enrolledTurmaIds: ['turma-1'],
    courseId: 'c1',
  };

  const pending = getStudentPendingTasks(dummyAssignments, dummyTurmas, studentUser);
  assert.equal(pending.length, 1);
  assert.equal(pending[0].assignment.id, 'a1');
  assert.equal(pending[0].isUrgent, true);
  assert.equal(pending[0].turma?.name, 'Turma Programação');

  // Test getStudentNotificationAlerts
  const dummyDisciplines: Discipline[] = [
    {
      id: 'disc-prog',
      code: 'PROG1',
      name: 'Programação 1',
      courseId: 'c1',
      credits: 4,
      workloadHours: 60,
      semester: '1',
      department: 'COINF',
      room: 'Lab 1',
      schedule: 'Seg',
      description: '',
      syllabus: '',
      color: '#3b82f6',
      studentsCount: 30,
      modules: [],
    },
  ];

  const alertsResult = getStudentNotificationAlerts(
    dummyAssignments,
    dummyTurmas,
    studentUser,
    dummyDisciplines
  );

  assert.equal(alertsResult.urgentCount, 1);
  assert.ok(alertsResult.toastMessage?.includes('Lista de Exercícios Java'));
  assert.ok(alertsResult.toastMessage?.includes('Programação 1'));
  assert.equal(alertsResult.toastType, 'warning');
});

test('generateDisciplinePDF creates valid jsPDF instance with discipline ementa content', async () => {
  const { generateDisciplinePDF } = await import('./pdfGenerator.js');

  const sampleCourse: Course = {
    id: 'course-tds',
    code: 'TDS-INT',
    name: 'Técnico Integrado em Desenvolvimento de Sistemas',
    degree: 'Técnico Integrado',
    durationSemesters: 6,
    coordinator: 'Prof. Eber Santana',
    department: 'COINF',
    description: 'Curso técnico integrado',
    activeStudentsCount: 40,
    resolution: 'Resolução CS/IFS nº 216/2023',
    workloadTotalHours: 3333,
  };

  const sampleDiscipline: Discipline = {
    id: 'tds-prog1',
    code: 'TDS101',
    name: 'Programação 1',
    courseId: 'course-tds',
    credits: 5,
    workloadHours: 167,
    workloadLessons: 200,
    weeklyHours: 5,
    theoryHours: 50,
    practiceHours: 150,
    prerequisites: 'Sem pré-requisito',
    periodNumber: 1,
    semester: '1º Ano',
    department: 'COINF',
    room: 'Lab 01',
    schedule: 'Seg/Ter',
    description: 'Lógica e programação de computadores.',
    syllabus: 'Introdução à Lógica; Algoritmos; Variáveis e Estruturas de Controle; POO.',
    objectives: 'Capacitar o aluno a solucionar problemas com algoritmos e programação.',
    color: '#3b82f6',
    studentsCount: 38,
    modules: ['Algoritmos', 'Condicionais e Loops', 'POO'],
    bibliography: {
      basic: ['DEITEL, Java: como programar. 10 ed. ISBN 9788543004792.'],
      complementar: ['FÉLIX, Programação Orientada a Objetos. ISBN 9788543020174.'],
    },
  };

  const doc = generateDisciplinePDF(sampleDiscipline, sampleCourse);
  assert.ok(doc);
  assert.ok(doc.getNumberOfPages() >= 1);
});

test('generateCourseSyllabusPDF creates valid multi-page document with full matrix and syllabi', async () => {
  const { generateCourseSyllabusPDF } = await import('./pdfGenerator.js');

  const sampleCourse: Course = {
    id: 'course-inf',
    code: 'INF-SUB',
    name: 'Técnico em Informática (Subsequente)',
    degree: 'Técnico Subsequente',
    durationSemesters: 4,
    coordinator: 'Prof. Eber Santana',
    department: 'COINF',
    description: 'Curso pós-médio',
    activeStudentsCount: 60,
    resolution: 'Resolução nº 09/2017/CS/IFS',
    workloadTotalHours: 1203,
  };

  const sampleDisciplines: Discipline[] = [
    {
      id: 'inf-prog1',
      code: 'INF201',
      name: 'Programação de Computadores 1',
      courseId: 'course-inf',
      credits: 4,
      workloadHours: 95,
      workloadLessons: 114,
      semester: '2º Período',
      department: 'COINF',
      room: 'Lab 01',
      schedule: 'Segundas',
      description: 'Lógica e programação.',
      syllabus: 'Lógica estruturada e orientada a objetos.',
      objectives: 'Desenvolver raciocínio algorítmico.',
      color: '#10b981',
      studentsCount: 30,
      modules: ['Lógica', 'Funções'],
    },
  ];

  const doc = generateCourseSyllabusPDF(sampleCourse, sampleDisciplines);
  assert.ok(doc);
  // Capa + 1 página de ementa por disciplina
  assert.ok(doc.getNumberOfPages() >= 2);
});

