import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Discipline } from '../types';

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  selectedDisciplineId: string;
  onSelectDiscipline: (id: string) => void;
  showAllOption?: boolean;
  selectedCourseId?: string;
}

export const DisciplineSelector: React.FC<DisciplineSelectorProps> = ({
  disciplines,
  selectedDisciplineId,
  onSelectDiscipline,
  showAllOption = true,
  selectedCourseId = 'all',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePeriodFilter, setActivePeriodFilter] = useState<number | 'all'>('all');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Disciplina selecionada atualmente
  const currentDiscipline = disciplines.find((d) => d.id === selectedDisciplineId);

  // Períodos/Anos presentes na lista de disciplinas
  const periodsAvailable = useMemo(() => {
    const set = new Set<number>();
    disciplines.forEach((d) => {
      if (d.periodNumber) set.add(d.periodNumber);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [disciplines]);

  const isTds = selectedCourseId === 'course-tds' || disciplines.some((d) => d.courseId === 'course-tds');

  const getPeriodLabel = (num: number) => {
    return isTds ? `${num}º Ano` : `${num}º Período`;
  };

  // Filtragem para o popup de busca
  const filteredForDropdown = useMemo(() => {
    return disciplines.filter((d) => {
      if (activePeriodFilter !== 'all' && d.periodNumber !== activePeriodFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = d.code.toLowerCase().includes(q);
        const matchName = d.name.toLowerCase().includes(q);
        const matchSemester = (d.semester || '').toLowerCase().includes(q);
        return matchCode || matchName || matchSemester;
      }
      return true;
    });
  }, [disciplines, activePeriodFilter, searchQuery]);

  // Disciplinas exibidas no carrossel horizontal rápido (filtradas por período se selecionado)
  const carouselDisciplines = useMemo(() => {
    if (activePeriodFilter === 'all') return disciplines;
    return disciplines.filter((d) => d.periodNumber === activePeriodFilter);
  }, [disciplines, activePeriodFilter]);

  // Atualizar estado das setas de rolagem
  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [carouselDisciplines]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollState, 250);
  };

  // Fecha dropdown ao clicar fora ou pressionar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleSelect = (id: string) => {
    onSelectDiscipline(id);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2.5 w-full">
      {/* 1. Botão Seletor Principal / Combobox com Pesquisa */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-label="Escolher matéria ou disciplina acadêmica"
          className={`flex items-center justify-between gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition shadow-2xs min-w-[220px] max-w-[340px] sm:max-w-none ${
            isDropdownOpen
              ? 'bg-[#e8f5e9] border-[#248c3d] ring-2 ring-[#248c3d]/20 text-[#166534]'
              : selectedDisciplineId === 'all'
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'
              : 'bg-white hover:bg-slate-50 border-[#248c3d]/40 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedDisciplineId === 'all' ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#1e7e34] shrink-0" />
                <span className="font-bold text-slate-900 truncate">
                  Todas as Disciplinas
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 shrink-0">
                  {disciplines.length}
                </span>
              </>
            ) : currentDiscipline ? (
              <>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10"
                  style={{ backgroundColor: currentDiscipline.color }}
                />
                <span className="font-mono font-bold text-[#1e7e34] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                  {currentDiscipline.code}
                </span>
                <span className="font-semibold text-slate-800 truncate" title={currentDiscipline.name}>
                  {currentDiscipline.name}
                </span>
              </>
            ) : (
              <span className="text-slate-500">Selecione uma matéria...</span>
            )}
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180 text-[#1e7e34]' : ''
            }`}
          />
        </button>

        {/* Menu Dropdown Suspenso com Pesquisa Instantânea */}
        {isDropdownOpen && (
          <div className="absolute left-0 mt-1.5 z-50 w-[320px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Campo de Busca Rápida */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por nome ou código (ex: Programação, INF201)..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#248c3d] focus:border-transparent font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filtros de Período dentro da Pesquisa */}
              {periodsAvailable.length > 1 && (
                <div className="flex items-center gap-1 mt-2.5 overflow-x-auto no-scrollbar pt-1">
                  <button
                    type="button"
                    onClick={() => setActivePeriodFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
                      activePeriodFilter === 'all'
                        ? 'bg-[#1e7e34] text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    Todos ({disciplines.length})
                  </button>
                  {periodsAvailable.map((num) => {
                    const count = disciplines.filter((d) => d.periodNumber === num).length;
                    const isSelected = activePeriodFilter === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setActivePeriodFilter(num)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-[#1e7e34] text-white shadow-2xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                        }`}
                      >
                        {getPeriodLabel(num)} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lista de Opções */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 p-1.5" role="listbox">
              {showAllOption && (
                <button
                  type="button"
                  onClick={() => handleSelect('all')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                    selectedDisciplineId === 'all'
                      ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[#1e7e34]" />
                    </div>
                    <div>
                      <div className="font-bold">Todas as Disciplinas</div>
                      <div className="text-[10px] text-slate-500">
                        Exibir conteúdo e materiais de todas as matérias
                      </div>
                    </div>
                  </div>
                  {selectedDisciplineId === 'all' && (
                    <Check className="w-4 h-4 text-[#1e7e34] shrink-0" />
                  )}
                </button>
              )}

              {filteredForDropdown.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Nenhuma disciplina encontrada para &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredForDropdown.map((d) => {
                  const isSelected = selectedDisciplineId === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelect(d.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                        isSelected
                          ? 'bg-[#e8f5e9] text-[#166534] font-bold'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/10"
                          style={{ backgroundColor: d.color }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#1e7e34] text-[11px]">
                              {d.code}
                            </span>
                            <span className="font-semibold truncate text-slate-900">
                              {d.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <span>{d.semester}</span>
                            <span>·</span>
                            <span>{d.workloadHours}h relógio ({d.workloadLessons || 0} h/a)</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-[#1e7e34] shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Rodapé do Menu com Total */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{filteredForDropdown.length} de {disciplines.length} matérias</span>
              <span className="text-[10px] text-slate-400">Pressione Esc para fechar</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Filtro Rápido por Período & Carrossel Suave com Setas */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 relative">
        {/* Botão de Rolar para a Esquerda */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Rolar disciplinas para a esquerda"
            className="hidden sm:flex items-center justify-center w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 shadow-2xs shrink-0 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Lista Horizontal de Pílulas com Rolagem Suave */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollState}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 flex-1"
        >
          {showAllOption && (
            <button
              type="button"
              onClick={() => onSelectDiscipline('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                selectedDisciplineId === 'all'
                  ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Todas
            </button>
          )}

          {carouselDisciplines.map((d) => {
            const isSelected = selectedDisciplineId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelectDiscipline(d.id)}
                title={`${d.code} - ${d.name} (${d.semester})`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1e7e34] text-white shadow-xs ring-2 ring-[#248c3d]/25'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#ffffff' : d.color }}
                />
                <span className="font-mono font-bold">{d.code}</span>
                <span className={`font-normal truncate max-w-[130px] sm:max-w-[170px] ${isSelected ? 'text-white/95' : 'text-slate-600'}`}>
                  - {d.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Botão de Rolar para a Direita */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Rolar disciplinas para a direita"
            className="hidden sm:flex items-center justify-center w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 shadow-2xs shrink-0 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
