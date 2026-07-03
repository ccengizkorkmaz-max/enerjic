import { cookies } from 'next/headers';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/admin';
import { Leaf, LayoutDashboard, PlusCircle, LogOut, Globe, Settings, MessageSquare, Mail, Layers, Zap, Car } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const isAuthenticated = session?.value === 'true';

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-emerald-400" />
                <span className="font-extrabold text-lg tracking-tight text-white">
                  enerjic<span className="text-emerald-400">.panel</span>
                </span>
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Yönetim Paneli</span>
                </Link>
                <Link
                  href="/admin/haber-ekle"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Yeni Haber Ekle</span>
                </Link>
                <Link
                  href="/admin/reklamlar"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Reklam Ayarları</span>
                </Link>
                <Link
                  href="/admin/yorumlar"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Yorumlar</span>
                </Link>
                <Link
                  href="/admin/bulten"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>E-Bülten</span>
                </Link>
                <Link
                  href="/admin/kategoriler"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  <span>Kategoriler</span>
                </Link>
                <Link
                  href="/admin/sarj-istasyonlari"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  <span>Şarj Rehberi</span>
                </Link>
                <Link
                  href="/admin/ev-katalogu"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Car className="h-4 w-4" />
                  <span>EV Kataloğu</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition-all"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Siteyi Görüntüle</span>
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center space-x-1 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-900/30 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Çıkış Yap</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Admin Area */}
      <main className="flex-grow py-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
