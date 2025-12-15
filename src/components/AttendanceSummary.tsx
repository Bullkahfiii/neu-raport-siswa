import { useState } from 'react';
import { Attendance, MonthlyAttendance } from '@/types/student';
import { CalendarCheck } from 'lucide-react';
import { AttendanceCalendar } from './AttendanceCalendar';

interface AttendanceSummaryProps {
  attendance: Attendance[];
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const [selectedMonth, setSelectedMonth] = useState<{
    month: number;
    year: number;
  } | null>(null);

  const getMonthlyAttendance = (): MonthlyAttendance[] => {
    const monthlyData: Record<string, MonthlyAttendance> = {};

    attendance.forEach((a) => {
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
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      if (a.tahun !== b.tahun) return b.tahun - a.tahun;
      return MONTH_NAMES.indexOf(b.bulan) - MONTH_NAMES.indexOf(a.bulan);
    });
  };

  const monthlyAttendance = getMonthlyAttendance();

  const handleMonthClick = (bulan: string, tahun: number) => {
    const monthIndex = MONTH_NAMES.indexOf(bulan);
    setSelectedMonth({ month: monthIndex, year: tahun });
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <CalendarCheck className="w-5 h-5 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Rekap Kehadiran
        </h3>
      </div>

      {/* Content */}
      {monthlyAttendance.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyAttendance.map((month) => (
            <div
              key={`${month.bulan}-${month.tahun}`}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              {/* Judul Bulan */}
              <div
                onClick={() => handleMonthClick(month.bulan, month.tahun)}
                className="font-semibold text-lg cursor-pointer hover:text-primary hover:underline"
              >
                {month.bulan} {month.tahun}
              </div>

              {/* Statistik */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                {/* Hadir */}
                <div>
                  <div className="w-10 h-10 mx-auto rounded-full bg-success/10 text-success font-bold flex items-center justify-center">
                    {month.hadir}
                  </div>
                  <div className="text-sm mt-1 text-muted-foreground">
                    Hadir
                  </div>
                </div>

                {/* Sakit */}
                <div>
                  <div className="w-10 h-10 mx-auto rounded-full bg-warning/10 text-warning font-bold flex items-center justify-center">
                    {month.sakit}
                  </div>
                  <div className="text-sm mt-1 text-muted-foreground">
                    Sakit
                  </div>
                </div>

                {/* Izin */}
                <div>
                  <div className="w-10 h-10 mx-auto rounded-full bg-info/10 text-info font-bold flex items-center justify-center">
                    {month.izin}
                  </div>
                  <div className="text-sm mt-1 text-muted-foreground">
                    Izin
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Belum ada data kehadiran
        </div>
      )}

      {/* Calendar Dialog */}
      {selectedMonth && (
        <AttendanceCalendar
          isOpen={!!selectedMonth}
          onClose={() => setSelectedMonth(null)}
          month={selectedMonth.month}
          year={selectedMonth.year}
          attendance={attendance}
        />
      )}
    </div>
  );
}
