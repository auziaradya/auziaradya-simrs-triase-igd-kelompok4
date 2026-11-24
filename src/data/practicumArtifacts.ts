export interface PracticumArtifact {
  id: string;
  filename: string;
  title: string;
  role: string;
  language: string;
  description: string;
  content: string;
}

export const SQL_ARTIFACT = `-- ============================================================================
-- Skema Basis Data: Modul Triase dan Pendaftaran Gawat Darurat (IGD)
-- Rumah Sakit     : RS Sehat Sentosa (Purwarupa SIMRS)
-- Catatan         : Hanya menggunakan data dummy & NIK anonim (non-PII)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS simrs_igd_dummy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE simrs_igd_dummy;

-- ----------------------------------------------------------------------------
-- 1. Tabel Pasien (Identitas Anonim / Dummy)
-- ----------------------------------------------------------------------------
CREATE TABLE pasien_dummy (
  no_rm VARCHAR(20) NOT NULL COMMENT 'Primary key nomor rekam medis pasien (contoh: RM-2026-000101)',
  nik_anonim VARCHAR(32) NOT NULL COMMENT 'Identitas NIK yang telah dianonimkan/dimasking (contoh: ANON-3201-XXXX-8821)',
  nama_dummy VARCHAR(100) NOT NULL COMMENT 'Nama pasien dummy untuk simulasi pengembangan, bukan nama pasien asli',
  jenis_kelamin ENUM('L', 'P') NOT NULL COMMENT 'Jenis kelamin pasien: L = Laki-laki, P = Perempuan',
  usia_tahun TINYINT UNSIGNED NOT NULL COMMENT 'Usia pasien dalam tahun (0-120)',
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pencatatan master pasien dummy',
  PRIMARY KEY (no_rm),
  UNIQUE KEY uq_pasien_nik_anonim (nik_anonim),
  CONSTRAINT chk_usia_pasien CHECK (usia_tahun BETWEEN 0 AND 120)
) ENGINE=InnoDB COMMENT='Tabel master identitas pasien dummy teranonimisasi';

-- ----------------------------------------------------------------------------
-- 2. Tabel Pendaftaran IGD
-- ----------------------------------------------------------------------------
CREATE TABLE pendaftaran_igd (
  id_pendaftaran BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key unik pendaftaran kunjungan IGD',
  no_rm VARCHAR(20) NOT NULL COMMENT 'Foreign key ke nomor rekam medis pada tabel pasien_dummy',
  waktu_kedatangan DATETIME NOT NULL COMMENT 'Tanggal dan waktu kedatangan pasien di pintu IGD',
  status_pelayanan ENUM('Menunggu', 'Ditangani', 'Observasi', 'Selesai') NOT NULL DEFAULT 'Menunggu' COMMENT 'Status alur pelayanan pasien di IGD',
  PRIMARY KEY (id_pendaftaran),
  KEY idx_waktu_kedatangan (waktu_kedatangan),
  CONSTRAINT fk_pendaftaran_pasien
    FOREIGN KEY (no_rm) REFERENCES pasien_dummy (no_rm)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Tabel transaksi pendaftaran kunjungan pasien IGD';

-- ----------------------------------------------------------------------------
-- 3. Tabel Pemeriksaan Triase IGD
-- ----------------------------------------------------------------------------
CREATE TABLE pemeriksaan_triase (
  id_triase BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key unik hasil pemeriksaan triase',
  id_pendaftaran BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key ke tabel pendaftaran_igd',
  kategori_triase ENUM('Merah', 'Kuning', 'Hijau', 'Hitam') NOT NULL COMMENT 'Kategori prioritas triase IGD: Merah (Resusitasi), Kuning (Mendesak), Hijau (Non-Urgent), Hitam (DOA/Eksitus)',
  keluhan_utama TEXT NOT NULL COMMENT 'Keluhan utama yang membawa pasien datang ke IGD',
  catatan_triase VARCHAR(500) NULL COMMENT 'Catatan klinis singkat petugas triase IGD',
  waktu_triase DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu penetapan kategori triase',
  PRIMARY KEY (id_triase),
  UNIQUE KEY uq_triase_pendaftaran (id_pendaftaran),
  CONSTRAINT fk_triase_pendaftaran
    FOREIGN KEY (id_pendaftaran) REFERENCES pendaftaran_igd (id_pendaftaran)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Tabel klasifikasi tingkat kegawatan pasien IGD';

-- ----------------------------------------------------------------------------
-- 4. Tabel Tanda Vital (Vital Signs)
-- ----------------------------------------------------------------------------
CREATE TABLE tanda_vital (
  id_vital BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key unik pencatatan tanda vital',
  id_triase BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key ke tabel pemeriksaan_triase',
  tekanan_sistolik SMALLINT UNSIGNED NOT NULL COMMENT 'Tekanan darah sistolik dalam satuan mmHg (0-300)',
  tekanan_diastolik SMALLINT UNSIGNED NOT NULL COMMENT 'Tekanan darah diastolik dalam satuan mmHg (0-200)',
  nadi SMALLINT UNSIGNED NOT NULL COMMENT 'Frekuensi denyut nadi dalam denyut per menit / x/mnt (0-250)',
  suhu DECIMAL(4,1) NOT NULL COMMENT 'Suhu tubuh dalam derajat Celcius (25.0-45.0)',
  respiratory_rate TINYINT UNSIGNED NOT NULL COMMENT 'Frekuensi pernapasan (RR) dalam napas per menit / x/mnt (0-80)',
  spo2 TINYINT UNSIGNED NOT NULL COMMENT 'Saturasi oksigen perifer (SpO2) dalam persen % (0-100)',
  diukur_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pengukuran tanda vital pasien',
  PRIMARY KEY (id_vital),
  CONSTRAINT fk_vital_triase
    FOREIGN KEY (id_triase) REFERENCES pemeriksaan_triase (id_triase)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT chk_sistol CHECK (tekanan_sistolik BETWEEN 0 AND 300),
  CONSTRAINT chk_diastol CHECK (tekanan_diastolik BETWEEN 0 AND 200),
  CONSTRAINT chk_nadi CHECK (nadi BETWEEN 0 AND 250),
  CONSTRAINT chk_suhu CHECK (suhu BETWEEN 25.0 AND 45.0),
  CONSTRAINT chk_rr CHECK (respiratory_rate BETWEEN 0 AND 80),
  CONSTRAINT chk_spo2 CHECK (spo2 BETWEEN 0 AND 100)
) ENGINE=InnoDB COMMENT='Tabel pencatatan parameter tanda vital pasien saat triase IGD';

-- ----------------------------------------------------------------------------
-- Contoh Pengisian Data Dummy (Non-PII)
-- ----------------------------------------------------------------------------
INSERT INTO pasien_dummy (no_rm, nik_anonim, nama_dummy, jenis_kelamin, usia_tahun)
VALUES ('RM-2026-000101', 'ANON-3201-XXXX-8821', 'Pasien Dummy A (Tn. Hendra)', 'L', 58);

INSERT INTO pendaftaran_igd (no_rm, waktu_kedatangan, status_pelayanan)
VALUES ('RM-2026-000101', '2026-11-23 17:15:00', 'Ditangani');

INSERT INTO pemeriksaan_triase (id_pendaftaran, kategori_triase, keluhan_utama, catatan_triase)
VALUES (1, 'Merah', 'Nyeri dada kiri menjalar ke lengan dan sesak napas mendadak.', 'Segera masuk ruang resusitasi.');

INSERT INTO tanda_vital (id_triase, tekanan_sistolik, tekanan_diastolik, nadi, suhu, respiratory_rate, spo2)
VALUES (1, 85, 55, 128, 36.4, 32, 88);
`;

