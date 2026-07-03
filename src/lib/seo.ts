import { Metadata } from 'next';

interface SEOOptions {
  title?: string;
  description?: string;
  slug?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
  publishedTime?: string;
}

export function getSEOMetadata(options: SEOOptions = {}): Metadata {
  const siteName = 'Enerjic';
  const defaultTitle = 'Enerjic - Temiz Enerji ve Sürdürülebilir Teknolojiler';
  const defaultDesc = 'Elektrikli araçlar, temiz enerji, girişimcilik, SaaS ve trend yeşil teknolojiler üzerine Türkiye’nin yeni nesil bilgi kaynağı.';
  const defaultUrl = 'https://enerjic.com';
  const defaultImage = `${defaultUrl}/og-image.jpg`;

  const title = options.title ? `${options.title} | ${siteName}` : defaultTitle;
  const description = options.description || defaultDesc;
  const url = options.slug ? `${defaultUrl}/${options.slug}` : defaultUrl;
  const image = options.imageUrl || defaultImage;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: 'tr_TR',
      type: options.type || 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: options.title || siteName,
        },
      ],
      ...(options.type === 'article' && options.publishedTime
        ? {
            publishedTime: options.publishedTime,
            authors: ['Enerjic Editör'],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
