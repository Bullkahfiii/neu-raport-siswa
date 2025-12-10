import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { GraduationCap, Phone, LogIn, BookOpen, Settings, Link, Check, AlertCircle } from 'lucide-react';
import { loginByPhone, isAppsScriptConfigured, setAppsScriptUrl, getAppsScriptUrl } from '@/services/googleSheetsApi';
import { getStudentByPhone } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Login() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsConfigured(isAppsScriptConfigured());
    setScriptUrl(getAppsScriptUrl());
  }, []);

  const handleSaveConfig = () => {
    if (scriptUrl && scriptUrl.includes('script.google.com')) {
      setAppsScriptUrl(scriptUrl);
      setIsConfigured(true);
      setIsDialogOpen(false);
      toast.success('Konfigurasi berhasil disimpan!');
    } else {
      toast.error('URL tidak valid. Pastikan URL dari Google Apps Script.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isConfigured) {
        // Use real API
        const result = await loginByPhone(phone);
        
        if (result.success && result.data) {
          localStorage.setItem('loggedInStudent', JSON.stringify(result.data));
          localStorage.setItem('loggedInPhone', phone);
          toast.success(`Selamat datang, ${result.data.nama}!`);
          navigate('/dashboard');
        } else {
          toast.error(result.error || 'Login gagal. Silakan coba lagi.');
        }
      } else {
        // Use mock data for demo
        await new Promise(resolve => setTimeout(resolve, 800));
        const student = getStudentByPhone(phone);
        
        if (student) {
          localStorage.setItem('loggedInStudent', JSON.stringify(student));
          localStorage.setItem('loggedInPhone', phone);
          toast.success(`Selamat datang, ${student.nama}!`);
          navigate('/dashboard');
        } else {
          toast.error('Nomor WhatsApp tidak ditemukan. Silakan coba lagi.');
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">E-Raport Siswa</h1>
              <p className="text-sm text-muted-foreground">Portal Akademik Digital</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Konfigurasi Google Sheets
                </DialogTitle>
                <DialogDescription>
                  Masukkan URL Web App dari Google Apps Script untuk menghubungkan ke spreadsheet Anda.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    URL Google Apps Script Web App
                  </label>
                  <Input
                    placeholder="https://script.google.com/macros/s/..."
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL ini didapat setelah deploy Apps Script sebagai Web App
                  </p>
                </div>

                <div className={`p-3 rounded-lg flex items-start gap-3 ${isConfigured ? 'bg-success/10' : 'bg-warning/10'}`}>
                  {isConfigured ? (
                    <>
                      <Check className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-success">Terhubung</p>
                        <p className="text-xs text-muted-foreground">Aplikasi terhubung ke Google Sheets</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning">Belum Terhubung</p>
                        <p className="text-xs text-muted-foreground">Aplikasi menggunakan data demo</p>
                      </div>
                    </>
                  )}
                </div>

                <Button onClick={handleSaveConfig} className="w-full" variant="gradient">
                  Simpan Konfigurasi
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full gradient-hero mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Masuk ke Raport</h2>
              <p className="text-muted-foreground">
                Gunakan nomor WhatsApp yang terdaftar untuk melihat raport Anda
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan nomor tanpa tanda + atau spasi
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="gradient"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Masuk
                  </span>
                )}
              </Button>
            </form>

            {!isConfigured && (
              <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Demo:</strong> Gunakan nomor <code className="bg-muted px-2 py-1 rounded text-primary font-mono">081234567890</code> untuk mencoba
                </p>
              </div>
            )}

            <div className={`mt-4 p-3 rounded-lg text-center ${isConfigured ? 'bg-success/10' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                {isConfigured ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">Terhubung ke Google Sheets</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    <span>Klik ikon settings untuk menghubungkan ke Google Sheets</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>© 2024 E-Raport Siswa. All rights reserved.</p>
      </footer>
    </div>
  );
}
