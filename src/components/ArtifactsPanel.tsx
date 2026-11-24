import React, { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { PRACTICUM_ARTIFACTS } from '../data/practicumArtifacts';

interface ArtifactsPanelProps {
  onNotify: (message: string) => void;
}

export function ArtifactsPanel({ onNotify }: ArtifactsPanelProps) {
  const [activeId, setActiveId] = useState<string>(PRACTICUM_ARTIFACTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeArtifact =
    PRACTICUM_ARTIFACTS.find((a) => a.id === activeId) ?? PRACTICUM_ARTIFACTS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeArtifact.content);
      setCopiedId(activeArtifact.id);
      onNotify(`Isi file ${activeArtifact.filename} berhasil disalin ke clipboard.`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onNotify('Gagal menyalin otomatis. Silakan blok teks lalu tekan Ctrl+C.');
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify(`File ${filename} berhasil diunduh.`);
  };

  return (
    <div className="space-y-6">
      {/* Pemilih file artefak */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md overflow-x-auto">
          {PRACTICUM_ARTIFACTS.map((artifact) => {
            const active = artifact.id === activeArtifact.id;
            return (
              <button
                key={artifact.id}
                type="button"
                onClick={() => setActiveId(artifact.id)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {artifact.filename}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedId === activeArtifact.id ? (
              <Check className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            {copiedId === activeArtifact.id ? 'Tersalin' : 'Salin Kode'}
          </button>
          <button
            type="button"
            onClick={() => handleDownload(activeArtifact.filename, activeArtifact.content)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Unduh {activeArtifact.filename}
          </button>
        </div>
      </div>

      {/* Konten kode & keterangan */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-slate-900">{activeArtifact.filename}</span>
            <span aria-hidden="true">·</span>
            <span>{activeArtifact.role}</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">{activeArtifact.title}</h3>
          <p className="text-sm text-slate-600">{activeArtifact.description}</p>
        </div>

        <pre className="p-5 bg-slate-950 text-slate-100 text-xs font-mono leading-relaxed overflow-x-auto max-h-[540px]">
          <code>{activeArtifact.content}</code>
        </pre>
      </div>
    </div>
  );
}
