import React, { useState } from 'react';
import { Download, RotateCcw, Shield, UserCheck } from 'lucide-react';
import { SQL_ARTIFACT } from '../data/practicumArtifacts';

interface PengaturanViewProps {
  onResetAllData: () => void;
  onNotify: (msg: string) => void;
}

export function PengaturanView({ onResetAllData, onNotify }: PengaturanViewProps) {
  const [namaRs, setNamaRs] = useState('RS SEHAT SENTOSA');
  const [kodeFaskes, setKodeFaskes] = useState('3273011');
  const [bridgingMode, setBridgingMode] = useState('Simulasi Lokal (Offline Dummy)');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Pengaturan sistem untuk ${namaRs} (${kodeFaskes}) berhasil disimpan.`);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SQL_ARTIFACT], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database_triase_igd.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('Skema database_triase_igd.sql berhasil diunduh.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <form
        onSubmit={handleSaveSettings}
        className="bg-white border border-slate-200 rounded-[12px] p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Shield className="w-4 h-4 text-[#2878C8]" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[#173B67]">
            Konfigurasi Modul IGD &amp; Simulasi Bridging
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Fasilitas Kesehatan
            </label>
            <input
              type="text"
              value={namaRs}
              onChange={(e) => setNamaRs(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kode Faskes Kemenkes / BPJS
            </label>
            <input
              type="text"
              value={kodeFaskes}
              onChange={(e) => setKodeFaskes(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mode Integrasi SatuSehat &amp; VClaim BPJS
            </label>
            <select
              value={bridgingMode}
              onChange={(e) => setBridgingMode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
            >
              <option value="Simulasi Lokal (Offline Dummy)">Simulasi Lokal (Offline Dummy)</option>
              <option value="Sandbox Praktikum RKE517">Sandbox Praktikum RKE517 (Simulasi)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#173B67] rounded-[10px] hover:bg-[#1f4d85]"
          >
            Simpan Pengaturan
          </button>
        </div>
      </form>

      <div className="bg-white border border-slate-200 rounded-[12px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#173B67]">
            Skema Basis Data &amp; Reset Data Simulasi
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Unduh skema MySQL (<code className="font-mono">database_triase_igd.sql</code>) atau kembalikan antrean ke data dummy awal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadSql}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#173B67] bg-[#F4F8FC] border border-blue-200 rounded-[10px] hover:bg-blue-100"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Unduh SQL
          </button>
          <button
            type="button"
            onClick={onResetAllData}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#E74C3C] bg-white border border-red-200 rounded-[10px] hover:bg-red-50"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Data Dummy
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfilPenggunaView({ totalVisits }: { totalVisits: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[12px] p-6 shadow-xs max-w-2xl space-y-5">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 rounded-full bg-[#173B67] text-white flex items-center justify-center font-bold text-base">
          NS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#173B67]">
              Ns. Nadia Syarifah, S.Kep (Petugas Simulasi)
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-[#27AE60] border border-emerald-200 px-2 py-0.5 rounded-md">
              <UserCheck className="w-3 h-3" aria-hidden="true" />
              Shift Pagi IGD
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Unit Kerja: Instalasi Gawat Darurat (IGD) · RS Sehat Sentosa
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-slate-200">
          <dt className="text-slate-500">Peran Akses SIMRS</dt>
          <dd className="font-semibold text-[#173B67] mt-0.5">Perawat Triase &amp; Admisi IGD</dd>
        </div>
        <div className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-slate-200">
          <dt className="text-slate-500">Nomor STR / SIPP (Simulasi)</dt>
          <dd className="font-mono font-semibold text-[#173B67] mt-0.5">STR-SIM-2026-08912</dd>
        </div>
        <div className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-slate-200">
          <dt className="text-slate-500">Total Kunjungan di Sesi Lokal</dt>
          <dd className="font-mono font-semibold text-[#173B67] mt-0.5">{totalVisits} Kunjungan</dd>
        </div>
        <div className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-slate-200">
          <dt className="text-slate-500">Standar Modul</dt>
          <dd className="font-semibold text-[#173B67] mt-0.5">RME KMK 1423 &amp; PMK 47/2018</dd>
        </div>
      </dl>
    </div>
  );
}
