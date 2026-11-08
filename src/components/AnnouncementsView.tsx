import React, { useState } from 'react';
import { Bell, Pin, Plus, AlertCircle, MessageSquare, Send, Trash2 } from 'lucide-react';
import { Announcement, Discipline, UserRole, UserProfile } from '../types';

interface AnnouncementsViewProps {
  disciplines: Discipline[];
  announcements: Announcement[];
  selectedDisciplineId: string;
  userRole: UserRole;
  currentUser: UserProfile;
  onOpenNewAnnouncementModal: () => void;
  onAddComment: (announcementId: string, text: string) => void;
  onDeleteAnnouncement: (announcementId: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  disciplines,
  announcements,
  selectedDisciplineId,
  userRole,
  currentUser,
  onOpenNewAnnouncementModal,
  onAddComment,
  onDeleteAnnouncement,
}) => {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const filteredAnnouncements =
    selectedDisciplineId === 'all'
      ? announcements
      : announcements.filter((a) => a.disciplineId === selectedDisciplineId);

  // Pinned first, then by date descending
  const sortedList = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleSendComment = (announcementId: string) => {
    if (!commentText.trim()) return;
    onAddComment(announcementId, commentText.trim());
    setCommentText('');
    setActiveCommentId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Comunicação e Avisos</span>
            <span aria-hidden="true">·</span>
            <span>Mural Oficial da Turma</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Mural de Avisos & Comunicados
          </h1>
        </div>

        {userRole === 'professor' && (
          <button
            onClick={onOpenNewAnnouncementModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo Comunicado
          </button>
        )}
      </div>

      {/* Announcements List */}
      {sortedList.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1 font-display">
            Nenhum aviso publicado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Não há comunicados recentes para esta disciplina no momento.
          </p>
          {userRole === 'professor' && (
            <button
              onClick={onOpenNewAnnouncementModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Publicar Primeiro Aviso
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedList.map((ann) => {
            const discipline = disciplines.find((d) => d.id === ann.disciplineId);

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition ${
                  ann.pinned
                    ? 'border-[#1e7e34]/40 ring-1 ring-[#1e7e34]/20 bg-gradient-to-b from-[#e8f5e9]/20 to-white'
                    : 'border-slate-200'
                }`}
              >
                {/* Meta Row (Zero-pill format) */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    {ann.pinned && (
                      <span className="flex items-center gap-1 font-semibold text-[#1e7e34]">
                        <Pin className="w-3.5 h-3.5" />
                        Fixado
                      </span>
                    )}
                    {ann.priority === 'urgente' && (
                      <span className="flex items-center gap-1 font-semibold text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Urgente
                      </span>
                    )}
                    {ann.priority === 'importante' && (
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Importante
                      </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">
                      {discipline?.code || 'Geral'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{ann.authorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{ann.date}</span>
                    {userRole === 'professor' && (
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        aria-label="Excluir comunicado"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Announcement Title & Content */}
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  {ann.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                  {ann.content}
                </p>

                {/* Comments Section */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      Comentários e Dúvidas Rápidas ({ann.comments.length})
                    </span>
                    <button
                      onClick={() =>
                        setActiveCommentId(activeCommentId === ann.id ? null : ann.id)
                      }
                      className="text-xs text-[#1e7e34] hover:underline font-semibold"
                    >
                      {activeCommentId === ann.id ? 'Fechar campo' : 'Adicionar comentário'}
                    </button>
                  </div>

                  {/* List of existing comments */}
                  {ann.comments.length > 0 && (
                    <div className="space-y-2 mb-3 bg-slate-50/70 rounded-lg p-3 border border-slate-100">
                      {ann.comments.map((comm) => (
                        <div key={comm.id} className="text-xs text-slate-700 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {comm.authorName}
                            </span>
                            {comm.authorRole === 'professor' && (
                              <span className="text-[10px] text-[#166534] font-bold bg-[#e8f5e9] border border-[#248c3d]/30 px-1.5 rounded">
                                Professor
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">· {comm.date}</span>
                          </div>
                          <p className="text-slate-600 pl-0.5">{comm.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  {activeCommentId === ann.id && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Escreva sua pergunta ou comentário para este aviso..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(ann.id);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
                      />
                      <button
                        onClick={() => handleSendComment(ann.id)}
                        className="px-3 py-1.5 bg-[#1e7e34] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
