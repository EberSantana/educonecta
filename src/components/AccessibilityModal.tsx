import React, { useEffect, useRef } from 'react';
import {
  X,
  Eye,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Keyboard,
  ExternalLink,
  MessageCircle,
  ZoomIn,
  Contrast,
  Languages,
} from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const legalFramework = [
    {
      norm: 'Lei nº 13.146/2015 (Lei Brasileira de Inclusão, art. 63)',
      establishes:
        'Torna obrigatória a acessibilidade nos sítios da internet mantidos por empresas e órgãos públicos.',
      response:
        'Páginas com navegação estruturada por teclado, contraste adequado, hierarquia semântica de cabeçalhos e suporte pleno a leitores de tela (NVDA, Orca, TalkBack).',
      status: 'Atendido (WCAG 2.1 AA)',
    },
    {
      norm: 'Lei nº 10.098/2000',
      establishes:
        'Normas gerais e critérios básicos para a promoção da acessibilidade, inclusive nos meios de comunicação e informação.',
      response:
        'Uso do portal com segurança e autonomia por discentes e docentes, sem depender exclusivamente de mouse, touch ou resolução fixa.',
      status: 'Atendido',
    },
    {
      norm: 'Decreto nº 5.296/2004',
      establishes:
        'Regulamenta a Lei 10.098 e estabelece diretrizes de acessibilidade nos portais e sítios da administração pública brasileira.',
      response:
        'Implementação rigorosa das diretrizes do e-MAG (Modelo de Acessibilidade em Governo Eletrônico).',
      status: 'Atendido (e-MAG)',
    },
    {
      norm: 'Lei nº 10.436/2002 e Decreto nº 5.626/2005',
      establishes:
        'Reconhecem a Língua Brasileira de Sinais (Libras) como meio legal de comunicação e expressão.',
      response:
        'Widget oficial VLibras do Governo Federal integrado e disponível em todas as páginas do portal para tradução digital para Libras.',
      status: 'Atendido (VLibras)',
    },
    {
      norm: 'e-MAG (Modelo de Acessibilidade em Governo Eletrônico)',
      establishes:
        'Recomendações e boas práticas de acessibilidade para sítios e sistemas do governo federal e instituições federais de ensino.',
      response:
        'Estruturação por marcos semânticos (banner, navegação, conteúdo principal e rodapé), atalhos de salto e verificação no padrão do ASES.',
      status: 'Atendido',
    },
    {
      norm: 'WCAG 2.1 nível AA (W3C)',
      establishes:
        'Padrão internacional de acessibilidade digital que fundamenta o e-MAG.',
      response:
        'Auditado e validado com o motor axe-core nos temas claro e escuro, sem falhas de contraste de texto, botões sem rótulos ou elementos inacessíveis.',
      status: 'Conforme AA',
    },
    {
      norm: 'Lei nº 13.709/2018 (LGPD)',
      establishes:
        'Lei Geral de Proteção de Dados Pessoais.',
      response:
        'Tratamento ético e seguro de matrículas, notas, diários de classe e materiais dos estudantes, sem rastreadores comerciais externos.',
      status: 'Conforme',
    },
  ];

  const shortcuts = [
    { key: 'Tab', desc: 'Avança para o próximo elemento interativo (links, botões, campos).' },
    { key: 'Shift + Tab', desc: 'Retorna para o elemento interativo anterior.' },
    { key: 'Enter / Espaço', desc: 'Ativa o botão, expande acordeão ou abre o link selecionado.' },
    { key: 'Esc', desc: 'Fecha a janela modal ou menu aberto e retorna o foco à tela.' },
    { key: 'Alt + 1', desc: 'Pula diretamente para o conteúdo principal (Bypass Blocks).' },
    { key: 'Alt + 2', desc: 'Pula diretamente para a barra de navegação de cursos e matérias.' },
    { key: 'Alt + 3', desc: 'Abre esta Declaração de Acessibilidade e Base Legal.' },
    { key: 'Alt + 4', desc: 'Alterna rapidamente o modo de Alto Contraste.' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-accessibility-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Institucional IF */}
        <div className="px-6 py-5 bg-[#1e7e34] text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-100 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Conformidade com WCAG 2.1 nível AA e e-MAG</span>
            </div>
            <h2 id="modal-accessibility-title" className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Acessibilidade Digital & Base Legal do Portal
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              EduConecta IFS · Campus Tobias Barreto · Coordenação de Informática (COINF)
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#166534] transition focus:ring-2 focus:ring-white"
            aria-label="Fechar janela de acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faixa Vermelha Oficial IF */}
        <div className="h-1 bg-[#ce2029]" />

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {/* Quick Adjustment Controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#1e7e34]" />
              Ferramentas Rápidas de Acessibilidade
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {/* High Contrast Toggle */}
              <button
                onClick={onToggleHighContrast}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs transition border ${
                  highContrast
                    ? 'bg-black text-yellow-300 border-yellow-400 ring-2 ring-yellow-400'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
                aria-pressed={highContrast}
              >
                <Contrast className="w-4 h-4" />
                <span>{highContrast ? 'Alto Contraste: Ativo' : 'Ativar Alto Contraste (Alt + 4)'}</span>
              </button>

              {/* Font Size Adjusters */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1">
                <span className="text-[11px] text-slate-500 font-semibold px-2 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Tamanho do Texto:
                </span>
                <button
                  onClick={() => onChangeFontSize('normal')}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition ${
                    fontSize === 'normal'
                      ? 'bg-[#1e7e34] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label="Tamanho de fonte normal 100%"
                >
                  A
                </button>
                <button
                  onClick={() => onChangeFontSize('large')}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition ${
                    fontSize === 'large'
                      ? 'bg-[#1e7e34] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label="Aumentar fonte para 115%"
                >
                  A+
                </button>
                <button
                  onClick={() => onChangeFontSize('xlarge')}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition ${
                    fontSize === 'xlarge'
                      ? 'bg-[#1e7e34] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label="Aumentar fonte para 130%"
                >
                  A++
                </button>
              </div>

              {/* VLibras Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e8f5e9] border border-[#248c3d]/40 rounded-lg text-xs font-semibold text-[#166534]">
                <Languages className="w-4 h-4 text-[#1e7e34]" />
                <span>VLibras Ativo no Canto Direito da Tela</span>
              </div>
            </div>
          </div>

          {/* Legal Framework Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-[#1e7e34]" />
              Base Legal e Normas de Acessibilidade Digital no Brasil
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              O portal EduConecta foi concebido para atender rigorosamente à legislação brasileira de inclusão social e digital:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th scope="col" className="p-3 w-1/4">Norma Legal</th>
                    <th scope="col" className="p-3 w-1/3">O que estabelece</th>
                    <th scope="col" className="p-3">Como o portal responde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {legalFramework.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-semibold text-slate-900 align-top">
                        <div>{item.norm}</div>
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e8f5e9] text-[#166534] border border-[#248c3d]/30">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 align-top">
                        {item.establishes}
                      </td>
                      <td className="p-3 text-slate-800 align-top font-medium">
                        {item.response}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Keyboard Shortcuts Guide */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display mb-2 flex items-center gap-2">
              <Keyboard className="w-4.5 h-4.5 text-[#1e7e34]" />
              Navegação Completa por Teclado e Teclas de Atalho
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Todos os elementos interativos do portal respondem a comandos universais de teclado, permitindo navegação fluida sem necessidade do mouse:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shortcuts.map((sc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-2xs text-[11px] shrink-0">
                    {sc.key}
                  </kbd>
                  <span className="text-slate-600">{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reporting Accessibility Barriers */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-950 mb-0.5">
                Canal para Reportar Barreiras de Acessibilidade
              </div>
              <p className="leading-relaxed">
                A verificação automática com o motor <strong>axe-core</strong> e <strong>e-MAG</strong> não substitui o teste com pessoas. Se você encontrar qualquer barreira de acesso, dificuldade de contraste, foco ou incompatibilidade com seu leitor de tela, comunique diretamente ao coordenador e professor:
              </p>
              <div className="mt-2 font-semibold text-slate-900">
                Prof. Eber Santana · Coordenação de Informática (COINF) · <span className="font-mono text-emerald-800">eberss@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Conformidade WCAG 2.1 AA · e-MAG · Lei nº 13.146/2015
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1e7e34] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg transition shadow-xs"
          >
            Fechar Declaração
          </button>
        </div>
      </div>
    </div>
  );
};
