import { TriagePatient } from '../types/triase';

export const INITIAL_DUMMY_PATIENTS: TriagePatient[] = [
  {
    id: 'TRG-001',
    noRm: 'RM-2026-000101',
    nikAnonim: 'ANON-3201-XXXX-8821',
    namaDummy: 'Pasien Dummy A (Tn. Hendra)',
    jenisKelamin: 'L',
    usia: 58,
    waktuKedatangan: '2026-11-23T17:15',
    keluhanUtama: 'Nyeri dada kiri menjalar ke lengan dan sesak napas mendadak sejak 30 menit lalu.',
    kategoriTriase: 'Merah',
    tandaVital: {
      sistol: 85,
      diastol: 55,
      nadi: 128,
      suhu: 36.4,
      rr: 32,
      spo2: 88,
    },
    status: 'Ditangani',
    catatanTriase: 'Segera masuk ruang resusitasi, pasang monitor EKG dan oksigen.',
  },
  {
    id: 'TRG-002',
    noRm: 'RM-2026-000102',
    nikAnonim: 'ANON-3204-XXXX-4419',
    namaDummy: 'Pasien Dummy B (Ny. Kartika)',
    jenisKelamin: 'P',
    usia: 34,
    waktuKedatangan: '2026-11-23T17:28',
    keluhanUtama: 'Demam tinggi 3 hari disertai muntah berulang dan nyeri ulu hati.',
    kategoriTriase: 'Kuning',
    tandaVital: {
      sistol: 110,
      diastol: 72,
      nadi: 108,
      suhu: 39.1,
      rr: 22,
      spo2: 96,
    },
    status: 'Menunggu',
    catatanTriase: 'Perlu evaluasi cairan intravena dan pemeriksaan darah lengkap.',
  },
  {
    id: 'TRG-003',
    noRm: 'RM-2026-000103',
    nikAnonim: 'ANON-3273-XXXX-1904',
    namaDummy: 'Pasien Dummy C (An. Raka)',
    jenisKelamin: 'L',
    usia: 19,
    waktuKedatangan: '2026-11-23T17:34',
    keluhanUtama: 'Luka robek dangkal di punggung tangan kanan akibat terjatuh dari sepeda.',
    kategoriTriase: 'Hijau',
    tandaVital: {
      sistol: 118,
      diastol: 76,
      nadi: 84,
      suhu: 36.8,
      rr: 18,
      spo2: 99,
    },
    status: 'Menunggu',
    catatanTriase: 'Perdarahan terkontrol, arahkan ke poli bedah minor IGD.',
  },
  {
    id: 'TRG-004',
    noRm: 'RM-2026-000104',
    nikAnonim: 'ANON-3209-XXXX-7732',
    namaDummy: 'Pasien Dummy D (Ny. Sinta)',
    jenisKelamin: 'P',
    usia: 47,
    waktuKedatangan: '2026-11-23T17:05',
    keluhanUtama: 'Sesak napas dengan riwayat asma bronkial, mengi terdengar saat ekspirasi.',
    kategoriTriase: 'Kuning',
    tandaVital: {
      sistol: 132,
      diastol: 84,
      nadi: 104,
      suhu: 36.9,
      rr: 26,
      spo2: 93,
    },
    status: 'Observasi',
    catatanTriase: 'Nebulisasi bronkodilator sedang berjalan di bed observasi 2.',
  },
];

export function formatLocalDateTimeInput(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}
