import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  ClipboardPlus,
  FileSpreadsheet,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Stethoscope,
  UserCircle2,
  X,
} from 'lucide-react';
import { INITIAL_SIMRS_VISITS } from './data/simrsMasterData';
import {
  ActiveMenu,
  IgdVisitRecord,
  TriageAssessment,
  TriageLevel,
  VisitStatus,
} from './types/simrs';
import { DashboardView } from './components/DashboardView';
import { PendaftaranIgdView } from './components/PendaftaranIgdView';
import { TriaseAsuhanView } from './components/TriaseAsuhanView';
import { DataKunjunganView } from './components/DataKunjunganView';
import { LaporanIgdView } from './components/LaporanIgdView';
import { PengaturanView, ProfilPenggunaView } from './components/SettingsProfileViews';

const STORAGE_KEY = 'sehat_sentosa_emergency_care_v2';

export default function App() {
  const [visits, setVisits] = useState<IgdVisitRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Gunakan seed awal bila localStorage tidak tersedia
    }
    return INITIAL_SIMRS_VISITS;
  });

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTriaseVisitId, setSelectedTriaseVisitId] = useState<string | null>(
    visits[0]?.id_pendaftaran ?? null
  );
  const [kunjunganFilterTriage, setKunjunganFilterTriage] = useState<'Semua' | TriageLevel>('Semua');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [clockText, setClockText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    } catch {
      // Abaikan error kuota penyimpanan lokal
    }
  }, [visits]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockText(
        now.toLocaleString('id-ID', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const handleRegisterVisit = (newVisit: IgdVisitRecord) => {
    setVisits((prev) => [newVisit, ...prev]);
    setSelectedTriaseVisitId(newVisit.id_pendaftaran);
    setActiveMenu('triase');
    showToast(
      `Simulasi pendaftaran berhasil: ${newVisit.nama_lengkap} (No. RM ${newVisit.no_rm}) disimpan ke penyimpanan lokal.`
    );
  };

  const handleSaveAssessment = (
    idPendaftaran: string,
    kategoriTriase: TriageLevel,
    assessment: TriageAssessment
  ) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id_pendaftaran === idPendaftaran
          ? {
              ...v,
              kategori_triase: kategoriTriase,
              asuhan: assessment,
              status_kunjungan:
                v.status_kunjungan === 'Menunggu Triase'
                  ? 'Dalam Penanganan'
                  : v.status_kunjungan,
            }
          : v
      )
    );
    showToast(
      `Pengkajian Triase & Asuhan untuk ${idPendaftaran} berhasil diperbarui secara lokal (Simulasi).`
    );
  };

  const handleUpdateVisitStatus = (idPendaftaran: string, status: VisitStatus) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id_pendaftaran === idPendaftaran ? { ...v, status_kunjungan: status } : v
      )
    );
    showToast(`Status kunjungan ${idPendaftaran} diperbarui menjadi "${status}".`);
  };

  const handleResetAllData = () => {
    setVisits(INITIAL_SIMRS_VISITS);
    setSelectedTriaseVisitId(INITIAL_SIMRS_VISITS[0].id_pendaftaran);
    showToast('Seluruh data simulasi IGD telah dikembalikan ke kondisi awal.');
  };

  const globalSearchMatches = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return visits
      .filter(
        (v) =>
          v.no_rm.toLowerCase().includes(q) ||
          v.nama_lengkap.toLowerCase().includes(q) ||
          v.id_pendaftaran.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [globalSearch, visits]);

  const urgentNotifications = useMemo(
    () =>
      visits.filter(
        (v) => v.kategori_triase === 'Merah' || v.status_kunjungan === 'Menunggu Triase'
      ),
    [visits]
  );

  const menuItems: Array<{ id: ActiveMenu; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'pendaftaran', label: 'Pendaftaran IGD', icon: <ClipboardPlus className="w-4 h-4 shrink-0" /> },
    { id: 'triase', label: 'Triase & Asuhan IGD', icon: <Stethoscope className="w-4 h-4 shrink-0" /> },
    { id: 'kunjungan', label: 'Data Kunjungan', icon: <FileSpreadsheet className="w-4 h-4 shrink-0" /> },
    { id: 'laporan', label: 'Laporan IGD', icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4 shrink-0" /> },
    { id: 'profil', label: 'Profil Pengguna', icon: <UserCircle2 className="w-4 h-4 shrink-0" /> },
  ];

  const pageTitles: Record<ActiveMenu, string> = {
    dashboard: 'Dashboard IGD',
    pendaftaran: 'Pendaftaran Pasien IGD',
    triase: 'Triase & Asuhan Keperawatan IGD',
    kunjungan: 'Data Kunjungan IGD',
    laporan: 'Laporan Statistik IGD',
    pengaturan: 'Pengaturan Sistem',
    profil: 'Profil Petugas IGD',
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 flex">
      {/* Sidebar Navigasi */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#173B67] text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Nama Aplikasi */}
          <div className="flex items-start justify-between gap-2 pb-4 border-b border-white/15">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-[#35B6A4] text-white flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wide leading-snug text-white">
                  SEHAT SENTOSA – EMERGENCY CARE SYSTEM
                </div>
                <div className="text-[10px] text-blue-200 leading-tight mt-0.5">
                  Integrated Emergency Registration &amp; Triage Information System
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup navigasi"
              className="lg:hidden p-1 text-blue-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Navigasi */}
          <nav className="space-y-1" aria-label="Menu utama SIMRS">
            {menuItems.map((item) => {
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'kunjungan') setKunjunganFilterTriage('Semua');
                    setActiveMenu(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-[10px] transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#2878C8] text-white shadow-xs'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 m-4 rounded-[10px] bg-white/10 text-[11px] text-blue-100 space-y-1">
          <p className="font-semibold text-white">RKE517 · Purwarupa SIMRS</p>
          <p className="leading-relaxed">
            Simulasi RME lokal. Jangan gunakan data pasien asli.
          </p>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="lg:hidden p-1.5 -ml-1.5 text-[#173B67] rounded-md hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#173B67] truncate">
                {pageTitles[activeMenu]}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                RS Sehat Sentosa · Instalasi Gawat Darurat (IGD)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Global Search Bar */}
            <div className="relative hidden md:block w-64">
              <Search
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari cepat No. RM / Nama..."
                aria-label="Pencarian global pasien"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F8FC] border border-slate-200 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
              />
              {globalSearchMatches.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-[10px] shadow-lg py-1 z-30">
                  {globalSearchMatches.map((m) => (
                    <button
                      key={m.id_pendaftaran}
                      type="button"
                      onClick={() => {
                        setSelectedTriaseVisitId(m.id_pendaftaran);
                        setActiveMenu('triase');
                        setGlobalSearch('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#F4F8FC] text-xs"
                    >
                      <div className="font-semibold text-[#173B67] truncate">{m.nama_lengkap}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        RM {m.no_rm} · {m.kategori_triase}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tanggal & Waktu Real-time */}
            <div className="hidden xl:block px-3 py-1.5 rounded-[10px] bg-[#F4F8FC] border border-slate-200 text-[11px] font-mono tabular-nums text-[#173B67] whitespace-nowrap">
              {clockText}
            </div>

            {/* Ikon Notifikasi */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((s) => !s)}
                aria-label="Notifikasi IGD"
                className="relative p-2 rounded-[10px] bg-[#F4F8FC] border border-slate-200 text-[#173B67] hover:bg-blue-50"
              >
                <Bell className="w-4 h-4" />
                {urgentNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E74C3C] text-white text-[10px] font-bold flex items-center justify-center">
                    {urgentNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-[12px] shadow-lg p-3 z-30 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#173B67]">
                      Antrean Prioritas &amp; Menunggu
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {urgentNotifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">Tidak ada antrean menunggu.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {urgentNotifications.map((n) => (
                        <button
                          key={n.id_pendaftaran}
                          type="button"
                          onClick={() => {
                            setSelectedTriaseVisitId(n.id_pendaftaran);
                            setActiveMenu('triase');
                            setShowNotifications(false);
                          }}
                          className="w-full text-left p-2 rounded-[8px] bg-[#F4F8FC] hover:bg-blue-50 text-xs"
                        >
                          <div className="font-semibold text-[#173B67] truncate">
                            {n.nama_lengkap}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Triase {n.kategori_triase} · {n.status_kunjungan}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profil Petugas Login */}
            <button
              type="button"
              onClick={() => setActiveMenu('profil')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-[10px] border border-slate-200 bg-white hover:bg-[#F4F8FC]"
            >
              <div className="w-7 h-7 rounded-full bg-[#173B67] text-white text-[11px] font-bold flex items-center justify-center">
                NS
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-semibold text-[#173B67] leading-tight">
                  Ns. Nadia S.
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">Perawat IGD</div>
              </div>
            </button>
          </div>
        </header>

        {/* Notifikasi Toast Simulasi */}
        {toast && (
          <div className="px-5 pt-4">
            <div
              role="status"
              className="bg-white border border-[#35B6A4] text-[#173B67] px-4 py-3 rounded-[10px] shadow-xs text-xs font-medium flex items-center justify-between gap-3"
            >
              <span>{toast}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Tutup pesan"
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Viewport Halaman Aktif */}
        <main className="flex-1 p-5 md:p-6 max-w-[1440px] w-full mx-auto">
          {activeMenu === 'dashboard' && (
            <DashboardView
              visits={visits}
              onNavigate={setActiveMenu}
              onSelectTriageFilter={(level) => {
                setKunjunganFilterTriage(level);
                setActiveMenu('kunjungan');
              }}
              onOpenTriaseForVisit={(id) => {
                setSelectedTriaseVisitId(id);
                setActiveMenu('triase');
              }}
            />
          )}

          {activeMenu === 'pendaftaran' && (
            <PendaftaranIgdView
              visits={visits}
              onRegisterVisit={handleRegisterVisit}
              onNotify={showToast}
            />
          )}

          {activeMenu === 'triase' && (
            <TriaseAsuhanView
              visits={visits}
              selectedVisitId={selectedTriaseVisitId}
              onSelectVisitId={setSelectedTriaseVisitId}
              onSaveAssessment={handleSaveAssessment}
              onNotify={showToast}
            />
          )}

          {activeMenu === 'kunjungan' && (
            <DataKunjunganView
              visits={visits}
              initialFilterTriage={kunjunganFilterTriage}
              onUpdateStatus={handleUpdateVisitStatus}
              onOpenTriase={(id) => {
                setSelectedTriaseVisitId(id);
                setActiveMenu('triase');
              }}
            />
          )}

          {activeMenu === 'laporan' && <LaporanIgdView visits={visits} />}

          {activeMenu === 'pengaturan' && (
            <PengaturanView onResetAllData={handleResetAllData} onNotify={showToast} />
          )}

          {activeMenu === 'profil' && <ProfilPenggunaView totalVisits={visits.length} />}
        </main>
      </div>
    </div>
  );
}
