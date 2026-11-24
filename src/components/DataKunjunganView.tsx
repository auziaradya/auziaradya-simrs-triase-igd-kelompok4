import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Search, X } from 'lucide-react';
import { IgdVisitRecord, TRIAGE_CONFIG, TriageLevel, VisitStatus } from '../types/simrs';

interface DataKunjunganViewProps {
  visits: IgdVisitRecord[];
  initialFilterTriage?: 'Semua' | TriageLevel;
  onUpdateStatus: (idPendaftaran: string, status: VisitStatus) => void;
  onOpenTriase: (idPendaftaran: string) => void;
}

const PAGE_SIZE = 5;

export function DataKunjunganView({
  visits,
  initialFilterTriage = 'Semua',
  onUpdateStatus,
  onOpenTriase,
}: DataKunjunganViewProps) {
  const [search, setSearch] = useState('');
  const [filterTriage, setFilterTriage] = useState<'Semua' | TriageLevel>(initialFilterTriage);
  const [filterDate, setFilterDate] = useState('');
  const [page, setPage] = useState(1);
  const [detailVisit, setDetailVisit] = useState<IgdVisitRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return visits.filter((v) => {
      if (filterTriage !== 'Semua' && v.kategori_triase !== filterTriage) return false;
      if (filterDate && !v.waktu_kedatangan.startsWith(filterDate)) return false;
      if (!q) return true;
      return (
        v.no_rm.toLowerCase().includes(q) ||
        v.id_pendaftaran.toLowerCase().includes(q) ||
        v.nama_lengkap.toLowerCase().includes(q) ||
        v.keluhan_utama.toLowerCase().includes(q) ||
        v.dokter_jaga.toLowerCase().includes(q)
      );
    });
  }, [visits, search, filterTriage, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['Semua', 'Merah', 'Kuning', 'Hijau', 'Hitam'] as const).map((level) => {
            const active = filterTriage === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  setFilterTriage(level);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] border transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#173B67] text-white border-[#173B67]'
                    : 'bg-[#F4F8FC] text-slate-700 border-slate-200 hover:bg-blue-50'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
            aria-label="Filter tanggal kunjungan"
            className="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-[10px] bg-white"
          />
          {filterDate && (
            <button
              type="button"
              onClick={() => setFilterDate('')}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Reset Tgl
            </button>
          )}
          <div className="relative sm:w-64">
            <Search
              className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari No. RM, nama, dokter..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
            />
          </div>
        </div>
      </div>

      {/* Tabel Data Kunjungan */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F8FC] text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3 whitespace-nowrap">No</th>
                <th className="py-3 px-3 whitespace-nowrap">No. RM</th>
                <th className="py-3 px-3 whitespace-nowrap">ID Pendaftaran</th>
                <th className="py-3 px-3 whitespace-nowrap">Nama Pasien (Dummy)</th>
                <th className="py-3 px-3 whitespace-nowrap">Waktu Kedatangan</th>
                <th className="py-3 px-3 whitespace-nowrap">Cara Datang</th>
                <th className="py-3 px-3">Keluhan Utama</th>
                <th className="py-3 px-3 whitespace-nowrap">Kategori Triase</th>
                <th className="py-3 px-3 whitespace-nowrap">Dokter Jaga</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-500">
                    Tidak ditemukan kunjungan IGD sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                pageItems.map((v, idx) => {
                  const cfg = TRIAGE_CONFIG[v.kategori_triase];
                  return (
                    <tr key={v.id_pendaftaran} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-500">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-[#173B67] whitespace-nowrap">
                        {v.no_rm}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                        {v.id_pendaftaran}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {v.nama_lengkap}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                        {v.waktu_kedatangan.replace('T', ' ')}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {v.cara_datang}
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs">
                        <p className="line-clamp-2">{v.keluhan_utama}</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
                        >
                          {v.kategori_triase}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                        {v.dokter_jaga}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          aria-label={`Ubah status ${v.nama_lengkap}`}
                          value={v.status_kunjungan}
                          onChange={(e) =>
                            onUpdateStatus(v.id_pendaftaran, e.target.value as VisitStatus)
                          }
                          className="px-2 py-1 text-[11px] font-medium border border-slate-300 rounded-[8px] bg-white"
                        >
                          <option value="Menunggu Triase">Menunggu Triase</option>
                          <option value="Dalam Penanganan">Dalam Penanganan</option>
                          <option value="Observasi">Observasi</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDetailVisit(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#173B67] bg-[#F4F8FC] border border-blue-200 rounded-[8px] hover:bg-blue-100"
                        >
                          <Eye className="w-3 h-3" aria-hidden="true" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-[#F4F8FC]/40">
          <span className="tabular-nums">
            Menampilkan {pageItems.length} dari {filtered.length} kunjungan
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-slate-300 rounded-[8px] bg-white disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-slate-300 rounded-[8px] bg-white disabled:opacity-40"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ringkasan Rekam Medis IGD */}
      {detailVisit && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-rme-title"
        >
          <div className="bg-white border border-slate-200 rounded-[12px] max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#173B67] text-white sticky top-0">
              <div>
                <h3 id="modal-rme-title" className="text-sm font-bold">
                  Ringkasan Rekam Medis IGD · {detailVisit.nama_lengkap}
                </h3>
                <p className="text-[11px] font-mono text-blue-100">
                  No. RM: {detailVisit.no_rm} · ID: {detailVisit.id_pendaftaran}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailVisit(null)}
                aria-label="Tutup modal detail"
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <p className="font-bold text-[#173B67]">Identitas &amp; Alamat</p>
                  <p>NIK KTP: <span className="font-mono">{detailVisit.nik_ktp}</span></p>
                  <p>TTL / Usia: {detailVisit.tempat_lahir}, {detailVisit.tanggal_lahir} ({detailVisit.usia_tahun} thn)</p>
                  <p>Ibu Kandung: {detailVisit.nama_ibu_kandung}</p>
                  <p>Alamat: {detailVisit.alamat_jalan}, RT {detailVisit.rt}/RW {detailVisit.rw}, {detailVisit.kelurahan}, {detailVisit.kecamatan}, {detailVisit.kab_kota}, {detailVisit.provinsi}</p>
                  <p>SatuSehat: {detailVisit.satusehat_status} ({detailVisit.satusehat_id})</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-[#173B67]">Kunjungan IGD &amp; Penjamin</p>
                  <p>Triase: <strong className="text-[#173B67]">{detailVisit.kategori_triase}</strong></p>
                  <p>Cara Datang: {detailVisit.cara_datang}</p>
                  <p>Kesadaran (GCS): {detailVisit.kesadaran_gcs}</p>
                  <p>Dokter Jaga: {detailVisit.dokter_jaga}</p>
                  <p>Penjamin: {detailVisit.cara_pembayaran}</p>
                  {detailVisit.no_sep_simulasi && (
                    <p>SEP Simulasi: <span className="font-mono">{detailVisit.no_sep_simulasi}</span></p>
                  )}
                  <p>Penanggung Jawab: {detailVisit.pj_nama} ({detailVisit.pj_hubungan} · {detailVisit.pj_no_hp})</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#173B67]">Keluhan Utama Masuk IGD</p>
                <p className="p-3 bg-[#F4F8FC] rounded-[10px] border border-slate-200 text-slate-800">
                  {detailVisit.keluhan_utama}
                </p>
              </div>

              {detailVisit.asuhan ? (
                <div className="space-y-4">
                  <p className="font-bold text-[#173B67]">
                    Hasil Pengkajian Triase &amp; Asuhan (PMK No. 47 Tahun 2018)
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                    {[
                      { k: 'TD (mmHg)', v: `${detailVisit.asuhan.sistolik}/${detailVisit.asuhan.diastolik}` },
                      { k: 'Nadi', v: `${detailVisit.asuhan.nadi} x/m` },
                      { k: 'Suhu', v: `${detailVisit.asuhan.suhu} °C` },
                      { k: 'RR', v: `${detailVisit.asuhan.rr} x/m` },
                      { k: 'SpO2', v: `${detailVisit.asuhan.spo2}%` },
                      { k: 'Nyeri', v: `${detailVisit.asuhan.skala_nyeri}/10` },
                    ].map((vital) => (
                      <div key={vital.k} className="p-2.5 bg-[#F4F8FC] rounded-[8px] border border-slate-200">
                        <div className="text-[10px] text-slate-500">{vital.k}</div>
                        <div className="font-mono font-bold text-[#173B67] mt-0.5">{vital.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-900">SAMPLE:</p>
                      <p>S: {detailVisit.asuhan.sample_s || '-'}</p>
                      <p>A: {detailVisit.asuhan.sample_a || '-'}</p>
                      <p>M: {detailVisit.asuhan.sample_m || '-'}</p>
                      <p>P: {detailVisit.asuhan.sample_p || '-'}</p>
                      <p>L: {detailVisit.asuhan.sample_l || '-'}</p>
                      <p>E: {detailVisit.asuhan.sample_e || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Terapi &amp; Tindak Lanjut:</p>
                      <p>Penunjang: {detailVisit.asuhan.pemeriksaan_penunjang.join(', ') || '-'}</p>
                      <p>Terapi: {detailVisit.asuhan.terapi_awal || '-'}</p>
                      <p>Disposisi: {detailVisit.asuhan.rencana_tindak_lanjut || '-'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-[10px] bg-amber-50 border border-amber-200 text-amber-900">
                  Belum dilakukan pengkajian lanjutan (SAMPLE / ABCDE / Tanda Vital).
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2.5 bg-[#F4F8FC]/60">
              <button
                type="button"
                onClick={() => {
                  const id = detailVisit.id_pendaftaran;
                  setDetailVisit(null);
                  onOpenTriase(id);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2878C8] rounded-[10px] hover:bg-[#1e64ab]"
              >
                Lanjutkan / Edit Pengkajian Triase
              </button>
              <button
                type="button"
                onClick={() => setDetailVisit(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-[10px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
