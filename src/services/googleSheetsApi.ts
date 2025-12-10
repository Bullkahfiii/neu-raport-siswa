import { Student, TestScore, Attendance } from '@/types/student';

// URL Google Apps Script Web App - Ganti dengan URL deployment Anda
const APPS_SCRIPT_URL = localStorage.getItem('appsScriptUrl') || '';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AllStudentData {
  student: Student;
  scores: {
    tka: TestScore[];
    tesEvaluasi: TestScore[];
    utbk: TestScore[];
  };
  attendance: Attendance[];
}

// Set URL Apps Script
export const setAppsScriptUrl = (url: string) => {
  localStorage.setItem('appsScriptUrl', url);
};

// Get URL Apps Script
export const getAppsScriptUrl = (): string => {
  return localStorage.getItem('appsScriptUrl') || '';
};

// Check if Apps Script is configured
export const isAppsScriptConfigured = (): boolean => {
  const url = getAppsScriptUrl();
  return url.length > 0 && url.includes('script.google.com');
};

// Login by phone number
export const loginByPhone = async (phone: string): Promise<ApiResponse<Student>> => {
  const url = getAppsScriptUrl();
  
  if (!url) {
    return { success: false, error: 'URL Apps Script belum dikonfigurasi' };
  }

  try {
    // Gunakan mode no-cors tidak bisa karena tidak bisa baca response
    // Google Apps Script perlu diakses dengan redirect mode
    const response = await fetch(`${url}?action=login&phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Gagal terhubung ke server. Pastikan URL Apps Script sudah di-deploy dengan benar dan akses diset ke "Anyone".' };
  }
};

// Get all student data (combined endpoint)
export const getAllStudentData = async (phone: string): Promise<ApiResponse<AllStudentData>> => {
  const url = getAppsScriptUrl();
  
  if (!url) {
    return { success: false, error: 'URL Apps Script belum dikonfigurasi' };
  }

  try {
    const response = await fetch(`${url}?action=getAllData&phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('GetAllData error:', error);
    return { success: false, error: 'Gagal terhubung ke server. Pastikan URL Apps Script sudah di-deploy dengan benar.' };
  }
};

// Get student scores
export const getStudentScores = async (nama: string): Promise<ApiResponse<{
  tka: TestScore[];
  tesEvaluasi: TestScore[];
  utbk: TestScore[];
}>> => {
  const url = getAppsScriptUrl();
  
  if (!url) {
    return { success: false, error: 'URL Apps Script belum dikonfigurasi' };
  }

  try {
    const response = await fetch(`${url}?action=getScores&nama=${encodeURIComponent(nama)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data nilai.' };
  }
};

// Get student attendance
export const getStudentAttendance = async (nama: string): Promise<ApiResponse<Attendance[]>> => {
  const url = getAppsScriptUrl();
  
  if (!url) {
    return { success: false, error: 'URL Apps Script belum dikonfigurasi' };
  }

  try {
    const response = await fetch(`${url}?action=getAttendance&nama=${encodeURIComponent(nama)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data kehadiran.' };
  }
};