export const HTML_ARTIFACT = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Formulir Triase & Pendaftaran IGD - SIMRS RS Sehat Sentosa</title>
  <style>
    :root {
      --bg: #f4f7f9;
      --surface: #ffffff;
      --border: #d8e1e8;
      --text: #0f172a;
      --muted: #475569;
      --accent: #0f766e;
      --accent-hover: #115e59;
      --merah: #dc2626;
      --kuning: #d97706;
      --hijau: #16a34a;
      --hitam: #1e293b;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px 16px;
    }

    .container {
      max-width: 920px;
      margin: 0 auto;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }

    .header {
      background: #0f172a;
      color: #ffffff;
      padding: 20px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .header h1 { font-size: 1.25rem; font-weight: 600; }
    .header p { font-size: 0.85rem; color: #cbd5e1; }

    form { padding: 28px; }

    .section-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #0f172a;
      padding-bottom: 8px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .section { margin-bottom: 28px; }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .field { display: flex; flex-direction: column; gap: 6px; }
    .field.full { grid-column: 1 / -1; }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }

    input, textarea, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.92rem;
      font-family: inherit;
      color: var(--text);
      background: #fff;
    }

    input:focus, textarea:focus, select:focus {
      outline: 2px solid rgba(15, 118, 110, 0.25);
      border-color: var(--accent);
    }

    .triase-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .triase-option { position: relative; }
    .triase-option input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .triase-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.15s, background-color 0.15s;
    }

    .triase-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .swatch {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      display: inline-block;
    }

    .swatch-merah { background: var(--merah); }
    .swatch-kuning { background: var(--kuning); }
    .swatch-hijau { background: var(--hijau); }
    .swatch-hitam { background: var(--hitam); }

    .triase-desc { font-size: 0.78rem; color: var(--muted); }

    input[value="Merah"]:checked + .triase-card { border-color: var(--merah); background: #fef2f2; }
    input[value="Kuning"]:checked + .triase-card { border-color: var(--kuning); background: #fffbeb; }
    input[value="Hijau"]:checked + .triase-card { border-color: var(--hijau); background: #f0fdf4; }
    input[value="Hitam"]:checked + .triase-card { border-color: var(--hitam); background: #f1f5f9; }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    button {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .btn-reset {
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    }

    .btn-save {
      background: var(--accent);
      color: #ffffff;
    }

    .btn-save:hover { background: var(--accent-hover); }

    .notice {
      margin-top: 16px;
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px solid #99f6e4;
      background: #f0fdfa;
      color: #115e59;
      font-size: 0.88rem;
      display: none;
    }

    @media (max-width: 720px) {
      .grid-2, .grid-3, .triase-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div>
        <h1>SIMRS RS Sehat Sentosa — Modul Triase & Pendaftaran IGD</h1>
        <p>Gunakan hanya data pasien dummy dan NIK teranonimisasi untuk simulasi</p>
      </div>
    </header>

    <form id="triaseForm">
      <div class="section">
        <h2 class="section-title">1. Identitas Pasien Dummy & Kedatangan</h2>
        <div class="grid-2">
          <div class="field">
            <label for="namaDummy">Nama Pasien (Dummy)</label>
            <input type="text" id="namaDummy" name="namaDummy" placeholder="Contoh: Pasien Dummy A" required />
          </div>
          <div class="field">
            <label for="noRm">Nomor Rekam Medis (No. RM)</label>
            <input type="text" id="noRm" name="noRm" placeholder="Contoh: RM-2026-000101" required />
          </div>
          <div class="field">
            <label for="nikAnonim">NIK Anonim</label>
            <input type="text" id="nikAnonim" name="nikAnonim" placeholder="Contoh: ANON-3201-XXXX-8821" required />
          </div>
          <div class="field">
            <label for="waktuKedatangan">Tanggal & Waktu Kedatangan</label>
            <input type="datetime-local" id="waktuKedatangan" name="waktuKedatangan" required />
          </div>
          <div class="field full">
            <label for="keluhanUtama">Keluhan Utama</label>
            <textarea id="keluhanUtama" name="keluhanUtama" rows="3" placeholder="Tuliskan keluhan utama saat tiba di IGD..." required></textarea>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">2. Pengukuran Tanda Vital</h2>
        <div class="grid-3">
          <div class="field">
            <label for="sistol">Tekanan Sistolik (mmHg)</label>
            <input type="number" id="sistol" name="sistol" min="0" max="300" placeholder="120" required />
          </div>
          <div class="field">
            <label for="diastol">Tekanan Diastolik (mmHg)</label>
            <input type="number" id="diastol" name="diastol" min="0" max="200" placeholder="80" required />
          </div>
          <div class="field">
            <label for="nadi">Nadi (x/menit)</label>
            <input type="number" id="nadi" name="nadi" min="0" max="250" placeholder="84" required />
          </div>
          <div class="field">
            <label for="suhu">Suhu Tubuh (°C)</label>
            <input type="number" id="suhu" name="suhu" step="0.1" min="25" max="45" placeholder="36.8" required />
          </div>
          <div class="field">
            <label for="rr">Respiratory Rate / RR (x/menit)</label>
            <input type="number" id="rr" name="rr" min="0" max="80" placeholder="20" required />
          </div>
          <div class="field">
            <label for="spo2">Saturasi Oksigen / SpO2 (%)</label>
            <input type="number" id="spo2" name="spo2" min="0" max="100" placeholder="98" required />
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">3. Kategori Triase IGD</h2>
        <div class="triase-grid">
          <label class="triase-option">
            <input type="radio" name="kategoriTriase" value="Merah" required />
            <span class="triase-card">
              <span class="triase-badge"><span class="swatch swatch-merah"></span>Merah</span>
              <span class="triase-desc">Resusitasi / Gawat Darurat</span>
            </span>
          </label>
          <label class="triase-option">
            <input type="radio" name="kategoriTriase" value="Kuning" />
            <span class="triase-card">
              <span class="triase-badge"><span class="swatch swatch-kuning"></span>Kuning</span>
              <span class="triase-desc">Gawat Tidak Darurat</span>
            </span>
          </label>
          <label class="triase-option">
            <input type="radio" name="kategoriTriase" value="Hijau" />
            <span class="triase-card">
              <span class="triase-badge"><span class="swatch swatch-hijau"></span>Hijau</span>
              <span class="triase-desc">Non-Urgent / Ringan</span>
            </span>
          </label>
          <label class="triase-option">
            <input type="radio" name="kategoriTriase" value="Hitam" />
            <span class="triase-card">
              <span class="triase-badge"><span class="swatch swatch-hitam"></span>Hitam</span>
              <span class="triase-desc">DOA / Meninggal</span>
            </span>
          </label>
        </div>
      </div>

      <div class="actions">
        <button type="reset" class="btn-reset">Reset</button>
        <button type="submit" class="btn-save">Simpan Data Triase</button>
      </div>

      <div id="saveNotice" class="notice"></div>
    </form>
  </div>

  <script>
    const form = document.getElementById("triaseForm");
    const notice = document.getElementById("saveNotice");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      notice.style.display = "block";
      notice.textContent =
        "Data triase dummy untuk " +
        data.get("namaDummy") +
        " (" +
        data.get("noRm") +
        ") dengan kategori " +
        data.get("kategoriTriase") +
        " berhasil divalidasi dan disimpan secara lokal.";
    });
    form.addEventListener("reset", function () {
      notice.style.display = "none";
    });
  </script>
</body>
</html>
`;

export const README_ARTIFACT = `# SIMRS RS Sehat Sentosa — Modul Triase & Pendaftaran Gawat Darurat (IGD)

Purwarupa modul pendaftaran dan triase Instalasi Gawat Darurat (IGD) untuk Sistem Informasi Manajemen Rumah Sakit (SIMRS) RS Sehat Sentosa. Proyek ini dikembangkan sebagai luaran praktikum mata kuliah **Analisis dan Perancangan Sistem Informasi Kesehatan (RKE517)**.

## Latar Belakang
Instalasi Gawat Darurat membutuhkan proses skrining triase yang cepat, terstandar, dan terdokumentasi akurat sejak pasien tiba. Tanpa pencatatan terstruktur atas keluhan utama, tanda vital, dan klasifikasi warna triase (Merah, Kuning, Hijau, Hitam), risiko keterlambatan penanganan kasus kritis dan kesalahan identifikasi rekam medis meningkat. Modul ini menjadi purwarupa awal alur pendaftaran dan triase digital yang aman sebelum integrasi penuh dengan sistem rumah sakit.

## Tujuan Sistem
1. Menyediakan formulir pendaftaran dan pencatatan triase IGD berbasis standar klinis.
2. Mendokumentasikan enam parameter tanda vital utama (TD Sistolik, TD Diastolik, Nadi, Suhu, RR, dan SpO2).
3. Menyediakan skema basis data relasional dengan integritas referensial dan validasi nilai fisiologis.
4. Menerapkan praktik keamanan pengembangan SIMRS dan perlindungan data pribadi sejak tahap perancangan.

## Fitur Utama
- Pencatatan identitas pasien teranonimisasi (\`no_rm\` dan \`nik_anonim\`) menggunakan data dummy.
- Penentuan kategori triase IGD (Merah, Kuning, Hijau, Hitam) disertai panduan klinis tanda vital.
- Pencatatan keluhan utama dan enam parameter tanda vital dengan validasi rentang nilai.
- Daftar antrean prioritas IGD yang diurutkan berdasarkan tingkat kegawatan.

## Struktur Direktori Proyek
\`\`\`text
simrs-triase-igd-kelompok[NOMOR]/
├── .env.example              # Templat variabel lingkungan tanpa kredensial asli
├── .gitignore                # Daftar file/folder yang dikecualikan dari pelacakan Git
├── README.md                 # Dokumentasi teknis sistem dan SOP keamanan data pasien
├── database_triase_igd.sql   # Skema DDL SQL basis data pendaftaran & triase IGD
└── form_triase.html          # Antarmuka purwarupa formulir pendaftaran & triase IGD
\`\`\`

## Teknologi yang Digunakan
- **Basis Data**: MySQL / MariaDB (SQL DDL)
- **Antarmuka**: HTML5, CSS3 Internal, JavaScript (serta purwarupa interaktif React + TypeScript + Tailwind CSS)
- **Version Control**: Git & GitHub/GitLab (Branching & Pull Request/Merge Request workflow)

## Alur Kerja Pengembangan Git
1. Pastikan branch \`main\` lokal selalu mutakhir (\`git pull origin main\`).
2. Buat branch fitur sesuai peran (\`fitur-skema-database\`, \`fitur-form-triase\`, \`fitur-dokumentasi-alur\`).
3. Kerjakan perubahan pada branch masing-masing, lalu lakukan \`git add\` dan \`git commit\`.
4. Kirim branch ke server (\`git push origin nama-branch\`).
5. Ajukan Pull Request / Merge Request ke branch \`main\`, lakukan *code review* minimal 1 komentar, lalu *approve* dan *merge*.

## Lima SOP Keamanan Data Pasien bagi Tim Pengembang SIMRS
1. **Perlindungan Kerahasiaan Data Pasien**: Seluruh anggota tim dilarang keras menyalin, mengunduh, atau memindahkan data rekam medis pasien asli dari lingkungan produksi ke perangkat pribadi atau repositori publik.
2. **Penggunaan Data Dummy untuk Pengembangan**: Seluruh pengujian antarmuka maupun pengisian basis data di tahap pengembangan wajib menggunakan data sintetis/dummy dengan NIK yang telah dimasking (\`ANON-XXXX\`).
3. **Pengamanan Kredensial melalui File \`.env\`**: Kata sandi basis data, kunci API, dan token otentikasi hanya boleh disimpan di file \`.env\` lokal yang dikecualikan oleh \`.gitignore\`; repositori hanya boleh menyimpan templat \`.env.example\`.
4. **Pengaturan Hak Akses Repositori**: Repositori SIMRS wajib diatur dengan visibilitas *Private* dan menerapkan prinsip *least privilege* (hanya tim pengembang terdaftar yang diberi akses *Developer/Maintainer*, serta *branch protection* pada \`main\`).
5. **Pemeriksaan Kode Sebelum Merge**: Setiap Pull Request / Merge Request ke branch \`main\` wajib melalui *code review* oleh rekan tim/QA untuk memastikan tidak ada kebocoran kredensial, tidak ada data pribadi pasien (PII), dan validasi input telah berjalan dengan benar.
`;

export const GITIGNORE_ARTIFACT = `# File konfigurasi lingkungan (berisi password/API key asli - JANGAN DI-COMMIT)
.env
.env.local
.env.*.local

# File log dan database lokal sementara
*.log
*.sqlite
*.db

# Folder dependensi & build
node_modules/
dist/
build/

# File sistem operasi & editor
.DS_Store
Thumbs.db
.vscode/
`;

export const ENV_EXAMPLE_ARTIFACT = `# Konfigurasi Lingkungan Aplikasi Purwarupa SIMRS IGD - RS Sehat Sentosa
# Salin file ini menjadi .env dan sesuaikan nilainya di komputer lokal.
# JANGAN PERNAH mengunggah file .env asli ke repositori Git.

APP_NAME="SIMRS RS Sehat Sentosa - Modul Triase IGD"
APP_ENV=development
APP_PORT=8080

# Konfigurasi Basis Data
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simrs_igd_dummy
DB_USERNAME=isi_username_lokal
DB_PASSWORD=isi_password_lokal
`;

export const PRACTICUM_ARTIFACTS: PracticumArtifact[] = [
  {
    id: 'sql',
    filename: 'database_triase_igd.sql',
    title: 'Skema Basis Data (SQL DDL)',
    role: 'Anggota 1 · Database Designer',
    language: 'sql',
    description:
      'Struktur relasional 4 tabel (pasien_dummy, pendaftaran_igd, pemeriksaan_triase, tanda_vital) lengkap dengan PK, FK, CHECK constraints, dan komentar pada setiap kolom.',
    content: SQL_ARTIFACT,
  },
  {
    id: 'html',
    filename: 'form_triase.html',
    title: 'Formulir Triase HTML5 Mandiri',
    role: 'Anggota 2 · Frontend Developer',
    language: 'html',
    description:
      'File HTML5 + CSS internal mandiri yang dapat langsung dijalankan di browser dengan validasi input dasar, tombol Simpan & Reset, dan warna kategori triase.',
    content: HTML_ARTIFACT,
  },
  {
    id: 'readme',
    filename: 'README.md',
    title: 'Dokumentasi Sistem & 5 SOP Keamanan',
    role: 'Anggota 3 · System Analyst',
    language: 'markdown',
    description:
      'Dokumentasi proyek lengkap mencakup latar belakang, tujuan, fitur utama, struktur direktori, alur kerja Git, dan 5 SOP keamanan data pasien.',
    content: README_ARTIFACT,
  },
  {
    id: 'gitignore',
    filename: '.gitignore',
    title: 'Konfigurasi Pengecualian Git',
    role: 'Tahap 1 · Inisialisasi Keamanan',
    language: 'text',
    description:
      'Mencegah file kredensial (.env), log, dan database lokal ikut terunggah ke repositori GitHub/GitLab.',
    content: GITIGNORE_ARTIFACT,
  },
  {
    id: 'env',
    filename: '.env.example',
    title: 'Templat Variabel Lingkungan',
    role: 'Tahap 1 · Inisialisasi Keamanan',
    language: 'env',
    description:
      'Templat konfigurasi database dan aplikasi tanpa menyertakan kredensial rahasia asli.',
    content: ENV_EXAMPLE_ARTIFACT,
  },
];
