import { db } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSEOMetadata } from '@/lib/seo';
import SoftwareUpdateClient from '@/components/SoftwareUpdateClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getSEOMetadata({
    title: 'EV Yazılım Güncellemeleri — OTA Sürüm Takibi',
    description: 'Tesla, Togg, BMW, BYD, Rivian ve Ford dahil tüm elektrikli araç markalarının en güncel yazılım güncellemeleri, OTA yamaları ve sürüm notları.',
    slug: 'yazilim-guncellemeleri',
  });
}

async function getUpdates() {
  try {
    const updates = await db.softwareUpdate.findMany({
      where: { isActive: true },
      orderBy: { releaseDate: 'desc' },
    });
    return updates;
  } catch {
    return [];
  }
}

export default async function SoftwareUpdatesPage() {
  const updates = await getUpdates();

  // Get unique brands for filter
  const brands = [...new Set(updates.map(u => u.brand))].sort();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.3) 0%, transparent 50%)' }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 backdrop-blur-sm p-2.5 rounded-xl border border-blue-400/20">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
              OTA Takip Merkezi
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            EV Yazılım Güncellemeleri
          </h1>
          <p className="text-blue-200/80 text-base md:text-lg max-w-2xl">
            Elektrikli araç markalarının en güncel OTA yazılım güncellemeleri, güvenlik yamaları ve sürüm notlarını tek merkezden takip edin.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {brands.map(brand => (
              <Link
                key={brand}
                href={`/yazilim-guncellemeleri/${encodeURIComponent(brand.toLowerCase())}`}
                className="text-xs font-bold bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/10"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Client Component with Filters */}
      <SoftwareUpdateClient updates={updates} brands={brands} />
    </main>
  );
}
