import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  RotateCcw,
  Save,
  Stethoscope,
} from 'lucide-react';
import { DIAGNOSTIC_SUPPORT_OPTIONS, MECHANISM_OPTIONS } from '../data/simrsMasterData';
import {
  IgdVisitRecord,
  TRIAGE_CONFIG,
  TriageAssessment,
  TriageLevel,
} from '../types/simrs';

interface TriaseAsuhanViewProps {
  visits: IgdVisitRecord[];
  selectedVisitId: string | null;
  onSelectVisitId: (id: string) => void;
  onSaveAssessment: (
    idPendaftaran: string,
    kategoriTriase: TriageLevel,
    assessment: TriageAssessment
  ) => void;
  onNotify: (msg: string) => void;
}

type TriaseTab = 'tab1' | 'tab2' | 'tab3' | 'tab4';

function getNowLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function createEmptyAssessment(keluhanDefault = ''): TriageAssessment {
  return {
    waktu_pengkajian: getNowLocal(),
    rs_perujuk: '',
    keluhan_saat_mrs: keluhanDefault,
    mekanisme_kejadian: [],
    mekanisme_lainnya: '',
    sample_s: '',
    sample_a: '',
    sample_m: '',
    sample_p: '',
    sample_l: '',
    sample_e: '',
    abcde_airway: 'Paten, tidak ada sumbatan jalan napas',
    abcde_breathing: 'Spontan, gerak dada simetris',
    abcde_circulation: 'Nadi teraba reguler, CRT < 2 detik',
    abcde_disability: 'Sadar penuh, pupil isokor',
    abcde_exposure: 'Tidak ada kelainan kulit/jejas',
    instrumen_nyeri: 'NRS',
    skala_nyeri: 0,
    lokasi_nyeri: '',
    karakteristik_nyeri: '',
    sistolik: 120,
    diastolik: 80,
    nadi: 84,
    suhu: 36.7,
    rr: 20,
    spo2: 98,
    status_psikologis: 'Tenang',
    dukungan_sosial: 'Didampingi keluarga',
    status_fungsional: 'Mandiri / Dibantu sebagian',
    risiko_jatuh: 'Risiko Rendah',
    skor_ews_manual: 0,
    pemeriksaan_penunjang: [],
    terapi_awal: '',
    rencana_tindak_lanjut: '',
  };
}

