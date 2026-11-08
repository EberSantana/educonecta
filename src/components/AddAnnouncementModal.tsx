import React, { useState } from 'react';
import { X, Bell, Pin } from 'lucide-react';
import { Discipline, Announcement } from '../types';

interface AddAnnouncementModalProps {
  disciplines: Discipline[];
  defaultDisciplineId: string;
  authorName: string;
  onAddAnnouncement: (announcement: Announcement) => void;
  onClose: () => void;
}

export const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({
  disciplines,
  defaultDisciplineId,
  authorName,
  onAddAnnouncement,
  onClose,
}) => {
  const [disciplineId, setDisciplineId] = useState(
    defaultDisciplineId !== 'all' ? defaultDisciplineId : disciplines[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'importante' | 'urgente'>('normal');
  const [pinned, setPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      disciplineId,
      title: title.trim(),
      content: content.trim(),
      priority,
      date: new Date().toISOString().split('T')[0],
      authorName,
      authorRole: 'professor',
      pinned,
      comments: [],
    };

    onAddAnnouncement(newAnnouncement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Novo Comunicado para a Turma
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Envie avisos oficiais, lembretes de avaliações e orientações aos alunos.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disciplina Destino
            </label>
            <select
              value={disciplineId}
              onChange={(e) => setDisciplineId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            >
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Prioridade do Aviso
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition ${
                  priority === 'normal'
                    ? 'border-[#248c3d] bg-[#e8f5e9] text-[#166534] font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Informativo
              </button>
              <button
                type="button"
                onClick={() => setPriority('importante')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition ${
                  priority === 'importante'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Importante
              </button>
              <button
                type="button"
                onClick={() => setPriority('urgente')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition ${
                  priority === 'urgente'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Urgente
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título do Comunicado
            </label>
            <input
              type="text"
              placeholder="Ex: Mudança de horário da monitoria e prazo da Lista 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mensagem Completa
            </label>
            <textarea
              rows={4}
              placeholder="Escreva as informações detalhadas para a turma..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pin-announcement"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-4 h-4 text-[#1e7e34] rounded border-slate-300 focus:ring-[#1e7e34]"
            />
            <label htmlFor="pin-announcement" className="text-xs text-slate-700 font-medium cursor-pointer flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-slate-400" />
              Fixar este aviso no topo do mural da disciplina
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold transition shadow-sm"
            >
              Publicar Comunicado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
