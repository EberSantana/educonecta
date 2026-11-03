export type MaterialType = 'pdf' | 'slides' | 'video' | 'exercise' | 'code' | 'link';

export interface Course {
  id: string;
  code: string;
  name: string;
  degree: 'Técnico Integrado' | 'Técnico Subsequente' | 'Técnico' | 'Bacharelado' | 'Licenciatura' | 'Tecnologia' | 'Pós-Graduação';
  durationSemesters: number;
  coordinator: string;
  department: string;
  description: string;
  activeStudentsCount: number;
  campus?: string;
  resolution?: string;
  workloadTotalHours?: number;
}

export interface Lesson {
  id: string;
  disciplineId: string;
  courseId: string;
  lessonNumber: number; // e.g. 1, 2, 3...
  title: string;
  bimestre: number; // 1, 2, 3, 4
  summary: string;
  contentDetails?: string[];
  technologies?: string[];
  isEvaluation?: boolean;
  evaluationType?: 'prova' | 'trabalho' | 'recuperacao' | 'projeto' | 'laboratorio';
  durationHours: number;
  status?: 'concluida' | 'em_andamento' | 'prevista';
}

export interface Turma {
  id: string;
  code: string;
  courseId: string;
  disciplineId: string;
  name: string;
  semester: string;
  shift: 'Matutino' | 'Vespertino' | 'Noturno' | 'Integral';
  professorId: string;
  professorName: string;
  room: string;
  schedule: string;
  maxStudents: number;
  enrolledStudentIds: string[];
}

export interface Student {
  id: string;
  matricula: string;
  name: string;
  email: string;
  courseId: string;
  status: 'Ativo' | 'Trancado' | 'Formando' | 'Inativo';
  enrolledTurmaIds: string[];
  phone?: string;
  entryYear: string;
  avatarInitials: string;
}

export interface Material {
  id: string;
  disciplineId: string;
  courseId: string; // explicitly bound to course for course segregation
  lessonId?: string; // linked to specific lesson
  lessonNumber?: number; // e.g. Aula 01, 02...
  module: string;
  title: string;
  description: string;
  type: MaterialType;
  fileSize?: string;
  dateAdded: string;
  externalUrl?: string;
  downloadCount: number;
  contentSnippet?: string;
}

export interface Discipline {
  id: string;
  code: string;
  name: string;
  courseId: string;
  credits: number;
  workloadHours: number; // Carga horária em horas-relógio (ex: 127h, 95h, 63h, 32h)
  workloadLessons?: number; // Carga horária em horas-aula (ex: 152 h/a, 114 h/a, 76 h/a, 38 h/a)
  weeklyHours?: number; // Aulas semanais (ex: 8, 6, 4, 2)
  theoryHours?: number; // Carga horária teórica (h)
  practiceHours?: number; // Carga horária prática (h)
  prerequisites?: string; // Componentes pré-requisitos oficiais
  periodNumber?: number; // 1, 2, 3, 4 (Períodos do PPC)
  semester: string;
  department: string;
  room: string;
  schedule: string;
  description: string;
  syllabus: string;
  color: string;
  studentsCount: number;
  modules: string[];
  lessonsCount?: number;
  objectives?: string;
  bibliography?: {
    basic: string[];
    complementar?: string[];
    complementary?: string[];
  };
}

export interface AnnouncementComment {
  id: string;
  authorName: string;
  authorRole: 'professor' | 'student';
  date: string;
  text: string;
}

export interface Announcement {
  id: string;
  disciplineId: string;
  title: string;
  content: string;
  priority: 'normal' | 'importante' | 'urgente';
  date: string;
  authorName: string;
  authorRole: 'professor';
  pinned: boolean;
  comments: AnnouncementComment[];
}

export interface DiscussionResponse {
  id: string;
  authorName: string;
  authorRole: 'professor' | 'student';
  date: string;
  content: string;
  isOfficialAnswer?: boolean;
}

export interface Discussion {
  id: string;
  disciplineId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: 'student' | 'professor';
  date: string;
  likes: number;
  hasLiked?: boolean;
  status: 'aberta' | 'resolvida';
  tags: string[];
  responses: DiscussionResponse[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
  notes?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface Assignment {
  id: string;
  disciplineId: string;
  title: string;
  description: string;
  module: string;
  dueDate: string;
  maxScore: number;
  weight: number;
  instructions: string;
  rubricCriteria: { criterion: string; points: number }[];
  attachmentName?: string;
  submissions: Submission[];
}

export interface OfficeHour {
  id: string;
  disciplineId?: string;
  dayOfWeek: string;
  time: string;
  location: string;
  virtualRoomUrl: string;
  slotsAvailable: number;
  bookedStudents: string[];
}

export type UserRole = 'professor' | 'student';

export interface Professor {
  id: string;
  name: string;
  email: string;
  siape: string;
  title: 'Especialista' | 'Mestre' | 'Doutor' | 'Pós-Doutor' | 'Graduado';
  department: string;
  campus: string;
  assignedDisciplineIds: string[];
  assignedTurmaIds: string[];
  bio?: string;
  phone?: string;
  room?: string;
  avatarInitials: string;
  googleConnected?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarInitials: string;
  matricula?: string;
  department?: string;
  title?: string;
  courseId?: string;
  enrolledTurmaIds?: string[];
}

