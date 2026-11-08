import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Video, Code, BookOpen, Link2, Check, AlertCircle, Cloud } from 'lucide-react';
import { Discipline, Material, MaterialType } from '../types';

interface AddMaterialModalProps {
  disciplines: Discipline[];
  defaultDisciplineId: string;
  onAddMaterial: (material: Material) => void;
  onClose: () => void;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  disciplines,
  defaultDisciplineId,
  onAddMaterial,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [disciplineId, setDisciplineId] = useState(
    defaultDisciplineId !== 'all' ? defaultDisciplineId : disciplines[0]?.id || ''
  );

  const selectedDiscipline = disciplines.find((d) => d.id === disciplineId);

  const [module, setModule] = useState(selectedDiscipline?.modules[0] || 'Módulo Geral');
  const [customModule, setCustomModule] = useState('');
  const [isNewModule, setIsNewModule] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MaterialType>('pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [contentSnippet, setContentSnippet] = useState('');
  const [lessonNumber, setLessonNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);

      // Auto-set title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Format size
      const bytes = file.size;
      const sizeStr =
        bytes > 1024 * 1024
          ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(bytes / 1024)} KB`;
      setFileSize(sizeStr);

      // Detect type
      const lower = file.name.toLowerCase();
      if (lower.endsWith('.pdf')) setType('pdf');
      else if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) setType('slides');
      else if (lower.endsWith('.zip') || lower.endsWith('.js') || lower.endsWith('.java') || lower.endsWith('.py')) setType('code');
      else if (lower.endsWith('.mp4') || lower.endsWith('.mkv')) setType('video');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Informe o título do material.');
      return;
    }
    if (!description.trim()) {
      setError('Informe uma breve descrição do material.');
      return;
    }

    const finalModule = isNewModule && customModule.trim() ? customModule.trim() : module;

    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      disciplineId,
      courseId: selectedDiscipline?.courseId || 'course-tds',
      lessonNumber: lessonNumber.trim() ? parseInt(lessonNumber.trim(), 10) : undefined,
      module: finalModule,
      title: title.trim(),
      description: description.trim(),
      type,
      fileSize: type === 'link' || type === 'video' ? undefined : fileSize,
      externalUrl: externalUrl.trim() || undefined,
      dateAdded: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      contentSnippet: contentSnippet.trim() || undefined,
    };

    onAddMaterial(newMaterial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-6">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Publicar Novo Material Didático
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Envie apostilas, slides, listas ou links para os estudantes do IFS Tobias Barreto
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Discipline Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Disciplina / Matéria *
            </label>
            <select
              value={disciplineId}
              onChange={(e) => {
                setDisciplineId(e.target.value);
                const disc = disciplines.find((d) => d.id === e.target.value);
                if (disc && disc.modules.length > 0) {
                  setModule(disc.modules[0]);
                }
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name} ({d.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Module selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Módulo / Unidade Temática
              </label>
              <button
                type="button"
                onClick={() => setIsNewModule(!isNewModule)}
                className="text-[11px] text-indigo-600 hover:underline"
              >
                {isNewModule ? 'Escolher módulo existente' : '+ Criar novo módulo'}
              </button>
            </div>

            {isNewModule ? (
              <input
                type="text"
                placeholder="Ex: Módulo 5: Árvores B e Índices"
                value={customModule}
                onChange={(e) => setCustomModule(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {selectedDiscipline?.modules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Linked Lesson (Optional) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vincular a uma Aula da Ementa (Opcional)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              placeholder="Ex: 1 para Aula 01, 4 para Aula 04..."
              value={lessonNumber}
              onChange={(e) => setLessonNumber(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Identifica a aula no cronograma para que o estudante baixe o material diretamente da ementa.
            </p>
          </div>

          {/* Type Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Tipo de Recurso
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'slides', label: 'Slides', icon: BookOpen },
                { id: 'video', label: 'Vídeo', icon: Video },
                { id: 'exercise', label: 'Exercício', icon: FileText },
                { id: 'code', label: 'Código', icon: Code },
                { id: 'link', label: 'Link Web', icon: Link2 },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as MaterialType)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real File Upload Zone */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload de Arquivo do Computador</span>
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>Google Drive & Nuvem</span>
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.pptx,.ppt,.docx,.doc,.zip,.java,.py,.js,.html,.css,.mp4"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white p-4 rounded-lg text-center cursor-pointer transition"
            >
              <Upload className="w-6 h-6 mx-auto text-indigo-500 mb-1" />
              {uploadedFileName ? (
                <div className="text-emerald-700 font-bold">
                  ✓ Arquivo carregado: {uploadedFileName} ({fileSize})
                </div>
              ) : (
                <div>
                  <span className="font-semibold text-indigo-600">Clique para selecionar o arquivo</span> ou arraste aqui
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Suporta PDF, Slides (PPTX), Documentos (DOCX), Códigos (.java, .py) ou ZIP
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título do Material *
            </label>
            <input
              type="text"
              placeholder="Ex: Apostila de Estruturas Balanceadas e Exemplos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Breve Descrição / Instruções aos Alunos *
            </label>
            <textarea
              rows={2}
              placeholder="Descreva o que o material aborda e como os estudantes devem utilizá-lo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* URL or File Size */}
          {type === 'video' || type === 'link' ? (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                URL do Link / Vídeo
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/... ou https://meet.google.com/..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tamanho Registrado do Arquivo
              </label>
              <input
                type="text"
                placeholder="Ex: 3.5 MB"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Content snippet preview */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Trecho Didático / Sumário / Código para Pré-visualização
            </label>
            <textarea
              rows={3}
              placeholder="Cole aqui o sumário da aula, código de exemplo ou tópicos principais..."
              value={contentSnippet}
              onChange={(e) => setContentSnippet(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1e7e34] text-white rounded-lg font-bold hover:bg-[#166534] transition shadow-sm"
            >
              Publicar Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
