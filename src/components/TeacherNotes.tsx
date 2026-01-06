import { MessageSquareText } from 'lucide-react';

export interface TeacherNote {
  namaSiswa: string;
  tanggal: string;
  catatan: string;
  waliKelas?: string;
}

interface TeacherNotesProps {
  notes: TeacherNote[];
}

export function TeacherNotes({ notes }: TeacherNotesProps) {
  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center">
          <MessageSquareText className="w-5 h-5 text-purple" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Catatan Wali Kelas
        </h3>
      </div>

      {/* Content */}
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-muted/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {new Date(note.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                {note.waliKelas && (
                  <span className="text-xs bg-purple/10 text-purple px-2 py-1 rounded-full">
                    {note.waliKelas}
                  </span>
                )}
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {note.catatan}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Belum ada catatan dari wali kelas
        </div>
      )}
    </div>
  );
}
