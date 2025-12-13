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

export function AttendanceCalendar({ isOpen, onClose, month, year, attendance }: AttendanceCalendarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hadir':
        return 'bg-success text-success-foreground';
      case 'Sakit':
        return 'bg-warning text-warning-foreground';
      case 'Izin':
        return 'bg-info text-info-foreground';
      case 'Tambahan':
        return 'bg-purple text-purple-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusForDate = (day: number): string | null => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = attendance.find(a => {
      const aDate = new Date(a.tanggal);
      const aDateStr = `${aDate.getFullYear()}-${String(aDate.getMonth() + 1).padStart(2, '0')}-${String(aDate.getDate()).padStart(2, '0')}`;
      return aDateStr === dateStr;
    });
    return record ? record.status : null;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

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
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-purple" />
              <span>Tambahan</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {DAY_NAMES.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Calendar Days */}
            {days.map(day => {
              const status = getStatusForDate(day);
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    status ? getStatusColor(status) : 'bg-muted/50 text-muted-foreground'
                  }`}
                  title={status || 'Tidak ada data'}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
