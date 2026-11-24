export type TriageCategory = 'Merah' | 'Kuning' | 'Hijau' | 'Hitam';

export type PatientStatus = 'Menunggu' | 'Ditangani' | 'Observasi' | 'Selesai';

export interface VitalSigns {
  sistol: number;
  diastol: number;
  nadi: number;
  suhu: number;
  rr: number;
  spo2: number;
}

export interface TriagePatient {
  id: string;
  noRm: string;
  nikAnonim: string;
  namaDummy: string;
  jenisKelamin: 'L' | 'P';
  usia: number;
  waktuKedatangan: string;
  keluhanUtama: string;
  kategoriTriase: TriageCategory;
  tandaVital: VitalSigns;
  status: PatientStatus;
  catatanTriase?: string;
}

export const TRIAGE_META: Record<
  TriageCategory,
  {
    label: string;
    prioritas: string;
    targetWaktu: string;
    urutan: number;
    dotColor: string;
    textColor: string;
    surfaceSelected: string;
    ringSelected: string;
  }
> = {
  Merah: {
    label: 'Merah · Resusitasi',
    prioritas: 'Prioritas 1 (Gawat Darurat)',
    targetWaktu: 'Segera (0 menit)',
    urutan: 1,
    dotColor: 'bg-red-600',
    textColor: 'text-red-700',
    surfaceSelected: 'bg-red-50/70 border-red-400',
    ringSelected: 'ring-1 ring-red-500',
  },
  Kuning: {
    label: 'Kuning · Mendesak',
    prioritas: 'Prioritas 2 (Gawat Tidak Darurat)',
    targetWaktu: 'Maks. 10–30 menit',
    urutan: 2,
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    surfaceSelected: 'bg-amber-50/70 border-amber-400',
    ringSelected: 'ring-1 ring-amber-500',
  },
  Hijau: {
    label: 'Hijau · Non-Urgent',
    prioritas: 'Prioritas 3 (Ringan / Rawat Jalan)',
    targetWaktu: 'Maks. 60 menit',
    urutan: 3,
    dotColor: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    surfaceSelected: 'bg-emerald-50/70 border-emerald-400',
    ringSelected: 'ring-1 ring-emerald-500',
  },
  Hitam: {
    label: 'Hitam · DOA / Eksitus',
    prioritas: 'Prioritas 0 (Meninggal / Tidak Tertolong)',
    targetWaktu: 'Kamar Jenazah / Administrasi',
    urutan: 4,
    dotColor: 'bg-slate-800',
    textColor: 'text-slate-800',
    surfaceSelected: 'bg-slate-100 border-slate-500',
    ringSelected: 'ring-1 ring-slate-600',
  },
};

export function evaluateVitalWarnings(vitals: Partial<VitalSigns>): string[] {
  const warnings: string[] = [];
  if (vitals.spo2 !== undefined && vitals.spo2 > 0 && vitals.spo2 < 90) {
    warnings.push(`SpO2 kritis (${vitals.spo2}% < 90%)`);
  } else if (vitals.spo2 !== undefined && vitals.spo2 >= 90 && vitals.spo2 < 95) {
    warnings.push(`SpO2 menurun (${vitals.spo2}%)`);
  }
  if (vitals.sistol !== undefined && vitals.sistol > 0 && (vitals.sistol < 90 || vitals.sistol >= 180)) {
    warnings.push(`Tekanan sistolik ekstrem (${vitals.sistol} mmHg)`);
  }
  if (vitals.nadi !== undefined && vitals.nadi > 0 && (vitals.nadi < 50 || vitals.nadi > 120)) {
    warnings.push(`Nadi di luar rentang aman (${vitals.nadi} x/mnt)`);
  }
  if (vitals.rr !== undefined && vitals.rr > 0 && (vitals.rr < 10 || vitals.rr > 28)) {
    warnings.push(`Frekuensi napas abnormal (${vitals.rr} x/mnt)`);
  }
  if (vitals.suhu !== undefined && vitals.suhu > 0 && (vitals.suhu >= 39.5 || vitals.suhu < 35)) {
    warnings.push(`Suhu tubuh ekstrem (${vitals.suhu} °C)`);
  }
  return warnings;
}

export function suggestTriageCategory(vitals: Partial<VitalSigns>): {
  category: TriageCategory | null;
  reason: string;
} {
  const { sistol, nadi, rr, spo2, suhu } = vitals;
  if (
    sistol === undefined ||
    nadi === undefined ||
    rr === undefined ||
    spo2 === undefined ||
    suhu === undefined
  ) {
    return { category: null, reason: 'Lengkapi tanda vital untuk rekomendasi triase otomatis.' };
  }

  if (nadi === 0 && rr === 0 && sistol === 0) {
    return {
      category: 'Hitam',
      reason: 'Tidak terdeteksi nadi, napas, maupun tekanan darah.',
    };
  }

  if (spo2 < 90 || sistol < 90 || rr > 30 || rr < 10 || nadi > 130 || nadi < 45) {
    return {
      category: 'Merah',
      reason: 'Terdapat gangguan jalan napas, pernapasan, atau sirkulasi kritis.',
    };
  }

  if (
    spo2 < 95 ||
    sistol >= 160 ||
    nadi > 105 ||
    rr > 22 ||
    suhu >= 38.5
  ) {
    return {
      category: 'Kuning',
      reason: 'Tanda vital tidak stabil sedang; memerlukan evaluasi dokter segera.',
    };
  }

  return {
    category: 'Hijau',
    reason: 'Tanda vital dalam batas stabil; kondisi non-urgent.',
  };
}
