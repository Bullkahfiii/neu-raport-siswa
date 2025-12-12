// ============================================
// GOOGLE APPS SCRIPT - E-RAPORT SISWA API
// ============================================
// Cara penggunaan:
// 1. Buka Google Spreadsheet Anda
// 2. Klik Extensions > Apps Script
// 3. Hapus kode default dan paste kode ini
// 4. Klik Deploy > New deployment
// 5. Pilih "Web app"
// 6. Set "Execute as" = Me, "Who has access" = Anyone
// 7. Copy URL yang diberikan dan paste di aplikasi

// ============================================
// KONFIGURASI - Sesuaikan dengan nama sheet Anda
// ============================================
const CONFIG = {
  SHEET_DATABASE_SISWA: "DataBase Siswa",
  SHEET_TKA: "TKA",
  SHEET_TES_EVALUASI: "Tes Evaluasi",
  SHEET_UTBK: "UTBK",
  SHEET_ABSENSI: "Absensi"
};

// ============================================
// MAIN HANDLER
// ============================================
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case "login":
        result = loginByPhone(e.parameter.phone);
        break;
      case "getScores":
        result = getStudentScores(e.parameter.nama);
        break;
      case "getAttendance":
        result = getStudentAttendance(e.parameter.nama);
        break;
      case "getAllData":
        result = getAllStudentData(e.parameter.phone);
        break;
      default:
        result = { success: false, error: "Action tidak valid" };
    }
  } catch (error) {
    result = { success: false, error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// FUNGSI LOGIN
// ============================================
function loginByPhone(phone) {
  if (!phone) {
    return { success: false, error: "Nomor WhatsApp diperlukan" };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_DATABASE_SISWA);
  
  if (!sheet) {
    return { success: false, error: "Sheet Database Siswa tidak ditemukan" };
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Cari index kolom
  const colIndex = {
    no: 0,           // A
    nama: 1,         // B
    nis: 2,          // C
    asalSekolah: 3,  // D
    kelas: 4,        // E
    foto: 5,         // F - Link foto siswa
    kurikulum: 6,    // G
    nomorWA: 7,      // H
    nomorWAOrangTua: 8, // I
    email: 9,        // J
    tanggalLahir: 10, // K
    rumpun: 11,      // L
    program: 12,     // M
    pilihanPTNPertama: 26, // AA
    pilihanPTNKedua: 27    // AB
  };

  // Cari siswa berdasarkan nomor WA
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const nomorWA = String(row[colIndex.nomorWA]).replace(/\D/g, '');
    const inputPhone = String(phone).replace(/\D/g, '');
    
    if (nomorWA === inputPhone) {
      const student = {
        no: row[colIndex.no],
        nama: row[colIndex.nama],
        nis: String(row[colIndex.nis]),
        asalSekolah: row[colIndex.asalSekolah],
        foto: row[colIndex.foto] || "",
        kelas: row[colIndex.kelas],
        kurikulum: row[colIndex.kurikulum],
        nomorWA: row[colIndex.nomorWA],
        nomorWAOrangTua: row[colIndex.nomorWAOrangTua],
        email: row[colIndex.email],
        tanggalLahir: formatDate(row[colIndex.tanggalLahir]),
        rumpun: row[colIndex.rumpun],
        program: row[colIndex.program],
        pilihanPTNPertama: row[colIndex.pilihanPTNPertama] || "-",
        pilihanPTNKedua: row[colIndex.pilihanPTNKedua] || "-"
      };
      
      return { success: true, data: student };
    }
  }

  return { success: false, error: "Nomor WhatsApp tidak ditemukan" };
}

// ============================================
// FUNGSI GET SCORES
// ============================================
function getStudentScores(nama) {
  if (!nama) {
    return { success: false, error: "Nama siswa diperlukan" };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  return {
    success: true,
    data: {
      tka: getScoresFromSheet(ss, CONFIG.SHEET_TKA, nama),
      tesEvaluasi: getScoresFromSheet(ss, CONFIG.SHEET_TES_EVALUASI, nama),
      utbk: getScoresFromSheet(ss, CONFIG.SHEET_UTBK, nama)
    }
  };
}

function getScoresFromSheet(ss, sheetName, nama) {
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return [];
  }

  const data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    return [];
  }

  const headers = data[0];
  const scores = [];

  // Kolom: A=Nama, B=Kelas, C=NomorInduk, D=TanggalTes, E=NamaTes, F+=Nilai
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const namaSiswa = String(row[0]).trim().toLowerCase();
    const inputNama = String(nama).trim().toLowerCase();
    
    if (namaSiswa === inputNama) {
      const nilai = {};
      
      // Ambil nilai dari kolom F sampai akhir
      for (let j = 5; j < headers.length; j++) {
        if (headers[j] && row[j] !== "" && row[j] !== null) {
          nilai[headers[j]] = Number(row[j]) || 0;
        }
      }

      if (Object.keys(nilai).length > 0) {
        scores.push({
          namaSiswa: row[0],
          kelas: row[1],
          nomorInduk: String(row[2]),
          tanggalTes: formatDate(row[3]),
          namaTes: row[4],
          nilai: nilai
        });
      }
    }
  }

  return scores;
}

// ============================================
// FUNGSI GET ATTENDANCE
// ============================================
function getStudentAttendance(nama) {
  if (!nama) {
    return { success: false, error: "Nama siswa diperlukan" };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_ABSENSI);
  
  if (!sheet) {
    return { success: true, data: [] };
  }

  const data = sheet.getDataRange().getValues();
  const attendance = [];

  // Kolom: A=Nama, B=Kelas, C=Tanggal, D=Status
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const namaSiswa = String(row[0]).trim().toLowerCase();
    const inputNama = String(nama).trim().toLowerCase();
    
    if (namaSiswa === inputNama) {
      attendance.push({
        namaSiswa: row[0],
        kelas: row[1],
        tanggal: formatDate(row[2]),
        status: row[3]
      });
    }
  }

  return { success: true, data: attendance };
}

// ============================================
// FUNGSI GET ALL DATA (Combined)
// ============================================
function getAllStudentData(phone) {
  // Login dulu
  const loginResult = loginByPhone(phone);
  
  if (!loginResult.success) {
    return loginResult;
  }

  const student = loginResult.data;
  const nama = student.nama;

  // Get scores
  const scoresResult = getStudentScores(nama);
  
  // Get attendance
  const attendanceResult = getStudentAttendance(nama);

  return {
    success: true,
    data: {
      student: student,
      scores: scoresResult.data,
      attendance: attendanceResult.data
    }
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatDate(date) {
  if (!date) return "";
  
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return String(date);
}

// ============================================
// TEST FUNCTIONS (untuk debugging)
// ============================================
function testLogin() {
  const result = loginByPhone("081234567890");
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetScores() {
  const result = getStudentScores("Ahmad Rizky Pratama");
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetAttendance() {
  const result = getStudentAttendance("Ahmad Rizky Pratama");
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetAllData() {
  const result = getAllStudentData("081234567890");
  Logger.log(JSON.stringify(result, null, 2));
}
