import React, { useMemo, useState } from 'react';
import { AlertCircle, Check, RotateCcw, Sparkles } from 'lucide-react';
import {
  TRIAGE_META,
  TriageCategory,
  TriagePatient,
  evaluateVitalWarnings,
  suggestTriageCategory,
} from '../types/triase';
import { formatLocalDateTimeInput } from '../data/dummyPatients';

interface TriageFormProps {
  existingNoRms: string[];
  onSave: (patient: TriagePatient) => void;
  onCancel?: () => void;
}

interface FormState {
  namaDummy: string;
  noRm: string;
  nikAnonim: string;
  jenisKelamin: 'L' | 'P';
  usia: string;
  waktuKedatangan: string;
  keluhanUtama: string;
  sistol: string;
  diastol: string;
  nadi: string;
  suhu: string;
  rr: string;
  spo2: string;
  kategoriTriase: TriageCategory | '';
  catatanTriase: string;
}

function createInitialState(nextIndex: number): FormState {
  const padded = String(101 + nextIndex).padStart(6, '0');
  const randomMask = String(Math.floor(1000 + Math.random() * 9000));
  return {
    namaDummy: '',
    noRm: `RM-2026-${padded}`,
    nikAnonim: `ANON-3201-XXXX-${randomMask}`,
    jenisKelamin: 'L',
    usia: '',
    waktuKedatangan: formatLocalDateTimeInput(),
    keluhanUtama: '',
    sistol: '',
    diastol: '',
    nadi: '',
    suhu: '',
    rr: '',
    spo2: '',
    kategoriTriase: '',
    catatanTriase: '',
  };
}

