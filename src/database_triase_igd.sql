-- ============================================================================
-- SKEMA BASIS DATA SIMRS RS SEHAT SENTOSA
-- MODUL PENDAFTARAN & TRIASE INSTALASI GAWAT DARURAT (IGD)
-- Standar RME Kemenkes RI (KMK 1423 & PMK No. 47 Tahun 2018)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS db_simrs_igd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_simrs_igd;

-- 1. Tabel Master Identitas Pasien
CREATE TABLE IF NOT EXISTS pasien (
    no_rm VARCHAR(6) PRIMARY KEY COMMENT 'Nomor Rekam Medis unik 6 digit (contoh: 000001)',
    nik_anonim VARCHAR(16) NOT NULL UNIQUE COMMENT 'NIK KTP 16 digit (dianonimkan pada lingkungan simulasi)',
    nama_lengkap VARCHAR(150) NOT NULL COMMENT 'Nama lengkap pasien huruf kapital tanpa gelar',
    jenis_kelamin ENUM('1', '2', '0', '3', '4') NOT NULL COMMENT 'Standar KMK 1423: 1=Laki-laki, 2=Perempuan, 0=Tidak diketahui, 3=Tidak dapat ditentukan, 4=Tidak mengisi',
    tempat_lahir VARCHAR(100) NULL COMMENT 'Kota/Kabupaten tempat lahir pasien',
    tanggal_lahir DATE NOT NULL COMMENT 'Tanggal lahir pasien format YYYY-MM-DD',
    nama_ibu_kandung VARCHAR(150) NULL COMMENT 'Nama lengkap ibu kandung untuk verifikasi identitas RME',
    kewarganegaraan ENUM('INDONESIA', 'WNA') DEFAULT 'INDONESIA' COMMENT 'Status kewarganegaraan pasien',
    status_pernikahan VARCHAR(30) NULL COMMENT 'Status pernikahan sesuai standar KMK 1423',
    agama VARCHAR(30) NULL COMMENT 'Agama pasien sesuai standar KMK 1423',
    golongan_darah ENUM('A', 'B', 'AB', 'O', 'Tidak Tahu') DEFAULT 'Tidak Tahu' COMMENT 'Golongan darah pasien',
    ihs_number VARCHAR(50) NULL COMMENT 'ID SatuSehat Kemenkes RI',
    alamat_jalan TEXT NULL COMMENT 'Alamat jalan, RT/RW, dan nomor rumah',
    provinsi VARCHAR(100) NULL COMMENT 'Nama Provinsi domisili',
    kab_kota VARCHAR(100) NULL COMMENT 'Nama Kabupaten/Kota domisili',
    kecamatan VARCHAR(100) NULL COMMENT 'Nama Kecamatan domisili',
    kelurahan VARCHAR(100) NULL COMMENT 'Nama Kelurahan/Desa domisili',
    no_hp VARCHAR(20) NOT NULL COMMENT 'Nomor telepon/HP aktif pasien',
    email VARCHAR(100) NULL COMMENT 'Alamat email pasien',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan rekam medis'
) ENGINE=InnoDB COMMENT='Tabel master identitas pasien IGD';

