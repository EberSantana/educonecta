import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  HelpCircle,
  Plus,
  Send,
  Search,
  Check,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Discussion, Discipline, UserRole, UserProfile } from '../types';
import { filterDiscussions } from '../utils/academic-logic';

interface DiscussionsViewProps {
  disciplines: Discipline[];
  discussions: Discussion[];
  selectedDisciplineId: string;
  userRole: UserRole;
  currentUser: UserProfile;
  onOpenNewDiscussionModal: () => void;
  onLikeDiscussion: (discussionId: string) => void;
  onAddResponse: (
    discussionId: string,
    content: string,
    isOfficialAnswer?: boolean
  ) => void;
  onMarkResolved: (discussionId: string) => void;
}

export const DiscussionsView: React.FC<DiscussionsViewProps> = ({
  disciplines,
  discussions,
  selectedDisciplineId,
  userRole,
  currentUser,
  onOpenNewDiscussionModal,
  onLikeDiscussion,
  onAddResponse,
  onMarkResolved,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aberta' | 'resolvida'>('all');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isOfficialCheck, setIsOfficialCheck] = useState(userRole === 'professor');

  const filteredDiscussions = filterDiscussions(
    discussions,
    searchQuery,
    statusFilter,
    selectedDisciplineId
  );

  const handleSendReply = (discussionId: string) => {
    if (!replyText.trim()) return;
    const isOfficial = userRole === 'professor' && isOfficialCheck;
    onAddResponse(discussionId, replyText.trim(), isOfficial);
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Interação Pedagógica</span>
            <span aria-hidden="true">·</span>
            <span>Fórum Acadêmico e Dúvidas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Fórum de Dúvidas & Perguntas Frequentes
          </h1>
        </div>

        <button
          onClick={onOpenNewDiscussionModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Fazer uma Pergunta
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por termo, conceito, exercício ou tag (ex: Dijkstra, AVL, Integral)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'Todas as Dúvidas' },
            { id: 'aberta', label: 'Dúvidas em Aberto' },
            { id: 'resolvida', label: 'Respondidas & Resolvidas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === tab.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discussions Feed */}
      {filteredDiscussions.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1 font-display">
            Nenhuma dúvida encontrada
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? 'Tente utilizar outras palavras-chave ou remover os filtros.'
              : 'Seja o primeiro a postar uma dúvida sobre a matéria!'}
          </p>
          <button
            onClick={onOpenNewDiscussionModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Publicar Dúvida
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((disc) => {
            const discipline = disciplines.find((d) => d.id === disc.disciplineId);
            const officialReply = disc.responses.find((r) => r.isOfficialAnswer);

            return (
              <div
                key={disc.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300"
              >
                {/* Meta header (Zero-pill format) */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      {discipline?.code || 'Geral'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{disc.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{disc.date}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        disc.status === 'resolvida' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {disc.status === 'resolvida' ? '✓ Resolvida' : '● Em Aberto'}
                    </span>
                  </div>

                  {userRole === 'professor' && disc.status === 'aberta' && (
                    <button
                      onClick={() => onMarkResolved(disc.id)}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Marcar como Resolvida
                    </button>
                  )}
                </div>

                {/* Question Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  {disc.title}
                </h3>

                {/* Question Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  {disc.content}
                </p>

                {/* Tags */}
                {disc.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] text-slate-500">
                    <span className="text-slate-400 font-medium">Tópicos:</span>
                    {disc.tags.map((tag, i) => (
                      <span key={i} className="text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Upvote & Action Bar */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onLikeDiscussion(disc.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                      disc.hasLiked
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Também tenho esta dúvida</span>
                    <span className="font-mono tabular-nums ml-1">({disc.likes})</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveReplyId(activeReplyId === disc.id ? null : disc.id)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Responder ({disc.responses.length})</span>
                  </button>
                </div>

                {/* Responses list */}
                {disc.responses.length > 0 && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Respostas da Comunidade ({disc.responses.length}):
                    </span>

                    {disc.responses.map((resp) => (
                      <div
                        key={resp.id}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                          resp.isOfficialAnswer
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {resp.authorName}
                            </span>
                            {resp.isOfficialAnswer && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                Resposta Oficial do Professor
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">{resp.date}</span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line">{resp.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {activeReplyId === disc.id && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <textarea
                      rows={3}
                      placeholder={
                        userRole === 'professor'
                          ? 'Escreva a explicação pedagógica ou orientação técnica para a turma...'
                          : 'Compartilhe sua contribuição, raciocínio ou dica com o colega...'
                      }
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />

                    <div className="flex items-center justify-between text-xs">
                      {userRole === 'professor' ? (
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={isOfficialCheck}
                            onChange={(e) => setIsOfficialCheck(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                          />
                          <span>Marcar como Resposta Oficial do Professor</span>
                        </label>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Postando como estudante
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-1.5 text-slate-500 hover:text-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSendReply(disc.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Publicar Resposta</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
