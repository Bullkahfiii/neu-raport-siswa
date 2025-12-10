import { TestScore } from '@/types/student';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ProgressChartProps {
  tkaScores: TestScore[];
  tesEvaluasiScores: TestScore[];
  utbkScores: TestScore[];
  compact?: boolean;
}

export function ProgressChart({ tkaScores, tesEvaluasiScores, utbkScores, compact = false }: ProgressChartProps) {
  const calculateAverage = (scores: TestScore[]) => {
    return scores.map(score => {
      const values = Object.values(score.nilai);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      return {
        tanggal: new Date(score.tanggalTes).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short'
        }),
        namaTes: score.namaTes,
        rataRata: Number(average.toFixed(1))
      };
    });
  };

  const tkaData = calculateAverage(tkaScores);
  const tesEvaluasiData = calculateAverage(tesEvaluasiScores);
  const utbkData = calculateAverage(utbkScores);

  const hasData = tkaData.length > 0 || tesEvaluasiData.length > 0 || utbkData.length > 0;

  if (!hasData) return null;

  const combinedData = [...tkaData.map(d => ({ ...d, type: 'TKA' })),
                        ...tesEvaluasiData.map(d => ({ ...d, type: 'Tes Evaluasi' })),
                        ...utbkData.map(d => ({ ...d, type: 'UTBK' }))]
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  return (
    <div className={`bg-card rounded-xl shadow-card ${compact ? 'p-4' : 'p-6'} animate-slide-up`} style={{ animationDelay: '0.3s' }}>
      <div className={`flex items-center gap-3 ${compact ? 'mb-3' : 'mb-6'}`}>
        <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-accent/10 flex items-center justify-center`}>
          <TrendingUp className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-accent`} />
        </div>
        <h3 className={`${compact ? 'text-base' : 'text-xl'} font-bold text-foreground`}>Grafik Perkembangan Nilai</h3>
      </div>

      <div className={compact ? 'h-48' : 'h-80'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="tanggal" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={compact ? 10 : 12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={compact ? 10 : 12}
              width={30}
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
            
            {tkaData.length > 0 && (
              <Line
                data={tkaData}
                type="monotone"
                dataKey="rataRata"
                name="TKA"
                stroke="hsl(var(--primary))"
                strokeWidth={compact ? 2 : 3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: compact ? 3 : 5 }}
                activeDot={{ r: compact ? 5 : 8 }}
              />
            )}
            
            {tesEvaluasiData.length > 0 && (
              <Line
                data={tesEvaluasiData}
                type="monotone"
                dataKey="rataRata"
                name="Tes Evaluasi"
                stroke="hsl(var(--success))"
                strokeWidth={compact ? 2 : 3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: compact ? 3 : 5 }}
                activeDot={{ r: compact ? 5 : 8 }}
              />
            )}
            
            {utbkData.length > 0 && (
              <Line
                data={utbkData}
                type="monotone"
                dataKey="rataRata"
                name="UTBK"
                stroke="hsl(var(--accent))"
                strokeWidth={compact ? 2 : 3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: compact ? 3 : 5 }}
                activeDot={{ r: compact ? 5 : 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`${compact ? 'mt-2' : 'mt-4'} flex flex-wrap gap-4 justify-center`}>
        {tkaData.length > 0 && (
          <div className="flex items-center gap-2">
            <div className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-primary`} />
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>TKA</span>
          </div>
        )}
        {tesEvaluasiData.length > 0 && (
          <div className="flex items-center gap-2">
            <div className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-success`} />
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Tes Evaluasi</span>
          </div>
        )}
        {utbkData.length > 0 && (
          <div className="flex items-center gap-2">
            <div className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-accent`} />
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>UTBK</span>
          </div>
        )}
      </div>
    </div>
  );
}