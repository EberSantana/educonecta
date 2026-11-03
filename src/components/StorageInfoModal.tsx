import React from 'react';
import {
  X,
  HardDrive,
  Database,
  Cloud,
  FolderOpen,
  CheckCircle2,
  Server,
  Layers,
  FileCheck,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface StorageInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialsCount: number;
}

export const StorageInfoModal: React.FC<StorageInfoModalProps> = ({
  isOpen,
  onClose,
  materialsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">
                Onde ficam os Arquivos e Banco de Dados?
              </h2>
              <p className="text-xs text-slate-300">
                Arquitetura de armazenamento, limites de espaço e sincronização em nuvem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Summary Box */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-950 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Visão Geral do Armazenamento no EduConecta:</span>
            </div>
            <p className="text-indigo-900 leading-relaxed">
              Os arquivos enviados e metadados didáticos utilizam uma arquitetura híbrida de alta performance: <strong>Banco de Dados Google Cloud Firestore</strong> para catálogo e metadados, <strong>Google Drive / Workspace</strong> do professor para documentos e arquivos pesados, e <strong>Cache Local do Navegador</strong> para carregamento imediato offline.
            </p>
          </div>

          {/* Cards dos Locais de Armazenamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Google Drive & Workspace */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  <span>Google Drive / Workspace</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  15 GB Grátis
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>Para onde vão:</strong> Arquivos de aula (PDFs, apresentações de slides, apostilas, vídeos gravados e planilhas integradas do Google Sheets).
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Capacidade: <strong>15 GB gratuitos</strong> por conta pessoal, ou <strong>Ilimitado / Pooled</strong> para contas institucionais do IFS (<code className="text-slate-700 font-mono">@ifs.edu.br</code>).
              </div>
            </div>

            {/* 2. Firebase Firestore Database */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Database className="w-4 h-4 text-amber-600" />
                  <span>Banco de Dados Firestore</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  1 GB (Documentos)
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>O que armazena:</strong> Cadastro dos professores, turmas, alunos, ementas normatizadas dos PPCs, cronogramas de aula, avisos e fórum de dúvidas.
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Instância: <code className="font-mono text-[10px] text-slate-700">ai-studio-educonectaportal</code> (Google Cloud us-west1). Suporta até <strong>50.000 leituras/dia</strong> gratuitas.
              </div>
            </div>

            {/* 3. Firebase Cloud Storage */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Firebase Cloud Storage</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  5 GB Grátis
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>Bucket do Projeto:</strong> <code className="font-mono text-[10px] text-slate-700">gen-lang-client-0117342580.firebasestorage.app</code>. Armazena uploads diretos de arquivos binários e entregas de tarefas dos estudantes.
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Tamanho máximo por arquivo: até <strong>100 MB</strong> recomendado.
              </div>
            </div>

            {/* 4. Cache Local do Navegador */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <span>Cache Local (IndexedDB)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Instantâneo
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>Garante funcionamento offline:</strong> Mantém cópia local dos materiais recentes e do estado da sessão para carregamento instantâneo mesmo sem internet no campus.
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Atualmente indexados: <strong>{materialsCount} materiais de aula</strong>.
              </div>
            </div>
          </div>

          {/* Como fazer upload, editar e excluir */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">
              Como Funciona o Fluxo de Arquivos no Portal:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-indigo-700 mb-1">1. Fazer Upload</div>
                <p className="text-slate-600 text-[11px]">
                  Clique em <strong>"Publicar Novo Material"</strong>. Arraste ou selecione o arquivo do seu computador (PDF, DOCX, PPTX, ZIP). O tamanho e o tipo são detectados automaticamente.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-indigo-700 mb-1">2. Editar Dados</div>
                <p className="text-slate-600 text-[11px]">
                  Clique no ícone de lápis <strong>(Editar)</strong> em qualquer material para trocar o arquivo, corrigir títulos, alterar o módulo ou vincular a outra aula da ementa.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-rose-700 mb-1">3. Deletar</div>
                <p className="text-slate-600 text-[11px]">
                  Clique no ícone de lixeira <strong>(Excluir)</strong> com confirmação de segurança para liberar espaço e remover o recurso do catálogo dos alunos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Instituto Federal de Sergipe (IFS) · Campus Tobias Barreto</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
