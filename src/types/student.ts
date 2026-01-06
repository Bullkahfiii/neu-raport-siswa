export interface Student {
  no: number;
  nama: string;
  nis: string;
  asalSekolah: string;
  foto?: string;
  kelas: string;
  kurikulum: string;
  nomorWA: string;
  nomorWAOrangTua: string;
  email: string;
  tanggalLahir: string;
  rumpun: string;
  program: string;
  pilihanPTNPertama: string;
  pilihanPTNKedua: string;
}

export interface TestScore {
  namaSiswa: string;
  kelas: string;
  nomorInduk: string;
  tanggalTes: string;
  namaTes: string;
  nilai: Record<string, number>;
}

export interface Attendance {
  namaSiswa: string;
  kelas: string;
  tanggal: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Tambahan';
}

export interface MonthlyAttendance {
  bulan: string;
  tahun: number;
  hadir: number;
  sakit: number;
  izin: number;
  tambahan: number;
}

export interface TeacherNote {
  namaSiswa: string;
  tanggal: string;
  catatan: string;
  waliKelas?: string;
}
