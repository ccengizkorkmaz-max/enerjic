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
  const [isAdsenseApproved, setIsAdsenseApproved] = useState(false);

  const isActive = placement ? placement.isActive : true;
  const adClient = placement ? placement.adClient : 'ca-pub-xxxxxxxxxxxxxxxx';
  const adSlot = placement ? placement.adSlot : '1234567890';
  const minHeight = placement ? placement.minHeight : (slotCode === 'header_banner' ? 90 : 250);

  useEffect(() => {
    // Check if the client is using the real approved publisher ID
    if (adClient && adClient !== 'ca-pub-xxxxxxxxxxxxxxxx' && adClient.includes('3275598773792351')) {
      setIsAdsenseApproved(true);
      try {
        if (typeof window !== 'undefined') {
          const adsbygoogle = (window as any).adsbygoogle || [];
          adsbygoogle.push({});
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn('AdSense push error: ', err);
      }
    } else {
      setIsLoaded(true);
    }
  }, [adClient]);

  if (!isActive) {
    return null;
  }

  let widthClass = 'w-full';
  let labelText = 'Sponsorlu Reklam';
  // Use user's official Adaptive A-Ads ID
  const fallbackIframeSrc = 'https://acceptable.a-ads.com/2447062/?size=Adaptive';
  let iframeHeight = '250';

  if (slotCode === 'header_banner') {
    widthClass = 'max-w-[728px] mx-auto w-full';
    labelText = 'Sponsorlu Reklam';
    iframeHeight = '90';
  } else if (slotCode === 'sidebar_top') {
    widthClass = 'w-[300px] mx-auto';
    labelText = 'Sponsorlu Reklam';
    iframeHeight = '250';
  } else if (slotCode === 'in_article_p3') {
    widthClass = 'w-full';
    labelText = 'Sponsorlu Reklam';
    iframeHeight = '90';
  }

  return (
    <div className={`relative ${widthClass} my-6 transition-all duration-300`}>
      <div 
        style={{ minHeight: `${minHeight}px` }}
        className={`${widthClass} bg-gray-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden p-2`}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent -translate-x-full animate-shimmer" />
        )}
        
        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2 z-10 select-none block text-center w-full">
          {labelText}
        </span>

        {isAdsenseApproved ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: `${minHeight}px` }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
            <iframe
              data-aa="2447062"
              src={fallbackIframeSrc}
              style={{
                border: '0px',
                padding: '0',
                width: '70%',
                height: `${iframeHeight}px`,
                overflow: 'hidden',
                display: 'block',
                margin: 'auto',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        )}

        {isAdsenseApproved && (
          <div className="absolute bottom-1 right-2 bg-emerald-50 text-[8px] text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100 z-10 select-none">
            AdSense Active
          </div>
        )}
      </div>
    </div>
  );
}
