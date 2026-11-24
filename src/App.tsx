import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ClipboardPlus,
  FileCode2,
  ListChecks,
  Menu,
  Plus,
  X,
} from 'lucide-react';
import { INITIAL_DUMMY_PATIENTS } from './data/dummyPatients';
import { PatientStatus, TRIAGE_META, TriageCategory, TriagePatient } from './types/triase';
import { TriageQueue } from './components/TriageQueue';
import { TriageForm } from './components/TriageForm';
import { ArtifactsPanel } from './components/ArtifactsPanel';

type ActiveTab = 'queue' | 'form' | 'artifacts';

const STORAGE_KEY = 'simrs_sehat_sentosa_triase_igd_v1';

export default function App() {
  const [patients, setPatients] = useState<TriagePatient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback ke data dummy awal jika storage tidak tersedia
    }
    return INITIAL_DUMMY_PATIENTS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('queue');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch {
      // Abaikan kegagalan penulisan localStorage
    }
  }, [patients]);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const triageCounts = useMemo(() => {
    const counts: Record<TriageCategory, number> = {
      Merah: 0,
      Kuning: 0,
      Hijau: 0,
      Hitam: 0,
    };
    for (const p of patients) {
      counts[p.kategoriTriase] += 1;
    }
    return counts;
  }, [patients]);

  const handleSavePatient = (newPatient: TriagePatient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setActiveTab('queue');
    showToast(
      `Pasien ${newPatient.namaDummy} (${newPatient.noRm}) berhasil didaftarkan ke kategori ${newPatient.kategoriTriase}.`
    );
  };

  const handleUpdateStatus = (id: string, status: PatientStatus) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    showToast(`Status pelayanan pasien diperbarui menjadi ${status}.`);
  };

  const handleDeletePatient = (id: string) => {
    const target = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      showToast(`Data dummy ${target.noRm} telah dihapus dari antrean.`);
    }
  };

  const handleResetDemoData = () => {
    setPatients(INITIAL_DUMMY_PATIENTS);
    showToast('Daftar antrean dikembalikan ke data dummy awal.');
  };

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'queue',
      label: 'Antrean Triase IGD',
      icon: <ListChecks className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'form',
      label: 'Pendaftaran & Triase',
      icon: <ClipboardPlus className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'artifacts',
      label: 'Skema SQL & Artefak',
      icon: <FileCode2 className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
  ];

  const pageTitle =
    activeTab === 'queue'
      ? 'Antrean Triase IGD'
      : activeTab === 'form'
      ? 'Pendaftaran & Triase Baru'
      : 'Skema Basis Data & Artefak Proyek';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar Navigasi */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">
                  RS Sehat Sentosa
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  SIMRS · Modul IGD
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu"
              className="md:hidden p-1 text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1" aria-label="Navigasi utama">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-teal-50 text-teal-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Ringkasan Kategori Triase (tanpa pill statis) */}
          <div className="pt-5 border-t border-slate-200 space-y-3">
            <h2 className="text-xs font-semibold text-slate-500">Ringkasan Antrean Aktif</h2>
            <dl className="space-y-2 text-xs">
              {(['Merah', 'Kuning', 'Hijau', 'Hitam'] as TriageCategory[]).map((cat) => {
                const meta = TRIAGE_META[cat];
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <dt className="flex items-center gap-2 text-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-xs ${meta.dotColor}`} aria-hidden="true" />
                      <span>{cat}</span>
                    </dt>
                    <dd className="font-mono tabular-nums font-semibold text-slate-900">
                      {triageCounts[cat]}
                    </dd>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <dt className="font-medium text-slate-900">Total Pasien Dummy</dt>
                <dd className="font-mono tabular-nums font-semibold text-slate-900">
                  {patients.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-700">Mode Simulasi Non-PII</p>
          <p>Hanya gunakan data dummy dan NIK teranonimisasi.</p>
        </div>
      </aside>

      {/* Backdrop mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Kontekstual */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu"
              className="md:hidden p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-500 hidden sm:inline whitespace-nowrap">
                SIMRS IGD
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
                /
              </span>
              <h1 className="font-semibold text-slate-900 truncate">{pageTitle}</h1>
            </div>
          </div>

          <div className="shrink-0">
            {activeTab !== 'form' ? (
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Pasien Triase Baru
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                Lihat Antrean IGD
              </button>
            )}
          </div>
        </header>

        {/* Banner notifikasi aksi */}
        {toast && (
          <div className="px-6 pt-4">
            <div
              role="status"
              className="bg-teal-50 border border-teal-200 text-teal-900 px-4 py-2.5 rounded-md text-xs font-medium flex items-center justify-between gap-3"
            >
              <span>{toast}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Tutup notifikasi"
                className="text-teal-700 hover:text-teal-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'queue' && (
            <TriageQueue
              patients={patients}
              onUpdateStatus={handleUpdateStatus}
              onDeletePatient={handleDeletePatient}
              onOpenNewForm={() => setActiveTab('form')}
              onResetDemoData={handleResetDemoData}
            />
          )}

          {activeTab === 'form' && (
            <TriageForm
              existingNoRms={patients.map((p) => p.noRm)}
              onSave={handleSavePatient}
              onCancel={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'artifacts' && <ArtifactsPanel onNotify={showToast} />}
        </main>
      </div>
    </div>
  );
}
