import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Link2,
  MapPin,
  RotateCcw,
  Save,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import {
  ARRIVAL_MODE_OPTIONS,
  BLOOD_TYPE_OPTIONS,
  CAUSE_OF_ADMISSION_OPTIONS,
  DUTY_DOCTORS,
  GCS_OPTIONS,
  KMK_GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PJ_RELATION_OPTIONS,
  REGION_HIERARCHY,
  RELIGION_OPTIONS,
  generateNextIdPendaftaran,
  generateNextNoRm,
} from '../data/simrsMasterData';
import { IgdVisitRecord, TRIAGE_CONFIG, TriageLevel } from '../types/simrs';

interface PendaftaranIgdViewProps {
  visits: IgdVisitRecord[];
  onRegisterVisit: (record: IgdVisitRecord) => void;
  onNotify: (msg: string) => void;
}

function getLocalDateTimeNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function calculateAgeYears(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function PendaftaranIgdView({
  visits,
  onRegisterVisit,
  onNotify,
}: PendaftaranIgdViewProps) {
  const nextNoRm = useMemo(() => generateNextNoRm(visits), [visits]);
  const nextIdPendaftaran = useMemo(() => generateNextIdPendaftaran(visits), [visits]);

  // Card 1: Identitas Pasien
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nikKtp, setNikKtp] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('1');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [kewarganegaraan, setKewarganegaraan] = useState('INDONESIA');
  const [statusWn, setStatusWn] = useState<'WNI' | 'WNA'>('WNI');
  const [statusPernikahan, setStatusPernikahan] = useState('Belum Menikah');
  const [agama, setAgama] = useState('Islam');
  const [golonganDarah, setGolonganDarah] = useState('Tidak Tahu');
  const [satusehatStatus, setSatusehatStatus] = useState<'Belum Terhubung' | 'Terhubung'>('Belum Terhubung');
  const [satusehatId, setSatusehatId] = useState('-');

  // Alamat berjenjang
  const [cariWilayah, setCariWilayah] = useState('');
  const [provinsi, setProvinsi] = useState('JAWA BARAT');
  const [kabKota, setKabKota] = useState('KOTA BANDUNG');
  const [kecamatan, setKecamatan] = useState('COBLONG');
  const [kelurahan, setKelurahan] = useState('DAGO');
  const [alamatJalan, setAlamatJalan] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [noRumah, setNoRumah] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');

  // Card 2: Penanggung Jawab
  const [pjAlamatSama, setPjAlamatSama] = useState(true);
  const [pjNama, setPjNama] = useState('');
  const [pjHubungan, setPjHubungan] = useState('Istri');
  const [pjNoHp, setPjNoHp] = useState('');
  const [pjAlamatLengkap, setPjAlamatLengkap] = useState('');

  // Card 3: Formulir Masuk IGD
  const [kategoriTriase, setKategoriTriase] = useState<TriageLevel | ''>('');
  const [caraDatang, setCaraDatang] = useState(ARRIVAL_MODE_OPTIONS[0]);
  const [sebabMasuk, setSebabMasuk] = useState(CAUSE_OF_ADMISSION_OPTIONS[0]);
  const [kesadaranGcs, setKesadaranGcs] = useState(GCS_OPTIONS[0]);
  const [keluhanUtama, setKeluhanUtama] = useState('');
  const [dokterJaga, setDokterJaga] = useState(DUTY_DOCTORS[0]);

  // Card 4: Penjamin & Bridging VClaim
  const [caraPembayaran, setCaraPembayaran] = useState(PAYMENT_METHOD_OPTIONS[0]);
  const [noBpjs, setNoBpjs] = useState('');
  const [bpjsResult, setBpjsResult] = useState('');
  const [sepResult, setSepResult] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const usiaTahun = useMemo(() => calculateAgeYears(tanggalLahir), [tanggalLahir]);

  const provinsiList = Object.keys(REGION_HIERARCHY);
  const kabKotaList = Object.keys(REGION_HIERARCHY[provinsi] || {});
  const kecamatanList = Object.keys(REGION_HIERARCHY[provinsi]?.[kabKota] || {});
  const kelurahanList = REGION_HIERARCHY[provinsi]?.[kabKota]?.[kecamatan] || [];

  const handleProvinsiChange = (val: string) => {
    setProvinsi(val);
    const firstKab = Object.keys(REGION_HIERARCHY[val] || {})[0] || '';
    setKabKota(firstKab);
    const firstKec = Object.keys(REGION_HIERARCHY[val]?.[firstKab] || {})[0] || '';
    setKecamatan(firstKec);
    const firstKel = REGION_HIERARCHY[val]?.[firstKab]?.[firstKec]?.[0] || '';
    setKelurahan(firstKel);
  };

  const handleKabChange = (val: string) => {
    setKabKota(val);
    const firstKec = Object.keys(REGION_HIERARCHY[provinsi]?.[val] || {})[0] || '';
    setKecamatan(firstKec);
    const firstKel = REGION_HIERARCHY[provinsi]?.[val]?.[firstKec]?.[0] || '';
    setKelurahan(firstKel);
  };

  const handleKecChange = (val: string) => {
    setKecamatan(val);
    const firstKel = REGION_HIERARCHY[provinsi]?.[kabKota]?.[val]?.[0] || '';
    setKelurahan(firstKel);
  };

  const handleAutoFillRegion = () => {
    const q = cariWilayah.trim().toUpperCase();
    for (const prov of Object.keys(REGION_HIERARCHY)) {
      for (const kab of Object.keys(REGION_HIERARCHY[prov])) {
        for (const kec of Object.keys(REGION_HIERARCHY[prov][kab])) {
          for (const kel of REGION_HIERARCHY[prov][kab][kec]) {
            if (!q || kel.includes(q) || kec.includes(q) || kab.includes(q) || prov.includes(q)) {
              setProvinsi(prov);
              setKabKota(kab);
              setKecamatan(kec);
              setKelurahan(kel);
              onNotify(`Wilayah otomatis diisi: ${kel}, ${kec}, ${kab}, ${prov} (Simulasi).`);
              return;
            }
          }
        }
      }
    }
    setProvinsi('DKI JAKARTA');
    setKabKota('KOTA ADM. JAKARTA SELATAN');
    setKecamatan('KEBAYORAN BARU');
    setKelurahan('SENAYAN');
    onNotify('Wilayah default simulasi diisi: SENAYAN, KEBAYORAN BARU, JAKARTA SELATAN.');
  };

  const handleCekSatuSehat = () => {
    if (!/^\d{16}$/.test(nikKtp.trim())) {
      setErrors((prev) => ({
        ...prev,
        nikKtp: 'Masukkan 16 digit angka NIK KTP terlebih dahulu untuk simulasi SatuSehat.',
      }));
      return;
    }
    const fakeId = `P1000${nikKtp.slice(-7)}`;
    setSatusehatStatus('Terhubung');
    setSatusehatId(fakeId);
    onNotify(`Simulasi SatuSehat IHS berhasil terhubung (IHS ID: ${fakeId}).`);
  };

  const handleCekBpjs = () => {
    if (!/^\d{13}$/.test(noBpjs.trim())) {
      setErrors((prev) => ({
        ...prev,
        noBpjs: 'Nomor kartu BPJS Kesehatan harus tepat 13 digit angka.',
      }));
      return;
    }
    setBpjsResult(`SIMULASI VCLAIM: KARTU ${noBpjs} STATUS AKTIF · FASKES TK.1 KLINIK SEHAT SENTOSA`);
    onNotify('Simulasi validasi kepesertaan BPJS Kesehatan berhasil (Status: AKTIF).');
  };

  const handleCekVclaimSep = () => {
    if (!/^\d{13}$/.test(noBpjs.trim())) {
      setErrors((prev) => ({
        ...prev,
        noBpjs: 'Masukkan 13 digit Nomor Kartu BPJS sebelum menerbitkan SEP simulasi.',
      }));
      return;
    }
    const sepSim = `0112R0011126V${String(Math.floor(100000 + Math.random() * 899999))}`;
    setBpjsResult(`SIMULASI VCLAIM: PESERTA AKTIF · HAK KELAS RAWAT 2`);
    setSepResult(sepSim);
    onNotify(`Simulasi Bridging VClaim berhasil menerbitkan No. SEP: ${sepSim}.`);
  };

  const handleReset = () => {
    setNamaLengkap('');
    setNikKtp('');
    setJenisKelamin('1');
    setTempatLahir('');
    setTanggalLahir('');
    setNamaIbu('');
    setKewarganegaraan('INDONESIA');
    setStatusWn('WNI');
    setStatusPernikahan('Belum Menikah');
    setAgama('Islam');
    setGolonganDarah('Tidak Tahu');
    setSatusehatStatus('Belum Terhubung');
    setSatusehatId('-');
    setAlamatJalan('');
    setRt('');
    setRw('');
    setNoRumah('');
    setNoHp('');
    setEmail('');
    setPjAlamatSama(true);
    setPjNama('');
    setPjHubungan('Istri');
    setPjNoHp('');
    setPjAlamatLengkap('');
    setKategoriTriase('');
    setCaraDatang(ARRIVAL_MODE_OPTIONS[0]);
    setSebabMasuk(CAUSE_OF_ADMISSION_OPTIONS[0]);
    setKesadaranGcs(GCS_OPTIONS[0]);
    setKeluhanUtama('');
    setDokterJaga(DUTY_DOCTORS[0]);
    setCaraPembayaran(PAYMENT_METHOD_OPTIONS[0]);
    setNoBpjs('');
    setBpjsResult('');
    setSepResult('');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!namaLengkap.trim()) nextErrors.namaLengkap = 'Nama lengkap pasien wajib diisi.';
    if (!/^\d{16}$/.test(nikKtp.trim())) {
      nextErrors.nikKtp = 'NIK KTP wajib tepat 16 digit angka.';
    }
    if (!tanggalLahir) nextErrors.tanggalLahir = 'Tanggal lahir wajib diisi.';
    if (!noHp.trim()) nextErrors.noHp = 'No. HP / Telepon pasien wajib diisi.';
    if (!pjNama.trim()) nextErrors.pjNama = 'Nama penanggung jawab wajib diisi.';
    if (!pjNoHp.trim()) nextErrors.pjNoHp = 'No. HP penanggung jawab wajib diisi.';
    if (!kategoriTriase) {
      nextErrors.kategoriTriase = 'Pilih kategori triase awal secara manual oleh petugas.';
    }
    if (!keluhanUtama.trim()) nextErrors.keluhanUtama = 'Keluhan utama masuk IGD wajib diisi.';
    if (caraPembayaran.includes('BPJS') && noBpjs.trim() && !/^\d{13}$/.test(noBpjs.trim())) {
      nextErrors.noBpjs = 'Nomor kartu BPJS harus 13 digit angka.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !kategoriTriase) {
      onNotify('Periksa kembali kolom wajib bertanda bintang (*) pada formulir pendaftaran.');
      return;
    }

    const newRecord: IgdVisitRecord = {
      id_pendaftaran: nextIdPendaftaran,
      no_rm: nextNoRm,
      nama_lengkap: namaLengkap.trim().toUpperCase(),
      nik_ktp: nikKtp.trim(),
      jenis_kelamin_kmk: jenisKelamin,
      tempat_lahir: tempatLahir.trim().toUpperCase() || '-',
      tanggal_lahir: tanggalLahir,
      usia_tahun: usiaTahun,
      nama_ibu_kandung: namaIbu.trim().toUpperCase() || '-',
      kewarganegaraan,
      status_wn: statusWn,
      status_pernikahan: statusPernikahan,
      agama,
      golongan_darah: golonganDarah,
      satusehat_status: satusehatStatus,
      satusehat_id: satusehatId,
      provinsi,
      kab_kota: kabKota,
      kecamatan,
      kelurahan,
      alamat_jalan: alamatJalan.trim().toUpperCase() || '-',
      rt: rt.trim() || '000',
      rw: rw.trim() || '000',
      no_rumah: noRumah.trim() || '-',
      no_hp: noHp.trim(),
      email: email.trim() || '-',
      pj_alamat_sama: pjAlamatSama,
      pj_nama: pjNama.trim().toUpperCase(),
      pj_hubungan: pjHubungan,
      pj_no_hp: pjNoHp.trim(),
      pj_alamat_lengkap: pjAlamatSama ? undefined : pjAlamatLengkap.trim().toUpperCase(),
      waktu_kedatangan: getLocalDateTimeNow(),
      kategori_triase: kategoriTriase,
      cara_datang: caraDatang,
      sebab_masuk: sebabMasuk,
      kesadaran_gcs: kesadaranGcs,
      keluhan_utama: keluhanUtama.trim(),
      dokter_jaga: dokterJaga,
      cara_pembayaran: caraPembayaran,
      no_bpjs: noBpjs.trim() || undefined,
      bpjs_status_validasi: bpjsResult || undefined,
      no_sep_simulasi: sepResult || undefined,
      status_kunjungan: 'Menunggu Triase',
    };

    onRegisterVisit(newRecord);
    handleReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: Card 1 & Card 2 */}
        <div className="xl:col-span-7 space-y-6">
          {/* CARD 1: LEMBAR IDENTITAS PASIEN */}
          <section className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-[#F4F8FC]/60">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#2878C8]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#173B67]">
                  LEMBAR IDENTITAS PASIEN (KMK 1423)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold text-[#173B67] bg-white border border-blue-200 px-2.5 py-0.5 rounded-md">
                  No. RM: {nextNoRm}
                </span>
                <span className="text-[10px] font-semibold text-white bg-[#2878C8] px-2 py-0.5 rounded-md">
                  6 Digit
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pasien (Kapital tanpa gelar)*
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value.toUpperCase())}
                    placeholder="CONTOH: PASIEN DUMMY BUDI SANTOSO"
                    className="w-full px-3 py-2 text-xs uppercase border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
                  />
                  {errors.namaLengkap && (
                    <p className="text-[11px] text-[#E74C3C] mt-1">{errors.namaLengkap}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK KTP (16 Digit Angka)*
                  </label>
                  <input
                    type="text"
                    name="nik_ktp"
                    maxLength={16}
                    value={nikKtp}
                    onChange={(e) => setNikKtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="3201010101900001"
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
                  />
                  {errors.nikKtp && (
                    <p className="text-[11px] text-[#E74C3C] mt-1">{errors.nikKtp}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin (5 Kategori KMK 1423)*
                  </label>
                  <select
                    name="jenis_kelamin_kmk"
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
                  >
                    {KMK_GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Ibu Kandung
                  </label>
                  <input
                    type="text"
                    name="nama_ibu_kandung"
                    value={namaIbu}
                    onChange={(e) => setNamaIbu(e.target.value.toUpperCase())}
                    placeholder="NAMA IBU KANDUNG DUMMY"
                    className="w-full px-3 py-2 text-xs uppercase border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempat_lahir"
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value.toUpperCase())}
                    placeholder="BANDUNG"
                    className="w-full px-3 py-2 text-xs uppercase border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Lahir*
                    </label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
                    />
                    {errors.tanggalLahir && (
                      <p className="text-[11px] text-[#E74C3C] mt-1">{errors.tanggalLahir}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Usia
                    </label>
                    <div className="px-3 py-2 text-xs font-mono tabular-nums font-semibold bg-[#F4F8FC] border border-slate-200 rounded-[10px] text-[#173B67]">
                      {usiaTahun} thn
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kewarganegaraan
                    </label>
                    <select
                      name="kewarganegaraan"
                      value={kewarganegaraan}
                      onChange={(e) => {
                        setKewarganegaraan(e.target.value);
                        setStatusWn(e.target.value === 'INDONESIA' ? 'WNI' : 'WNA');
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
                    >
                      <option value="INDONESIA">INDONESIA</option>
                      <option value="WNA">WNA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status_wn"
                      value={statusWn}
                      onChange={(e) => setStatusWn(e.target.value as 'WNI' | 'WNA')}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
                    >
                      <option value="WNI">WNI</option>
                      <option value="WNA">WNA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Pernikahan (KMK 1423)
                  </label>
                  <select
                    name="status_pernikahan"
                    value={statusPernikahan}
                    onChange={(e) => setStatusPernikahan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
                  >
                    {MARITAL_STATUS_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agama (KMK 1423)
                  </label>
                  <select
                    name="agama"
                    value={agama}
                    onChange={(e) => setAgama(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
                  >
                    {RELIGION_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Golongan Darah
                  </label>
                  <select
                    name="golongan_darah"
                    value={golonganDarah}
                    onChange={(e) => setGolonganDarah(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white focus:outline-none focus:border-[#2878C8]"
                  >
                    {BLOOD_TYPE_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Integrasi SatuSehat */}
              <div className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5 text-[#2878C8]" aria-hidden="true" />
                    <span className="text-xs font-bold text-[#173B67]">
                      Integrasi SatuSehat Kemenkes ID
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        satusehatStatus === 'Terhubung'
                          ? 'bg-[#27AE60] text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {satusehatStatus}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600">
                    IHS Number: {satusehatId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCekSatuSehat}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2878C8] rounded-[8px] hover:bg-[#1e64ab] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  Cek SatuSehat
                </button>
              </div>

              {/* Sub-section Alamat Lengkap Berjenjang */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2878C8]" aria-hidden="true" />
                    <h3 className="text-xs font-bold text-[#173B67]">
                      ALAMAT LENGKAP BERJENJANG (KTP &amp; DOMISILI)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cariWilayah}
                      onChange={(e) => setCariWilayah(e.target.value)}
                      placeholder="Cari kelurahan/kota (mis: Dago)..."
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-[8px] w-48 focus:outline-none focus:border-[#2878C8]"
                    />
                    <button
                      type="button"
                      onClick={handleAutoFillRegion}
                      className="px-2.5 py-1 text-xs font-semibold text-[#173B67] bg-[#F4F8FC] border border-blue-200 rounded-[8px] hover:bg-blue-100 whitespace-nowrap"
                    >
                      Auto-fill
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Provinsi
                    </label>
                    <select
                      name="provinsi"
                      value={provinsi}
                      onChange={(e) => handleProvinsiChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                    >
                      {provinsiList.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kabupaten / Kota
                    </label>
                    <select
                      name="kab_kota"
                      value={kabKota}
                      onChange={(e) => handleKabChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                    >
                      {kabKotaList.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kecamatan
                    </label>
                    <select
                      name="kecamatan"
                      value={kecamatan}
                      onChange={(e) => handleKecChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                    >
                      {kecamatanList.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kelurahan / Desa
                    </label>
                    <select
                      name="kelurahan"
                      value={kelurahan}
                      onChange={(e) => setKelurahan(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                    >
                      {kelurahanList.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Jalan / Blok
                    </label>
                    <input
                      type="text"
                      name="alamat_jalan"
                      value={alamatJalan}
                      onChange={(e) => setAlamatJalan(e.target.value)}
                      placeholder="JL. MERDEKA DUMMY"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      RT
                    </label>
                    <input
                      type="text"
                      name="rt"
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      placeholder="001"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      RW
                    </label>
                    <input
                      type="text"
                      name="rw"
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      placeholder="002"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      No. Rumah
                    </label>
                    <input
                      type="text"
                      name="no_rumah"
                      value={noRumah}
                      onChange={(e) => setNoRumah(e.target.value)}
                      placeholder="12A"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      No. HP / Telepon*
                    </label>
                    <input
                      type="tel"
                      name="no_hp"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      placeholder="081200000000"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
                    />
                    {errors.noHp && <p className="text-[11px] text-[#E74C3C] mt-1">{errors.noHp}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Pasien
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pasien.dummy@contoh.id"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CARD 2: PENANGGUNG JAWAB PASIEN */}
          <section className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-[#F4F8FC]/60">
              <h2 className="text-sm font-bold text-[#173B67]">
                PENANGGUNG JAWAB PASIEN
              </h2>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="pj_alamat_sama"
                  checked={pjAlamatSama}
                  onChange={(e) => setPjAlamatSama(e.target.checked)}
                  className="rounded border-slate-300 text-[#2878C8]"
                />
                Alamat sama dengan pasien
              </label>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penanggung Jawab*
                </label>
                <input
                  type="text"
                  name="pj_nama"
                  value={pjNama}
                  onChange={(e) => setPjNama(e.target.value.toUpperCase())}
                  placeholder="NAMA PENANGGUNG JAWAB"
                  className="w-full px-3 py-2 text-xs uppercase border border-slate-300 rounded-[10px]"
                />
                {errors.pjNama && (
                  <p className="text-[11px] text-[#E74C3C] mt-1">{errors.pjNama}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hubungan dengan Pasien*
                </label>
                <select
                  name="pj_hubungan"
                  value={pjHubungan}
                  onChange={(e) => setPjHubungan(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  {PJ_RELATION_OPTIONS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. HP Penanggung Jawab*
                </label>
                <input
                  type="tel"
                  name="pj_no_hp"
                  value={pjNoHp}
                  onChange={(e) => setPjNoHp(e.target.value)}
                  placeholder="081200000099"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-[10px]"
                />
                {errors.pjNoHp && (
                  <p className="text-[11px] text-[#E74C3C] mt-1">{errors.pjNoHp}</p>
                )}
              </div>

              {!pjAlamatSama && (
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    name="pj_alamat_lengkap"
                    value={pjAlamatLengkap}
                    onChange={(e) => setPjAlamatLengkap(e.target.value)}
                    placeholder="Tuliskan alamat lengkap penanggung jawab..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px]"
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* KOLOM KANAN: Card 3 & Card 4 */}
        <div className="xl:col-span-5 space-y-6">
          {/* CARD 3: FORMULIR MASUK IGD */}
          <section className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-[#F4F8FC]/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E74C3C]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#173B67]">FORMULIR MASUK IGD</h2>
              </div>
              <span className="text-[10px] font-bold tracking-wide text-white bg-[#E74C3C] px-2.5 py-0.5 rounded-md">
                EMERGENCY ROOM
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Kategori Triase Awal (KMK 1423 · Pilihan Manual)*
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: {nextIdPendaftaran}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {(['Merah', 'Kuning', 'Hijau', 'Hitam'] as TriageLevel[]).map((level) => {
                    const cfg = TRIAGE_CONFIG[level];
                    const checked = kategoriTriase === level;
                    return (
                      <label
                        key={level}
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-[10px] border cursor-pointer transition-all ${
                          checked
                            ? `${cfg.cardBorder} ${cfg.cardSurface} ring-1 ring-offset-0`
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="kategori_triase"
                          value={level}
                          checked={checked}
                          onChange={() => setKategoriTriase(level)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-sm shrink-0 ${cfg.badgeBg}`}
                            aria-hidden="true"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{level}</div>
                            <div className="text-[10px] text-slate-600">{cfg.subtitle}</div>
                          </div>
                        </div>
                        {checked && (
                          <CheckCircle2 className="w-4 h-4 text-[#173B67]" aria-hidden="true" />
                        )}
                      </label>
                    );
                  })}
                </div>
                {errors.kategoriTriase && (
                  <p className="text-[11px] text-[#E74C3C] mt-1">{errors.kategoriTriase}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cara Datang ke IGD
                </label>
                <select
                  name="cara_datang"
                  value={caraDatang}
                  onChange={(e) => setCaraDatang(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  {ARRIVAL_MODE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sebab Masuk IGD
                </label>
                <select
                  name="sebab_masuk"
                  value={sebabMasuk}
                  onChange={(e) => setSebabMasuk(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  {CAUSE_OF_ADMISSION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tingkat Kesadaran (GCS)
                </label>
                <select
                  name="kesadaran_gcs"
                  value={kesadaranGcs}
                  onChange={(e) => setKesadaranGcs(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  {GCS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keluhan Utama Masuk IGD*
                </label>
                <textarea
                  name="keluhan_utama"
                  rows={3}
                  value={keluhanUtama}
                  onChange={(e) => setKeluhanUtama(e.target.value)}
                  placeholder="Tuliskan keluhan utama saat pasien tiba di IGD..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#2878C8]"
                />
                {errors.keluhanUtama && (
                  <p className="text-[11px] text-[#E74C3C] mt-1">{errors.keluhanUtama}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dokter Jaga IGD*
                </label>
                <select
                  name="dokter_jaga"
                  value={dokterJaga}
                  onChange={(e) => setDokterJaga(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  {DUTY_DOCTORS.map((doc) => (
                    <option key={doc} value={doc}>
                      {doc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* CARD 4: PENJAMIN & CARA PEMBAYARAN */}
          <section className="bg-white border border-slate-200 rounded-[12px] shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-[#F4F8FC]/60">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#35B6A4]" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#173B67]">
                  PENJAMIN &amp; CARA PEMBAYARAN
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-[#173B67] bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                BRIDGING SIMULASI
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cara Pembayaran*
                </label>
                <select
                  name="cara_pembayaran"
                  value={caraPembayaran}
                  onChange={(e) => setCaraPembayaran(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[10px] bg-white"
                >
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#F4F8FC] border border-blue-200 space-y-3">
                <p className="text-xs font-bold text-[#173B67]">
                  Panel Simulasi Bridging VClaim BPJS Kesehatan
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nomor Kartu BPJS Kesehatan (13 Digit Angka)
                  </label>
                  <input
                    type="text"
                    name="no_bpjs"
                    maxLength={13}
                    value={noBpjs}
                    onChange={(e) => setNoBpjs(e.target.value.replace(/\D/g, ''))}
                    placeholder="0001234567890"
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-[10px]"
                  />
                  {errors.noBpjs && (
                    <p className="text-[11px] text-[#E74C3C] mt-1">{errors.noBpjs}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCekBpjs}
                    className="px-3 py-1.5 text-xs font-semibold text-[#173B67] bg-white border border-slate-300 rounded-[8px] hover:bg-slate-50"
                  >
                    Cek BPJS
                  </button>
                  <button
                    type="button"
                    onClick={handleCekVclaimSep}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#35B6A4] rounded-[8px] hover:bg-[#2b9a8a]"
                  >
                    Cek VClaim &amp; SEP
                  </button>
                </div>

                {(bpjsResult || sepResult) && (
                  <div className="p-2.5 rounded-[8px] bg-white border border-emerald-200 text-[11px] space-y-1">
                    {bpjsResult && <p className="font-semibold text-[#27AE60]">{bpjsResult}</p>}
                    {sepResult && (
                      <p className="font-mono text-[#173B67]">
                        No. SEP Simulasi: <strong>{sepResult}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Tombol Aksi Utama */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate-600">
          Mode simulasi lokal (<code className="font-mono">localStorage</code>) — tidak mengirimkan data ke server produksi rumah sakit.
        </p>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-[10px] hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#173B67] rounded-[10px] hover:bg-[#1f4d85] transition-colors"
          >
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
            SIMPAN &amp; DAFTARKAN PASIEN IGD
          </button>
        </div>
      </div>
    </form>
  );
}
