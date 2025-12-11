import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, TestScore, Attendance } from '@/types/student';
import { getAllStudentData } from '@/services/googleSheetsApi';
import { StudentIdentityCard } from '@/components/StudentIdentityCard';
import { AttendanceSummary } from '@/components/AttendanceSummary';
import { ScoreTable } from '@/components/ScoreTable';
import { Button } from '@/components/ui/button';
import { LogOut, Download, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import logo from '@/assets/logo.png';
interface Scores {
  tka: TestScore[];
  tesEvaluasi: TestScore[];
  utbk: TestScore[];
}
export default function Dashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [scores, setScores] = useState<Scores>({
    tka: [],
    tesEvaluasi: [],
    utbk: []
  });
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const loadData = async () => {
    const storedStudent = localStorage.getItem('loggedInStudent');
    const storedPhone = localStorage.getItem('loggedInPhone');
    if (!storedStudent) {
      navigate('/');
      return;
    }
    const parsedStudent = JSON.parse(storedStudent) as Student;
    setStudent(parsedStudent);
    if (storedPhone) {
      try {
        const result = await getAllStudentData(storedPhone);
        if (result.success && result.data) {
          setStudent(result.data.student);
          setScores(result.data.scores);
          setAttendance(result.data.attendance);
          localStorage.setItem('loggedInStudent', JSON.stringify(result.data.student));
        } else {
          toast.error('Gagal memuat data dari server');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat memuat data');
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [navigate]);
  const handleRefresh = async () => {
    setIsLoading(true);
    toast.info('Memperbarui data...');
    await loadData();
    toast.success('Data berhasil diperbarui');
  };
  const handleLogout = () => {
    localStorage.removeItem('loggedInStudent');
    localStorage.removeItem('loggedInPhone');
    toast.success('Berhasil keluar');
    navigate('/');
  };
  const handleDownloadPdf = async () => {
    if (!reportRef.current || !student) return;
    setIsGeneratingPdf(true);
    toast.info('Menyiapkan PDF...');
    try {
      // Add PDF class for smaller styling
      reportRef.current.classList.add('pdf-mode');
      const element = reportRef.current;
      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number],
        filename: `Raport_${student.nama.replace(/\s+/g, '_')}.pdf`,
        image: {
          type: 'jpeg' as const,
          quality: 0.95
        },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };
      await html2pdf().set(opt).from(element).save();
      toast.success('PDF berhasil diunduh!');

      // Remove PDF class
      reportRef.current.classList.remove('pdf-mode');
    } catch (error) {
      toast.error('Gagal membuat PDF. Silakan coba lagi.');
      reportRef.current?.classList.remove('pdf-mode');
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  if (isLoading || !student) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Bubat Hebat</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">E-Raport Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh} title="Refresh data">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="hidden sm:flex">
              {isGeneratingPdf ? <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </> : <>
                  <Download className="w-4 h-4" />
                  Simpan PDF
                </>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile PDF Button */}
      <div className="sm:hidden fixed bottom-4 right-4 z-50 no-print">
        <Button variant="gradient" size="icon" className="w-14 h-14 rounded-full shadow-lg" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
          {isGeneratingPdf ? <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg> : <FileText className="w-6 h-6" />}
        </Button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6" ref={reportRef}>
        {/* Page Title for PDF */}
        <div className="text-center mb-6 hidden print:block">
          <h1 className="text-2xl font-bold text-foreground">RAPORT SISWA</h1>
          <p className="text-muted-foreground">Periode: {new Date().getFullYear()}</p>
        </div>

        <div className="space-y-4">
          {/* Student Identity */}
          <StudentIdentityCard student={student} />

          {/* Attendance Summary */}
          <AttendanceSummary attendance={attendance} />

          {/* Score Tables */}
          <div className="space-y-4">
            <ScoreTable title="Nilai TKA (Tes Kemampuan Akademik)" scores={scores.tka} colorClass="gradient-primary" compact />
            
            <ScoreTable title="Nilai Tes Evaluasi" scores={scores.tesEvaluasi} colorClass="bg-success" compact />
            
            <ScoreTable title="Nilai Try Out UTBK" scores={scores.utbk} colorClass="bg-accent" compact isUtbk />

            {scores.tka.length === 0 && scores.tesEvaluasi.length === 0 && scores.utbk.length === 0 && <div className="bg-card rounded-xl shadow-card p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Data Nilai</h3>
                <p className="text-muted-foreground">
                  Data nilai akan muncul setelah Anda mengikuti tes
                </p>
              </div>}
          </div>
        </div>

        {/* Footer for PDF */}
        <div className="mt-6 pt-4 border-t border-border text-center hidden print:block">
          <p className="text-sm text-muted-foreground">
            Dicetak pada: {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
          </p>
        </div>
      </main>
    </div>;
}