import { useState } from 'react';
import { Attendance, MonthlyAttendance } from '@/types/student';
import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { AttendanceCalendar } from './AttendanceCalendar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

interface AttendanceSummaryProps {
  attendance: Attendance[];
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTHS_PER_PAGE = 4;

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const [selectedMonth, setSelectedMonth] = useState<{
    month: number;
    year: number;
  } | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentPage, setCurrentPage] = useState(0);

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
          tambahan: 0,
          terlambat: 0,
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
        case 'Terlambat':
          monthlyData[key].terlambat++;
          break;
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      if (a.tahun !== b.tahun) return b.tahun - a.tahun;
      return MONTH_NAMES.indexOf(b.bulan) - MONTH_NAMES.indexOf(a.bulan);
    });
  };

  const monthlyAttendance = getMonthlyAttendance();
  
  // Group months into pages of 4
  const groupedMonths: MonthlyAttendance[][] = [];
  for (let i = 0; i < monthlyAttendance.length; i += MONTHS_PER_PAGE) {
    groupedMonths.push(monthlyAttendance.slice(i, i + MONTHS_PER_PAGE));
  }

  const totalPages = groupedMonths.length;

  const handleMonthClick = (bulan: string, tahun: number) => {
    const monthIndex = MONTH_NAMES.indexOf(bulan);
    setSelectedMonth({ month: monthIndex, year: tahun });
  };

  const handlePrev = () => {
    carouselApi?.scrollPrev();
  };

  const handleNext = () => {
    carouselApi?.scrollNext();
  };

  // Update current page when carousel scrolls
  carouselApi?.on('select', () => {
    setCurrentPage(carouselApi.selectedScrollSnap());
  });

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Rekap Kehadiran
          </h3>
        </div>
        
        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[40px] text-center">
              {currentPage + 1}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {monthlyAttendance.length > 0 ? (
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {groupedMonths.map((group, pageIndex) => (
              <CarouselItem key={pageIndex} className="basis-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.map((month) => (
                    <div
                      key={`${month.bulan}-${month.tahun}`}
                      className="border rounded-lg p-3 hover:shadow-sm transition"
                    >
                      {/* Judul Bulan */}
                      <div
                        onClick={() => handleMonthClick(month.bulan, month.tahun)}
                        className="font-semibold text-base cursor-pointer hover:text-primary hover:underline leading-tight"
                      >
                        {month.bulan} {month.tahun}
                      </div>

                      {/* Statistik */}
                      <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                        {/* Hadir */}
                        <div>
                          <div 
                            className="w-8 h-8 mx-auto rounded-full bg-success/10 text-success font-bold text-sm"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1'
                            }}
                          >
                            {month.hadir}
                          </div>
                          <div className="text-xs mt-0.5 text-muted-foreground">
                            Hadir
                          </div>
                        </div>

                        {/* Sakit */}
                        <div>
                          <div 
                            className="w-8 h-8 mx-auto rounded-full bg-warning/10 text-warning font-bold text-sm"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1'
                            }}
                          >
                            {month.sakit}
                          </div>
                          <div className="text-xs mt-0.5 text-muted-foreground">
                            Sakit
                          </div>
                        </div>

                        {/* Izin */}
                        <div>
                          <div 
                            className="w-8 h-8 mx-auto rounded-full bg-info/10 text-info font-bold text-sm"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1'
                            }}
                          >
                            {month.izin}
                          </div>
                          <div className="text-xs mt-0.5 text-muted-foreground">
                            Izin
                          </div>
                        </div>

                        {/* Terlambat */}
                        <div>
                          <div 
                            className="w-8 h-8 mx-auto rounded-full bg-destructive/10 text-destructive font-bold text-sm"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1'
                            }}
                          >
                            {month.terlambat}
                          </div>
                          <div className="text-xs mt-0.5 text-muted-foreground">
                            Terlambat
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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
