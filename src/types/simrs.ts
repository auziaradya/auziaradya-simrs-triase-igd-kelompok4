export type TriageLevel = 'Merah' | 'Kuning' | 'Hijau' | 'Hitam';

export type VisitStatus =
  | 'Menunggu Triase'
  | 'Dalam Penanganan'
  | 'Observasi'
  | 'Selesai';

export type ActiveMenu =
  | 'dashboard'
  | 'pendaftaran'
  | 'triase'
  | 'kunjungan'
  | 'laporan'
  | 'pengaturan'
  | 'profil';

export interface TriageAssessment {
  waktu_pengkajian: string;
  rs_perujuk: string;
  keluhan_saat_mrs: string;
  mekanisme_kejadian: string[];
  mekanisme_lainnya: string;
  // SAMPLE
  sample_s: string;
  sample_a: string;
  sample_m: string;
  sample_p: string;
  sample_l: string;
  sample_e: string;
  // ABCDE
  abcde_airway: string;
  abcde_breathing: string;
  abcde_circulation: string;
  abcde_disability: string;
  abcde_exposure: string;
  // Tab 2: Nyeri & Tanda Vital Lengkap
  instrumen_nyeri: 'NRS' | 'BPS' | 'CPOT';
  skala_nyeri: number;
  lokasi_nyeri: string;
  karakteristik_nyeri: string;
  sistolik: number;
  diastolik: number;
  nadi: number;
  suhu: number;
  rr: number;
  spo2: number;
  // Tab 3: Psikologis, Sosial & Fungsional (EWS)
  status_psikologis: string;
  dukungan_sosial: string;
  status_fungsional: string;
  risiko_jatuh: string;
  skor_ews_manual: number;
  // Tab 4: Penunjang & Terapi
  pemeriksaan_penunjang: string[];
  terapi_awal: string;
  rencana_tindak_lanjut: string;
}

export interface IgdVisitRecord {
  id_pendaftaran: string;
  no_rm: string;
  // Identitas Pasien KMK 1423
  nama_lengkap: string;
  nik_ktp: string;
  jenis_kelamin_kmk: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  usia_tahun: number;
  nama_ibu_kandung: string;
  kewarganegaraan: string;
  status_wn: 'WNI' | 'WNA';
  status_pernikahan: string;
  agama: string;
  golongan_darah: string;
  satusehat_status: 'Terhubung' | 'Belum Terhubung';
  satusehat_id: string;
  // Alamat Berjenjang
  provinsi: string;
  kab_kota: string;
  kecamatan: string;
  kelurahan: string;
  alamat_jalan: string;
  rt: string;
  rw: string;
  no_rumah: string;
  no_hp: string;
  email: string;
  // Penanggung Jawab
  pj_alamat_sama: boolean;
  pj_nama: string;
  pj_hubungan: string;
  pj_no_hp: string;
  pj_alamat_lengkap?: string;
  // Masuk IGD
  waktu_kedatangan: string;
  kategori_triase: TriageLevel;
  cara_datang: string;
  sebab_masuk: string;
  kesadaran_gcs: string;
  keluhan_utama: string;
  dokter_jaga: string;
  // Penjamin & VClaim
  cara_pembayaran: string;
  no_bpjs?: string;
  bpjs_status_validasi?: string;
  no_sep_simulasi?: string;
  // Status & Asuhan PMK 47/2018
  status_kunjungan: VisitStatus;
  asuhan?: TriageAssessment;
}

export const TRIAGE_CONFIG: Record<
  TriageLevel,
  {
    title: string;
    subtitle: string;
    responseTime: string;
    description: string;
    hex: string;
    badgeBg: string;
    badgeText: string;
    cardBorder: string;
    cardSurface: string;
  }
> = {
  Merah: {
    title: 'Merah · Resusitasi',
    subtitle: 'Resusitasi',
    responseTime: '0 menit',
    description: 'Ancaman henti napas/jantung',
    hex: '#E74C3C',
    badgeBg: 'bg-[#E74C3C]',
    badgeText: 'text-white',
    cardBorder: 'border-[#E74C3C]',
    cardSurface: 'bg-red-50/70',
  },
  Kuning: {
    title: 'Kuning · Emergensi',
    subtitle: 'Emergensi',
    responseTime: '< 15 menit',
    description: 'Gawat darurat berisiko tinggi',
    hex: '#F59E0B',
    badgeBg: 'bg-[#F59E0B]',
    badgeText: 'text-white',
    cardBorder: 'border-[#F59E0B]',
    cardSurface: 'bg-amber-50/70',
  },
  Hijau: {
    title: 'Hijau · Non-Urgensi',
    subtitle: 'Non-Urgensi',
    responseTime: '< 60 menit',
    description: 'Semi darurat / ringan',
    hex: '#27AE60',
    badgeBg: 'bg-[#27AE60]',
    badgeText: 'text-white',
    cardBorder: 'border-[#27AE60]',
    cardSurface: 'bg-emerald-50/70',
  },
  Hitam: {
    title: 'Hitam · Meninggal / DOA',
    subtitle: 'Meninggal / DOA',
    responseTime: 'DOA',
    description: 'Death on Arrival / tanda kematian jelas',
    hex: '#333333',
    badgeBg: 'bg-[#333333]',
    badgeText: 'text-white',
    cardBorder: 'border-[#333333]',
    cardSurface: 'bg-slate-100',
  },
};
