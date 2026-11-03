import React from 'react';
import { Discipline } from '../types';
import { BookOpen } from 'lucide-react';

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  selectedDisciplineId: string;
  onSelectDiscipline: (id: string) => void;
  showAllOption?: boolean;
}

export const DisciplineSelector: React.FC<DisciplineSelectorProps> = ({
  disciplines,
  selectedDisciplineId,
  onSelectDiscipline,
  showAllOption = true,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {showAllOption && (
        <button
          onClick={() => onSelectDiscipline('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
            selectedDisciplineId === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          Todas as Disciplinas
        </button>
      )}

      {disciplines.map((d) => {
        const isSelected = selectedDisciplineId === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onSelectDiscipline(d.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
              isSelected
                ? 'bg-[#1e7e34] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isSelected ? '#ffffff' : d.color }}
            />
            <span>{d.code}</span>
            <span className="hidden sm:inline font-normal opacity-85 truncate max-w-[150px]">
              - {d.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
