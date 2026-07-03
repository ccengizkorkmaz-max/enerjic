"use client";

import { useEffect, useState } from 'react';

interface AdPlacement {
  slotCode: string;
  adClient: string;
  adSlot: string;
  minHeight: number;
  isActive: boolean;
}

interface AdSkeletonProps {
  slotCode: string;
  placement?: AdPlacement | null;
}

export default function AdSkeleton({
  slotCode,
  placement,
}: AdSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const isActive = placement ? placement.isActive : true;
  const adClient = placement ? placement.adClient : 'ca-pub-xxxxxxxxxxxxxxxx';
  const adSlot = placement ? placement.adSlot : '1234567890';
  const minHeight = placement ? placement.minHeight : (slotCode === 'header_banner' ? 90 : 250);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        setIsLoaded(true);
      }
    } catch (err) {
      console.warn('AdSense push error: ', err);
    }
  }, []);

  if (!isActive) {
    return null;
  }

  let widthClass = 'w-full';
  let labelText = 'Yazı İçi Reklam';

  if (slotCode === 'header_banner') {
    widthClass = 'max-w-[728px] mx-auto w-full';
    labelText = 'Header Banner Reklamı';
  } else if (slotCode === 'sidebar_top') {
    widthClass = 'w-[300px] mx-auto';
    labelText = 'Sponsorlu Bağlantı';
  } else if (slotCode === 'in_article_p3') {
    widthClass = 'w-full';
    labelText = 'Yazı İçi Reklam';
  }

  return (
    <div className={`relative ${widthClass} my-6 transition-all duration-300`}>
      <div 
        style={{ minHeight: `${minHeight}px` }}
        className={`${widthClass} bg-gray-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden`}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent -translate-x-full animate-shimmer" />
        )}
        
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 z-10 select-none">
          {labelText}
        </span>

        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: `${minHeight}px` }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        <div className="absolute bottom-2 right-2 bg-emerald-50 text-[10px] text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-200 z-10 select-none">
          AdSense Ready
        </div>
      </div>
    </div>
  );
}
