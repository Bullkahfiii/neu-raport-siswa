import { useState } from 'react';
import { TestScore } from '@/types/student';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProgressChartProps {
  tkaScores: TestScore[];
  tesEvaluasiScores: TestScore[];
  utbkScores: TestScore[];
  compact?: boolean;
}

type TestType = 'TKA' | 'Tes Evaluasi' | 'UTBK';

const COLORS = [
  'hsl(0, 72%, 51%)',    // Red
  'hsl(142, 70%, 45%)',   // Green
  'hsl(38, 92%, 50%)',    // Orange
  'hsl(210, 70%, 50%)',   // Blue
  'hsl(270, 70%, 50%)',   // Purple
  'hsl(180, 70%, 40%)',   // Cyan
  'hsl(330, 70%, 50%)',   // Pink
  'hsl(60, 70%, 45%)',    // Yellow
];

export function ProgressChart({ tkaScores, tesEvaluasiScores, utbkScores, compact = false }: ProgressChartProps) {
  const [selectedType, setSelectedType] = useState<TestType>('TKA');

  const getScoresForType = (type: TestType): TestScore[] => {
    switch (type) {
      case 'TKA':
        return tkaScores;
      case 'Tes Evaluasi':
        return tesEvaluasiScores;
      case 'UTBK':
        return utbkScores;
      default:
        return [];
    }
  };

  const currentScores = getScoresForType(selectedType);

  const hasData = tkaScores.length > 0 || tesEvaluasiScores.length > 0 || utbkScores.length > 0;

  if (!hasData) return null;

  // Get all subjects from selected test type
  const allSubjects = Array.from(
    new Set(currentScores.flatMap(s => Object.keys(s.nilai)))
  );

  // Transform data for chart - show each subject's value per test
  const chartData = currentScores.map(score => {
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

  // Determine available test types for dropdown
  const availableTypes: TestType[] = [];
  if (tkaScores.length > 0) availableTypes.push('TKA');
  if (tesEvaluasiScores.length > 0) availableTypes.push('Tes Evaluasi');
  if (utbkScores.length > 0) availableTypes.push('UTBK');

  // Set default to first available type if current selection has no data
  if (currentScores.length === 0 && availableTypes.length > 0 && !availableTypes.includes(selectedType)) {
    setSelectedType(availableTypes[0]);
  }

  return (
    <div className={`bg-card rounded-xl shadow-card ${compact ? 'p-4' : 'p-6'} animate-slide-up`} style={{ animationDelay: '0.3s' }}>
      <div className={`flex items-center justify-between gap-3 ${compact ? 'mb-3' : 'mb-6'}`}>
        <div className="flex items-center gap-3">
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-accent/10 flex items-center justify-center`}>
            <TrendingUp className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-accent`} />
          </div>
          <h3 className={`${compact ? 'text-base' : 'text-xl'} font-bold text-foreground`}>Grafik Perkembangan Nilai</h3>
        </div>

        <Select value={selectedType} onValueChange={(value: TestType) => setSelectedType(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Pilih Tes" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentScores.length > 0 ? (
        <>
          <div className={compact ? 'h-48' : 'h-80'}>
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
                    boxShadow: 'var(--shadow-md)',
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
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={compact ? 2 : 3}
                    dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: compact ? 3 : 5 }}
                    activeDot={{ r: compact ? 5 : 8 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${compact ? 'mt-2' : 'mt-4'} flex flex-wrap gap-3 justify-center`}>
            {allSubjects.map((subject, index) => (
              <div key={subject} className="flex items-center gap-2">
                <div 
                  className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded-full`} 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{subject}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Tidak ada data untuk {selectedType}
        </div>
      )}
    </div>
  );
}