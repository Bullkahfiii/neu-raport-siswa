import { useState } from 'react';
import { TestScore } from '@/types/student';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileSpreadsheet, TrendingUp, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScoreTableProps {
  title: string;
  scores: TestScore[];
  colorClass: string;
  compact?: boolean;
  isUtbk?: boolean;
}

const CHART_COLORS = [
  'hsl(0, 72%, 51%)',
  'hsl(142, 70%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(210, 70%, 50%)',
  'hsl(270, 70%, 50%)',
  'hsl(180, 70%, 40%)',
  'hsl(330, 70%, 50%)',
  'hsl(60, 70%, 45%)',
];

const getUtbkScoreColor = (score: number) => {
  if (score >= 620) {
    return 'bg-success text-success-foreground';
  } else if (score >= 501) {
    return 'bg-warning text-warning-foreground';
  } else {
    return 'bg-destructive text-destructive-foreground';
  }
};

const getRegularScoreColor = (score: number) => {
  if (score >= 80) {
    return 'bg-success text-success-foreground';
  } else if (score >= 56) {
    return 'bg-warning text-warning-foreground';
  } else {
    return 'bg-destructive text-destructive-foreground';
  }
};

export function ScoreTable({ title, scores, colorClass, compact = false, isUtbk = false }: ScoreTableProps) {
  const [showChart, setShowChart] = useState(false);

  if (scores.length === 0) return null;

  const allSubjects = Array.from(
    new Set(scores.flatMap(s => Object.keys(s.nilai)))
  );

  const chartData = scores.map(score => {
    const dataPoint: Record<string, any> = {
      tanggal: new Date(score.tanggalTes).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
      }),
      namaTes: score.namaTes
    };
    
    allSubjects.forEach(subject => {
      dataPoint[subject] = score.nilai[subject] ?? null;
    });

    return dataPoint;
  });

  return (
    <div className={`bg-card rounded-xl shadow-card ${compact ? 'p-4' : 'p-6'} animate-slide-up overflow-hidden`}>
      <div className={`flex items-center gap-3 ${compact ? 'mb-3' : 'mb-6'}`}>
        <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg ${colorClass} flex items-center justify-center`}>
          <FileSpreadsheet className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-primary-foreground`} />
        </div>
        <h3 
          className={`${compact ? 'text-base' : 'text-xl'} font-bold text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-2`}
          onClick={() => setShowChart(!showChart)}
        >
          {title}
          <TrendingUp className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-muted-foreground`} />
        </h3>
        {showChart && (
          <button 
            onClick={(e) => { e.stopPropagation(); setShowChart(false); }}
            className="ml-auto p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Chart Section */}
      {showChart && (
        <div className={`${compact ? 'mb-4' : 'mb-6'} border border-border rounded-lg p-4 bg-muted/30`}>
          <div className={compact ? 'h-48' : 'h-64'}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="tanggal" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={compact ? 10 : 12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={compact ? 10 : 12}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: compact ? '10px' : '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ fontSize: compact ? '10px' : '12px' }} />
                
                {allSubjects.map((subject, index) => (
                  <Line
                    key={subject}
                    type="monotone"
                    dataKey={subject}
                    name={subject}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={compact ? 2 : 3}
                    dot={{ fill: CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2, r: compact ? 3 : 4 }}
                    activeDot={{ r: compact ? 5 : 7 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
                  {allSubjects.map(subject => {
                    const scoreValue = score.nilai[subject];
                    const scoreColorClass = isUtbk 
                      ? getUtbkScoreColor(scoreValue) 
                      : getRegularScoreColor(scoreValue);
                    
                    return (
                      <TableCell key={subject} className={`text-center ${compact ? 'py-1.5 px-1' : ''}`}>
                        <span 
                          className={`score-badge ${compact ? 'text-xs' : 'text-sm'} rounded-md font-medium ${scoreColorClass}`}
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: compact ? '40px' : '50px',
                            height: compact ? '24px' : '28px',
                            padding: compact ? '0 6px' : '0 8px',
                            textAlign: 'center',
                            lineHeight: '1'
                          }}
                        >
                          {scoreValue ?? '-'}
                        </span>
                      </TableCell>
                    );
                  })}
                  <TableCell className={`text-center ${compact ? 'py-1.5 px-2' : ''}`}>
                    <span 
                      className={`score-badge ${compact ? 'text-xs' : 'text-sm'} rounded-md font-bold ${
                        isUtbk ? getUtbkScoreColor(average) : getRegularScoreColor(average)
                      }`}
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: compact ? '45px' : '55px',
                        height: compact ? '24px' : '28px',
                        padding: compact ? '0 8px' : '0 12px',
                        textAlign: 'center',
                        lineHeight: '1'
                      }}
                    >
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
