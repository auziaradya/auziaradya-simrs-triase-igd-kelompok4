import React, { useMemo } from 'react';
import { BarChart3, Info, PieChart } from 'lucide-react';
import { IgdVisitRecord, TRIAGE_CONFIG, TriageLevel } from '../types/simrs';

interface LaporanIgdViewProps {
  visits: IgdVisitRecord[];
}

export function LaporanIgdView({ visits }: LaporanIgdViewProps) {
  const triageStats = useMemo(() => {
    const levels: TriageLevel[] = ['Merah', 'Kuning', 'Hijau', 'Hitam'];
    const total = Math.max(1, visits.length);
    return levels.map((level) => {
      const count = visits.filter((v) => v.kategori_triase === level).length;
      const pct = Math.round((count / total) * 100);
      return { level, count, pct, cfg: TRIAGE_CONFIG[level] };
    });
  }, [visits]);

  const dateTrend = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of visits) {
      const datePart = v.waktu_kedatangan.slice(0, 10);
      map.set(datePart, (map.get(datePart) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [visits]);

  const arrivalStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of visits) {
      map.set(v.cara_datang, (map.get(v.cara_datang) || 0) + 1);
    }
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
  }, [visits]);

  const maxTrendCount = Math.max(1, ...dateTrend.map((d) => d.count));

  // Hitung segmen donut SVG
  const donutSegments = useMemo(() => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const total = visits.length || 1;
    let offset = 0;
    return triageStats.map((s) => {
      const length = (s.count / total) * circumference;
      const seg = {
        ...s,
        strokeDasharray: `${length} ${circumference - length}`,
        strokeDashoffset: -offset,
      };
      offset += length;
      return seg;
    });
  }, [triageStats, visits.length]);

  return (
    <div className="space-y-6">
      {/* Keterangan Data Simulasi Praktikum */}
      <div className="bg-white border border-blue-200 rounded-[12px] p-4 shadow-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2878C8] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs text-slate-700 space-y-0.5">
          <p className="font-bold text-[#173B67]">
            Laporan Statistik Simulasi IGD — Keperluan Praktikum RKE517
          </p>
          <p>
            Seluruh angka kunjungan, distribusi kategori triase, dan cara datang yang ditampilkan pada halaman ini merupakan <strong>data simulasi dummy</strong> dan bukan data pelayanan pasien rumah sakit sesungguhnya.
          </p>
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Kunjungan Tercatat</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-[#173B67] mt-1">
            {visits.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Seluruh rentang tanggal simulasi</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Sudah Dikaji Triase Lanjutan</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-[#2878C8] mt-1">
            {visits.filter((v) => Boolean(v.asuhan)).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Lengkap SAMPLE / ABCDE / Vital Signs</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Status Pelayanan Selesai</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-[#27AE60] mt-1">
            {visits.filter((v) => v.status_kunjungan === 'Selesai').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Dari {visits.length} kunjungan aktif</p>
        </div>
      </div>

      {/* Grafik Visualisasi SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Tren Kunjungan per Tanggal */}
        <section className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2878C8]" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#173B67]">
                Tren Kunjungan IGD per Tanggal
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Grafik Batang SVG</span>
          </div>

          <div className="pt-2">
            <svg
              viewBox="0 0 420 200"
              className="w-full h-52"
              role="img"
              aria-label="Grafik tren kunjungan IGD per tanggal"
            >
              <line x1="40" y1="165" x2="400" y2="165" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="40" y1="25" x2="40" y2="165" stroke="#cbd5e1" strokeWidth="1" />
              {dateTrend.map((item, idx) => {
                const barWidth = Math.min(48, Math.floor(280 / Math.max(1, dateTrend.length)));
                const spacing = 340 / Math.max(1, dateTrend.length);
                const x = 55 + idx * spacing + (spacing - barWidth) / 2 - 15;
                const height = Math.max(8, Math.round((item.count / maxTrendCount) * 125));
                const y = 165 - height;
                return (
                  <g key={item.date}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      rx="6"
                      fill="#2878C8"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#173B67"
                    >
                      {item.count}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y="182"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#475569"
                    >
                      {item.date.slice(5)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Grafik Proporsi Kategori Triase */}
        <section className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#35B6A4]" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#173B67]">
                Proporsi Kategori Triase IGD
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Distribusi KMK 1423</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <svg
              viewBox="0 0 150 150"
              className="w-40 h-40 shrink-0 -rotate-90"
              role="img"
              aria-label="Diagram proporsi kategori triase"
            >
              <circle
                cx="75"
                cy="75"
                r="54"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="20"
              />
              {donutSegments.map((seg) =>
                seg.count > 0 ? (
                  <circle
                    key={seg.level}
                    cx="75"
                    cy="75"
                    r="54"
                    fill="none"
                    stroke={seg.cfg.hex}
                    strokeWidth="20"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                  />
                ) : null
              )}
            </svg>

            <div className="flex-1 w-full space-y-2.5">
              {triageStats.map((s) => (
                <div key={s.level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: s.cfg.hex }}
                        aria-hidden="true"
                      />
                      {s.level} ({s.cfg.subtitle})
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-[#173B67]">
                      {s.count} ({s.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.pct}%`,
                        backgroundColor: s.cfg.hex,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Distribusi Cara Datang Pasien */}
      <section className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#173B67]">Distribusi Cara Datang Pasien</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {arrivalStats.map((item) => (
            <div
              key={item.label}
              className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-slate-200 flex items-center justify-between gap-2"
            >
              <span className="text-xs font-medium text-slate-700">{item.label}</span>
              <span className="text-base font-bold font-mono tabular-nums text-[#173B67]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
