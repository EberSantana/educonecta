import React, { useState } from 'react';
import { X, HelpCircle, Tag } from 'lucide-react';
import { Discipline, Discussion, UserProfile } from '../types';

interface AddDiscussionModalProps {
  disciplines: Discipline[];
  defaultDisciplineId: string;
  currentUser: UserProfile;
  onAddDiscussion: (discussion: Discussion) => void;
  onClose: () => void;
}

export const AddDiscussionModal: React.FC<AddDiscussionModalProps> = ({
  disciplines,
  defaultDisciplineId,
  currentUser,
  onAddDiscussion,
  onClose,
}) => {
  const [disciplineId, setDisciplineId] = useState(
    defaultDisciplineId !== 'all' ? defaultDisciplineId : disciplines[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newDiscussion: Discussion = {
      id: `disc-${Date.now()}`,
      disciplineId,
      title: title.trim(),
      content: content.trim(),
      authorName: currentUser.name,
      authorRole: currentUser.role,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      hasLiked: false,
      status: 'aberta',
      tags: parsedTags.length > 0 ? parsedTags : ['Geral'],
      responses: [],
    };

    onAddDiscussion(newDiscussion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Fazer uma Pergunta / Abrir Dúvida
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compartilhe sua dúvida com o professor e com os colegas da disciplina.
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disciplina
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Dúvida
            </label>
            <input
              type="text"
              placeholder="Ex: Como lidar com a rotação esquerda-direita na árvore AVL?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detalhamento da Dúvida
            </label>
            <textarea
              rows={4}
              placeholder="Explique o que você tentou fazer, qual resultado obteve e onde surgiu a dificuldade..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Palavras-chave / Tags (separadas por vírgula)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: AVL, Rotações, Exercício 3"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/20 focus:border-[#1e7e34]"
              />
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
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
              Publicar Pergunta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
