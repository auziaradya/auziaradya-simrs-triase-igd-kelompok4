import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldAlert,
  UserCheck,
  Users,
} from 'lucide-react';
import { ActiveMenu, IgdVisitRecord, TRIAGE_CONFIG, TriageLevel } from '../types/simrs';

interface DashboardViewProps {
  visits: IgdVisitRecord[];
  onNavigate: (menu: ActiveMenu) => void;
  onSelectTriageFilter: (level: TriageLevel) => void;
  onOpenTriaseForVisit: (idPendaftaran: string) => void;
}

export function DashboardView({
  visits,
  onNavigate,
  onSelectTriageFilter,
  onOpenTriaseForVisit,
}: DashboardViewProps) {
  const countByLevel = (level: TriageLevel) =>
    visits.filter((v) => v.kategori_triase === level).length;

  const latestToday = visits.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Banner ringkasan shift */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-wide text-[#2878C8] bg-[#F4F8FC] border border-blue-200 px-2.5 py-0.5 rounded-md mb-1.5">
            SIMULASI RME · KMK 1423 &amp; PMK NO. 47 TAHUN 2018
          </span>
          <h2 className="text-lg font-bold text-[#173B67]">
            Ringkasan Operasional Instalasi Gawat Darurat (IGD)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Seluruh data di bawah merupakan data dummy simulasi praktikum RKE517 (tersimpan lokal di browser).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('pendaftaran')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#173B67] rounded-[10px] hover:bg-[#1e4b82] transition-colors whitespace-nowrap"
          >
            + Pendaftaran IGD Baru
          </button>
          <button
            type="button"
            onClick={() => onNavigate('triase')}
            className="px-4 py-2 text-xs font-semibold text-[#173B67] bg-[#F4F8FC] border border-slate-200 rounded-[10px] hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Buka Form Triase
          </button>
        </div>
      </div>

      {/* 4 Kartu Statistik Utama */}
      <section aria-label="Statistik Kunjungan IGD">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Kunjungan IGD</p>
              <p className="text-3xl font-bold font-mono tabular-nums text-[#173B67] mt-1.5">
                {visits.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Data simulasi aktif</p>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-[#F4F8FC] text-[#2878C8] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Pasien Kategori Merah</p>
              <p className="text-3xl font-bold font-mono tabular-nums text-[#E74C3C] mt-1.5">
                {countByLevel('Merah')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Resusitasi · 0 menit</p>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-red-50 text-[#E74C3C] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Pasien Kategori Kuning</p>
              <p className="text-3xl font-bold font-mono tabular-nums text-[#D97706] mt-1.5">
                {countByLevel('Kuning')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Emergensi · &lt; 15 menit</p>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Pasien Kategori Hijau</p>
              <p className="text-3xl font-bold font-mono tabular-nums text-[#27AE60] mt-1.5">
                {countByLevel('Hijau')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Non-Urgensi · &lt; 60 menit</p>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-emerald-50 text-[#27AE60] flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Ringkasan Kategori Triase (4 Kartu Visualisasi Interaktif) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#173B67]">
              Ringkasan Kategori Triase Klinis (Penetapan Manual Tenaga Kesehatan)
            </h3>
            <p className="text-xs text-slate-500">
              Klik salah satu kartu kategori untuk memfilter daftar kunjungan IGD.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#173B67] bg-white border border-slate-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
            PMK NO. 47 TAHUN 2018
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['Merah', 'Kuning', 'Hijau', 'Hitam'] as TriageLevel[]).map((level) => {
            const cfg = TRIAGE_CONFIG[level];
            const total = countByLevel(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSelectTriageFilter(level)}
                className="text-left bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs hover:border-[#2878C8] hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
                    >
                      {level.toUpperCase()} · {cfg.subtitle}
                    </span>
                    <span className="font-mono tabular-nums text-sm font-bold text-[#173B67]">
                      {total}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800">{cfg.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    Respon: {cfg.responseTime}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#2878C8] group-hover:translate-x-0.5 transition-transform">
                    Lihat <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Antrean Kunjungan IGD Terkini */}
      <section className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2878C8]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-[#173B67]">
              Antrean Pelayanan IGD Terkini
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('kunjungan')}
            className="text-xs font-semibold text-[#2878C8] hover:underline"
          >
            Semua Data Kunjungan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F8FC] text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-4 whitespace-nowrap">No. RM</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Nama Pasien (Dummy)</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Triase</th>
                <th className="py-2.5 px-4">Keluhan Utama</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Dokter Jaga</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {latestToday.map((v) => {
                const cfg = TRIAGE_CONFIG[v.kategori_triase];
                return (
                  <tr key={v.id_pendaftaran} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#173B67] whitespace-nowrap">
                      {v.no_rm}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {v.nama_lengkap}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
                      >
                        {v.kategori_triase}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {v.keluhan_utama}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{v.dokter_jaga}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {v.status_kunjungan}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenTriaseForVisit(v.id_pendaftaran)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#2878C8] bg-[#F4F8FC] border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                      >
                        Kaji Triase
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
