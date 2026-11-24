import { IgdVisitRecord } from '../types/simrs';

export const KMK_GENDER_OPTIONS = [
  { value: '1', label: '1 : Laki-laki' },
  { value: '2', label: '2 : Perempuan' },
  { value: '0', label: '0 : Tidak diketahui' },
  { value: '3', label: '3 : Tidak dapat ditentukan' },
  { value: '4', label: '4 : Tidak mengisi' },
];

export const MARITAL_STATUS_OPTIONS = [
  'Belum Menikah',
  'Kawin',
  'Cerai Hidup',
  'Cerai Mati',
];

export const RELIGION_OPTIONS = [
  'Islam',
  'Kristen Protestan',
  'Katolik',
  'Hindu',
  'Buddha',
  'Khonghucu',
  'Penghayat Kepercayaan',
];

export const BLOOD_TYPE_OPTIONS = ['A', 'B', 'AB', 'O', 'Tidak Tahu'];

export const ARRIVAL_MODE_OPTIONS = [
  '1 : Datang Sendiri / Mandiri',
  '2 : Ambulans',
  '3 : Rujukan Puskesmas / RS Lain',
  '4 : Diantar Polisi / Masyarakat',
];

export const CAUSE_OF_ADMISSION_OPTIONS = [
  '1 : Non-Trauma / Penyakit',
  '2 : Trauma / Kecelakaan',
  '3 : Obstetri / Ginekologi',
  '4 : Psikiatri',
];

export const GCS_OPTIONS = [
  'E4M6V5 - Compos Mentis - GCS 15',
  'E4M6V4 - Apatis / Bingung - GCS 14',
  'E3M5V4 - Delirium - GCS 12',
  'E3M5V3 - Somnolen - GCS 11',
  'E2M4V2 - Sopor / Stupor - GCS 8',
  'E1M2V1 - Koma Berat - GCS 4',
  'E1M1V1 - Tidak Ada Respon - GCS 3',
];

export const DUTY_DOCTORS = [
  'dr. Sari Dewi, Sp.PD',
  'dr. Budi Santoso, Sp.EM',
  'dr. Hendra Wijaya, Sp.B',
  'dr. Nadia Putri, Sp.A',
];

export const PAYMENT_METHOD_OPTIONS = [
  'BPJS KESEHATAN (JKN-KIS PBI / NON-PBI)',
  'Umum / Pribadi',
  'Asuransi Swasta',
  'Jasa Raharja',
];

export const PJ_RELATION_OPTIONS = [
  'Suami',
  'Istri',
  'Orang Tua',
  'Anak',
  'Saudara',
  'Lainnya',
];

export const MECHANISM_OPTIONS = [
  'Kecelakaan lalu lintas',
  'Jatuh',
  'Luka tusuk',
  'Terbakar',
  'Tenggelam',
  'Keracunan',
  'Kekerasan',
  'Lainnya',
];

export const DIAGNOSTIC_SUPPORT_OPTIONS = [
  'Darah Lengkap (CBC)',
  'Kimia Klinik & Elektrolit',
  'EKG 12 Lead',
  'Foto Thorax (Rontgen)',
  'CT Scan Kepala Non-Kontras',
  'USG FAST Abdomen',
  'Analisis Gas Darah (AGD)',
];

export interface RegionTree {
  [provinsi: string]: {
    [kabKota: string]: {
      [kecamatan: string]: string[];
    };
  };
}

export const REGION_HIERARCHY: RegionTree = {
  'DKI JAKARTA': {
    'KOTA ADM. JAKARTA SELATAN': {
      'KEBAYORAN BARU': ['SENAYAN', 'MELAWAI', 'GUNUNG', 'KRAMAT PELA'],
      'SETIABUDI': ['KARET', 'KUNINGAN TIMUR', 'MENTENG ATAS'],
    },
    'KOTA ADM. JAKARTA PUSAT': {
      'MENTENG': ['CIKINI', 'GONDANGDIA', 'PEGANGSAAN'],
      'GAMBIR': ['CIDENG', 'PETOJO UTARA', 'KEBON KELAPA'],
    },
  },
  'JAWA BARAT': {
    'KOTA BANDUNG': {
      'COBLONG': ['DAGO', 'LEBAK GEDE', 'SADANG SERANG'],
      'SUKASARI': ['GEGERKALONG', 'ISOLA', 'SARIJADI'],
    },
    'KAB. BOGOR': {
      'CIBINONG': ['PAKANSARI', 'SUKAHATI', 'TENGAH'],
      'BABAKAN MADANG': ['SENTUL', 'CITARINGGUL', 'CIPAMBUAN'],
    },
  },
  'JAWA TENGAH': {
    'KOTA SEMARANG': {
      'TEMBALANG': ['BULUSAN', 'METESEH', 'SENDANGMULYO'],
      'BANYUMANIK': ['SRONDOL WETAN', 'PADANGSARI', 'GEDAWANG'],
    },
  },
  'JAWA TIMUR': {
    'KOTA SURABAYA': {
      'GUBENG': ['AIRLANGGA', 'KERTAJAYA', 'MOJO'],
      'TEGALSARI': ['DR. SUTOMO', 'KEPUTRAN', 'WONOREJO'],
    },
  },
};

