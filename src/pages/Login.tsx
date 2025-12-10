import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Phone, LogIn } from 'lucide-react';
import { loginByPhone } from '@/services/googleSheetsApi';
import logo from '@/assets/logo.png';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginByPhone(phone);
      
      if (result.success && result.data) {
        localStorage.setItem('loggedInStudent', JSON.stringify(result.data));
        localStorage.setItem('loggedInPhone', phone);
        toast.success(`Selamat datang, ${result.data.nama}!`);
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login gagal. Silakan coba lagi.');
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
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-xl object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">E-Raport Siswa</h1>
              <p className="text-sm text-muted-foreground">Portal Akademik Digital</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <img src={logo} alt="Logo" className="w-24 h-24 rounded-full mx-auto mb-4 object-contain shadow-lg" />
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