import { Student } from '@/types/student';
import { User, School, Mail, BookOpen, Target, GraduationCap } from 'lucide-react';

interface StudentIdentityCardProps {
  student: Student;
}

export function StudentIdentityCard({ student }: StudentIdentityCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        {student.foto ? (
          <img 
            src={student.foto} 
            alt={`Foto ${student.nama}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-16 h-16 rounded-full gradient-primary flex items-center justify-center ${student.foto ? 'hidden' : ''}`}>
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{student.nama}</h2>
          <p className="text-muted-foreground">{student.program} • {student.rumpun}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <GraduationCap className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Kelas</p>
            <p className="font-medium text-foreground">{student.kelas}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <School className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Asal Sekolah</p>
            <p className="font-medium text-foreground">{student.asalSekolah}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">NIS</p>
            <p className="font-medium text-foreground">{student.nis}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{student.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Target PTN</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-card/80 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Pilihan 1</p>
            <p className="font-medium text-foreground text-sm">{student.pilihanPTNPertama}</p>
          </div>
          <div className="bg-card/80 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Pilihan 2</p>
            <p className="font-medium text-foreground text-sm">{student.pilihanPTNKedua}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
