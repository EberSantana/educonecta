import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Clock,
  Bell,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { DisciplineSelector } from './components/DisciplineSelector';
import { CoursesView } from './components/CoursesView';
import { TurmasView } from './components/TurmasView';
import { StudentsView } from './components/StudentsView';
import { DisciplinesView } from './components/DisciplinesView';
import { MaterialsView } from './components/MaterialsView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { DiscussionsView } from './components/DiscussionsView';
import { AssignmentsView } from './components/AssignmentsView';
import { OfficeHoursView } from './components/OfficeHoursView';
import { MaterialModal } from './components/MaterialModal';
import { AddMaterialModal } from './components/AddMaterialModal';
import { AddAnnouncementModal } from './components/AddAnnouncementModal';
import { AddDiscussionModal } from './components/AddDiscussionModal';
import { AddDisciplineModal } from './components/AddDisciplineModal';
import { AddAssignmentModal } from './components/AddAssignmentModal';
import { SubmissionModal } from './components/SubmissionModal';
import { GradeSubmissionModal } from './components/GradeSubmissionModal';
import { ProfessorsView } from './components/ProfessorsView';
import { EditProfessorModal } from './components/EditProfessorModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { EditDisciplineModal } from './components/EditDisciplineModal';
import { EditTurmaModal } from './components/EditTurmaModal';
import { EditMaterialModal } from './components/EditMaterialModal';
import { StorageInfoModal } from './components/StorageInfoModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { LessonsScheduleModal } from './components/LessonsScheduleModal';
import {
  getStudentNotificationAlerts,
  getStudentPendingTasks,
} from './utils/academic-logic';

import {
  initialCourses,
  initialTurmas,
  initialStudents,
  initialProfessors,
  initialDisciplines,
  initialLessons,
  initialMaterials,
  initialAnnouncements,
  initialDiscussions,
  initialAssignments,
  initialOfficeHours,
  initialUsers,
  initialProfessor,
  initialStudent,
} from './data/initialData';

import {
  Course,
  Turma,
  Student,
  Professor,
  Discipline,
  Lesson,
  Material,
  Announcement,
  Discussion,
  Assignment,
  Submission,
  OfficeHour,
  UserRole,
  UserProfile,
} from './types';

