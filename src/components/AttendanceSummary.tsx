import { Attendance, MonthlyAttendance } from '@/types/student';
import { CalendarCheck, UserCheck, Stethoscope, FileText, XCircle } from 'lucide-react';

interface AttendanceSummaryProps {
  attendance: Attendance[];
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const getMonthlyAttendance = (): MonthlyAttendance[] => {
    const monthlyData: Record<string, MonthlyAttendance> = {};

    attendance.forEach(a => {
      const date = new Date(a.tanggal);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          bulan: MONTH_NAMES[month],
          tahun: year,
          hadir: 0,
          sakit: 0,
          izin: 0,
          alpha: 0
        };
      }

      switch (a.status) {
        case 'Hadir':
          monthlyData[key].hadir++;
          break;
        case 'Sakit':
          monthlyData[key].sakit++;
          break;
        case 'Izin':
          monthlyData[key].izin++;
          break;
        case 'Alpha':
          monthlyData[key].alpha++;
          break;
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      const monthA = MONTH_NAMES.indexOf(a.bulan);
      const monthB = MONTH_NAMES.indexOf(b.bulan);
      if (a.tahun !== b.tahun) return b.tahun - a.tahun;
      return monthB - monthA;
    });
  };

  const monthlyAttendance = getMonthlyAttendance();

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <CalendarCheck className="w-5 h-5 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Rekap Kehadiran</h3>
      </div>

      <div className="space-y-4">
        {monthlyAttendance.map((month, index) => (
          <div 
            key={`${month.bulan}-${month.tahun}`} 
            className="p-4 bg-muted/50 rounded-lg"
          >
            <h4 className="font-semibold text-foreground mb-3">
              {month.bulan} {month.tahun}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg">
                <UserCheck className="w-4 h-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Hadir</p>
                  <p className="font-bold text-success">{month.hadir}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg">
                <Stethoscope className="w-4 h-4 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Sakit</p>
                  <p className="font-bold text-warning">{month.sakit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-info/10 rounded-lg">
                <FileText className="w-4 h-4 text-info" />
                <div>
                  <p className="text-xs text-muted-foreground">Izin</p>
                  <p className="font-bold text-info">{month.izin}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                <XCircle className="w-4 h-4 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Alpha</p>
                  <p className="font-bold text-destructive">{month.alpha}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {monthlyAttendance.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data kehadiran
          </div>
        )}
      </div>
    </div>
  );
}
