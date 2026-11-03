import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Professor, Discipline, Turma } from '../types';
import {
  signInWithGoogle,
  signOutGoogle,
  getCachedAccessToken,
} from '../services/firebase';
import {
  createProfessorSpreadsheet,
  syncProfessorsToSpreadsheet,
  fetchSpreadsheetRows,
  parseSheetRowsToProfessors,
} from '../services/googleSheets';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professors: Professor[];
  disciplines: Discipline[];
  turmas: Turma[];
  onImportProfessors: (imported: Professor[]) => void;
  showToast: (msg: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  professors,
  disciplines,
  turmas,
  onImportProfessors,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'paste'>('export');
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>('eberss@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Export state
  const [exportTitle, setExportTitle] = useState('IFS Tobias Barreto - Quadro de Professores e Disciplinas');
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);

  // Import state
  const [importSpreadsheetInput, setImportSpreadsheetInput] = useState('');
  const [previewProfessors, setPreviewProfessors] = useState<Professor[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Quick Paste state
  const [pastedContent, setPastedContent] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signInWithGoogle();
      setGoogleUserEmail(res.user.email);
      showToast(`Conectado como ${res.user.email}!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao autenticar com a conta Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOutGoogle();
      setGoogleUserEmail(null);
      showToast('Desconectado da conta Google.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleExportToGoogleSheets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getCachedAccessToken();
      if (!token) {
        // Prompt Google Sign-In first
        const authRes = await signInWithGoogle();
        setGoogleUserEmail(authRes.user.email);
        const res = await createProfessorSpreadsheet(
          authRes.accessToken,
          exportTitle,
          professors,
          disciplines,
          turmas
        );
        setCreatedSheetUrl(res.spreadsheetUrl);
        showToast('Planilha Google criada com sucesso no seu Google Drive!');
      } else {
        const res = await createProfessorSpreadsheet(
          token,
          exportTitle,
          professors,
          disciplines,
          turmas
        );
        setCreatedSheetUrl(res.spreadsheetUrl);
        showToast('Planilha Google criada com sucesso no seu Google Drive!');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao exportar dados para o Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSpreadsheetData = async () => {
    if (!importSpreadsheetInput.trim()) {
      setError('Por favor, informe a URL ou o ID da planilha do Google.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreviewProfessors([]);
    setImportWarnings([]);

    try {
      let token = getCachedAccessToken();
      if (!token) {
        const authRes = await signInWithGoogle();
        setGoogleUserEmail(authRes.user.email);
        token = authRes.accessToken;
      }

      const rows = await fetchSpreadsheetRows(token, importSpreadsheetInput.trim());
      const { professors: parsed, warnings } = parseSheetRowsToProfessors(
        rows,
        disciplines,
        turmas
      );

      if (parsed.length === 0) {
        setError('Nenhum registro de professor válido foi encontrado na planilha.');
      } else {
        setPreviewProfessors(parsed);
        setImportWarnings(warnings);
        showToast(`${parsed.length} professores carregados para visualização.`);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          'Não foi possível ler a planilha. Verifique se o link está correto e compartilhado com sua conta.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewProfessors.length === 0) return;
    onImportProfessors(previewProfessors);
    setShowConfirmModal(false);
    onClose();
    showToast(`${previewProfessors.length} professores integrados com sucesso!`);
  };

  const handleParsePastedContent = () => {
    if (!pastedContent.trim()) {
      setError('Cole o conteúdo da planilha no campo de texto.');
      return;
    }

    setError(null);
    try {
      // Split rows by newline and cells by tab (TSV copied from Google Sheets / Excel)
      const lines = pastedContent
        .trim()
        .split(/\r?\n/)
        .map((line) => line.split('\t'));

      if (lines.length < 2) {
        setError('O texto colado deve conter ao menos a linha de cabeçalho e uma linha de professor.');
        return;
      }

      const { professors: parsed, warnings } = parseSheetRowsToProfessors(
        lines,
        disciplines,
        turmas
      );

      if (parsed.length === 0) {
        setError('Não foi possível reconhecer as colunas. Verifique o cabeçalho.');
      } else {
        setPreviewProfessors(parsed);
        setImportWarnings(warnings);
        showToast(`${parsed.length} professores identificados no texto colado.`);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar conteúdo colado.');
    }
  };

  const copyTemplateHeaders = () => {
    const template = `SIAPE\tNome Completo\tEmail Institucional\tTitulação\tDepartamento\tCampus\tTelefone\tGabinete / Sala\tDisciplinas Ministradas (Códigos)\tTurmas Atribuídas (Códigos)\n1984210\tProf. Eber Santana\teberss@gmail.com\tMestre\tCoordenação de Informática (COINF)\tIFS Campus Tobias Barreto\t(79) 3541-1200\tSala 12\tTDS101, TDS201, INF201\tTDS-1A, TDS-2A\n2104592\tProfª. Camila Rodrigues\tcamila.rodrigues@ifs.edu.br\tMestre\tCoordenação de Informática (COINF)\tIFS Campus Tobias Barreto\t(79) 3541-1204\tGabinete 04\tTDS102, TDS202\tTDS-1A`;
    navigator.clipboard.writeText(template);
    showToast('Modelo com cabeçalhos copiado para a Área de Transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display">
                  Integração com Google Sheets & Workspace
                </h2>
                <span className="text-[10px] font-bold bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded border border-emerald-800">
                  IFS Tobias Barreto
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Sincronize, exporte e importe o quadro docente e associações com o Google Planilhas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Account Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Conta Google:</span>
            {googleUserEmail ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{googleUserEmail}</span>
              </div>
            ) : (
              <span className="text-slate-500 italic">Nenhuma conta conectada</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!googleUserEmail ? (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold shadow-2xs transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Conectar com Google</span>
              </button>
            ) : (
              <button
                onClick={handleGoogleSignOut}
                className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white gap-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar para Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Importar por Link do Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>Planilha Modelo & Colagem Rápida</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Exportação Automática para o Google Drive</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Gere uma planilha no Google Sheets contendo todos os <strong>{professors.length} professores</strong> cadastrados no IFS Campus Tobias Barreto, com SIAPE, e-mails institucionais, titulações e todas as disciplinas e turmas associadas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Planilha no Google Drive:
                </label>
                <input
                  type="text"
                  value={exportTitle}
                  onChange={(e) => setExportTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                <div className="font-semibold text-slate-800">Colunas que serão geradas:</div>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">SIAPE</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Nome Completo</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Email Institucional</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Titulação</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Departamento</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Campus</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Disciplinas Ministradas</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Turmas Atribuídas</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleExportToGoogleSheets}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2 shadow-xs"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                  )}
                  <span>Gerar Planilha no Google Sheets</span>
                </button>

                {createdSheetUrl && (
                  <a
                    href={createdSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-lg transition"
                  >
                    <span>Abrir Planilha Criada no Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT BY LINK */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
                <div className="font-bold text-slate-900 mb-1">
                  Importar Dados de uma Planilha Existente
                </div>
                <p className="text-slate-600 leading-relaxed mb-2">
                  Cole o link de uma planilha do Google Sheets compartilhada (ou o ID da planilha). O sistema fará a leitura das linhas e mapeará automaticamente os professores para o catálogo do IFS.
                </p>
                <div className="text-[11px] text-slate-500">
                  Exemplo de link: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit</code>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL ou ID da Planilha Google:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importSpreadsheetInput}
                    onChange={(e) => setImportSpreadsheetInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={handleFetchSpreadsheetData}
                    disabled={isLoading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shrink-0"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Carregar Dados</span>
                  </button>
                </div>
              </div>

              {/* Preview dos Dados */}
              {previewProfessors.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Pré-visualização ({previewProfessors.length} professores encontrados):
                    </span>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Integrar {previewProfessors.length} Professores</span>
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-lg text-xs divide-y divide-slate-100">
                    {previewProfessors.map((p, idx) => (
                      <div key={idx} className="p-2.5 bg-white hover:bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded">
                              SIAPE: {p.siape}
                            </span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                              {p.title}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {p.email} · {p.assignedDisciplineIds.length} disciplinas · {p.assignedTurmaIds.length} turmas
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {importWarnings.length > 0 && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 space-y-0.5">
                      <strong className="block font-semibold">Avisos de Mapeamento:</strong>
                      {importWarnings.slice(0, 4).map((w, i) => (
                        <div key={i}>· {w}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEMPLATE & QUICK PASTE */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 mb-0.5">
                    Planilha Modelo para Cadastro de Professores
                  </div>
                  <p className="text-slate-600">
                    Copie a estrutura com os cabeçalhos padrão e preencha no seu Google Sheets ou Excel.
                  </p>
                </div>
                <button
                  onClick={copyTemplateHeaders}
                  className="px-3 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Modelo com Cabeçalhos</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Colar Linhas Copiadas da Planilha (Ctrl+V):
                </label>
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  rows={5}
                  placeholder={`SIAPE\tNome Completo\tEmail Institucional\tTitulação\tDisciplinas Ministradas\tTurmas\n1984210\tProf. Eber Santana\teberss@gmail.com\tMestre\tTDS101, TDS201\tTDS-1A\n...`}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleParsePastedContent}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Processar Linhas Coladas</span>
                </button>

                {previewProfessors.length > 0 && (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Importar {previewProfessors.length} Professores</span>
                  </button>
                )}
              </div>

              {previewProfessors.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-800">
                    Pré-visualização dos Professores Identificados:
                  </span>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg text-xs divide-y divide-slate-100">
                    {previewProfessors.map((p, idx) => (
                      <div key={idx} className="p-2.5 bg-white flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-slate-500 ml-2 font-mono text-[11px]">SIAPE: {p.siape}</span>
                          <div className="text-[11px] text-slate-500">
                            {p.email} · {p.title} · {p.assignedDisciplineIds.length} disciplinas associadas
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center gap-3 text-emerald-700 mb-3">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-base font-bold text-slate-900">
                  Confirmar Integração de Dados
                </h3>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Você está prestes a integrar <strong>{previewProfessors.length} professores</strong> ao sistema do IFS Campus Tobias Barreto. Suas disciplinas e turmas serão automaticamente associadas.
              </p>
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs"
                >
                  Confirmar e Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Instituto Federal de Sergipe · Coordenação de Informática (COINF)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
