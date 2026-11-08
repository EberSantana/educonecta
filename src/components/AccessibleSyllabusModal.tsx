import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  GraduationCap,
  Library,
  Sparkles,
} from 'lucide-react';
import { Discipline, Course } from '../types';
import { downloadDisciplinePDF } from '../utils/pdfGenerator';

interface AccessibleSyllabusModalProps {
  discipline: Discipline;
  course?: Course;
  onClose: () => void;
  onShowToast?: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AccessibleSyllabusModal: React.FC<AccessibleSyllabusModalProps> = ({
  discipline,
  course,
  onClose,
  onShowToast,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Leitura de tela acessível com Web Speech API
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast?.('Síntese de voz não suportada pelo seu navegador.', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = `
      Componente curricular: ${discipline.name}. Código: ${discipline.code}.
      Curso: ${course?.name || 'EduConecta IFS'}.
      Carga horária: ${discipline.workloadHours} horas relógio, equivalente a ${discipline.workloadLessons || 0} horas-aula.
      Pré-requisitos: ${discipline.prerequisites || 'Sem pré-requisito'}.
      Ementa oficial do PPC: ${discipline.syllabus || discipline.description}.
      ${discipline.objectives ? `Objetivo geral: ${discipline.objectives}.` : ''}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    onShowToast?.('Iniciando leitura em áudio da ementa oficial.', 'info');
  };

  // Download do arquivo PDF institucional
  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    onShowToast?.(`Gerando PDF oficial de ${discipline.code}...`, 'info');

    setTimeout(() => {
      try {
        downloadDisciplinePDF(discipline, course);
        setIsGeneratingPdf(false);
        onShowToast?.(`Ementa em PDF de ${discipline.code} baixada com sucesso!`, 'success');
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        setIsGeneratingPdf(false);
        onShowToast?.('Erro ao gerar PDF da ementa.', 'error');
      }
    }, 150);
  };

  // Imprimir ou Salvar em PDF via Navegador
  const handleBrowserPrint = () => {
    window.print();
  };

  // Copiar texto integral para a área de transferência
  const handleCopyText = () => {
    const fullText = `
INSTITUTO FEDERAL DE SERGIPE - CAMPUS TOBIAS BARRETO
COORDENAÇÃO DE INFORMÁTICA (COINF)
===================================================
EMENTA OFICIAL DO COMPONENTE CURRICULAR (PPC)
Componente: ${discipline.name} (${discipline.code})
Curso: ${course?.name || 'Técnico em Informática'}
Ato Normativo: ${course?.resolution || 'Resolução CS/IFS'}
Carga Horária: ${discipline.workloadHours}h relógio (${discipline.workloadLessons || 0} h/a)
Pré-requisitos: ${discipline.prerequisites || 'Sem pré-requisito'}
Período/Ano: ${discipline.semester}

EMENTA:
${discipline.syllabus || discipline.description}

OBJETIVOS:
${discipline.objectives || 'Capacitar o estudante nas competências previstas no PPC.'}

UNIDADES / MÓDULOS:
${discipline.modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

BIBLIOGRAFIA BÁSICA:
${(discipline.bibliography?.basic || []).join('\n')}

BIBLIOGRAFIA COMPLEMENTAR:
${(discipline.bibliography?.complementar || discipline.bibliography?.complementary || []).join('\n')}
    `.trim();

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      onShowToast?.('Texto da ementa copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-syllabus-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Institutional Header */}
        <div className="bg-[#1e7e34] text-white p-4 sm:p-5 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-full bg-[#ce2029] -skew-x-12 transform origin-top-right opacity-90 pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-emerald-100">
              <span>IFS Campus Tobias Barreto</span>
              <span>·</span>
              <span>COINF</span>
              <span>·</span>
              <span>PPC Oficial</span>
            </div>
            <h2 id="modal-syllabus-title" className="text-lg sm:text-xl font-black font-display tracking-tight text-white flex items-center gap-2">
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-sm font-bold">
                {discipline.code}
              </span>
              <span>{discipline.name}</span>
            </h2>
            <p className="text-xs text-emerald-100">
              {course?.name} · {course?.resolution || 'Matriz Curricular'}
            </p>
          </div>

          <button
            onClick={() => {
              if (isSpeaking && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            aria-label="Fechar janela de ementa"
            className="relative z-10 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accessibility Toolbar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Sparkles className="w-4 h-4 text-[#1e7e34]" />
            <span>Ferramentas de Acessibilidade & Exportação:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Audio Reader */}
            <button
              onClick={handleToggleSpeech}
              aria-label={isSpeaking ? 'Pausar leitura em voz alta' : 'Ouvir ementa em voz alta'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition border ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-700" /> : <Volume2 className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isSpeaking ? 'Parar Leitura' : 'Ouvir Ementa'}</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopyText}
              aria-label="Copiar texto integral da ementa"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            {/* Print / Save */}
            <button
              onClick={handleBrowserPrint}
              aria-label="Imprimir documento oficial ou salvar pelo navegador"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg font-semibold text-xs transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimir</span>
            </button>

            {/* Direct PDF Download */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              aria-label={`Baixar arquivo PDF oficial da disciplina ${discipline.name}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e7e34] hover:bg-[#166534] text-white rounded-lg font-bold text-xs transition shadow-xs disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar PDF Oficial'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Accessible Document Preview */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 leading-relaxed font-sans">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Carga Horária</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {discipline.workloadHours}h relógio
              </span>
              <span className="text-[11px] text-slate-500 block">
                {discipline.workloadLessons || 0} horas-aula
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Aulas Semanais</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {discipline.weeklyHours || 4} aulas/sem
              </span>
              <span className="text-[11px] text-slate-500 block">
                {discipline.theoryHours || 0}h teór. · {discipline.practiceHours || 0}h prát.
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Pré-Requisito</span>
              <span className="text-xs font-semibold text-slate-800 line-clamp-2">
                {discipline.prerequisites || 'Sem pré-requisito'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Período / Ano</span>
              <span className="text-xs font-semibold text-slate-800">
                {discipline.semester}
              </span>
            </div>
          </div>

          {/* Section 1: Ementa Oficial */}
          <section aria-labelledby="heading-ementa-oficial" className="space-y-2">
            <h3 id="heading-ementa-oficial" className="text-sm font-black text-[#1e7e34] uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1e7e34]" />
              <span>1. Ementa Oficial do PPC Normatizado</span>
            </h3>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-[#248c3d]/25 text-slate-800 text-sm leading-relaxed font-serif">
              {discipline.syllabus || discipline.description}
            </div>
          </section>

          {/* Section 2: Objetivos */}
          {discipline.objectives && (
            <section aria-labelledby="heading-objetivos" className="space-y-2">
              <h3 id="heading-objetivos" className="text-sm font-black text-[#1e7e34] uppercase tracking-wide flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1e7e34]" />
                <span>2. Objetivos de Aprendizagem</span>
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed">
                {discipline.objectives}
              </div>
            </section>
          )}

          {/* Section 3: Conteúdo Programático */}
          {discipline.modules && discipline.modules.length > 0 && (
            <section aria-labelledby="heading-conteudo" className="space-y-2">
              <h3 id="heading-conteudo" className="text-sm font-black text-[#1e7e34] uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1e7e34]" />
                <span>3. Conteúdo Programático por Unidades ({discipline.modules.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {discipline.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#1e7e34] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Bibliografia */}
          {discipline.bibliography && (
            <section aria-labelledby="heading-bibliografia" className="space-y-3">
              <h3 id="heading-bibliografia" className="text-sm font-black text-[#1e7e34] uppercase tracking-wide flex items-center gap-2">
                <Library className="w-4 h-4 text-[#1e7e34]" />
                <span>4. Bibliografia Recomendada pelo PPC</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Básica */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wide text-[11px]">
                    Bibliografia Básica:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {(discipline.bibliography.basic || []).map((b, i) => (
                      <li key={i} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Complementar */}
                {(discipline.bibliography.complementar || discipline.bibliography.complementary || []).length > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1.5 uppercase tracking-wide text-[11px]">
                      Bibliografia Complementar:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {(discipline.bibliography.complementar || discipline.bibliography.complementary || []).map((c, i) => (
                        <li key={i} className="leading-snug">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>IFS Campus Tobias Barreto · Documento Oficial Acessível</span>
          <button
            onClick={() => {
              if (isSpeaking && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
