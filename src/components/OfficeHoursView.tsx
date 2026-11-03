import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ExternalLink,
  Users,
  CheckCircle,
  MessageCircle,
  Send,
  Plus,
} from 'lucide-react';
import { OfficeHour, Discipline, UserRole, UserProfile } from '../types';

interface OfficeHoursViewProps {
  disciplines: Discipline[];
  officeHours: OfficeHour[];
  selectedDisciplineId: string;
  userRole: UserRole;
  currentUser: UserProfile;
  onBookSlot: (officeHourId: string, studentName: string) => void;
  onCancelSlot: (officeHourId: string, studentName: string) => void;
}

export const OfficeHoursView: React.FC<OfficeHoursViewProps> = ({
  disciplines,
  officeHours,
  selectedDisciplineId,
  userRole,
  currentUser,
  onBookSlot,
  onCancelSlot,
}) => {
  const [quickMessage, setQuickMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const filteredHours =
    selectedDisciplineId === 'all'
      ? officeHours
      : officeHours.filter((h) => !h.disciplineId || h.disciplineId === selectedDisciplineId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    setMessageSent(true);
    setQuickMessage('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Plantão de Dúvidas e Atendimento</span>
          <span aria-hidden="true">·</span>
          <span>Apoio Pedagógico Individual e em Grupo</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          Horários de Atendimento & Sala Virtual
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Consulte os horários semanais fixos para esclarecer dúvidas presenciais ou online com o
          professor e agende seu atendimento individual.
        </p>
      </div>

      {/* Office Hours Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHours.map((hour) => {
          const discipline = disciplines.find((d) => d.id === hour.disciplineId);
          const isBookedByCurrent = hour.bookedStudents.includes(currentUser.name);
          const isFull = hour.bookedStudents.length >= hour.slotsAvailable;

          return (
            <div
              key={hour.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700">
                    {discipline?.code || 'Geral / Todas as Turmas'}
                  </span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    Semanal
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display mb-3">
                  {hour.dayOfWeek}
                </h3>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{hour.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hour.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      Vagas ocupadas:{' '}
                      <strong className="text-slate-800 font-mono">
                        {hour.bookedStudents.length} / {hour.slotsAvailable}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Booked students list */}
                {hour.bookedStudents.length > 0 && (
                  <div className="mb-4 p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Alunos com agendamento confirmado:
                    </span>
                    <ul className="text-slate-700 space-y-0.5 text-[11px]">
                      {hour.bookedStudents.map((name, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <a
                  href={hour.virtualRoomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Acessar Sala Virtual (Google Meet)</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>

                {userRole === 'student' && (
                  <div>
                    {isBookedByCurrent ? (
                      <button
                        onClick={() => onCancelSlot(hour.id, currentUser.name)}
                        className="w-full py-1.5 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium transition"
                      >
                        Cancelar Meu Agendamento
                      </button>
                    ) : (
                      <button
                        onClick={() => onBookSlot(hour.id, currentUser.name)}
                        disabled={isFull}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                      >
                        {isFull ? 'Vagas Esgotadas para este Horário' : 'Agendar Meu Horário'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Direct Message Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 font-display">
            Canal Direto de Comunicação Rápida com o Professor
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Precisa de orientação sobre um caso específico, dispensa de aula ou justificativa? Envie
          uma mensagem rápida direto para a caixa institucional do docente.
        </p>

        {messageSent && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Mensagem enviada com sucesso ao Prof. Eber Santana! Você receberá resposta no seu
              e-mail institucional.
            </span>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-3">
          <textarea
            rows={3}
            placeholder="Digite sua mensagem direta ao professor aqui..."
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Remetente: {currentUser.name} ({currentUser.email})
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Mensagem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
