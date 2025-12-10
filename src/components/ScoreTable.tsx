import { TestScore } from '@/types/student';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileSpreadsheet } from 'lucide-react';

interface ScoreTableProps {
  title: string;
  scores: TestScore[];
  colorClass: string;
}

export function ScoreTable({ title, scores, colorClass }: ScoreTableProps) {
  if (scores.length === 0) return null;

  const allSubjects = Array.from(
    new Set(scores.flatMap(s => Object.keys(s.nilai)))
  );

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}>
          <FileSpreadsheet className="w-5 h-5 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-foreground">Tanggal</TableHead>
              <TableHead className="font-semibold text-foreground">Nama Tes</TableHead>
              {allSubjects.map(subject => (
                <TableHead key={subject} className="font-semibold text-foreground text-center">
                  {subject}
                </TableHead>
              ))}
              <TableHead className="font-semibold text-foreground text-center">Rata-rata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => {
              const values = Object.values(score.nilai);
              const average = values.reduce((a, b) => a + b, 0) / values.length;
              
              return (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-muted-foreground">
                    {new Date(score.tanggalTes).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{score.namaTes}</TableCell>
                  {allSubjects.map(subject => (
                    <TableCell key={subject} className="text-center">
                      <span className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
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
                  <TableCell className="text-center">
                    <span className="inline-block px-3 py-1 rounded-md text-sm font-bold bg-primary/10 text-primary">
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
