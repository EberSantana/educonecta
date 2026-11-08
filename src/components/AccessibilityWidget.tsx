import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Image as ImageIcon,
  EyeOff,
  Palette,
  Type,
  ZoomIn,
  ZoomOut,
  Sparkles,
  RotateCcw,
  BookOpen,
  X,
  Play,
  Square,
  Pause,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  Link,
  ShieldCheck,
  MousePointerClick,
} from 'lucide-react';

export type AccessibilityProfile =
  | 'default'
  | 'low_vision'
  | 'dyslexia'
  | 'adhd'
  | 'daltonism';

export type BackgroundTheme = 'padrao' | 'escuro' | 'sepia' | 'amarelo-preto';
export type FontSizeLevel = 'small' | 'normal' | 'large' | 'xlarge';

interface AccessibilityWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLegalModal: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  isOpen,
  onClose,
  onOpenLegalModal,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
}) => {
  // Estado das Funcionalidades Inspiradas no Audima
  const [profile, setProfile] = useState<AccessibilityProfile>('default');
  const [touchToSpeakActive, setTouchToSpeakActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [hideImages, setHideImages] = useState(false);
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('padrao');
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [monochrome, setMonochrome] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Posição da Régua de Leitura
  const [rulerY, setRulerY] = useState(250);

  // Efeito da Régua de Leitura
  useEffect(() => {
    if (!readingRuler) return;
    const handleMouseMove = (e: MouseEvent) => {
      setRulerY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  // Efeito de Esconder Imagens
  useEffect(() => {
    if (hideImages) {
      document.body.classList.add('a11y-hide-images');
    } else {
      document.body.classList.remove('a11y-hide-images');
    }
  }, [hideImages]);

  // Efeito Monocromático
  useEffect(() => {
    if (monochrome) {
      document.body.classList.add('a11y-monochrome');
    } else {
      document.body.classList.remove('a11y-monochrome');
    }
  }, [monochrome]);

  // Efeito Fonte Dislexia
  useEffect(() => {
    if (dyslexiaFont) {
      document.body.classList.add('a11y-dyslexia-font');
    } else {
      document.body.classList.remove('a11y-dyslexia-font');
    }
  }, [dyslexiaFont]);

  // Efeito Destacar Links
  useEffect(() => {
    if (highlightLinks) {
      document.body.classList.add('a11y-highlight-links');
    } else {
      document.body.classList.remove('a11y-highlight-links');
    }
  }, [highlightLinks]);

  // Efeito Cor de Fundo
  useEffect(() => {
    document.body.classList.remove('a11y-bg-sepia', 'a11y-bg-dark', 'a11y-bg-yellow-black');
    if (bgTheme === 'sepia') {
      document.body.classList.add('a11y-bg-sepia');
    } else if (bgTheme === 'escuro') {
      document.body.classList.add('a11y-bg-dark');
    } else if (bgTheme === 'amarelo-preto') {
      document.body.classList.add('a11y-bg-yellow-black');
    }
  }, [bgTheme]);

  // Toque para Ouvir (Leitor de Tela Web Speech API)
  useEffect(() => {
    if (!touchToSpeakActive) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpokenText('');
      return;
    }

    const handleTextClick = (e: MouseEvent) => {
      // Ignorar cliques dentro do próprio painel do widget
      const widgetElement = document.getElementById('a11y-widget-panel');
      if (widgetElement && widgetElement.contains(e.target as Node)) {
        return;
      }

      const target = e.target as HTMLElement;
      if (!target) return;

      const text =
        target.innerText ||
        target.textContent ||
        target.getAttribute('aria-label') ||
        target.getAttribute('title');

      if (text && text.trim().length > 0) {
        speakText(text.trim(), target);
      }
    };

    document.addEventListener('click', handleTextClick);
    return () => document.removeEventListener('click', handleTextClick);
  }, [touchToSpeakActive]);

  const speakText = (text: string, elementToHighlight?: HTMLElement) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não suporta a síntese de voz (Web Speech API).');
      return;
    }

    window.speechSynthesis.cancel();

    // Destaque visual temporário no elemento falado
    if (elementToHighlight) {
      elementToHighlight.classList.add('a11y-speaking-highlight');
      setTimeout(() => {
        elementToHighlight.classList.remove('a11y-speaking-highlight');
      }, 3500);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentSpokenText(text.length > 60 ? text.substring(0, 60) + '...' : text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpokenText('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpokenText('');
    }
  };

  const handlePauseResumeSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Descrever Imagens da Tela (Audiodescrição das figuras do IFS)
  const handleDescribeImages = () => {
    const images = Array.from(document.querySelectorAll('img'));
    const descriptions: string[] = [];

    images.forEach((img, idx) => {
      const alt = img.getAttribute('alt');
      const title = img.getAttribute('title');
      if (alt || title) {
        descriptions.push(`Imagem ${idx + 1}: ${alt || title}.`);
      }
    });

    if (descriptions.length === 0) {
      speakText('Não há imagens com descrições gráficas na área visível da página.');
    } else {
      speakText(`Audiodescrição das imagens do portal: ${descriptions.join(' ')}`);
    }
  };

  // Alterar Cor de Fundo em Ciclo
  const cycleBackground = () => {
    if (bgTheme === 'padrao') setBgTheme('escuro');
    else if (bgTheme === 'escuro') setBgTheme('sepia');
    else if (bgTheme === 'sepia') setBgTheme('amarelo-preto');
    else setBgTheme('padrao');
  };

  // Aumentar e Diminuir Fonte
  const handleIncreaseFont = () => {
    if (fontSize === 'normal') onChangeFontSize('large');
    else if (fontSize === 'large') onChangeFontSize('xlarge');
  };

  const handleDecreaseFont = () => {
    if (fontSize === 'xlarge') onChangeFontSize('large');
    else if (fontSize === 'large') onChangeFontSize('normal');
  };

  // Aplicar Perfis de Acessibilidade Pré-definidos
  const handleApplyProfile = (selectedProfile: AccessibilityProfile) => {
    setProfile(selectedProfile);

    // Reset anterior
    setHideImages(false);
    setMonochrome(false);
    setDyslexiaFont(false);
    setReadingRuler(false);
    setHighlightLinks(false);
    setBgTheme('padrao');

    if (selectedProfile === 'low_vision') {
      onChangeFontSize('xlarge');
      onToggleHighContrast();
      setHighlightLinks(true);
    } else if (selectedProfile === 'dyslexia') {
      onChangeFontSize('large');
      setDyslexiaFont(true);
      setReadingRuler(true);
    } else if (selectedProfile === 'adhd') {
      setHideImages(true);
      setBgTheme('sepia');
      setReadingRuler(true);
    } else if (selectedProfile === 'daltonism') {
      setMonochrome(true);
      setHighlightLinks(true);
    } else if (selectedProfile === 'default') {
      onChangeFontSize('normal');
      if (highContrast) onToggleHighContrast();
    }
  };

  // Redefinir Tudo para os Padrões
  const handleResetAll = () => {
    setProfile('default');
    setTouchToSpeakActive(false);
    handleStopSpeech();
    setHideImages(false);
    setBgTheme('padrao');
    setDyslexiaFont(false);
    setMonochrome(false);
    setReadingRuler(false);
    setHighlightLinks(false);
    onChangeFontSize('normal');
    if (highContrast) onToggleHighContrast();
  };

  return (
    <>
      {/* Régua de Leitura Ativa (se habilitada) */}
      {readingRuler && (
        <div
          className="a11y-reading-ruler"
          style={{ top: `${rulerY}px` }}
          aria-hidden="true"
        />
      )}

      {/* Mini Player Flutuante quando "Toque para Ouvir" está ligado */}
      {touchToSpeakActive && (
        <div
          role="region"
          aria-label="Controle de Leitura por Voz"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl border border-emerald-500/50 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-3"
        >
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Volume2 className="w-4 h-4" />
            <span>Toque para Ouvir Ativo</span>
          </div>

          {currentSpokenText && (
            <span className="max-w-[180px] sm:max-w-xs truncate text-[11px] text-slate-300 font-normal">
              "{currentSpokenText}"
            </span>
          )}

          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            {isSpeaking && (
              <button
                onClick={handlePauseResumeSpeech}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title={isPaused ? 'Retomar fala' : 'Pausar fala'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              onClick={handleStopSpeech}
              className="p-1 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300"
              title="Interromper fala"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTouchToSpeakActive(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-[10px]"
              title="Desativar modo de leitura"
            >
              Desativar
            </button>
          </div>
        </div>
      )}

      {/* Painel de Acessibilidade Flutuante (Estilo Audima) */}
      {isOpen && (
        <div
          id="a11y-widget-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-widget-title"
          className="fixed top-16 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] max-h-[85vh] overflow-y-auto bg-slate-900/95 backdrop-blur-2xl text-slate-100 rounded-3xl shadow-2xl border border-slate-700/80 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* 1. Header do Painel */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight font-medium">
                  Acessibilidade Digital · IFS
                </span>
                <h2 id="a11y-widget-title" className="text-sm font-extrabold text-white leading-tight">
                  Painel de Inclusão
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  soundEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={soundEnabled ? 'Áudio Habilitado' : 'Áudio Desabilitado'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenLegalModal}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:text-yellow-300 text-slate-400 transition"
                title="Conformidade Legal (LBI Lei 13.146/2015, e-MAG)"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                aria-label="Fechar painel de acessibilidade"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 border border-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Seletor de Perfil de Acessibilidade */}
          <div>
            <label
              htmlFor="a11y-profile-select"
              className="block text-[11px] font-semibold text-slate-300 mb-1.5"
            >
              Selecione seu perfil de acessibilidade:
            </label>
            <div className="relative">
              <select
                id="a11y-profile-select"
                value={profile}
                onChange={(e) => handleApplyProfile(e.target.value as AccessibilityProfile)}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-3 py-2.5 appearance-none border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 cursor-pointer pr-9 shadow-inner transition"
              >
                <option value="default">Padrão do Sistema</option>
                <option value="low_vision">Visão Reduzida / Baixa Visão</option>
                <option value="dyslexia">Dislexia / Leitura Facilitada</option>
                <option value="adhd">TDAH / Foco e Baixa Distração</option>
                <option value="daltonism">Daltonismo / Escala de Cinza</option>
              </select>
              <ChevronDown className="w-4 h-4 text-emerald-200 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Grid de Funcionalidades Inspiradas no Audima */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: Toque para Ouvir */}
            <button
              onClick={() => {
                const next = !touchToSpeakActive;
                setTouchToSpeakActive(next);
                if (next) {
                  speakText(
                    'Modo Toque para Ouvir ativado. Clique em qualquer texto da tela para ouvir a leitura.'
                  );
                }
              }}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] relative ${
                touchToSpeakActive
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <Volume2 className={`w-5 h-5 ${touchToSpeakActive ? 'text-white' : 'text-emerald-400'}`} />
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <div className="text-xs font-bold leading-tight">
                Toque para Ouvir
                <span className="block text-[10px] font-normal opacity-80">
                  {touchToSpeakActive ? 'Ativo (clique no texto)' : 'Leitor de tela'}
                </span>
              </div>
            </button>

            {/* Card 2: Descrever Imagem */}
            <button
              onClick={handleDescribeImages}
              className="p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-teal-400" />
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <div className="text-xs font-bold leading-tight">
                Descrever Imagem
                <span className="block text-[10px] font-normal opacity-80">Audiodescrição</span>
              </div>
            </button>

            {/* Card 3: Esconder Imagens */}
            <button
              onClick={() => setHideImages(!hideImages)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] ${
                hideImages
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <EyeOff className={`w-5 h-5 ${hideImages ? 'text-white' : 'text-slate-400'}`} />
              <div className="text-xs font-bold leading-tight">
                Esconder Imagens
                <span className="block text-[10px] font-normal opacity-80">
                  {hideImages ? 'Ocultadas' : 'Visíveis'}
                </span>
              </div>
            </button>

            {/* Card 4: Alterar Cor de Fundo */}
            <button
              onClick={cycleBackground}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] ${
                bgTheme !== 'padrao'
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Palette className="w-5 h-5 text-amber-400" />
              <div className="text-xs font-bold leading-tight">
                Cor de Fundo
                <span className="block text-[10px] font-normal capitalize opacity-80">
                  {bgTheme === 'padrao'
                    ? 'Padrão'
                    : bgTheme === 'sepia'
                    ? 'Sépia Suave'
                    : bgTheme === 'escuro'
                    ? 'Escuro'
                    : 'Amarelo no Preto'}
                </span>
              </div>
            </button>

            {/* Card 5: Alterar Cor do Texto / Fonte Dislexia */}
            <button
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] ${
                dyslexiaFont
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Type className={`w-5 h-5 ${dyslexiaFont ? 'text-white' : 'text-sky-400'}`} />
              <div className="text-xs font-bold leading-tight">
                Fonte Legível
                <span className="block text-[10px] font-normal opacity-80">
                  {dyslexiaFont ? 'Fonte Aberta (Ativa)' : 'Fonte Padrão'}
                </span>
              </div>
            </button>

            {/* Card 6: Aumentar Fonte */}
            <button
              onClick={handleIncreaseFont}
              className="p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600"
            >
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm">A</span>
                <span className="text-xs font-bold">↑</span>
              </div>
              <div className="text-xs font-bold leading-tight">
                Aumentar Fonte
                <span className="block text-[10px] font-normal opacity-80">
                  Atual: {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}
                </span>
              </div>
            </button>

            {/* Card 7: Diminuir Fonte */}
            <button
              onClick={handleDecreaseFont}
              className="p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600"
            >
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm">A</span>
                <span className="text-xs font-bold">↓</span>
              </div>
              <div className="text-xs font-bold leading-tight">
                Diminuir Fonte
                <span className="block text-[10px] font-normal opacity-80">Restaurar tamanho</span>
              </div>
            </button>

            {/* Card 8: Monocromático */}
            <button
              onClick={() => setMonochrome(!monochrome)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[88px] ${
                monochrome
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="w-5 h-5 rounded-full border border-slate-400 bg-gradient-to-r from-white to-black" />
              <div className="text-xs font-bold leading-tight">
                Monocromático
                <span className="block text-[10px] font-normal opacity-80">
                  {monochrome ? 'Escala de Cinza' : 'Cores Ativas'}
                </span>
              </div>
            </button>
          </div>

          {/* 4. Ferramentas Adicionais (Régua de Leitura & Destacar Links) */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setReadingRuler(!readingRuler)}
                className={`px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition text-[11px] ${
                  readingRuler
                    ? 'bg-yellow-400 text-slate-900 border-yellow-300 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>📏 Régua de Leitura</span>
              </button>

              <button
                onClick={() => setHighlightLinks(!highlightLinks)}
                className={`px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition text-[11px] ${
                  highlightLinks
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Destacar Links</span>
              </button>
            </div>

            {/* Botão de Redefinir Tudo e Base Legal */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleResetAll}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Redefinir Tudo</span>
              </button>

              <button
                onClick={onOpenLegalModal}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WCAG 2.1 AA / LBI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
