import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BookOpen,
  ChevronDown,
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

  const dropdownRef = useRef<HTMLDivElement>(null);
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
  const filteredDisciplines = useMemo(() => {
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
    <div className="relative" ref={dropdownRef}>
      {/* Botão Seletor Principal Unificado */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        aria-label="Selecionar matéria ou disciplina"
        className={`flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 border rounded-xl px-3 py-1.5 text-xs shadow-2xs transition max-w-[280px] sm:max-w-[340px] ${
          isDropdownOpen
            ? 'bg-[#e8f5e9] border-[#248c3d] ring-2 ring-[#248c3d]/20 text-[#166534]'
            : selectedDisciplineId === 'all'
            ? 'border-slate-200 text-slate-800'
            : 'border-[#248c3d]/40 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <BookOpen className="w-4 h-4 text-[#1e7e34] shrink-0" />
          <span className="font-semibold text-slate-500 text-[11px] shrink-0">Matéria:</span>

          {selectedDisciplineId === 'all' ? (
            <span className="font-bold text-slate-900 truncate">Todas as Matérias</span>
          ) : currentDiscipline ? (
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0 ring-1 ring-black/10"
                style={{ backgroundColor: currentDiscipline.color }}
              />
              <span className="font-mono font-bold text-[#1e7e34]">{currentDiscipline.code}</span>
              <span className="font-semibold text-slate-900 truncate" title={currentDiscipline.name}>
                {currentDiscipline.name}
              </span>
            </div>
          ) : (
            <span className="text-slate-500">Selecione...</span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180 text-[#1e7e34]' : ''
          }`}
        />
      </button>

      {/* Menu Dropdown Suspenso com Pesquisa Instantânea e Organização por Período */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-1.5 z-50 w-[310px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar pesquisa"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Abas de Período/Ano */}
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
                    <div className="font-bold">Todas as Matérias</div>
                    <div className="text-[10px] text-slate-500">
                      Exibir conteúdo de todas as disciplinas do curso
                    </div>
                  </div>
                </div>
                {selectedDisciplineId === 'all' && (
                  <Check className="w-4 h-4 text-[#1e7e34] shrink-0" />
                )}
              </button>
            )}

            {filteredDisciplines.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Nenhuma disciplina encontrada para &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredDisciplines.map((d) => {
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
            <span>{filteredDisciplines.length} de {disciplines.length} matérias</span>
            <span className="text-[10px] text-slate-400">Esc para fechar</span>
          </div>
        </div>
      )}
    </div>
  );
};
