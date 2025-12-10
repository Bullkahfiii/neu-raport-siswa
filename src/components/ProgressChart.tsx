import { TestScore } from '@/types/student';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ProgressChartProps {
  tkaScores: TestScore[];
  tesEvaluasiScores: TestScore[];
  utbkScores: TestScore[];
}

export function ProgressChart({ tkaScores, tesEvaluasiScores, utbkScores }: ProgressChartProps) {
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
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Grafik Perkembangan Nilai</h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="tanggal" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            
            {tkaData.length > 0 && (
              <Line
                data={tkaData}
                type="monotone"
                dataKey="rataRata"
                name="TKA"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            )}
            
            {tesEvaluasiData.length > 0 && (
              <Line
                data={tesEvaluasiData}
                type="monotone"
                dataKey="rataRata"
                name="Tes Evaluasi"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            )}
            
            {utbkData.length > 0 && (
              <Line
                data={utbkData}
                type="monotone"
                dataKey="rataRata"
                name="UTBK"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {tkaData.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">TKA</span>
          </div>
        )}
        {tesEvaluasiData.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Tes Evaluasi</span>
          </div>
        )}
        {utbkData.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">UTBK</span>
          </div>
        )}
      </div>
    </div>
  );
}
