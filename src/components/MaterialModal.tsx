import React from 'react';
import { X, FileText, Download, CheckCircle, ExternalLink, Calendar, HardDrive, BookOpen } from 'lucide-react';
import { Material, Discipline, UserRole } from '../types';

interface MaterialModalProps {
  material: Material | null;
  discipline?: Discipline;
  userRole: UserRole;
  isCompleted: boolean;
  onToggleCompleted: (materialId: string) => void;
  onClose: () => void;
  onDownload: (material: Material) => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  material,
  discipline,
  userRole,
  isCompleted,
  onToggleCompleted,
  onClose,
  onDownload,
}) => {
  if (!material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{discipline?.code || 'Geral'}</span>
              <span aria-hidden="true">·</span>
              <span>{material.module}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{material.type}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {material.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar visualizador"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Descrição do Material
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {material.description}
            </p>
          </div>

          {material.contentSnippet && (
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 font-sans text-[11px]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Visualização Prévia do Conteúdo Didático
                </span>
                <span>{material.fileSize || 'Texto didático'}</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono">{material.contentSnippet}</pre>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Data de Postagem</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{material.dateAdded}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Tamanho / Formato</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{material.fileSize || 'Link / Web'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px]">Downloads / Acessos</span>
              <span className="font-semibold text-slate-800 mt-0.5 block tabular-nums">{material.downloadCount} alunos</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {userRole === 'student' && (
              <button
                onClick={() => onToggleCompleted(material.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                {isCompleted ? 'Material Concluído' : 'Marcar como Lido'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {material.externalUrl ? (
              <a
                href={material.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Acessar Link Externo
              </a>
            ) : (
              <button
                onClick={() => onDownload(material)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Material ({material.fileSize || 'PDF'})
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
