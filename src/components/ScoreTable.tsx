import { TestScore } from '@/types/student';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileSpreadsheet } from 'lucide-react';

interface ScoreTableProps {
  title: string;
  scores: TestScore[];
  colorClass: string;
  compact?: boolean;
}

export function ScoreTable({ title, scores, colorClass, compact = false }: ScoreTableProps) {
  if (scores.length === 0) return null;

  const allSubjects = Array.from(
    new Set(scores.flatMap(s => Object.keys(s.nilai)))
  );

  return (
    <div className={`bg-card rounded-xl shadow-card ${compact ? 'p-4' : 'p-6'} animate-slide-up overflow-hidden`}>
      <div className={`flex items-center gap-3 ${compact ? 'mb-3' : 'mb-6'}`}>
        <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg ${colorClass} flex items-center justify-center`}>
          <FileSpreadsheet className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-primary-foreground`} />
        </div>
        <h3 className={`${compact ? 'text-base' : 'text-xl'} font-bold text-foreground`}>{title}</h3>
      </div>

      <div className={`overflow-x-auto ${compact ? '-mx-4 px-4' : '-mx-6 px-6'}`}>
        <Table className={compact ? 'text-xs' : ''}>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className={`font-semibold text-foreground ${compact ? 'py-2 px-2' : ''}`}>Tanggal</TableHead>
              <TableHead className={`font-semibold text-foreground ${compact ? 'py-2 px-2' : ''}`}>Nama Tes</TableHead>
              {allSubjects.map(subject => (
                <TableHead key={subject} className={`font-semibold text-foreground text-center ${compact ? 'py-2 px-1' : ''}`}>
                  {subject}
                </TableHead>
              ))}
              <TableHead className={`font-semibold text-foreground text-center ${compact ? 'py-2 px-2' : ''}`}>Rata-rata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => {
              const values = Object.values(score.nilai);
              const average = values.reduce((a, b) => a + b, 0) / values.length;
              
              return (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className={`text-muted-foreground ${compact ? 'py-1.5 px-2' : ''}`}>
                    {new Date(score.tanggalTes).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: compact ? '2-digit' : 'numeric'
                    })}
                  </TableCell>
                  <TableCell className={`font-medium text-foreground ${compact ? 'py-1.5 px-2' : ''}`}>{score.namaTes}</TableCell>
                  {allSubjects.map(subject => (
                    <TableCell key={subject} className={`text-center ${compact ? 'py-1.5 px-1' : ''}`}>
                      <span className={`inline-block ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'} rounded-md font-medium ${
                        score.nilai[subject] >= 80 
                          ? 'bg-success/10 text-success' 
                          : score.nilai[subject] >= 60 
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                      }`}>
                        {score.nilai[subject] ?? '-'}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className={`text-center ${compact ? 'py-1.5 px-2' : ''}`}>
                    <span className={`inline-block ${compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} rounded-md font-bold bg-primary/10 text-primary`}>
                      {average.toFixed(1)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}