export default function App() {
  // Ensure migration to official IFS Campus Tobias Barreto PPCs (Resolução nº 09/2017/CS/IFS e Resolução CS/IFS nº 216/2023 - TDS Integrado)
  if (typeof window !== 'undefined' && localStorage.getItem('edu_ifs_tobias_v8_tds_inf') !== 'true') {
    try {
      localStorage.clear();
      localStorage.setItem('edu_ifs_tobias_v8_tds_inf', 'true');
    } catch (e) {}
  }

  // --- Persistent State from localStorage ---
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edu_courses');
    if (!saved) return initialCourses;
    try {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.some((c: Course) => c.id === 'course-tds') &&
        parsed.some((c: Course) => c.id === 'course-inf')
      ) {
        return parsed;
      }
    } catch (e) {}
    return initialCourses;
  });

  const [turmas, setTurmas] = useState<Turma[]>(() => {
    const saved = localStorage.getItem('edu_turmas');
    if (!saved) return initialTurmas;
    try {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.some((t: Turma) => t.courseId === 'course-tds') &&
        parsed.some((t: Turma) => t.courseId === 'course-inf')
      ) {
        return parsed;
      }
    } catch (e) {}
    return initialTurmas;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edu_students');
    if (!saved) return initialStudents;
    try {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.some((s: Student) => s.courseId === 'course-tds') &&
        parsed.some((s: Student) => s.courseId === 'course-inf')
      ) {
        return parsed;
      }
    } catch (e) {}
    return initialStudents;
  });

  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('edu_professors');
    if (!saved) return initialProfessors;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some((p: Professor) => p.id === 'prof-eber')) {
        return parsed;
      }
    } catch (e) {}
    return initialProfessors;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('edu_users');
    if (!saved) return initialUsers;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some((u: UserProfile) => u.id === 'prof-eber')) {
        return parsed;
      }
    } catch (e) {}
    return initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edu_current_user');
    if (!saved) return initialProfessor;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.id === 'prof-eber' || parsed.courseId === 'course-inf' || parsed.courseId === 'course-tds')) {
        return parsed;
      }
    } catch (e) {}
    return initialProfessor;
  });

  const [disciplines, setDisciplines] = useState<Discipline[]>(() => {
    const saved = localStorage.getItem('edu_disciplines');
    if (!saved) return initialDisciplines;
    try {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.some((d: Discipline) => d.id === 'tds-prog1') &&
        parsed.some((d: Discipline) => d.id === 'inf-prog1')
      ) {
        return parsed;
      }
    } catch (e) {}
    return initialDisciplines;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('edu_lessons');
    if (!saved) return initialLessons;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
    return initialLessons;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('edu_materials');
    if (!saved) return initialMaterials;
    try {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.some((m: Material) => m.id === 'mat-tds101-slides') &&
        parsed.some((m: Material) => m.id === 'mat-inf101-apostila')
      ) {
        return parsed;
      }
    } catch (e) {}
    return initialMaterials;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('edu_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = localStorage.getItem('edu_discussions');
    return saved ? JSON.parse(saved) : initialDiscussions;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('edu_assignments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((a: Assignment) => a.id));
          const missing = initialAssignments.filter((a) => !existingIds.has(a.id));
          if (missing.length > 0) {
            return [...parsed, ...missing];
          }
          return parsed;
        }
      } catch (e) {}
    }
    return initialAssignments;
  });

  const [officeHours, setOfficeHours] = useState<OfficeHour[]>(() => {
    const saved = localStorage.getItem('edu_office_hours');
    return saved ? JSON.parse(saved) : initialOfficeHours;
  });

  const [completedMaterialIds, setCompletedMaterialIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('edu_completed_materials');
    return saved ? JSON.parse(saved) : ['mat-inf101-apostila'];
  });

  // UI Navigation - Default to disciplines
  const [currentTab, setCurrentTab] = useState<string>('disciplines');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('all');
  const [selectedLessonFilter, setSelectedLessonFilter] = useState<number | null>(null);

  // Synchronize student's course and turma into active filter upon login
  useEffect(() => {
    if (currentUser?.courseId) {
      setSelectedCourseId(currentUser.courseId);
    }
    if (currentUser?.enrolledTurmaIds && currentUser.enrolledTurmaIds.length > 0) {
      setSelectedTurmaId(currentUser.enrolledTurmaIds[0]);
    }
  }, [currentUser]);

  // Modals state
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isAddDiscussionOpen, setIsAddDiscussionOpen] = useState(false);
  const [isAddDisciplineOpen, setIsAddDisciplineOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [submissionAssignment, setSubmissionAssignment] = useState<Assignment | null>(null);
  const [gradeModalData, setGradeModalData] = useState<{
    assignment: Assignment;
    submission: Submission;
  } | null>(null);

  // Professor & Google Sheets Modals
  const [isEditProfessorOpen, setIsEditProfessorOpen] = useState(false);
  const [selectedProfessorForEdit, setSelectedProfessorForEdit] = useState<Professor | null>(null);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);

  // Edit Modals (Discipline, Turma, Material) & Storage Info Modal
  const [isEditDisciplineOpen, setIsEditDisciplineOpen] = useState(false);
  const [selectedDisciplineForEdit, setSelectedDisciplineForEdit] = useState<Discipline | null>(null);

  const [isEditTurmaOpen, setIsEditTurmaOpen] = useState(false);
  const [selectedTurmaForEdit, setSelectedTurmaForEdit] = useState<Turma | null>(null);

  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [selectedMaterialForEdit, setSelectedMaterialForEdit] = useState<Material | null>(null);

  const [isStorageInfoOpen, setIsStorageInfoOpen] = useState(false);

  // Accessibility & e-MAG / WCAG 2.1 AA States
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('edu_high_contrast') === 'true';
  });
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    const saved = localStorage.getItem('edu_font_size');
    return saved === 'large' || saved === 'xlarge' ? saved : 'normal';
  });

  // Apply high contrast & font sizing classes to document.body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('edu_high_contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSize === 'large') {
      document.body.classList.add('font-size-large');
    } else if (fontSize === 'xlarge') {
      document.body.classList.add('font-size-xlarge');
    }
    localStorage.setItem('edu_font_size', fontSize);
  }, [fontSize]);

  // Global e-MAG / WCAG AccessKey shortcuts (Alt+1, Alt+2, Alt+3, Alt+4)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          const mainContent = document.getElementById('conteudo-principal');
          mainContent?.focus();
          mainContent?.scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === '2') {
          e.preventDefault();
          const navElement = document.getElementById('nav-principal');
          navElement?.scrollIntoView({ behavior: 'smooth' });
          const firstNavBtn = navElement?.querySelector('button');
          firstNavBtn?.focus();
        } else if (e.key === '3') {
          e.preventDefault();
          setIsAccessibilityModalOpen(true);
        } else if (e.key === '4') {
          e.preventDefault();
          setHighContrast((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  // Sistema de Notificações & Feedback Toast (WCAG 2.1 AA)
  const [activeToast, setActiveToast] = useState<{
    message: string;
    type?: 'success' | 'warning' | 'urgent' | 'info';
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    toast:
      | string
      | {
          message: string;
          type?: 'success' | 'warning' | 'urgent' | 'info';
          actionLabel?: string;
          onAction?: () => void;
        },
    duration = 4500
  ) => {
    if (typeof toast === 'string') {
      setActiveToast({ message: toast, type: 'success' });
    } else {
      setActiveToast(toast);
    }
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setActiveToast(null);
    }, duration);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setActiveToast(null);
  };

  // Tarefas pendentes e prazos próximos para alunos matriculados
  const studentPendingAlerts =
    currentUser?.role === 'student'
      ? getStudentPendingTasks(assignments, turmas, currentUser)
      : [];
  const pendingAssignmentsCount = studentPendingAlerts.filter(
    (a) => a.isUrgent || a.daysRemaining <= 7
  ).length;

  // Disparo automático de alerta de tarefas e prazos ao acessar como estudante
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') return;

    const timer = setTimeout(() => {
      const { alerts, toastMessage, toastType } = getStudentNotificationAlerts(
        assignments,
        turmas,
        currentUser,
        disciplines
      );

      if (toastMessage && alerts.length > 0) {
        const topAlert = alerts[0];
        const sessionKey = `notified_task_${currentUser.id}_${topAlert.assignment.id}_${topAlert.daysRemaining}`;
        const hasNotified = sessionStorage.getItem(sessionKey);

        if (!hasNotified) {
          sessionStorage.setItem(sessionKey, 'true');
          showToast(
            {
              message: toastMessage,
              type: toastType || 'warning',
              actionLabel: 'Ver Tarefas',
              onAction: () => {
                setCurrentTab('assignments');
                if (topAlert.disciplineId) {
                  setSelectedDisciplineId(topAlert.disciplineId);
                }
              },
            },
            7000
          );
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser?.id, currentUser?.role, currentUser?.enrolledTurmaIds, assignments]);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('edu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edu_professors', JSON.stringify(professors));
  }, [professors]);

  useEffect(() => {
    localStorage.setItem('edu_turmas', JSON.stringify(turmas));
  }, [turmas]);

  useEffect(() => {
    localStorage.setItem('edu_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edu_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('edu_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('edu_disciplines', JSON.stringify(disciplines));
  }, [disciplines]);

  useEffect(() => {
    localStorage.setItem('edu_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('edu_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('edu_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('edu_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('edu_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('edu_office_hours', JSON.stringify(officeHours));
  }, [officeHours]);

  useEffect(() => {
    localStorage.setItem('edu_completed_materials', JSON.stringify(completedMaterialIds));
  }, [completedMaterialIds]);

  const handleToggleLessonStatus = (lessonId: string, newStatus: string) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? { ...l, status: newStatus as 'concluida' | 'em_andamento' | 'prevista' }
          : l
      )
    );
    showToast('Status da aula atualizado com sucesso!');
  };

  // Auth Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'professor') {
      setCurrentTab('courses');
    } else {
      setCurrentTab('disciplines');
    }
    showToast(`Bem-vindo(a), ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Você saiu do sistema.');
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    setUsers([...users, newUser]);
    if (newUser.role === 'student') {
      const newStudentEntry: Student = {
        id: newUser.id,
        matricula: newUser.matricula || `2026${Math.floor(1000 + Math.random() * 9000)}`,
        name: newUser.name,
        email: newUser.email,
        courseId: newUser.courseId || courses[0]?.id || '',
        status: 'Ativo',
        enrolledTurmaIds: newUser.enrolledTurmaIds || [],
        entryYear: '2026',
        avatarInitials: newUser.avatarInitials,
      };
      setStudents([...students, newStudentEntry]);

      // Automatically enroll student in their chosen turma
      if (newUser.enrolledTurmaIds && newUser.enrolledTurmaIds.length > 0) {
        setTurmas((prevTurmas) =>
          prevTurmas.map((t) =>
            newUser.enrolledTurmaIds!.includes(t.id) && !t.enrolledStudentIds.includes(newUser.id)
              ? { ...t, enrolledStudentIds: [...t.enrolledStudentIds, newUser.id] }
              : t
          )
        );
      }
    }
    setCurrentUser(newUser);
    if (newUser.courseId) setSelectedCourseId(newUser.courseId);
    if (newUser.enrolledTurmaIds && newUser.enrolledTurmaIds.length > 0) {
      setSelectedTurmaId(newUser.enrolledTurmaIds[0]);
    }
    setCurrentTab(newUser.role === 'professor' ? 'courses' : 'disciplines');
    showToast(`Cadastro realizado com sucesso! Bem-vindo(a), ${newUser.name}!`);
  };

  const handleToggleRole = () => {
    if (!currentUser) return;
    const targetRole: UserRole = currentUser.role === 'professor' ? 'student' : 'professor';
    const candidate = users.find((u) => u.role === targetRole) || (targetRole === 'professor' ? initialProfessor : initialStudent);
    setCurrentUser(candidate);
    if (candidate.courseId) setSelectedCourseId(candidate.courseId);
    if (candidate.enrolledTurmaIds && candidate.enrolledTurmaIds.length > 0) {
      setSelectedTurmaId(candidate.enrolledTurmaIds[0]);
    } else {
      setSelectedTurmaId('all');
    }
    setCurrentTab(targetRole === 'professor' ? 'courses' : 'disciplines');
    showToast(
      targetRole === 'professor'
        ? `Modo alternado para: Professor (${candidate.name})`
        : `Modo alternado para: Aluno (${candidate.name})`
    );
  };

  // Course Handlers
  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
    showToast(`Curso "${newCourse.name}" cadastrado com sucesso!`);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    showToast('Curso removido.');
  };

  // Turma Handlers
  const handleAddTurma = (newTurma: Turma) => {
    setTurmas([...turmas, newTurma]);
    showToast(`Turma "${newTurma.code}" cadastrada!`);
  };

  const handleDeleteTurma = (turmaId: string) => {
    setTurmas(turmas.filter((t) => t.id !== turmaId));
    showToast('Turma removida.');
  };

  const handleEnrollStudent = (turmaId: string, studentId: string) => {
    setTurmas(
      turmas.map((t) =>
        t.id === turmaId && !t.enrolledStudentIds.includes(studentId)
          ? { ...t, enrolledStudentIds: [...t.enrolledStudentIds, studentId] }
          : t
      )
    );
    setStudents(
      students.map((s) =>
        s.id === studentId && !s.enrolledTurmaIds.includes(turmaId)
          ? { ...s, enrolledTurmaIds: [...s.enrolledTurmaIds, turmaId] }
          : s
      )
    );
    if (currentUser && currentUser.id === studentId) {
      const updated = currentUser.enrolledTurmaIds
        ? [...new Set([...currentUser.enrolledTurmaIds, turmaId])]
        : [turmaId];
      setCurrentUser({
        ...currentUser,
        enrolledTurmaIds: updated,
      });
      setSelectedTurmaId(turmaId);
    }
    showToast('Matrícula na turma confirmada!');
  };

  const handleUnenrollStudent = (turmaId: string, studentId: string) => {
    setTurmas(
      turmas.map((t) =>
        t.id === turmaId
          ? { ...t, enrolledStudentIds: t.enrolledStudentIds.filter((id) => id !== studentId) }
          : t
      )
    );
    setStudents(
      students.map((s) =>
        s.id === studentId
          ? { ...s, enrolledTurmaIds: s.enrolledTurmaIds.filter((id) => id !== turmaId) }
          : s
      )
    );
    if (currentUser && currentUser.id === studentId) {
      const updated = (currentUser.enrolledTurmaIds || []).filter((id) => id !== turmaId);
      setCurrentUser({
        ...currentUser,
        enrolledTurmaIds: updated,
      });
      if (selectedTurmaId === turmaId) {
        setSelectedTurmaId(updated[0] || 'all');
      }
    }
    showToast('Matrícula cancelada na turma.');
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents([...students, newStudent]);
    // Also create corresponding user account for login
    const newUserProfile: UserProfile = {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      password: '123',
      role: 'student',
      avatarInitials: newStudent.avatarInitials,
      matricula: newStudent.matricula,
      courseId: newStudent.courseId,
      enrolledTurmaIds: newStudent.enrolledTurmaIds,
    };
    setUsers([...users, newUserProfile]);

    // Update turmas enrollments if any selected
    if (newStudent.enrolledTurmaIds.length > 0) {
      setTurmas(
        turmas.map((t) =>
          newStudent.enrolledTurmaIds.includes(t.id) && !t.enrolledStudentIds.includes(newStudent.id)
            ? { ...t, enrolledStudentIds: [...t.enrolledStudentIds, newStudent.id] }
            : t
        )
      );
    }

    showToast(`Aluno "${newStudent.name}" cadastrado com sucesso!`);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((s) => s.id !== studentId));
    setUsers(users.filter((u) => u.id !== studentId));
    setTurmas(
      turmas.map((t) => ({
        ...t,
        enrolledStudentIds: t.enrolledStudentIds.filter((id) => id !== studentId),
      }))
    );
    showToast('Aluno removido do diretório.');
  };

  const handleUpdateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
    showToast(`Situação cadastral do aluno atualizada para "${status}".`);
  };

  // Professor Handlers & Google Sheets Sync
  const handleSaveProfessor = (savedProf: Professor) => {
    setProfessors((prev) => {
      const idx = prev.findIndex((p) => p.id === savedProf.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedProf;
        return updated;
      }
      return [savedProf, ...prev];
    });

    // Synchronize with turmas
    setTurmas((prevTurmas) =>
      prevTurmas.map((t) => {
        if (savedProf.assignedTurmaIds.includes(t.id)) {
          return {
            ...t,
            professorId: savedProf.id,
            professorName: savedProf.name,
          };
        }
        return t;
      })
    );

    showToast(`Professor(a) ${savedProf.name} salvo com sucesso!`);
  };

  const handleDeleteProfessor = (profId: string) => {
    const prof = professors.find((p) => p.id === profId);
    setProfessors((prev) => prev.filter((p) => p.id !== profId));
    showToast(`Professor ${prof?.name || ''} removido.`);
  };

  const handleImportProfessors = (imported: Professor[]) => {
    setProfessors((prev) => {
      const merged = [...prev];
      for (const item of imported) {
        const existingIdx = merged.findIndex(
          (p) => p.siape === item.siape || (item.email && p.email === item.email)
        );
        if (existingIdx >= 0) {
          merged[existingIdx] = { ...merged[existingIdx], ...item };
        } else {
          merged.push(item);
        }
      }
      return merged;
    });

    // Sync turmas
    setTurmas((prevTurmas) =>
      prevTurmas.map((t) => {
        const matchingProf = imported.find((p) => p.assignedTurmaIds.includes(t.id));
        if (matchingProf) {
          return {
            ...t,
            professorId: matchingProf.id,
            professorName: matchingProf.name,
          };
        }
        return t;
      })
    );

    showToast(`${imported.length} professores integrados do Google Sheets!`);
  };

  // Discipline & Material Handlers
  const handleAddDiscipline = (newDiscipline: Discipline) => {
    setDisciplines([...disciplines, newDiscipline]);
    setSelectedDisciplineId(newDiscipline.id);
    showToast(`Matéria "${newDiscipline.code} - ${newDiscipline.name}" cadastrada!`);
  };

  const handleSaveEditedDiscipline = (updated: Discipline) => {
    setDisciplines((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showToast(`Disciplina "${updated.name}" atualizada com sucesso!`);
  };

  const handleSaveEditedTurma = (updated: Turma) => {
    setTurmas((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast(`Turma "${updated.name}" atualizada com sucesso!`);
  };

  const handleAddMaterial = (newMaterial: Material) => {
    setMaterials([newMaterial, ...materials]);
    showToast(`Material "${newMaterial.title}" publicado com sucesso!`);
  };

  const handleSaveEditedMaterial = (updated: Material) => {
    setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Material "${updated.title}" atualizado com sucesso!`);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(materials.filter((m) => m.id !== materialId));
    showToast('Material removido.');
  };

  const handleToggleCompleted = (materialId: string) => {
    if (completedMaterialIds.includes(materialId)) {
      setCompletedMaterialIds(completedMaterialIds.filter((id) => id !== materialId));
      showToast('Marcado como não lido.');
    } else {
      setCompletedMaterialIds([...completedMaterialIds, materialId]);
      showToast('Material concluído!');
    }
  };

  const handleDownloadMaterial = (material: Material) => {
    setMaterials(
      materials.map((m) => (m.id === material.id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
    showToast(`Download de "${material.title}" iniciado!`);
  };

  // Announcement Handlers
  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements([newAnnouncement, ...announcements]);
    showToast('Comunicado publicado no mural!');
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== announcementId));
    showToast('Comunicado removido.');
  };

  const handleAddAnnouncementComment = (announcementId: string, text: string) => {
    if (!currentUser) return;
    setAnnouncements(
      announcements.map((a) => {
        if (a.id === announcementId) {
          return {
            ...a,
            comments: [
              ...a.comments,
              {
                id: `comm-${Date.now()}`,
                authorName: currentUser.name,
                authorRole: currentUser.role,
                date: new Date().toISOString().split('T')[0],
                text,
              },
            ],
          };
        }
        return a;
      })
    );
    showToast('Comentário publicado.');
  };

  // Discussion Handlers
  const handleAddDiscussion = (newDiscussion: Discussion) => {
    setDiscussions([newDiscussion, ...discussions]);
    showToast('Dúvida publicada no fórum!');
  };

  const handleLikeDiscussion = (discussionId: string) => {
    setDiscussions(
      discussions.map((d) => {
        if (d.id === discussionId) {
          const hasLiked = !d.hasLiked;
          return {
            ...d,
            hasLiked,
            likes: hasLiked ? d.likes + 1 : Math.max(0, d.likes - 1),
          };
        }
        return d;
      })
    );
  };

  const handleAddDiscussionResponse = (
    discussionId: string,
    content: string,
    isOfficialAnswer = false
  ) => {
    if (!currentUser) return;
    setDiscussions(
      discussions.map((d) => {
        if (d.id === discussionId) {
          return {
            ...d,
            status: isOfficialAnswer ? 'resolvida' : d.status,
            responses: [
              ...d.responses,
              {
                id: `resp-${Date.now()}`,
                authorName: currentUser.name,
                authorRole: currentUser.role,
                date: new Date().toISOString().split('T')[0],
                content,
                isOfficialAnswer,
              },
            ],
          };
        }
        return d;
      })
    );
    showToast(isOfficialAnswer ? 'Resposta oficial publicada!' : 'Resposta publicada no fórum.');
  };

  const handleMarkDiscussionResolved = (discussionId: string) => {
    setDiscussions(
      discussions.map((d) => (d.id === discussionId ? { ...d, status: 'resolvida' } : d))
    );
    showToast('Dúvida marcada como resolvida.');
  };

  // Assignment & Grading Handlers
  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments([newAssignment, ...assignments]);
    const matchingDiscipline = disciplines.find((d) => d.id === newAssignment.disciplineId);
    const discName = matchingDiscipline ? matchingDiscipline.name : 'Disciplina';
    const matchingTurma = turmas.find((t) => t.disciplineId === newAssignment.disciplineId);
    const turmaName = matchingTurma ? ` para ${matchingTurma.name}` : '';

    showToast({
      message: `Nova atividade "${newAssignment.title}" cadastrada${turmaName}! Alunos matriculados receberão alertas de prazo.`,
      type: 'success',
      actionLabel: 'Ver Lista',
      onAction: () => setCurrentTab('assignments'),
    });
  };

  const handleSubmitAssignment = (newSubmission: Submission) => {
    setAssignments(
      assignments.map((a) => {
        if (a.id === newSubmission.assignmentId) {
          const existingIndex = a.submissions.findIndex((s) => s.studentId === newSubmission.studentId);
          let updated = [...a.submissions];
          if (existingIndex >= 0) {
            updated[existingIndex] = newSubmission;
          } else {
            updated.push(newSubmission);
          }
          return { ...a, submissions: updated };
        }
        return a;
      })
    );
    showToast('Trabalho acadêmico enviado com sucesso!');
  };

  const handleGradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    if (!gradeModalData) return;
    setAssignments(
      assignments.map((a) => {
        if (a.id === gradeModalData.assignment.id) {
          return {
            ...a,
            submissions: a.submissions.map((s) =>
              s.id === submissionId
                ? { ...s, grade, feedback, gradedAt: new Date().toISOString() }
                : s
            ),
          };
        }
        return a;
      })
    );
    showToast(`Nota ${grade} e feedback salvos com sucesso.`);
  };

  // Office hours slot booking
  const handleBookSlot = (officeHourId: string, studentName: string) => {
    setOfficeHours(
      officeHours.map((h) =>
        h.id === officeHourId && !h.bookedStudents.includes(studentName)
          ? { ...h, bookedStudents: [...h.bookedStudents, studentName] }
          : h
      )
    );
    showToast('Horário agendado com sucesso!');
  };

  const handleCancelSlot = (officeHourId: string, studentName: string) => {
    setOfficeHours(
      officeHours.map((h) =>
        h.id === officeHourId
          ? { ...h, bookedStudents: h.bookedStudents.filter((n) => n !== studentName) }
          : h
      )
    );
    showToast('Agendamento cancelado.');
  };

  // If not logged in, render the AuthScreen
  if (!currentUser) {
    return (
      <AuthScreen
        courses={courses}
        turmas={turmas}
        onLogin={handleLogin}
        onRegisterUser={handleRegisterUser}
        users={users}
      />
    );
  }

  const unreadAnnouncementsCount = announcements.filter((a) => a.priority === 'urgente').length;
  const openQuestionsCount = discussions.filter((d) => d.status === 'aberta').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Salto de Navegação (Skip Link) - WCAG 2.1 AA / e-MAG */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1e7e34] focus:text-white focus:font-bold focus:rounded-lg focus:shadow-2xl focus:ring-4 focus:ring-yellow-300 focus:outline-none"
      >
        Pular para o conteúdo principal (Alt + 1)
      </a>

      {/* Sistema de Notificações e Toast Alert (WCAG 2.1 AA / e-MAG) */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] sm:w-auto p-3.5 sm:p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 transition-all duration-300 ${
            activeToast.type === 'urgent'
              ? 'bg-rose-950/95 text-rose-50 border-rose-500/60 ring-2 ring-rose-500/30'
              : activeToast.type === 'warning'
              ? 'bg-amber-950/95 text-amber-50 border-amber-500/60 ring-2 ring-amber-500/30'
              : activeToast.type === 'info'
              ? 'bg-sky-950/95 text-sky-50 border-sky-500/60'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          {/* Indicador Visual do Tipo de Alerta */}
          <div className="shrink-0 mt-0.5">
            {activeToast.type === 'urgent' ? (
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
            ) : activeToast.type === 'warning' ? (
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </span>
            ) : activeToast.type === 'info' ? (
              <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Mensagem e Ação */}
          <div className="flex-1 text-xs">
            <div className="font-medium leading-relaxed pr-2">
              {activeToast.message}
            </div>
            {activeToast.onAction && activeToast.actionLabel && (
              <button
                onClick={() => {
                  activeToast.onAction?.();
                  dismissToast();
                }}
                className={`mt-2 inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg text-[11px] transition border ${
                  activeToast.type === 'urgent'
                    ? 'bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 border-rose-400/50'
                    : activeToast.type === 'warning'
                    ? 'bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border-amber-400/50'
                    : 'bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 border-emerald-400/50'
                }`}
              >
                <span>{activeToast.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Botão de Fechar */}
          <button
            onClick={dismissToast}
            aria-label="Fechar notificação"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header com Barra de Acessibilidade e-MAG */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onToggleRole={handleToggleRole}
        onLogout={handleLogout}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        openQuestionsCount={openQuestionsCount}
        pendingAssignmentsCount={pendingAssignmentsCount}
        onOpenAccessibilityModal={() => setIsAccessibilityModalOpen(true)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* Main Container */}
      <main
        id="conteudo-principal"
        role="main"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 focus:outline-none"
      >
        {/* Active Context Bar - Separação Clara de Curso, Turma e Matéria */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          {/* Linha 1: Curso, Turma e Identificação do Usuário */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Seletor de Curso */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                <span className="font-semibold text-slate-500">Curso:</span>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    const cId = e.target.value;
                    setSelectedCourseId(cId);
                    const matchingTurma = turmas.find((t) => t.courseId === cId);
                    setSelectedTurmaId(matchingTurma ? matchingTurma.id : 'all');
                  }}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer max-w-[200px] truncate"
                >
                  <option value="all">Todos os Cursos</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seletor de Turma */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                <span className="font-semibold text-slate-500">Turma:</span>
                <select
                  value={selectedTurmaId}
                  onChange={(e) => {
                    const tId = e.target.value;
                    setSelectedTurmaId(tId);
                    if (tId !== 'all') {
                      const t = turmas.find((x) => x.id === tId);
                      if (t?.disciplineId) setSelectedDisciplineId(t.disciplineId);
                    }
                  }}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer max-w-[240px] truncate"
                >
                  <option value="all">Todas as Turmas</option>
                  {(selectedCourseId === 'all'
                    ? turmas
                    : turmas.filter((t) => t.courseId === selectedCourseId)
                  ).map((t) => {
                    const isEnrolled = currentUser.enrolledTurmaIds?.includes(t.id);
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.shift}){isEnrolled ? ' ★ Sua Turma' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Atalho do Aluno para Matrículas / Troca de Turma */}
              {currentUser.role === 'student' && (
                <button
                  onClick={() => setCurrentTab('turmas')}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#166534] bg-[#e8f5e9] hover:bg-[#d5ecd9] rounded-lg transition border border-[#248c3d]/40"
                >
                  + Escolher / Trocar Turma
                </button>
              )}
            </div>

            {/* Identificação do Usuário */}
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#1e7e34]" />
              <span>
                Conectado: <strong className="text-slate-800">{currentUser.name}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize font-bold text-[#1e7e34]">
                {currentUser.role === 'professor' ? 'Docente' : 'Discente'}
              </span>
              {currentUser.matricula && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    Matrícula: {currentUser.matricula}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Linha 2: Matérias / Disciplinas vinculadas */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Matéria / Disciplina:
            </span>
            <DisciplineSelector
              disciplines={
                selectedCourseId === 'all'
                  ? disciplines
                  : disciplines.filter((d) => d.courseId === selectedCourseId)
              }
              selectedDisciplineId={selectedDisciplineId}
              onSelectDiscipline={setSelectedDisciplineId}
            />
          </div>
        </div>

        {/* View Switcher */}
        {currentTab === 'courses' && (
          <CoursesView
            courses={courses}
            disciplines={disciplines}
            turmas={turmas}
            userRole={currentUser.role}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {currentTab === 'turmas' && (
          <TurmasView
            turmas={turmas}
            disciplines={disciplines}
            courses={courses}
            students={students}
            professors={professors}
            userRole={currentUser.role}
            currentStudentId={currentUser.id}
            onAddTurma={handleAddTurma}
            onEditTurma={(turma) => {
              setSelectedTurmaForEdit(turma);
              setIsEditTurmaOpen(true);
            }}
            onDeleteTurma={handleDeleteTurma}
            onEnrollStudent={handleEnrollStudent}
            onUnenrollStudent={handleUnenrollStudent}
          />
        )}

        {currentTab === 'students' && (
          <StudentsView
            students={students}
            courses={courses}
            turmas={turmas}
            userRole={currentUser.role}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudentStatus={handleUpdateStudentStatus}
          />
        )}

        {currentTab === 'professors' && (
          <ProfessorsView
            professors={professors}
            disciplines={disciplines}
            turmas={turmas}
            courses={courses}
            userRole={currentUser.role}
            onOpenAddModal={() => {
              setSelectedProfessorForEdit(null);
              setIsEditProfessorOpen(true);
            }}
            onEditProfessor={(prof) => {
              setSelectedProfessorForEdit(prof);
              setIsEditProfessorOpen(true);
            }}
            onDeleteProfessor={handleDeleteProfessor}
            onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
            onNavigateToDiscipline={(discId) => {
              setSelectedDisciplineId(discId);
              setCurrentTab('disciplines');
            }}
          />
        )}

        {currentTab === 'disciplines' && (
          <DisciplinesView
            disciplines={disciplines}
            materials={materials}
            courses={courses}
            lessons={lessons}
            professors={professors}
            userRole={currentUser.role}
            selectedCourseId={selectedCourseId}
            onSelectCourseFilter={setSelectedCourseId}
            onOpenNewDisciplineModal={() => setIsAddDisciplineOpen(true)}
            onEditDiscipline={(discipline) => {
              setSelectedDisciplineForEdit(discipline);
              setIsEditDisciplineOpen(true);
            }}
            onSelectDiscipline={setSelectedDisciplineId}
            onNavigateToMaterials={(id, lessonNum) => {
              setSelectedDisciplineId(id);
              setSelectedLessonFilter(lessonNum || null);
              setCurrentTab('materials');
            }}
            onToggleLessonStatus={handleToggleLessonStatus}
          />
        )}

        {currentTab === 'materials' && (
          <MaterialsView
            disciplines={disciplines}
            materials={materials}
            courses={courses}
            selectedDisciplineId={selectedDisciplineId}
            selectedCourseId={selectedCourseId}
            userRole={currentUser.role}
            completedMaterialIds={completedMaterialIds}
            initialLessonFilter={selectedLessonFilter}
            onSelectCourse={setSelectedCourseId}
            onSelectDiscipline={setSelectedDisciplineId}
            onToggleCompleted={handleToggleCompleted}
            onOpenNewMaterialModal={() => setIsAddMaterialOpen(true)}
            onOpenPreview={setPreviewMaterial}
            onEditMaterial={(material) => {
              setSelectedMaterialForEdit(material);
              setIsEditMaterialOpen(true);
            }}
            onDeleteMaterial={handleDeleteMaterial}
            onDownloadMaterial={handleDownloadMaterial}
            onOpenStorageInfo={() => setIsStorageInfoOpen(true)}
          />
        )}

        {currentTab === 'announcements' && (
          <AnnouncementsView
            disciplines={disciplines}
            announcements={announcements}
            selectedDisciplineId={selectedDisciplineId}
            userRole={currentUser.role}
            currentUser={currentUser}
            onOpenNewAnnouncementModal={() => setIsAddAnnouncementOpen(true)}
            onAddComment={handleAddAnnouncementComment}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {currentTab === 'discussions' && (
          <DiscussionsView
            disciplines={disciplines}
            discussions={discussions}
            selectedDisciplineId={selectedDisciplineId}
            userRole={currentUser.role}
            currentUser={currentUser}
            onOpenNewDiscussionModal={() => setIsAddDiscussionOpen(true)}
            onLikeDiscussion={handleLikeDiscussion}
            onAddResponse={handleAddDiscussionResponse}
            onMarkResolved={handleMarkDiscussionResolved}
          />
        )}

        {currentTab === 'assignments' && (
          <AssignmentsView
            disciplines={disciplines}
            assignments={assignments}
            selectedDisciplineId={selectedDisciplineId}
            userRole={currentUser.role}
            currentUser={currentUser}
            onOpenSubmitModal={(assignment) => setSubmissionAssignment(assignment)}
            onOpenGradeModal={(assignment, submission) =>
              setGradeModalData({ assignment, submission })
            }
            onOpenCreateAssignmentModal={() => setIsAddAssignmentOpen(true)}
          />
        )}

        {currentTab === 'office-hours' && (
          <OfficeHoursView
            disciplines={disciplines}
            officeHours={officeHours}
            selectedDisciplineId={selectedDisciplineId}
            userRole={currentUser.role}
            currentUser={currentUser}
            onBookSlot={handleBookSlot}
            onCancelSlot={handleCancelSlot}
          />
        )}
      </main>

      {/* Modals */}
      {previewMaterial && (
        <MaterialModal
          material={previewMaterial}
          discipline={disciplines.find((d) => d.id === previewMaterial.disciplineId)}
          userRole={currentUser.role}
          isCompleted={completedMaterialIds.includes(previewMaterial.id)}
          onToggleCompleted={handleToggleCompleted}
          onClose={() => setPreviewMaterial(null)}
          onDownload={handleDownloadMaterial}
        />
      )}

      {isAddMaterialOpen && (
        <AddMaterialModal
          disciplines={disciplines}
          defaultDisciplineId={selectedDisciplineId}
          onAddMaterial={handleAddMaterial}
          onClose={() => setIsAddMaterialOpen(false)}
        />
      )}

      {isAddAnnouncementOpen && (
        <AddAnnouncementModal
          disciplines={disciplines}
          defaultDisciplineId={selectedDisciplineId}
          authorName={currentUser.name}
          onAddAnnouncement={handleAddAnnouncement}
          onClose={() => setIsAddAnnouncementOpen(false)}
        />
      )}

      {isAddDiscussionOpen && (
        <AddDiscussionModal
          disciplines={disciplines}
          defaultDisciplineId={selectedDisciplineId}
          currentUser={currentUser}
          onAddDiscussion={handleAddDiscussion}
          onClose={() => setIsAddDiscussionOpen(false)}
        />
      )}

      {isAddDisciplineOpen && (
        <AddDisciplineModal
          courses={courses}
          onAddDiscipline={handleAddDiscipline}
          onClose={() => setIsAddDisciplineOpen(false)}
        />
      )}

      {isAddAssignmentOpen && (
        <AddAssignmentModal
          disciplines={disciplines}
          defaultDisciplineId={selectedDisciplineId}
          onAddAssignment={handleAddAssignment}
          onClose={() => setIsAddAssignmentOpen(false)}
        />
      )}

      {submissionAssignment && (
        <SubmissionModal
          assignment={submissionAssignment}
          currentUser={currentUser}
          existingSubmission={submissionAssignment.submissions.find(
            (s) => s.studentId === currentUser.id
          )}
          onSubmit={handleSubmitAssignment}
          onClose={() => setSubmissionAssignment(null)}
        />
      )}

      {gradeModalData && (
        <GradeSubmissionModal
          assignment={gradeModalData.assignment}
          submission={gradeModalData.submission}
          onGrade={handleGradeSubmission}
          onClose={() => setGradeModalData(null)}
        />
      )}

      {/* Professor Management & Google Sheets Modals */}
      <EditProfessorModal
        isOpen={isEditProfessorOpen}
        onClose={() => setIsEditProfessorOpen(false)}
        professor={selectedProfessorForEdit}
        disciplines={disciplines}
        turmas={turmas}
        courses={courses}
        onSave={handleSaveProfessor}
      />

      <GoogleSheetsModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        professors={professors}
        disciplines={disciplines}
        turmas={turmas}
        onImportProfessors={handleImportProfessors}
        showToast={showToast}
      />

      {/* Edit Discipline, Turma, Material Modals & Storage Architecture Info */}
      <EditDisciplineModal
        isOpen={isEditDisciplineOpen}
        onClose={() => setIsEditDisciplineOpen(false)}
        discipline={selectedDisciplineForEdit}
        courses={courses}
        onSave={handleSaveEditedDiscipline}
      />

      <EditTurmaModal
        isOpen={isEditTurmaOpen}
        onClose={() => setIsEditTurmaOpen(false)}
        turma={selectedTurmaForEdit}
        disciplines={disciplines}
        courses={courses}
        professors={professors}
        onSave={handleSaveEditedTurma}
      />

      <EditMaterialModal
        isOpen={isEditMaterialOpen}
        onClose={() => setIsEditMaterialOpen(false)}
        material={selectedMaterialForEdit}
        disciplines={disciplines}
        onSave={handleSaveEditedMaterial}
      />

      <StorageInfoModal
        isOpen={isStorageInfoOpen}
        onClose={() => setIsStorageInfoOpen(false)}
        materialsCount={materials.length}
      />

      {/* Modal de Acessibilidade & Base Legal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* Rodapé Acessível com Base Legal e-MAG / WCAG 2.1 AA */}
      <footer
        role="contentinfo"
        aria-label="Rodapé institucional e declaração de acessibilidade"
        className="bg-slate-900 text-slate-300 text-xs py-6 border-t border-slate-800 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="font-bold text-white text-sm">
              Instituto Federal de Educação, Ciência e Tecnologia de Sergipe · Campus Tobias Barreto
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              EduConecta IFS · Desenvolvido sob as diretrizes de Acessibilidade Digital WCAG 2.1 AA, e-MAG (Lei nº 13.146/2015) e LGPD (Lei nº 13.709/2018).
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => setIsAccessibilityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold transition border border-slate-700 underline flex items-center gap-1.5"
            >
              <span>Acessibilidade & Base Legal [Alt + 3]</span>
            </button>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-400">Coordenação de Informática (COINF)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
