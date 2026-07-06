'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-white border border-gray-100 shadow-xl rounded-2xl p-5 z-50 transition-all duration-300 ease-in-out">
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-900">Çerez Tercihleri</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sitemizde size en iyi deneyimi sunabilmek, site trafiğini analiz etmek ve kişiselleştirilmiş reklamlar göstermek için çerezler kullanıyoruz. Daha fazla bilgi için{' '}
            <Link href="/gizlilik-politikasi" className="text-emerald-700 underline hover:text-emerald-800">
              Gizlilik Politikamızı
            </Link>{' '}
            inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-emerald-700 text-white text-xs font-semibold py-2 px-4 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
          >
            Kabul Et
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-gray-50 text-gray-700 text-xs font-semibold py-2 px-4 rounded-xl hover:bg-gray-100 border border-gray-100 transition-colors cursor-pointer"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