export function TriaseAsuhanView({
  visits,
  selectedVisitId,
  onSelectVisitId,
  onSaveAssessment,
  onNotify,
}: TriaseAsuhanViewProps) {
  const activeVisit =
    visits.find((v) => v.id_pendaftaran === selectedVisitId) ?? visits[0] ?? null;

  const [activeTab, setActiveTab] = useState<TriaseTab>('tab1');
  const [kategoriTriase, setKategoriTriase] = useState<TriageLevel>(
    activeVisit?.kategori_triase ?? 'Kuning'
  );
  const [form, setForm] = useState<TriageAssessment>(() =>
    activeVisit?.asuhan
      ? { ...activeVisit.asuhan }
      : createEmptyAssessment(activeVisit?.keluhan_utama ?? '')
  );

  useEffect(() => {
    if (!activeVisit) return;
    setKategoriTriase(activeVisit.kategori_triase);
    setForm(
      activeVisit.asuhan
        ? { ...activeVisit.asuhan }
        : createEmptyAssessment(activeVisit.keluhan_utama)
    );
  }, [activeVisit?.id_pendaftaran]);

  const updateField = <K extends keyof TriageAssessment>(
    key: K,
    value: TriageAssessment[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (
    key: 'mekanisme_kejadian' | 'pemeriksaan_penunjang',
    item: string
  ) => {
    setForm((prev) => {
      const exists = prev[key].includes(item);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((i) => i !== item) : [...prev[key], item],
      };
    });
  };

  const handleReset = () => {
    if (!activeVisit) return;
    setKategoriTriase(activeVisit.kategori_triase);
    setForm(createEmptyAssessment(activeVisit.keluhan_utama));
    onNotify('Formulir pengkajian triase dikembalikan ke nilai awal.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisit) return;
    if (!form.keluhan_saat_mrs.trim()) {
      setActiveTab('tab1');
      onNotify('Keluhan Saat MRS wajib diisi pada Tab 1.');
      return;
    }
    onSaveAssessment(activeVisit.id_pendaftaran, kategoriTriase, form);
  };

  if (!activeVisit) {
    return (
      <div className="bg-white border border-slate-200 rounded-[12px] p-10 text-center">
        <p className="text-sm font-semibold text-[#173B67]">
          Belum ada pasien terdaftar di antrean IGD.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Silakan daftarkan pasien dummy terlebih dahulu melalui menu Pendaftaran IGD.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* A. Header Identitas Kunjungan & Waktu */}
      <section className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-[#F4F8FC]/60">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#2878C8]" aria-hidden="true" />
            <h2 className="text-sm font-bold text-[#173B67]">
              PENGKAJIAN TRIASE &amp; ASUHAN KEPERAWATAN GAWAT DARURAT
            </h2>
          </div>
          <span className="text-[10px] font-bold tracking-wide text-white bg-[#173B67] px-2.5 py-1 rounded-md">
            PMK NO. 47 TAHUN 2018
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Pasien dari Antrean IGD (Auto-load)
            </label>
            <select
              value={activeVisit.id_pendaftaran}
              onChange={(e) => onSelectVisitId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
            >
              {visits.map((v) => (
                <option key={v.id_pendaftaran} value={v.id_pendaftaran}>
                  {v.no_rm} · {v.id_pendaftaran} · {v.nama_lengkap} ({v.kategori_triase})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. RM &amp; ID Pendaftaran
            </label>
            <div className="px-3 py-2 text-xs font-mono tabular-nums bg-[#F4F8FC] border border-slate-200 rounded-[10px] text-[#173B67] font-semibold">
              {activeVisit.no_rm} / {activeVisit.id_pendaftaran}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cara Datang Pasien
            </label>
            <div className="px-3 py-2 text-xs bg-[#F4F8FC] border border-slate-200 rounded-[10px] text-slate-700 truncate">
              {activeVisit.cara_datang}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal &amp; Waktu Masuk IGD
            </label>
            <div className="px-3 py-2 text-xs font-mono tabular-nums bg-[#F4F8FC] border border-slate-200 rounded-[10px] text-slate-700">
              {activeVisit.waktu_kedatangan.replace('T', ' ')}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Waktu Pengkajian Triase
            </label>
            <input
              type="datetime-local"
              name="waktu_pengkajian"
              value={form.waktu_pengkajian}
              onChange={(e) => updateField('waktu_pengkajian', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rumah Sakit / Faskes Perujuk (Opsional)
            </label>
            <input
              type="text"
              name="rs_perujuk"
              value={form.rs_perujuk}
              onChange={(e) => updateField('rs_perujuk', e.target.value)}
              placeholder="Contoh: Puskesmas Dago / RSUD Kota (kosongkan jika datang sendiri)"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
            />
          </div>
        </div>
      </section>

      {/* Navigasi Tab Horizontal (4 Tab Klinis) */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-[#F4F8FC]/70 px-3 pt-3 flex flex-wrap gap-1.5">
          {[
            { id: 'tab1' as TriaseTab, label: '1. Triase, SAMPLE & ABCDE' },
            { id: 'tab2' as TriaseTab, label: '2. Nyeri (BPS/CPOT/NRS) & Tanda Vital' },
            { id: 'tab3' as TriaseTab, label: '3. Psikologis, Sosial & Fungsional (EWS)' },
            { id: 'tab4' as TriaseTab, label: '4. Penunjang & Terapi' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-[10px] border-t border-l border-r transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#173B67] border-slate-200 -mb-px'
                    : 'bg-transparent text-slate-600 border-transparent hover:text-[#173B67]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* TAB 1: TRIASE, SAMPLE & ABCDE */}
          {activeTab === 'tab1' && (
            <div className="space-y-6">
              {/* B. Kategori Triase Besar */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-[#173B67]">
                    B. Kategori Triase Gawat Darurat (Penetapan Manual Tenaga Kesehatan)*
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Tidak ada penetapan triase otomatis; pilih sesuai hasil pemeriksaan klinis.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['Merah', 'Kuning', 'Hijau', 'Hitam'] as TriageLevel[]).map((level) => {
                    const cfg = TRIAGE_CONFIG[level];
                    const selected = kategoriTriase === level;
                    return (
                      <label
                        key={level}
                        className={`p-4 rounded-[12px] border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                          selected
                            ? `${cfg.cardBorder} ${cfg.cardSurface} ring-1`
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="triase_final"
                          value={level}
                          checked={selected}
                          onChange={() => setKategoriTriase(level)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${cfg.badgeBg} ${cfg.badgeText}`}
                          >
                            {cfg.subtitle} ({level})
                          </span>
                          {selected && (
                            <CheckCircle2 className="w-4 h-4 text-[#173B67]" aria-hidden="true" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-800">{cfg.description}</p>
                        <p className="text-[11px] font-mono text-slate-500">
                          Waktu tanggap: {cfg.responseTime}
                        </p>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* C. Keluhan Saat MRS & Mekanisme Kejadian */}
              <div className="pt-5 border-t border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-[#173B67]">
                  C. Keluhan Saat MRS &amp; Mekanisme Kejadian
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keluhan Saat MRS (Masuk Rumah Sakit)*
                  </label>
                  <textarea
                    name="keluhan_saat_mrs"
                    rows={3}
                    value={form.keluhan_saat_mrs}
                    onChange={(e) => updateField('keluhan_saat_mrs', e.target.value)}
                    placeholder="Uraikan keluhan utama pasien saat masuk IGD..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Mekanisme Kejadian (Dapat pilih lebih dari satu)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {MECHANISM_OPTIONS.map((mech) => (
                      <label
                        key={mech}
                        className="flex items-center gap-2 p-2.5 rounded-[10px] border border-slate-200 bg-[#F4F8FC]/40 text-xs text-slate-800 cursor-pointer hover:border-[#2878C8]"
                      >
                        <input
                          type="checkbox"
                          checked={form.mekanisme_kejadian.includes(mech)}
                          onChange={() => toggleArrayItem('mekanisme_kejadian', mech)}
                          className="rounded border-slate-300 text-[#2878C8]"
                        />
                        <span>{mech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan Tambahan Mekanisme Kejadian
                  </label>
                  <input
                    type="text"
                    name="mekanisme_lainnya"
                    value={form.mekanisme_lainnya}
                    onChange={(e) => updateField('mekanisme_lainnya', e.target.value)}
                    placeholder="Contoh: Jatuh dari ketinggian ±2 meter / kronologi tambahan..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                  />
                </div>
              </div>

              {/* D. Riwayat Kesehatan Metode SAMPLE */}
              <div className="pt-5 border-t border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-[#173B67]">
                  D. Riwayat Kesehatan Terstruktur (Metode SAMPLE)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      S (Signs &amp; Symptoms) — Tanda dan Gejala
                    </label>
                    <textarea
                      name="sample_s"
                      rows={2}
                      value={form.sample_s}
                      onChange={(e) => updateField('sample_s', e.target.value)}
                      placeholder="Tanda klinis dan gejala yang tampak..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      A (Allergies) — Riwayat Alergi Obat / Makanan
                    </label>
                    <textarea
                      name="sample_a"
                      rows={2}
                      value={form.sample_a}
                      onChange={(e) => updateField('sample_a', e.target.value)}
                      placeholder="Tidak ada alergi / sebutkan jenis alergi..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      M (Medications) — Obat yang Sedang Dikonsumsi
                    </label>
                    <textarea
                      name="sample_m"
                      rows={2}
                      value={form.sample_m}
                      onChange={(e) => updateField('sample_m', e.target.value)}
                      placeholder="Daftar obat rutin atau obat sebelum ke IGD..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      P (Past Medical History) — Riwayat Penyakit Dahulu
                    </label>
                    <textarea
                      name="sample_p"
                      rows={2}
                      value={form.sample_p}
                      onChange={(e) => updateField('sample_p', e.target.value)}
                      placeholder="Hipertensi, DM, asma, riwayat operasi..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      L (Last Meal) — Makan / Minum Terakhir
                    </label>
                    <input
                      type="text"
                      name="sample_l"
                      value={form.sample_l}
                      onChange={(e) => updateField('sample_l', e.target.value)}
                      placeholder="Contoh: Makan nasi pukul 07.00 WIB"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E (Events Leading to Injury/Illness) — Kejadian Sebelum Masuk IGD
                    </label>
                    <textarea
                      name="sample_e"
                      rows={2}
                      value={form.sample_e}
                      onChange={(e) => updateField('sample_e', e.target.value)}
                      placeholder="Kronologi kejadian sebelum pasien dibawa ke IGD..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                </div>
              </div>

              {/* Pengkajian Primer ABCDE */}
              <div className="pt-5 border-t border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-[#173B67]">
                  Pengkajian Primer (ABCDE)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { key: 'abcde_airway' as const, label: 'A · Airway' },
                    { key: 'abcde_breathing' as const, label: 'B · Breathing' },
                    { key: 'abcde_circulation' as const, label: 'C · Circulation' },
                    { key: 'abcde_disability' as const, label: 'D · Disability' },
                    { key: 'abcde_exposure' as const, label: 'E · Exposure' },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {item.label}
                      </label>
                      <textarea
                        rows={2}
                        value={form[item.key]}
                        onChange={(e) => updateField(item.key, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-[10px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NYERI & TANDA VITAL LENGKAP */}
          {activeTab === 'tab2' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#E74C3C]" aria-hidden="true" />
                  <h3 className="text-xs font-bold text-[#173B67]">
                    E. Pemeriksaan Tanda Vital (Vital Signs)
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sistolik (mmHg)
                    </label>
                    <input
                      type="number"
                      name="tekanan_sistolik"
                      min={0}
                      max={300}
                      value={form.sistolik}
                      onChange={(e) => updateField('sistolik', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Diastolik (mmHg)
                    </label>
                    <input
                      type="number"
                      name="tekanan_diastolik"
                      min={0}
                      max={200}
                      value={form.diastolik}
                      onChange={(e) => updateField('diastolik', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nadi (x/menit)
                    </label>
                    <input
                      type="number"
                      name="nadi"
                      min={0}
                      max={250}
                      value={form.nadi}
                      onChange={(e) => updateField('nadi', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Suhu Tubuh (°C)
                    </label>
                    <input
                      type="number"
                      name="suhu"
                      step="0.1"
                      min={25}
                      max={45}
                      value={form.suhu}
                      onChange={(e) => updateField('suhu', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      RR (x/menit)
                    </label>
                    <input
                      type="number"
                      name="respiratory_rate"
                      min={0}
                      max={80}
                      value={form.rr}
                      onChange={(e) => updateField('rr', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      SpO2 (%)
                    </label>
                    <input
                      type="number"
                      name="spo2"
                      min={0}
                      max={100}
                      value={form.spo2}
                      onChange={(e) => updateField('spo2', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-[#173B67]">
                  Pengkajian Nyeri (BPS / CPOT / NRS)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Instrumen Pengkajian Nyeri
                    </label>
                    <select
                      value={form.instrumen_nyeri}
                      onChange={(e) =>
                        updateField('instrumen_nyeri', e.target.value as 'NRS' | 'BPS' | 'CPOT')
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                    >
                      <option value="NRS">NRS (Numeric Rating Scale 0–10)</option>
                      <option value="BPS">BPS (Behavioral Pain Scale)</option>
                      <option value="CPOT">CPOT (Critical-Care Pain Tool)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skala Nyeri (0–10): <span className="font-mono text-[#173B67]">{form.skala_nyeri}</span>
                    </label>
                    <input
                      type="range"
                      name="skala_nyeri"
                      min={0}
                      max={10}
                      value={form.skala_nyeri}
                      onChange={(e) => updateField('skala_nyeri', Number(e.target.value))}
                      className="w-full accent-[#2878C8] mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lokasi Nyeri
                    </label>
                    <input
                      type="text"
                      value={form.lokasi_nyeri}
                      onChange={(e) => updateField('lokasi_nyeri', e.target.value)}
                      placeholder="Contoh: Dada kiri / abdomen kanan bawah"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Karakteristik / Kualitas Nyeri
                    </label>
                    <input
                      type="text"
                      value={form.karakteristik_nyeri}
                      onChange={(e) => updateField('karakteristik_nyeri', e.target.value)}
                      placeholder="Contoh: Tertindih, menusuk, hilang timbul"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PSIKOLOGIS, SOSIAL & FUNGSIONAL (EWS) */}
          {activeTab === 'tab3' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Psikologis Pasien
                </label>
                <select
                  value={form.status_psikologis}
                  onChange={(e) => updateField('status_psikologis', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  <option value="Tenang">Tenang / Kooperatif</option>
                  <option value="Cemas">Cemas</option>
                  <option value="Gelisah">Gelisah / Agitasi</option>
                  <option value="Depresi / Sedih">Depresi / Menangis</option>
                  <option value="Tidak Dapat Dikaji">Tidak Dapat Dikaji (Penurunan Kesadaran)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Sosial &amp; Dukungan Keluarga
                </label>
                <input
                  type="text"
                  value={form.dukungan_sosial}
                  onChange={(e) => updateField('dukungan_sosial', e.target.value)}
                  placeholder="Contoh: Didampingi keluarga inti"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Fungsional / Aktivitas
                </label>
                <select
                  value={form.status_fungsional}
                  onChange={(e) => updateField('status_fungsional', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  <option value="Mandiri">Mandiri</option>
                  <option value="Mandiri / Dibantu sebagian">Dibantu Sebagian</option>
                  <option value="Ketergantungan total (brankar)">Ketergantungan Total (Brankar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skrining Risiko Jatuh (Morse / Get Up &amp; Go)
                </label>
                <select
                  value={form.risiko_jatuh}
                  onChange={(e) => updateField('risiko_jatuh', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  <option value="Risiko Rendah">Risiko Rendah</option>
                  <option value="Risiko Sedang">Risiko Sedang</option>
                  <option value="Risiko Tinggi">Risiko Tinggi (Pasang gelang kuning &amp; pengaman brankar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skor EWS (Early Warning Score) Pencatatan Petugas
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={form.skor_ews_manual}
                  onChange={(e) => updateField('skor_ews_manual', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PENUNJANG & TERAPI */}
          {activeTab === 'tab4' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4 text-[#2878C8]" aria-hidden="true" />
                  <label className="text-xs font-bold text-[#173B67]">
                    Permintaan Pemeriksaan Penunjang IGD
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {DIAGNOSTIC_SUPPORT_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 p-2.5 rounded-[10px] border border-slate-200 bg-[#F4F8FC]/40 text-xs text-slate-800 cursor-pointer hover:border-[#2878C8]"
                    >
                      <input
                        type="checkbox"
                        checked={form.pemeriksaan_penunjang.includes(opt)}
                        onChange={() => toggleArrayItem('pemeriksaan_penunjang', opt)}
                        className="rounded border-slate-300 text-[#2878C8]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Terapi Awal &amp; Tindakan Keperawatan IGD
                </label>
                <textarea
                  rows={3}
                  value={form.terapi_awal}
                  onChange={(e) => updateField('terapi_awal', e.target.value)}
                  placeholder="Contoh: Oksigenasi, pemasangan infus RL, pemberian analgetik/antipiretik sesuai instruksi dokter..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rencana Tindak Lanjut / Disposisi Pasien
                </label>
                <input
                  type="text"
                  value={form.rencana_tindak_lanjut}
                  onChange={(e) => updateField('rencana_tindak_lanjut', e.target.value)}
                  placeholder="Contoh: Observasi IGD 2 jam / Rawat Inap / Konsul Spesialis / Pulang Berobat Jalan"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Activity className="w-4 h-4 text-[#35B6A4]" aria-hidden="true" />
          <span>Data triase &amp; asuhan disimpan ke simulasi penyimpanan lokal browser.</span>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-[10px] hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Formulir
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#173B67] rounded-[10px] hover:bg-[#1f4d85]"
          >
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
            Simpan Data Triase &amp; Asuhan
          </button>
        </div>
      </div>
    </form>
  );
}
