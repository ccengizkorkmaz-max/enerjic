import { db } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSEOMetadata } from '@/lib/seo';
import SoftwareUpdateClient from '@/components/SoftwareUpdateClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ brand: string }>;
}

const brandDisplayNames: Record<string, string> = {
  'tesla': 'Tesla',
  'togg': 'Togg',
  'bmw': 'BMW',
  'byd': 'BYD',
  'rivian': 'Rivian',
  'ford': 'Ford',
  'volkswagen': 'Volkswagen',
  'mercedes': 'Mercedes-Benz',
  'hyundai': 'Hyundai',
  'kia': 'Kia',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand } = await params;
  const displayName = brandDisplayNames[brand] || brand.charAt(0).toUpperCase() + brand.slice(1);

  return getSEOMetadata({
    title: `${displayName} Yazılım Güncellemeleri — OTA Sürüm Geçmişi`,
    description: `${displayName} elektrikli araçlarının tüm yazılım güncellemeleri, OTA yamaları ve güvenlik düzeltmeleri. Sürüm notları ve değişiklik geçmişi.`,
    slug: `yazilim-guncellemeleri/${brand}`,
  });
}

async function getBrandUpdates(brandSlug: string) {
  try {
    // Find the actual brand name (case-insensitive match)
    const allUpdates = await db.softwareUpdate.findMany({
      where: { isActive: true },
      orderBy: { releaseDate: 'desc' },
    });

    const brandUpdates = allUpdates.filter(
      u => u.brand.toLowerCase() === brandSlug.toLowerCase()
    );

    return { updates: brandUpdates, allBrands: [...new Set(allUpdates.map(u => u.brand))].sort() };
  } catch {
    return { updates: [], allBrands: [] };
  }
}

export default async function BrandUpdatesPage({ params }: PageProps) {
  const { brand } = await params;
  const { updates, allBrands } = await getBrandUpdates(brand);

  if (updates.length === 0) {
    notFound();
  }

  const displayName = updates[0].brand;
  const totalUpdates = updates.length;
  const latestVersion = updates[0].version;
  const securityFixes = updates.filter(u => u.isSecurityFix).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/yazilim-guncellemeleri" className="hover:text-blue-600 transition-colors">
          Yazılım Güncellemeleri
        </Link>
        <span>›</span>
        <span className="font-semibold text-gray-900">{displayName}</span>
      </nav>

      {/* Brand Hero */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-8 md:p-12">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 text-[200px] font-black text-white/10 leading-none select-none">
            {displayName}
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            {displayName} Yazılım Güncellemeleri
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
              <div className="text-2xl font-black text-white">{totalUpdates}</div>
              <div className="text-xs text-gray-400 font-medium">Toplam Güncelleme</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
              <div className="text-2xl font-black text-white font-mono">{latestVersion}</div>
              <div className="text-xs text-gray-400 font-medium">Son Sürüm</div>
            </div>
            {securityFixes > 0 && (
              <div className="bg-red-500/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-red-400/20">
                <div className="text-2xl font-black text-red-400">{securityFixes}</div>
                <div className="text-xs text-red-300 font-medium">Güvenlik Yaması</div>
              </div>
            )}
          </div>

          {/* Other Brands */}
          <div className="flex flex-wrap gap-2 mt-8">
            <span className="text-xs text-gray-400 font-medium mr-2 self-center">Diğer Markalar:</span>
            {allBrands
              .filter(b => b.toLowerCase() !== brand.toLowerCase())
              .map(b => (
                <Link
                  key={b}
                  href={`/yazilim-guncellemeleri/${encodeURIComponent(b.toLowerCase())}`}
                  className="text-xs font-bold bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/10"
                >
                  {b}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Updates List */}
      <SoftwareUpdateClient updates={updates} brands={[displayName]} />
    </main>
  );
}
