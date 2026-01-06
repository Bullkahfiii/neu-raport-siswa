import { Student, TestScore, Attendance, TeacherNote } from '@/types/student';

// URL Google Apps Script Web App - Hardcoded
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlmtgrWGGk7t2BKa5esz__LpGJKykqCU_VDNTTWwsv1ut8_-Vn2WCrUxksaQjKZ2Iz8g/exec';

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
  notes: TeacherNote[];
}

// Check if Apps Script is configured (always true now)
export const isAppsScriptConfigured = (): boolean => {
  return true;
};

// Login by phone number
export const loginByPhone = async (phone: string): Promise<ApiResponse<Student>> => {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=login&phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Gagal terhubung ke server. Silakan coba lagi.' };
  }
};

// Get all student data (combined endpoint)
export const getAllStudentData = async (phone: string): Promise<ApiResponse<AllStudentData>> => {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getAllData&phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('GetAllData error:', error);
    return { success: false, error: 'Gagal terhubung ke server. Silakan coba lagi.' };
  }
};

// Get student scores
export const getStudentScores = async (nama: string): Promise<ApiResponse<{
  tka: TestScore[];
  tesEvaluasi: TestScore[];
  utbk: TestScore[];
}>> => {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getScores&nama=${encodeURIComponent(nama)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data nilai.' };
  }
};

// Get student attendance
export const getStudentAttendance = async (nama: string): Promise<ApiResponse<Attendance[]>> => {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getAttendance&nama=${encodeURIComponent(nama)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data kehadiran.' };
  }
};