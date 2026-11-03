import React from 'react';
import {
  GraduationCap,
  UserCheck,
  LogOut,
  Building,
  Users,
  Layers,
  BookOpen,
  Bell,
  MessageSquare,
  CheckSquare,
  Calendar,
  Sparkles,
  Eye,
  Contrast,
  Languages,
  ZoomIn,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import { IfLogo } from './IfLogo';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserProfile;
  onToggleRole: () => void;
  onLogout: () => void;
  unreadAnnouncementsCount: number;
  openQuestionsCount: number;
  pendingAssignmentsCount?: number;
  onOpenAccessibilityModal: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  themeAesthetic?: 'classic' | 'glassy';
  onToggleThemeAesthetic?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onToggleRole,
  onLogout,
  unreadAnnouncementsCount,
  openQuestionsCount,
  pendingAssignmentsCount = 0,
  onOpenAccessibilityModal,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
  themeAesthetic = 'classic',
  onToggleThemeAesthetic,
}) => {
  const isProfessor = currentUser.role === 'professor';

  // Navigation Items configuration
  const navItems = isProfessor
    ? [
        { id: 'courses', label: 'Cursos', icon: GraduationCap },
        { id: 'turmas', label: 'Turmas', icon: Layers },
        { id: 'students', label: 'Alunos', icon: Users },
        { id: 'professors', label: 'Professores', icon: Building },
        { id: 'disciplines', label: 'Matérias', icon: BookOpen },
        { id: 'materials', label: 'Materiais', icon: Sparkles },
        {
          id: 'announcements',
          label: 'Avisos',
          icon: Bell,
          badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined,
        },
        {
          id: 'discussions',
          label: 'Fórum',
          icon: MessageSquare,
          badge: openQuestionsCount > 0 ? openQuestionsCount : undefined,
        },
        { id: 'assignments', label: 'Tarefas & Notas', icon: CheckSquare },
        { id: 'office-hours', label: 'Atendimento', icon: Calendar },
      ]
    : [
        { id: 'disciplines', label: 'Minhas Matérias', icon: BookOpen },
        { id: 'materials', label: 'Materiais de Estudo', icon: Sparkles },
        {
          id: 'announcements',
          label: 'Mural de Avisos',
          icon: Bell,
          badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined,
        },
        { id: 'discussions', label: 'Fórum de Dúvidas', icon: MessageSquare },
        {
          id: 'assignments',
          label: 'Tarefas & Notas',
          icon: CheckSquare,
          badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
        },
        { id: 'office-hours', label: 'Atendimento', icon: Calendar },
      ];

  const handleOpenVLibras = () => {
    try {
      const vLibrasBtn = document.querySelector('[vw-access-button]') as HTMLElement;
      if (vLibrasBtn) {
        vLibrasBtn.click();
      } else {
        alert('O widget do VLibras está carregando no canto inferior direito da tela.');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <header role="banner" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 0. Barra de Acessibilidade Governamental e-MAG / WCAG 2.1 AA */}
      <div
        className="bg-slate-900 text-slate-200 px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-[11px] font-medium border-b border-slate-800"
        aria-label="Barra de atalhos e acessibilidade e-MAG"
      >
        {/* Teclas de Salto e Atalhos Rápidos */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <a
            href="#conteudo-principal"
            className="hover:text-yellow-300 transition focus:text-yellow-300 focus:underline"
            title="Ir para o conteúdo principal da página (Alt + 1)"
          >
            Ir para o conteúdo <span className="opacity-70 font-mono text-[10px]">[Alt + 1]</span>
          </a>
          <span className="opacity-40" aria-hidden="true">|</span>
          <a
            href="#nav-principal"
            className="hover:text-yellow-300 transition focus:text-yellow-300 focus:underline"
            title="Ir para o menu de navegação de cursos e matérias (Alt + 2)"
          >
            Ir para o menu <span className="opacity-70 font-mono text-[10px]">[Alt + 2]</span>
          </a>
          <span className="opacity-40 hidden sm:inline" aria-hidden="true">|</span>
          <button
            onClick={onOpenAccessibilityModal}
            className="hidden sm:inline-flex items-center gap-1 hover:text-yellow-300 transition text-left"
            title="Acessibilidade digital e normas legais (Alt + 3)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acessibilidade & Leis</span>
            <span className="opacity-70 font-mono text-[10px]">[Alt + 3]</span>
          </button>
        </div>

        {/* Controles de Acessibilidade: Alto Contraste, Fonte, VLibras */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Alto Contraste */}
          <button
            onClick={onToggleHighContrast}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition ${
              highContrast
                ? 'bg-yellow-400 text-black font-bold ring-1 ring-yellow-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Alternar modo de alto contraste (Alt + 4)"
            aria-pressed={highContrast}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Alto Contraste</span>
          </button>

          {/* Ajuste de Fonte */}
          <div className="flex items-center gap-0.5 bg-slate-800 rounded px-1 py-0.5" aria-label="Ajustar tamanho da fonte">
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-1.5 py-0.2 rounded font-bold transition text-[10px] ${
                fontSize === 'normal' ? 'bg-[#1e7e34] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tamanho normal de fonte (100%)"
              aria-label="Tamanho de fonte normal 100%"
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-1.5 py-0.2 rounded font-bold transition text-[10px] ${
                fontSize === 'large' ? 'bg-[#1e7e34] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Aumentar fonte (115%)"
              aria-label="Aumentar fonte 115%"
            >
              A+
            </button>
            <button
              onClick={() => onChangeFontSize('xlarge')}
              className={`px-1.5 py-0.2 rounded font-bold transition text-[10px] ${
                fontSize === 'xlarge' ? 'bg-[#1e7e34] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Aumentar fonte máxima (130%)"
              aria-label="Aumentar fonte 130%"
            >
              A++
            </button>
          </div>

          {/* Botão de Tradução em VLibras */}
          <button
            onClick={handleOpenVLibras}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[10px] transition"
            title="Abrir tradutor para Língua Brasileira de Sinais (VLibras)"
            aria-label="Tradutor de Libras - VLibras"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>VLibras</span>
          </button>
        </div>
      </div>

      {/* 1. Top Institutional Banner (Direct IFS Identity) */}
      <div className="bg-[#1e7e34] text-white px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[11px] font-bold tracking-wide">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-[#ce2029] shrink-0 animate-pulse" aria-hidden="true" />
          <span className="uppercase tracking-wider truncate">
            Instituto Federal de Sergipe · Campus Tobias Barreto
          </span>
          <span className="hidden md:inline-block opacity-70" aria-hidden="true">|</span>
          <span className="hidden md:inline-block font-normal text-emerald-100 truncate">
            Coordenação de Informática (COINF)
          </span>
        </div>

        {/* Card-inspired Pill Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAccessibilityModal}
            className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded transition border border-emerald-500/40 hidden sm:inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>WCAG 2.1 AA</span>
          </button>
          <span className="bg-white text-[#1e7e34] font-bold px-2.5 py-0.5 rounded-full text-[10px] shadow-2xs uppercase tracking-wider">
            Portal Oficial
          </span>
        </div>
      </div>

      {/* 2. Iconic IF Red Stripe */}
      <div className="h-1 bg-[#ce2029]" aria-hidden="true" />

      {/* 3. Main Brand & Profile Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2.5">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('disciplines')}
              className="flex items-center gap-2 text-left group transition shrink-0"
              title="Ir para tela inicial de disciplinas"
              aria-label="EduConecta IFS Tobias Barreto - Página inicial"
            >
              <IfLogo size="md" />
            </button>
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-1" aria-hidden="true" />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                EduConecta IFS
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">
                Gestão Pedagógica & Repositório PPC
              </div>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User chip */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#e8f5e9] text-[#1e7e34] font-bold text-[11px] flex items-center justify-center border border-[#248c3d]/30 shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-[11px] leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {isProfessor ? 'Docente Responsável' : 'Estudante'}
                </div>
              </div>
            </div>

            {/* Code XR Glassy v2 Theme Switcher */}
            {onToggleThemeAesthetic && (
              <button
                onClick={onToggleThemeAesthetic}
                title="Alternar entre o Tema Clássico Oficial IFS e o Code XR Glassy Dashboard v2"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-[#145a27] transition shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">
                  {themeAesthetic === 'glassy' ? 'Tema Clássico IFS' : 'Code XR Glassy v2'}
                </span>
              </button>
            )}

            {/* Quick Switch Role button */}
            <button
              onClick={onToggleRole}
              title={`Alternar para perfil de ${isProfessor ? 'Aluno' : 'Professor'}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-2xs ${
                isProfessor
                  ? 'bg-[#1e7e34] text-white border-[#1e7e34] hover:bg-[#166534]'
                  : 'bg-[#ce2029] text-white border-[#ce2029] hover:bg-[#a8171e]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isProfessor ? 'Docente (Prof.)' : 'Estudante (Aluno)'}
              </span>
              <span className="text-[10px] opacity-80 border-l border-white/30 pl-1">
                Alternar
              </span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Sair do Sistema / Logout"
              className="p-1.5 text-slate-500 hover:text-[#ce2029] hover:bg-rose-50 rounded-lg transition"
              aria-label="Sair do portal EduConecta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Dedicated Full-Width Navigation Strip */}
      <div id="nav-principal" className="border-t border-slate-200/80 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <nav
            role="navigation"
            aria-label="Navegação principal de áreas acadêmicas"
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 py-1.5 text-xs"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1e7e34] text-white shadow-xs ring-1 ring-[#1e7e34]/30'
                      : 'text-slate-700 hover:text-[#1e7e34] hover:bg-white border border-transparent hover:border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      aria-label={`${item.badge} notificações não lidas`}
                      className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#ce2029] text-white"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
