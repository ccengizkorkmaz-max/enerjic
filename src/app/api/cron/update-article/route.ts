import { NextResponse } from 'next/server';
import { ensureRolandBergerArticle } from '@/lib/ensure-roland-berger-article';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureRolandBergerArticle();
    revalidatePath('/');
    revalidatePath('/haber/roland-berger-ev-charging-index-2026-kuresel-sarj-ve-elektrikli-arac-raporu');
    revalidatePath('/kategori/elektrikli-araclar');

    return NextResponse.json({
      success: true,
      message: 'Roland Berger article updated and paths revalidated successfully!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