-- 2. Tabel Pendaftaran & Kunjungan IGD
CREATE TABLE IF NOT EXISTS pendaftaran_igd (
    id_pendaftaran VARCHAR(20) PRIMARY KEY COMMENT 'ID unik kunjungan IGD (contoh: IGD-20261124-001)',
    no_rm VARCHAR(6) NOT NULL COMMENT 'Relasi ke nomor rekam medis pasien',
    waktu_kedatangan DATETIME NOT NULL COMMENT 'Tanggal dan waktu kedatangan pasien di IGD',
    cara_datang VARCHAR(50) NOT NULL COMMENT 'Cara datang: Datang Sendiri, Ambulans, Rujukan, Polisi/Masyarakat',
    rs_perujuk VARCHAR(150) NULL COMMENT 'Nama faskes perujuk jika pasien rujukan',
    sebab_masuk VARCHAR(50) NOT NULL COMMENT 'Sebab masuk IGD: Non-Trauma, Trauma, Obstetri, Psikiatri',
    kesadaran_gcs VARCHAR(50) DEFAULT 'E4M6V5 (Compos Mentis - GCS 15)' COMMENT 'Tingkat kesadaran awal Glasgow Coma Scale',
    keluhan_awal TEXT NOT NULL COMMENT 'Keluhan utama saat pasien tiba di loket pendaftaran IGD',
    dokter_jaga VARCHAR(100) NOT NULL COMMENT 'Nama dokter jaga IGD yang bertanggung jawab',
    cara_pembayaran VARCHAR(50) NOT NULL COMMENT 'Penjamin: BPJS Kesehatan, Umum, Asuransi Swasta, Jasa Raharja',
    no_kartu_bpjs VARCHAR(13) NULL COMMENT 'Nomor kartu BPJS Kesehatan 13 digit jika penjamin BPJS',
    no_sep VARCHAR(30) NULL COMMENT 'Nomor Surat Eligibilitas Peserta (SEP) hasil bridging VClaim',
    nama_pj VARCHAR(150) NOT NULL COMMENT 'Nama penanggung jawab / keluarga pasien',
    hubungan_pj VARCHAR(50) NOT NULL COMMENT 'Hubungan penanggung jawab dengan pasien',
    no_hp_pj VARCHAR(20) NOT NULL COMMENT 'Nomor telepon darurat penanggung jawab',
    status_kunjungan ENUM('Menunggu Triase', 'Dalam Penanganan', 'Observasi', 'Selesai') DEFAULT 'Menunggu Triase' COMMENT 'Status alur pelayanan pasien di IGD',
    FOREIGN KEY (no_rm) REFERENCES pasien(no_rm) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Tabel transaksi pendaftaran dan penjamin kunjungan IGD';

-- 3. Tabel Pemeriksaan Triase & Asuhan Keperawatan IGD (PMK No. 47 Tahun 2018)
CREATE TABLE IF NOT EXISTS triase_igd (
    id_triase INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key auto increment pengkajian triase',
    id_pendaftaran VARCHAR(20) NOT NULL UNIQUE COMMENT 'Relasi 1-ke-1 dengan ID pendaftaran kunjungan IGD',
    no_rm VARCHAR(6) NOT NULL COMMENT 'Nomor rekam medis pasien',
    waktu_pengkajian DATETIME NOT NULL COMMENT 'Waktu dilakukannya pemeriksaan triase oleh perawat/dokter',
    kategori_triase ENUM('Merah', 'Kuning', 'Hijau', 'Hitam') NOT NULL COMMENT 'Kategori Triase: Merah (Resusitasi), Kuning (Emergensi), Hijau (Non-Urgensi), Hitam (DOA)',
    keluhan_utama TEXT NOT NULL COMMENT 'Keluhan utama klinis saat masuk rumah sakit (MRS)',
    mekanisme_kejadian VARCHAR(100) NULL COMMENT 'Mekanisme trauma/kejadian (KLL, Jatuh, Luka tusuk, dll)',
    keterangan_mekanisme TEXT NULL COMMENT 'Detail tambahan mekanisme kejadian',
    sample_signs_symptoms TEXT NULL COMMENT 'Metode SAMPLE - S: Tanda dan gejala klinis',
    sample_allergies TEXT NULL COMMENT 'Metode SAMPLE - A: Riwayat alergi obat/makanan',
    sample_medications TEXT NULL COMMENT 'Metode SAMPLE - M: Obat-obatan yang sedang dikonsumsi',
    sample_past_history TEXT NULL COMMENT 'Metode SAMPLE - P: Riwayat penyakit terdahulu',
    sample_last_meal VARCHAR(150) NULL COMMENT 'Metode SAMPLE - L: Waktu dan jenis makan/minum terakhir',
    sample_events TEXT NULL COMMENT 'Metode SAMPLE - E: Kejadian yang mendahului sakit/cedera',
    sistol INT NOT NULL COMMENT 'Tekanan darah sistolik dalam satuan mmHg',
    diastol INT NOT NULL COMMENT 'Tekanan darah diastolik dalam satuan mmHg',
    nadi INT NOT NULL COMMENT 'Frekuensi denyut nadi dalam satuan kali/menit',
    suhu DECIMAL(4,1) NOT NULL COMMENT 'Suhu tubuh aksila/timpani dalam derajat Celcius',
    rr INT NOT NULL COMMENT 'Respiratory Rate / laju pernapasan dalam satuan kali/menit',
    spo2 INT NOT NULL COMMENT 'Saturasi oksigen perifer dalam persen (%)',
    skala_nyeri TINYINT DEFAULT 0 COMMENT 'Skala nyeri Numerik (NRS) rentang 0 sampai 10',
    petugas_triase VARCHAR(100) NOT NULL COMMENT 'Nama perawat/tenaga kesehatan yang melakukan pengkajian triase',
    FOREIGN KEY (id_pendaftaran) REFERENCES pendaftaran_igd(id_pendaftaran) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (no_rm) REFERENCES pasien(no_rm) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Tabel pengkajian triase klinis, SAMPLE, dan tanda vital IGD';
