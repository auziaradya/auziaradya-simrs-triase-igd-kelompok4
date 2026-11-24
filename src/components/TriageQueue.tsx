import React, { useMemo, useState } from 'react';
import { AlertTriangle, Plus, Search, Trash2 } from 'lucide-react';
import {
  PatientStatus,
  TRIAGE_META,
  TriageCategory,
  TriagePatient,
  evaluateVitalWarnings,
} from '../types/triase';

interface TriageQueueProps {
  patients: TriagePatient[];
  onUpdateStatus: (id: string, status: PatientStatus) => void;
  onDeletePatient: (id: string) => void;
  onOpenNewForm: () => void;
  onResetDemoData: () => void;
}

const FILTER_OPTIONS: Array<{ value: 'Semua' | TriageCategory; label: string }> = [
  { value: 'Semua', label: 'Semua' },
  { value: 'Merah', label: 'Merah' },
  { value: 'Kuning', label: 'Kuning' },
  { value: 'Hijau', label: 'Hijau' },
  { value: 'Hitam', label: 'Hitam' },
];

export function TriageQueue({
  patients,
  onUpdateStatus,
  onDeletePatient,
  onOpenNewForm,
  onResetDemoData,
}: TriageQueueProps) {
  const [filterCategory, setFilterCategory] = useState<'Semua' | TriageCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(patients[0]?.id ?? null);

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...patients]
      .filter((p) => (filterCategory === 'Semua' ? true : p.kategoriTriase === filterCategory))
      .filter((p) => {
        if (!q) return true;
        return (
          p.noRm.toLowerCase().includes(q) ||
          p.namaDummy.toLowerCase().includes(q) ||
          p.nikAnonim.toLowerCase().includes(q) ||
          p.keluhanUtama.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const orderDiff =
          TRIAGE_META[a.kategoriTriase].urutan - TRIAGE_META[b.kategoriTriase].urutan;
        if (orderDiff !== 0) return orderDiff;
        return b.waktuKedatangan.localeCompare(a.waktuKedatangan);
      });
  }, [patients, filterCategory, searchQuery]);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedId) ?? filteredPatients[0] ?? null,
    [patients, selectedId, filteredPatients]
  );

  const formatDateTime = (iso: string) => {
    if (!iso) return '-';
    return iso.replace('T', ' ');
  };

  return (
    <div className="space-y-6">
      {/* Toolbar filter & pencarian */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md overflow-x-auto">
          {FILTER_OPTIONS.map((opt) => {
            const active = filterCategory === opt.value;
            const count =
              opt.value === 'Semua'
                ? patients.length
                : patients.filter((p) => p.kategoriTriase === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilterCategory(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. RM, nama dummy, keluhan..."
              aria-label="Cari pasien IGD"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
          </div>
          <button
            type="button"
            onClick={onResetDemoData}
            className="px-3 py-2 text-xs font-medium text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Muat Ulang Data Dummy
          </button>
        </div>
      </div>

      {/* Tabel antrean triase */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-medium text-slate-900">
              Tidak ada pasien pada filter atau kata kunci pencarian ini.
            </p>
            <p className="text-xs text-slate-500">
              Tambahkan pendaftaran pasien dummy baru atau ubah filter kategori triase.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenNewForm}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Daftarkan Pasien Dummy
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 whitespace-nowrap">Triase</th>
                  <th className="py-3 px-4 whitespace-nowrap">No. RM &amp; NIK Anonim</th>
                  <th className="py-3 px-4 whitespace-nowrap">Identitas Dummy</th>
                  <th className="py-3 px-4 whitespace-nowrap">Waktu Datang</th>
                  <th className="py-3 px-4">Keluhan Utama</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">TD (mmHg)</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Nadi</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Suhu</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">RR</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">SpO2</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredPatients.map((patient) => {
                  const meta = TRIAGE_META[patient.kategoriTriase];
                  const isSelected = selectedPatient?.id === patient.id;
                  const lowSpo2 = patient.tandaVital.spo2 < 92;

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedId(patient.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-teal-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2 font-semibold text-xs text-slate-900">
                          <span className={`w-2.5 h-2.5 rounded-xs ${meta.dotColor}`} aria-hidden="true" />
                          <span className={meta.textColor}>{patient.kategoriTriase}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono tabular-nums text-xs font-medium text-slate-900">
                          {patient.noRm}
                        </div>
                        <div className="font-mono tabular-nums text-xs text-slate-500">
                          {patient.nikAnonim}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 text-sm">{patient.namaDummy}</div>
                        <div className="text-xs text-slate-500 tabular-nums">
                          {patient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} · {patient.usia} thn
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                        {formatDateTime(patient.waktuKedatangan)}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-xs text-slate-700 line-clamp-2">{patient.keluhanUtama}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-900 whitespace-nowrap">
                        {patient.tandaVital.sistol}/{patient.tandaVital.diastol}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-900 whitespace-nowrap">
                        {patient.tandaVital.nadi}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-900 whitespace-nowrap">
                        {patient.tandaVital.suhu.toFixed(1)}°
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-900 whitespace-nowrap">
                        {patient.tandaVital.rr}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono tabular-nums text-xs font-medium whitespace-nowrap ${
                          lowSpo2 ? 'text-red-700' : 'text-slate-900'
                        }`}
                      >
                        {patient.tandaVital.spo2}%
                      </td>
                      <td
                        className="py-3 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          aria-label={`Ubah status ${patient.namaDummy}`}
                          value={patient.status}
                          onChange={(e) =>
                            onUpdateStatus(patient.id, e.target.value as PatientStatus)
                          }
                          className="px-2 py-1 text-xs font-medium border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:border-teal-700"
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Ditangani">Ditangani</option>
                          <option value="Observasi">Observasi</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Panel Inspeksi Detail Pasien Terpilih */}
      {selectedPatient && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                <span className={`font-sans font-semibold ${TRIAGE_META[selectedPatient.kategoriTriase].textColor}`}>
                  {TRIAGE_META[selectedPatient.kategoriTriase].label}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedPatient.noRm}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedPatient.nikAnonim}</span>
                <span aria-hidden="true">·</span>
                <span>Datang {formatDateTime(selectedPatient.waktuKedatangan)}</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {selectedPatient.namaDummy} ({selectedPatient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'},{' '}
                {selectedPatient.usia} tahun)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onDeletePatient(selectedPatient.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap shrink-0 self-start"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              Hapus Data Dummy
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Keluhan Utama</p>
                <p className="text-sm text-slate-800">{selectedPatient.keluhanUtama}</p>
              </div>
              {selectedPatient.catatanTriase && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Catatan Petugas Triase</p>
                  <p className="text-sm text-slate-700">{selectedPatient.catatanTriase}</p>
                </div>
              )}
              {evaluateVitalWarnings(selectedPatient.tandaVital).length > 0 && (
                <div className="flex items-start gap-2 pt-2 text-xs text-red-700 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Peringatan Klinis: {evaluateVitalWarnings(selectedPatient.tandaVital).join(' · ')}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-left border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
              <div>
                <p className="text-xs text-slate-500">Tekanan Darah</p>
                <p className="text-sm font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
                  {selectedPatient.tandaVital.sistol}/{selectedPatient.tandaVital.diastol}
                </p>
                <p className="text-[11px] text-slate-500">mmHg</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Nadi</p>
                <p className="text-sm font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
                  {selectedPatient.tandaVital.nadi}
                </p>
                <p className="text-[11px] text-slate-500">x/menit</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Suhu</p>
                <p className="text-sm font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
                  {selectedPatient.tandaVital.suhu.toFixed(1)}
                </p>
                <p className="text-[11px] text-slate-500">°C</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Resp. Rate</p>
                <p className="text-sm font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
                  {selectedPatient.tandaVital.rr}
                </p>
                <p className="text-[11px] text-slate-500">x/menit</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">SpO2</p>
                <p className="text-sm font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
                  {selectedPatient.tandaVital.spo2}%
                </p>
                <p className="text-[11px] text-slate-500">Saturasi O2</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Target Respon</p>
                <p className="text-xs font-medium text-slate-900 mt-0.5">
                  {TRIAGE_META[selectedPatient.kategoriTriase].targetWaktu}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
