import { Student, TestScore, Attendance } from '@/types/student';

export const mockStudents: Student[] = [
  {
    no: 1,
    nama: "Ahmad Rizky Pratama",
    nis: "2024001",
    asalSekolah: "SMAN 1 Jakarta",
    kelas: "XII IPA 1",
    kurikulum: "Kurikulum Merdeka",
    nomorWA: "081234567890",
    nomorWAOrangTua: "081234567891",
    email: "ahmad.rizky@email.com",
    tanggalLahir: "2006-05-15",
    rumpun: "Saintek",
    program: "Intensif",
    pilihanPTNPertama: "Universitas Indonesia - Kedokteran",
    pilihanPTNKedua: "ITB - Teknik Informatika"
  },
  {
    no: 2,
    nama: "Siti Nurhaliza",
    nis: "2024002",
    asalSekolah: "SMAN 3 Bandung",
    kelas: "XII IPA 2",
    kurikulum: "Kurikulum Merdeka",
    nomorWA: "082345678901",
    nomorWAOrangTua: "082345678902",
    email: "siti.nurhaliza@email.com",
    tanggalLahir: "2006-08-22",
    rumpun: "Saintek",
    program: "Reguler",
    pilihanPTNPertama: "UGM - Farmasi",
    pilihanPTNKedua: "Unair - Kedokteran Gigi"
  }
];

export const mockTKAScores: TestScore[] = [
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-10-15",
    namaTes: "TKA Saintek Batch 1",
    nilai: {
      "Matematika": 85,
      "Fisika": 78,
      "Kimia": 82,
      "Biologi": 88
    }
  },
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-11-05",
    namaTes: "TKA Saintek Batch 2",
    nilai: {
      "Matematika": 88,
      "Fisika": 82,
      "Kimia": 85,
      "Biologi": 90
    }
  },
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-12-01",
    namaTes: "TKA Saintek Batch 3",
    nilai: {
      "Matematika": 92,
      "Fisika": 85,
      "Kimia": 88,
      "Biologi": 92
    }
  }
];

export const mockTesEvaluasiScores: TestScore[] = [
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-10-20",
    namaTes: "Evaluasi Mingguan 1",
    nilai: {
      "PU": 75,
      "PPU": 80,
      "PBM": 72,
      "PK": 78
    }
  },
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-11-10",
    namaTes: "Evaluasi Mingguan 2",
    nilai: {
      "PU": 82,
      "PPU": 85,
      "PBM": 78,
      "PK": 82
    }
  }
];

export const mockUTBKScores: TestScore[] = [
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-11-15",
    namaTes: "Try Out UTBK 1",
    nilai: {
      "PU": 680,
      "PPU": 720,
      "PBM": 650,
      "PK": 700,
      "Matematika": 750,
      "Fisika": 680,
      "Kimia": 700,
      "Biologi": 720
    }
  },
  {
    namaSiswa: "Ahmad Rizky Pratama",
    kelas: "XII IPA 1",
    nomorInduk: "2024001",
    tanggalTes: "2024-12-05",
    namaTes: "Try Out UTBK 2",
    nilai: {
      "PU": 720,
      "PPU": 750,
      "PBM": 690,
      "PK": 730,
      "Matematika": 780,
      "Fisika": 720,
      "Kimia": 740,
      "Biologi": 760
    }
  }
];

export const mockAttendance: Attendance[] = [
  // Oktober
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-01", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-02", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-03", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-04", status: "Sakit" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-07", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-08", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-09", status: "Izin" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-10", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-14", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-10-15", status: "Hadir" },
  // November
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-01", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-04", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-05", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-06", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-07", status: "Sakit" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-08", status: "Sakit" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-11", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-12", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-13", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-14", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-11-15", status: "Hadir" },
  // Desember
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-02", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-03", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-04", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-05", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-06", status: "Izin" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-09", status: "Hadir" },
  { namaSiswa: "Ahmad Rizky Pratama", kelas: "XII IPA 1", tanggal: "2024-12-10", status: "Hadir" }
];

export const getStudentByPhone = (phone: string): Student | undefined => {
  return mockStudents.find(s => s.nomorWA === phone);
};

export const getStudentScores = (nama: string) => {
  return {
    tka: mockTKAScores.filter(s => s.namaSiswa === nama),
    tesEvaluasi: mockTesEvaluasiScores.filter(s => s.namaSiswa === nama),
    utbk: mockUTBKScores.filter(s => s.namaSiswa === nama)
  };
};

export const getStudentAttendance = (nama: string): Attendance[] => {
  return mockAttendance.filter(a => a.namaSiswa === nama);
};
