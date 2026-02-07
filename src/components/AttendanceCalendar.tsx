import { useState } from 'react';
import { Attendance } from '@/types/student';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttendanceCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  month: number;
  year: number;
  attendance: Attendance[];
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function AttendanceCalendar({
  isOpen,
  onClose,
  month,
  year,
  attendance,
}: AttendanceCalendarProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hadir':
        return 'bg-success text-success-foreground';
      case 'Sakit':
        return 'bg-warning text-warning-foreground';
      case 'Izin':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRecordsForDate = (day: number): Attendance[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return attendance.filter(a => {
      const aDate = new Date(a.tanggal);
      const aDateStr = `${aDate.getFullYear()}-${String(aDate.getMonth() + 1).padStart(2, '0')}-${String(aDate.getDate()).padStart(2, '0')}`;
      return aDateStr === dateStr;
    });
  };

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            {MONTH_NAMES[month]} {year}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-success" />
              <span>Hadir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-warning" />
              <span>Sakit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-info" />
              <span>Izin</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {DAY_NAMES.map(day => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}

            {/* Empty cells */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days */}
            {days.map(day => {
              const records = getRecordsForDate(day);
              const status = records.length > 0 ? records[0].status : null;
              const count = records.length;
              return (
                <div
                  key={day}
                  title={status ? `${status} (${count}x)` : 'Tidak ada data'}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors relative ${
                    status
                      ? getStatusColor(status)
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {day}
                  {count > 1 && (
                    <span className="absolute -top-1.5 -right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full min-w-[1.1rem] h-4 flex items-center justify-center shadow-sm px-1 z-10">
                      {count}x
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
