"use client";

import { useEffect, useState, useRef } from 'react';

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
  const pushedRef = useRef(false);

  const isActive = placement ? placement.isActive : true;
  const adClient = placement?.adClient || 'ca-pub-3275598773792351';
  const adSlot = placement?.adSlot || '1234567890';
  const minHeight = placement?.minHeight || (slotCode === 'header_banner' ? 90 : 250);

  useEffect(() => {
    // Check if a valid AdSense publisher ID is present
    const isValidPublisherId = Boolean(
      adClient && 
      adClient.startsWith('ca-pub-') && 
      !adClient.includes('xxxxxxxxxxxxxxxx')
    );

    if (isValidPublisherId) {
      setIsAdsenseApproved(true);
      if (!pushedRef.current) {
        try {
          if (typeof window !== 'undefined') {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            pushedRef.current = true;
          }
        } catch (err) {
          console.warn('AdSense push error: ', err);
        }
      }
    }
    setIsLoaded(true);
  }, [adClient, adSlot]);

  if (!isActive) {
    return null;
  }

  let widthClass = 'w-full';
  let labelText = 'Sponsorlu Reklam';
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
        className={`${widthClass} bg-gray-50/50 border border-gray-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden p-2`}
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
            style={{ display: 'block', width: '100%', minHeight: `${minHeight}px` }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
            <iframe
              data-aa="2447062"
              src="https://acceptable.a-ads.com/2447062/?size=Adaptive"
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
      </div>
    </div>
  );
}