export const INITIAL_SIMRS_VISITS: IgdVisitRecord[] = [
  {
    id_pendaftaran: 'IGD-20261123-001',
    no_rm: '000001',
    nama_lengkap: 'PASIEN DUMMY HENDRA WIJAYA',
    nik_ktp: '3201010101680001',
    jenis_kelamin_kmk: '1',
    tempat_lahir: 'BANDUNG',
    tanggal_lahir: '1968-05-14',
    usia_tahun: 58,
    nama_ibu_kandung: 'NY. DUMMY SITI AMINAH',
    kewarganegaraan: 'INDONESIA',
    status_wn: 'WNI',
    status_pernikahan: 'Kawin',
    agama: 'Islam',
    golongan_darah: 'O',
    satusehat_status: 'Terhubung',
    satusehat_id: 'P10002938471',
    provinsi: 'JAWA BARAT',
    kab_kota: 'KOTA BANDUNG',
    kecamatan: 'COBLONG',
    kelurahan: 'DAGO',
    alamat_jalan: 'JL. IR. H. JUANDA DUMMY NO. 42',
    rt: '003',
    rw: '007',
    no_rumah: '42',
    no_hp: '081200000101',
    email: 'dummy.hendra@contoh.id',
    pj_alamat_sama: true,
    pj_nama: 'NY. DUMMY RATNA SARI',
    pj_hubungan: 'Istri',
    pj_no_hp: '081200000102',
    waktu_kedatangan: '2026-11-23T08:15',
    kategori_triase: 'Merah',
    cara_datang: '2 : Ambulans',
    sebab_masuk: '1 : Non-Trauma / Penyakit',
    kesadaran_gcs: 'E3M5V4 - Delirium - GCS 12',
    keluhan_utama: 'Nyeri dada kiri menjalar ke rahang disertai keringat dingin dan sesak napas.',
    dokter_jaga: 'dr. Budi Santoso, Sp.EM',
    cara_pembayaran: 'BPJS KESEHATAN (JKN-KIS PBI / NON-PBI)',
    no_bpjs: '0001234567891',
    bpjs_status_validasi: 'AKTIF · PESERTA PBI/NON-PBI',
    no_sep_simulasi: '0112R0011126V000101',
    status_kunjungan: 'Dalam Penanganan',
    asuhan: {
      waktu_pengkajian: '2026-11-23T08:17',
      rs_perujuk: 'PUSKESMAS DAGO',
      keluhan_saat_mrs: 'Nyeri dada substernal seperti tertindih beban berat sejak 45 menit SMRS.',
      mekanisme_kejadian: ['Lainnya'],
      mekanisme_lainnya: 'Onset nyeri dada akut non-trauma',
      sample_s: 'Nyeri dada kiri menjalar ke lengan kiri, diaforesis, sesak napas.',
      sample_a: 'Tidak ada riwayat alergi obat atau makanan.',
      sample_m: 'Amlodipine 5 mg/hari, Aspilet 80 mg (tidak rutin).',
      sample_p: 'Hipertensi sejak 6 tahun lalu, dislipidemia.',
      sample_l: 'Sarapan bubur pukul 06.30 WIB.',
      sample_e: 'Keluhan muncul mendadak saat beraktivitas ringan di rumah.',
      abcde_airway: 'Paten, tidak ada sumbatan jalan napas.',
      abcde_breathing: 'Takipnea RR 30 x/menit, SpO2 89% udara ruangan.',
      abcde_circulation: 'Akral dingin, CRT > 3 detik, TD 86/54 mmHg, nadi 124 x/menit.',
      abcde_disability: 'GCS E3M5V4 (12), pupil isokor 3mm/3mm.',
      abcde_exposure: 'Tidak ditemukan jejas trauma eksternal.',
      instrumen_nyeri: 'NRS',
      skala_nyeri: 8,
      lokasi_nyeri: 'Dada kiri retrosternal',
      karakteristik_nyeri: 'Menekan / terasa berat',
      sistolik: 86,
      diastolik: 54,
      nadi: 124,
      suhu: 36.4,
      rr: 30,
      spo2: 89,
      status_psikologis: 'Cemas',
      dukungan_sosial: 'Didampingi istri dan anak',
      status_fungsional: 'Ketergantungan total (brankar)',
      risiko_jatuh: 'Risiko Tinggi',
      skor_ews_manual: 8,
      pemeriksaan_penunjang: ['EKG 12 Lead', 'Darah Lengkap (CBC)', 'Kimia Klinik & Elektrolit'],
      terapi_awal: 'Oksigen NRM 10 L/menit, pasang akses IV line RL, monitoring EKG kontinu.',
      rencana_tindak_lanjut: 'Konsul cito Spesialis Jantung / persiapan ruang ICCU.',
    },
  },
  {
    id_pendaftaran: 'IGD-20261123-002',
    no_rm: '000002',
    nama_lengkap: 'PASIEN DUMMY KARTIKA PUTRI',
    nik_ktp: '3174015403920002',
    jenis_kelamin_kmk: '2',
    tempat_lahir: 'JAKARTA',
    tanggal_lahir: '1992-03-14',
    usia_tahun: 34,
    nama_ibu_kandung: 'NY. DUMMY ENDANG',
    kewarganegaraan: 'INDONESIA',
    status_wn: 'WNI',
    status_pernikahan: 'Kawin',
    agama: 'Islam',
    golongan_darah: 'B',
    satusehat_status: 'Terhubung',
    satusehat_id: 'P10008812034',
    provinsi: 'DKI JAKARTA',
    kab_kota: 'KOTA ADM. JAKARTA SELATAN',
    kecamatan: 'KEBAYORAN BARU',
    kelurahan: 'SENAYAN',
    alamat_jalan: 'JL. SENOPATI DUMMY NO. 18',
    rt: '001',
    rw: '002',
    no_rumah: '18',
    no_hp: '081300000201',
    email: 'dummy.kartika@contoh.id',
    pj_alamat_sama: true,
    pj_nama: 'TN. DUMMY ARIFIN',
    pj_hubungan: 'Suami',
    pj_no_hp: '081300000202',
    waktu_kedatangan: '2026-11-23T09:05',
    kategori_triase: 'Kuning',
    cara_datang: '1 : Datang Sendiri / Mandiri',
    sebab_masuk: '1 : Non-Trauma / Penyakit',
    kesadaran_gcs: 'E4M6V5 - Compos Mentis - GCS 15',
    keluhan_utama: 'Demam tinggi hari ke-3 disertai mual, muntah 4 kali, dan nyeri ulu hati.',
    dokter_jaga: 'dr. Sari Dewi, Sp.PD',
    cara_pembayaran: 'BPJS KESEHATAN (JKN-KIS PBI / NON-PBI)',
    no_bpjs: '0009876543210',
    bpjs_status_validasi: 'AKTIF · PESERTA NON-PBI',
    no_sep_simulasi: '0112R0011126V000102',
    status_kunjungan: 'Menunggu Triase',
  },
  {
    id_pendaftaran: 'IGD-20261123-003',
    no_rm: '000003',
    nama_lengkap: 'PASIEN DUMMY RAKA PRATAMA',
    nik_ktp: '3273011208060003',
    jenis_kelamin_kmk: '1',
    tempat_lahir: 'BOGOR',
    tanggal_lahir: '2006-08-12',
    usia_tahun: 20,
    nama_ibu_kandung: 'NY. DUMMY LESTARI',
    kewarganegaraan: 'INDONESIA',
    status_wn: 'WNI',
    status_pernikahan: 'Belum Menikah',
    agama: 'Kristen Protestan',
    golongan_darah: 'A',
    satusehat_status: 'Belum Terhubung',
    satusehat_id: '-',
    provinsi: 'JAWA BARAT',
    kab_kota: 'KAB. BOGOR',
    kecamatan: 'CIBINONG',
    kelurahan: 'PAKANSARI',
    alamat_jalan: 'JL. TEGAR BERIMAN DUMMY NO. 9',
    rt: '004',
    rw: '005',
    no_rumah: '9',
    no_hp: '085600000301',
    email: 'dummy.raka@contoh.id',
    pj_alamat_sama: true,
    pj_nama: 'TN. DUMMY AGUS',
    pj_hubungan: 'Orang Tua',
    pj_no_hp: '085600000302',
    waktu_kedatangan: '2026-11-23T09:40',
    kategori_triase: 'Hijau',
    cara_datang: '1 : Datang Sendiri / Mandiri',
    sebab_masuk: '2 : Trauma / Kecelakaan',
    kesadaran_gcs: 'E4M6V5 - Compos Mentis - GCS 15',
    keluhan_utama: 'Luka lecet dan robek dangkal di punggung tangan kanan akibat terjatuh dari sepeda.',
    dokter_jaga: 'dr. Hendra Wijaya, Sp.B',
    cara_pembayaran: 'Umum / Pribadi',
    status_kunjungan: 'Observasi',
  },
  {
    id_pendaftaran: 'IGD-20261122-004',
    no_rm: '000004',
    nama_lengkap: 'PASIEN DUMMY SINTA MAHARANI',
    nik_ktp: '3374016209790004',
    jenis_kelamin_kmk: '2',
    tempat_lahir: 'SEMARANG',
    tanggal_lahir: '1979-09-22',
    usia_tahun: 47,
    nama_ibu_kandung: 'NY. DUMMY MURNI',
    kewarganegaraan: 'INDONESIA',
    status_wn: 'WNI',
    status_pernikahan: 'Kawin',
    agama: 'Katolik',
    golongan_darah: 'AB',
    satusehat_status: 'Terhubung',
    satusehat_id: 'P10004451902',
    provinsi: 'JAWA TENGAH',
    kab_kota: 'KOTA SEMARANG',
    kecamatan: 'TEMBALANG',
    kelurahan: 'BULUSAN',
    alamat_jalan: 'JL. SIROJUDIN DUMMY NO. 15',
    rt: '002',
    rw: '001',
    no_rumah: '15',
    no_hp: '081900000401',
    email: 'dummy.sinta@contoh.id',
    pj_alamat_sama: true,
    pj_nama: 'TN. DUMMY YOHANES',
    pj_hubungan: 'Suami',
    pj_no_hp: '081900000402',
    waktu_kedatangan: '2026-11-22T14:20',
    kategori_triase: 'Kuning',
    cara_datang: '3 : Rujukan Puskesmas / RS Lain',
    sebab_masuk: '1 : Non-Trauma / Penyakit',
    kesadaran_gcs: 'E4M6V5 - Compos Mentis - GCS 15',
    keluhan_utama: 'Sesak napas berbunyi mengi sejak 3 jam lalu, riwayat asma bronkial.',
    dokter_jaga: 'dr. Sari Dewi, Sp.PD',
    cara_pembayaran: 'Asuransi Swasta',
    status_kunjungan: 'Selesai',
  },
  {
    id_pendaftaran: 'IGD-20261121-005',
    no_rm: '000005',
    nama_lengkap: 'PASIEN DUMMY ANONIM LAKA',
    nik_ktp: '3578010504550005',
    jenis_kelamin_kmk: '1',
    tempat_lahir: 'SURABAYA',
    tanggal_lahir: '1955-04-05',
    usia_tahun: 71,
    nama_ibu_kandung: 'TIDAK DIKETAHUI',
    kewarganegaraan: 'INDONESIA',
    status_wn: 'WNI',
    status_pernikahan: 'Cerai Mati',
    agama: 'Islam',
    golongan_darah: 'Tidak Tahu',
    satusehat_status: 'Belum Terhubung',
    satusehat_id: '-',
    provinsi: 'JAWA TIMUR',
    kab_kota: 'KOTA SURABAYA',
    kecamatan: 'GUBENG',
    kelurahan: 'AIRLANGGA',
    alamat_jalan: 'JL. DHARMAWANGSA DUMMY NO. 77',
    rt: '005',
    rw: '003',
    no_rumah: '77',
    no_hp: '081500000501',
    email: '-',
    pj_alamat_sama: false,
    pj_nama: 'PETUGAS LAKA POLRES (DUMMY)',
    pj_hubungan: 'Lainnya',
    pj_no_hp: '081100000599',
    pj_alamat_lengkap: 'KANTOR UNIT LAKA LANTAS DUMMY',
    waktu_kedatangan: '2026-11-21T22:10',
    kategori_triase: 'Hitam',
    cara_datang: '4 : Diantar Polisi / Masyarakat',
    sebab_masuk: '2 : Trauma / Kecelakaan',
    kesadaran_gcs: 'E1M1V1 - Tidak Ada Respon - GCS 3',
    keluhan_utama: 'Korban kecelakaan lalu lintas tiba di IGD tanpa tanda-tanda kehidupan (DOA).',
    dokter_jaga: 'dr. Budi Santoso, Sp.EM',
    cara_pembayaran: 'Jasa Raharja',
    status_kunjungan: 'Selesai',
  },
];

export function generateNextNoRm(visits: IgdVisitRecord[]): string {
  const maxNum = visits.reduce((max, item) => {
    const parsed = parseInt(item.no_rm, 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 5);
  return String(maxNum + 1).padStart(6, '0');
}

export function generateNextIdPendaftaran(visits: IgdVisitRecord[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const seq = String(visits.length + 1).padStart(3, '0');
  return `IGD-${y}${m}${d}-${seq}`;
}