export function TriageForm({ existingNoRms, onSave, onCancel }: TriageFormProps) {
  const [form, setForm] = useState<FormState>(() => createInitialState(existingNoRms.length));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parsedVitals = useMemo(() => {
    const num = (val: string) => (val.trim() === '' ? undefined : Number(val));
    return {
      sistol: num(form.sistol),
      diastol: num(form.diastol),
      nadi: num(form.nadi),
      suhu: num(form.suhu),
      rr: num(form.rr),
      spo2: num(form.spo2),
    };
  }, [form.sistol, form.diastol, form.nadi, form.suhu, form.rr, form.spo2]);

  const vitalWarnings = useMemo(() => evaluateVitalWarnings(parsedVitals), [parsedVitals]);
  const triageSuggestion = useMemo(() => suggestTriageCategory(parsedVitals), [parsedVitals]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleLoadSample = () => {
    const samples = [
      {
        namaDummy: 'Pasien Dummy E (Tn. Wijaya)',
        jenisKelamin: 'L' as const,
        usia: '62',
        keluhanUtama: 'Penurunan kesadaran mendadak disertai napas cepat dan akral dingin.',
        sistol: '82',
        diastol: '50',
        nadi: '134',
        suhu: '36.1',
        rr: '32',
        spo2: '86',
        kategoriTriase: 'Merah' as TriageCategory,
        catatanTriase: 'Prioritas resusitasi segera, siapkan jalur IV dan oksigenasi.',
      },
      {
        namaDummy: 'Pasien Dummy F (Ny. Ratna)',
        jenisKelamin: 'P' as const,
        usia: '29',
        keluhanUtama: 'Nyeri perut kanan bawah sejak 8 jam lalu disertai mual dan demam ringan.',
        sistol: '116',
        diastol: '74',
        nadi: '108',
        suhu: '38.6',
        rr: '22',
        spo2: '97',
        kategoriTriase: 'Kuning' as TriageCategory,
        catatanTriase: 'Suspek apendisitis akut, jadwalkan pemeriksaan laboratorium dan bedah.',
      },
      {
        namaDummy: 'Pasien Dummy G (Sdr. Dimas)',
        jenisKelamin: 'L' as const,
        usia: '22',
        keluhanUtama: 'Keseleo pergelangan kaki kiri setelah berolahraga, nyeri saat menapak.',
        sistol: '120',
        diastol: '78',
        nadi: '80',
        suhu: '36.7',
        rr: '18',
        spo2: '99',
        kategoriTriase: 'Hijau' as TriageCategory,
        catatanTriase: 'Kondisi stabil, evaluasi radiologi ekstremitas.',
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setForm((prev) => ({
      ...prev,
      ...picked,
      waktuKedatangan: formatLocalDateTimeInput(),
    }));
    setErrors({});
  };

  const handleReset = () => {
    setForm(createInitialState(existingNoRms.length));
    setErrors({});
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!form.namaDummy.trim()) nextErrors.namaDummy = 'Nama pasien dummy wajib diisi.';
    if (!form.noRm.trim()) {
      nextErrors.noRm = 'Nomor Rekam Medis wajib diisi.';
    } else if (existingNoRms.includes(form.noRm.trim())) {
      nextErrors.noRm = 'Nomor Rekam Medis sudah terdaftar pada antrean aktif.';
    }

    if (!form.nikAnonim.trim()) {
      nextErrors.nikAnonim = 'NIK anonim wajib diisi.';
    } else if (!form.nikAnonim.toUpperCase().includes('ANON') && !form.nikAnonim.includes('X')) {
      nextErrors.nikAnonim = 'Gunakan format NIK teranonimisasi (contoh: ANON-3201-XXXX-1234).';
    }

    const usia = Number(form.usia);
    if (form.usia.trim() === '' || Number.isNaN(usia) || usia < 0 || usia > 120) {
      nextErrors.usia = 'Usia harus antara 0–120 tahun.';
    }

    if (!form.waktuKedatangan) nextErrors.waktuKedatangan = 'Waktu kedatangan wajib diisi.';
    if (!form.keluhanUtama.trim() || form.keluhanUtama.trim().length < 5) {
      nextErrors.keluhanUtama = 'Tuliskan keluhan utama minimal 5 karakter.';
    }

    const checkRange = (key: keyof FormState, label: string, min: number, max: number) => {
      const raw = form[key].trim();
      const val = Number(raw);
      if (raw === '' || Number.isNaN(val) || val < min || val > max) {
        nextErrors[key] = `${label} harus bernilai ${min}–${max}.`;
      }
    };

    checkRange('sistol', 'Tekanan sistolik', 0, 300);
    checkRange('diastol', 'Tekanan diastolik', 0, 200);
    checkRange('nadi', 'Nadi', 0, 250);
    checkRange('suhu', 'Suhu', 25, 45);
    checkRange('rr', 'Respiratory Rate', 0, 80);
    checkRange('spo2', 'SpO2', 0, 100);

    if (!form.kategoriTriase) {
      nextErrors.kategoriTriase = 'Pilih kategori triase IGD.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !form.kategoriTriase) return;

    const newPatient: TriagePatient = {
      id: `TRG-${Date.now().toString().slice(-5)}`,
      noRm: form.noRm.trim(),
      nikAnonim: form.nikAnonim.trim().toUpperCase(),
      namaDummy: form.namaDummy.trim(),
      jenisKelamin: form.jenisKelamin,
      usia: Number(form.usia),
      waktuKedatangan: form.waktuKedatangan,
      keluhanUtama: form.keluhanUtama.trim(),
      kategoriTriase: form.kategoriTriase,
      tandaVital: {
        sistol: Number(form.sistol),
        diastol: Number(form.diastol),
        nadi: Number(form.nadi),
        suhu: Number(form.suhu),
        rr: Number(form.rr),
        spo2: Number(form.spo2),
      },
      status: 'Menunggu',
      catatanTriase: form.catatanTriase.trim() || undefined,
    };

    onSave(newPatient);
    setForm(createInitialState(existingNoRms.length + 1));
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Formulir Pendaftaran &amp; Triase Pasien IGD
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Gunakan identitas pasien dummy dan format NIK anonim. Sistem tidak menyimpan identitas asli pasien.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Isi Contoh Dummy
        </button>
      </div>

      {/* Bagian 1: Identitas & Kedatangan */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          01. Identitas Pasien Dummy &amp; Kedatangan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2 lg:col-span-1">
            <label htmlFor="namaDummy" className="block text-xs font-medium text-slate-700 mb-1.5">
              Nama Pasien (Dummy)
            </label>
            <input
              id="namaDummy"
              type="text"
              value={form.namaDummy}
              onChange={(e) => updateField('namaDummy', e.target.value)}
              placeholder="Contoh: Pasien Dummy E (Tn. Andi)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.namaDummy && <p className="text-xs text-red-600 mt-1">{errors.namaDummy}</p>}
          </div>

          <div>
            <label htmlFor="noRm" className="block text-xs font-medium text-slate-700 mb-1.5">
              Nomor Rekam Medis (No. RM)
            </label>
            <input
              id="noRm"
              type="text"
              value={form.noRm}
              onChange={(e) => updateField('noRm', e.target.value)}
              placeholder="RM-2026-000105"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.noRm && <p className="text-xs text-red-600 mt-1">{errors.noRm}</p>}
          </div>

          <div>
            <label htmlFor="nikAnonim" className="block text-xs font-medium text-slate-700 mb-1.5">
              NIK Anonim
            </label>
            <input
              id="nikAnonim"
              type="text"
              value={form.nikAnonim}
              onChange={(e) => updateField('nikAnonim', e.target.value)}
              placeholder="ANON-3201-XXXX-8821"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.nikAnonim && <p className="text-xs text-red-600 mt-1">{errors.nikAnonim}</p>}
          </div>

          <div>
            <label htmlFor="jenisKelamin" className="block text-xs font-medium text-slate-700 mb-1.5">
              Jenis Kelamin
            </label>
            <select
              id="jenisKelamin"
              value={form.jenisKelamin}
              onChange={(e) => updateField('jenisKelamin', e.target.value as 'L' | 'P')}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            >
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          <div>
            <label htmlFor="usia" className="block text-xs font-medium text-slate-700 mb-1.5">
              Usia (Tahun)
            </label>
            <input
              id="usia"
              type="number"
              min={0}
              max={120}
              value={form.usia}
              onChange={(e) => updateField('usia', e.target.value)}
              placeholder="Contoh: 45"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.usia && <p className="text-xs text-red-600 mt-1">{errors.usia}</p>}
          </div>

          <div>
            <label htmlFor="waktuKedatangan" className="block text-xs font-medium text-slate-700 mb-1.5">
              Tanggal &amp; Waktu Kedatangan
            </label>
            <input
              id="waktuKedatangan"
              type="datetime-local"
              value={form.waktuKedatangan}
              onChange={(e) => updateField('waktuKedatangan', e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.waktuKedatangan && (
              <p className="text-xs text-red-600 mt-1">{errors.waktuKedatangan}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="keluhanUtama" className="block text-xs font-medium text-slate-700 mb-1.5">
            Keluhan Utama
          </label>
          <textarea
            id="keluhanUtama"
            rows={3}
            value={form.keluhanUtama}
            onChange={(e) => updateField('keluhanUtama', e.target.value)}
            placeholder="Deskripsikan keluhan utama, awitan gejala, dan kondisi klinis pasien saat tiba di IGD..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
          />
          {errors.keluhanUtama && (
            <p className="text-xs text-red-600 mt-1">{errors.keluhanUtama}</p>
          )}
        </div>
      </section>

      {/* Bagian 2: Tanda Vital */}
      <section className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            02. Pemeriksaan Tanda Vital (Vital Signs)
          </h3>
          {vitalWarnings.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {vitalWarnings.join(' · ')}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label htmlFor="sistol" className="block text-xs font-medium text-slate-700 mb-1.5">
              Sistol (mmHg)
            </label>
            <input
              id="sistol"
              type="number"
              min={0}
              max={300}
              value={form.sistol}
              onChange={(e) => updateField('sistol', e.target.value)}
              placeholder="120"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.sistol && <p className="text-xs text-red-600 mt-1">{errors.sistol}</p>}
          </div>

          <div>
            <label htmlFor="diastol" className="block text-xs font-medium text-slate-700 mb-1.5">
              Diastol (mmHg)
            </label>
            <input
              id="diastol"
              type="number"
              min={0}
              max={200}
              value={form.diastol}
              onChange={(e) => updateField('diastol', e.target.value)}
              placeholder="80"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.diastol && <p className="text-xs text-red-600 mt-1">{errors.diastol}</p>}
          </div>

          <div>
            <label htmlFor="nadi" className="block text-xs font-medium text-slate-700 mb-1.5">
              Nadi (x/mnt)
            </label>
            <input
              id="nadi"
              type="number"
              min={0}
              max={250}
              value={form.nadi}
              onChange={(e) => updateField('nadi', e.target.value)}
              placeholder="84"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.nadi && <p className="text-xs text-red-600 mt-1">{errors.nadi}</p>}
          </div>

          <div>
            <label htmlFor="suhu" className="block text-xs font-medium text-slate-700 mb-1.5">
              Suhu (°C)
            </label>
            <input
              id="suhu"
              type="number"
              step="0.1"
              min={25}
              max={45}
              value={form.suhu}
              onChange={(e) => updateField('suhu', e.target.value)}
              placeholder="36.8"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.suhu && <p className="text-xs text-red-600 mt-1">{errors.suhu}</p>}
          </div>

          <div>
            <label htmlFor="rr" className="block text-xs font-medium text-slate-700 mb-1.5">
              RR (x/mnt)
            </label>
            <input
              id="rr"
              type="number"
              min={0}
              max={80}
              value={form.rr}
              onChange={(e) => updateField('rr', e.target.value)}
              placeholder="20"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.rr && <p className="text-xs text-red-600 mt-1">{errors.rr}</p>}
          </div>

          <div>
            <label htmlFor="spo2" className="block text-xs font-medium text-slate-700 mb-1.5">
              SpO2 (%)
            </label>
            <input
              id="spo2"
              type="number"
              min={0}
              max={100}
              value={form.spo2}
              onChange={(e) => updateField('spo2', e.target.value)}
              placeholder="98"
              className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
            />
            {errors.spo2 && <p className="text-xs text-red-600 mt-1">{errors.spo2}</p>}
          </div>
        </div>

        {/* Rekomendasi klinis otomatis */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-md bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-700">
            <span className="font-semibold text-slate-900">Panduan Triase Vital: </span>
            {triageSuggestion.category ? (
              <>
                Disarankan kategori{' '}
                <span className={`font-semibold ${TRIAGE_META[triageSuggestion.category].textColor}`}>
                  {triageSuggestion.category}
                </span>{' '}
                — {triageSuggestion.reason}
              </>
            ) : (
              triageSuggestion.reason
            )}
          </div>
          {triageSuggestion.category && form.kategoriTriase !== triageSuggestion.category && (
            <button
              type="button"
              onClick={() => updateField('kategoriTriase', triageSuggestion.category!)}
              className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              Terapkan Saran ({triageSuggestion.category})
            </button>
          )}
        </div>
      </section>

      {/* Bagian 3: Kategori Triase */}
      <section className="space-y-4 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">
          03. Penetapan Kategori Triase IGD
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['Merah', 'Kuning', 'Hijau', 'Hitam'] as TriageCategory[]).map((cat) => {
            const meta = TRIAGE_META[cat];
            const selected = form.kategoriTriase === cat;
            return (
              <label
                key={cat}
                className={`flex flex-col gap-1.5 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  selected
                    ? `${meta.surfaceSelected} ${meta.ringSelected}`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="kategoriTriase"
                  value={cat}
                  checked={selected}
                  onChange={() => updateField('kategoriTriase', cat)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className={`w-3 h-3 rounded-xs ${meta.dotColor}`} aria-hidden="true" />
                    {cat}
                  </span>
                  {selected && <Check className="w-4 h-4 text-slate-900" aria-hidden="true" />}
                </div>
                <span className="text-xs font-medium text-slate-700">{meta.prioritas}</span>
                <span className="text-xs text-slate-500">Respon: {meta.targetWaktu}</span>
              </label>
            );
          })}
        </div>
        {errors.kategoriTriase && (
          <p className="text-xs text-red-600">{errors.kategoriTriase}</p>
        )}

        <div>
          <label htmlFor="catatanTriase" className="block text-xs font-medium text-slate-700 mb-1.5">
            Catatan Klinis Petugas Triase (Opsional)
          </label>
          <input
            id="catatanTriase"
            type="text"
            value={form.catatanTriase}
            onChange={(e) => updateField('catatanTriase', e.target.value)}
            placeholder="Contoh: Arahkan ke ruang resusitasi / lakukan pemasangan akses vena..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
          />
        </div>
      </section>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
        <div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Kembali ke Antrean
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            Simpan Data Triase
          </button>
        </div>
      </div>
    </form>
  );
}
