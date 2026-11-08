import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  Lock,
  Mail,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  Globe,
  HelpCircle,
  X,
} from 'lucide-react';
import { UserProfile, UserRole, Course, Turma } from '../types';
import { IfLogo } from './IfLogo';

interface AuthScreenProps {
  courses: Course[];
  turmas: Turma[];
  onLogin: (user: UserProfile) => void;
  onRegisterUser: (user: UserProfile) => void;
  users: UserProfile[];
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  courses,
  turmas,
  onLogin,
  onRegisterUser,
  users,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('professor');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMatricula, setRegMatricula] = useState('');
  const [regCourseId, setRegCourseId] = useState(courses[0]?.id || '');
  const [regTurmaId, setRegTurmaId] = useState(() => {
    const defaultCourseId = courses[0]?.id;
    const match = turmas.find((t) => t.courseId === defaultCourseId);
    return match ? match.id : '';
  });
  const [regDepartment, setRegDepartment] = useState('Departamento de Computação e Matemática');
  const [regTitle, setRegTitle] = useState('Professor Associado');

  const handleCourseChange = (newCourseId: string) => {
    setRegCourseId(newCourseId);
    const matchingTurma = turmas.find((t) => t.courseId === newCourseId);
    setRegTurmaId(matchingTurma ? matchingTurma.id : '');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanInput = loginIdentifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanInput ||
          (u.id === 'prof-eber' &&
            (cleanInput === 'eberss@gmail.com' ||
              cleanInput === 'eber.santana@ifs.edu.br' ||
              cleanInput === 'eber')) ||
          (u.matricula && u.matricula.toLowerCase() === cleanInput)) &&
        u.role === role
    );

    if (user) {
      if (user.password && loginPassword && user.password !== loginPassword) {
        setLoginError('Senha incorreta para esta conta institucional.');
        return;
      }
      onLogin(user);
    } else {
      setLoginError(
        role === 'professor'
          ? 'Nenhum professor encontrado com este e-mail institucional. Utilize os acessos rápidos abaixo ou cadastre-se.'
          : 'Nenhum aluno encontrado com esta matrícula ou e-mail. Utilize os acessos rápidos abaixo ou cadastre-se.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const initials = regName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword || '123',
      role,
      avatarInitials: initials || 'AC',
      matricula:
        role === 'student'
          ? regMatricula.trim() || `2026${Math.floor(1000 + Math.random() * 9000)}`
          : undefined,
      courseId: role === 'student' ? regCourseId : undefined,
      department: role === 'professor' ? regDepartment.trim() : undefined,
      title: role === 'professor' ? regTitle.trim() : undefined,
      enrolledTurmaIds: role === 'student' && regTurmaId ? [regTurmaId] : [],
    };

    onRegisterUser(newUser);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotModalOpen(false);
      setForgotEmail('');
    }, 3000);
  };

  const demoUsers = users.filter((u) => u.role === role);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Official IF Logo Lockup */}
        <div className="flex items-center justify-center mb-3">
          <IfLogo size="lg" showText={false} />
        </div>
        <div className="inline-block if-badge-red text-[11px] mb-2 shadow-xs">
          INSTITUTO FEDERAL DE SERGIPE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
          Edu<span className="text-[#1e7e34]">Conecta</span>
        </h1>
        <p className="mt-1 text-xs text-slate-600 font-semibold">
          Campus Tobias Barreto · Coordenação de Informática (COINF)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10 overflow-hidden relative">
          {/* Top IF Red Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ce2029]" />

          {/* Mode Switcher: Login vs Register */}
          <div className="flex border-b border-slate-200 mb-6 text-sm">
            <button
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`flex-1 pb-3 text-center font-bold transition border-b-2 -mb-[2px] ${
                mode === 'login'
                  ? 'border-[#1e7e34] text-[#1e7e34]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Acesso ao Sistema
            </button>
            <button
              onClick={() => {
                setMode('register');
                setLoginError('');
              }}
              className={`flex-1 pb-3 text-center font-bold transition border-b-2 -mb-[2px] ${
                mode === 'register'
                  ? 'border-[#1e7e34] text-[#1e7e34]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Novo Cadastro
            </button>
          </div>

          {/* Role Selection Tabs with Role Clarification */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Selecione o Tipo de Usuário:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRole('professor');
                  setLoginError('');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition ${
                  role === 'professor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span>Professor / Docente</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setLoginError('');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition ${
                  role === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estudante / Aluno</span>
              </button>
            </div>

            {/* Role Context Hint */}
            <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                {role === 'professor'
                  ? 'Permissões: Gestão de turmas, alunos, matérias, postagem de materiais e notas.'
                  : 'Permissões: Acesso a materiais didáticos, submissão de tarefas e fórum de dúvidas.'}
              </span>
            </div>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {role === 'professor' ? 'E-mail Institucional' : 'E-mail ou Matrícula'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={
                      role === 'professor'
                        ? 'eberss@gmail.com ou eber.santana@ifs.edu.br'
                        : '20261INF001 ou felipe.duarte@aluno.ifs.edu.br'
                    }
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Senha</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="•••••••• (padrão: 123)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#1e7e34] hover:bg-[#166534] text-white font-bold rounded-lg text-xs transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Single Sign-on simulator */}
              <button
                type="button"
                onClick={() => {
                  const demo = demoUsers[0];
                  if (demo) onLogin(demo);
                }}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Entrar com Login Único Acadêmico (SSO)</span>
              </button>

              {/* Quick Demo Logins Section */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider text-center">
                  Acessos Rápidos de Demonstração (1 Clique)
                </span>
                <div className="space-y-1.5">
                  {demoUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => onLogin(u)}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                          {u.avatarInitials}
                        </span>
                        <div>
                          <strong className="text-slate-800 block text-[11px]">{u.name}</strong>
                          <span className="text-slate-400 text-[10px]">
                            {u.role === 'professor' ? u.title : `Matrícula ${u.matricula}`}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                        Acessar ➔
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder={role === 'professor' ? 'Ex: Profa. Dra. Mariana Costa' : 'Ex: Gabriel Souza Santos'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  required
                  placeholder={role === 'professor' ? 'mariana.costa@universidade.edu.br' : 'gabriel.souza@aluno.universidade.edu.br'}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Senha de Acesso</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Defina sua senha (padrão: 123)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {role === 'student' ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Número de Matrícula Institucional
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 20260455"
                      value={regMatricula}
                      onChange={(e) => setRegMatricula(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                    />
                  </div>

                  {/* SEPARAÇÃO 1: ESCOLHA DO CURSO */}
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-indigo-950 text-xs">
                        1. Escolha o Curso de Graduação
                      </label>
                      <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-1.5 py-0.5 rounded">
                        Passo 1
                      </span>
                    </div>
                    <select
                      value={regCourseId}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.degree} · {c.durationSemesters} semestres)
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-indigo-700/80">
                      O curso define as disciplinas curriculares e as turmas disponíveis para sua matrícula.
                    </p>
                  </div>

                  {/* SEPARAÇÃO 2: ESCOLHA DA TURMA */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-900 text-xs">
                        2. Escolha a sua Turma Inicial
                      </label>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {turmas.filter((t) => t.courseId === regCourseId).length} turma(s) aberta(s)
                      </span>
                    </div>

                    {turmas.filter((t) => t.courseId === regCourseId).length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                        {turmas
                          .filter((t) => t.courseId === regCourseId)
                          .map((t) => {
                            const isSelected = regTurmaId === t.id;
                            const vacancies = t.maxStudents - t.enrolledStudentIds.length;
                            return (
                              <label
                                key={t.id}
                                className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition text-xs ${
                                  isSelected
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-500/20'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="turma_selection"
                                  checked={isSelected}
                                  onChange={() => setRegTurmaId(t.id)}
                                  className="mt-0.5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-[11px] text-slate-900 truncate">
                                      {t.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded shrink-0">
                                      {t.shift}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                    <span className="font-mono text-slate-600 font-semibold">{t.code}</span>
                                    <span>·</span>
                                    <span>{t.schedule}</span>
                                    <span>·</span>
                                    <span className={vacancies > 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                                      {vacancies > 0 ? `${vacancies} vagas restantes` : 'Turma lotada'}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                        Nenhuma turma cadastrada para este curso ainda. Você poderá se matricular assim que novas turmas forem ofertadas pelo professor.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Departamento</label>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Titulação / Cargo</label>
                      <input
                        type="text"
                        value={regTitle}
                        onChange={(e) => setRegTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition shadow-sm mt-2"
              >
                Concluir Cadastro & Acessar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Recuperação de Acesso
                </h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="p-5 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Informe o seu e-mail institucional ou número de matrícula para receber o link de
                redefinição de senha.
              </p>

              {forgotSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Link de redefinição enviado com sucesso para seu e-mail!</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    required
                    placeholder="seu.email@universidade.edu.br ou Matrícula"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition"
                  >
                    Enviar Link de Recuperação
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
