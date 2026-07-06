'use client';

import { useState, useEffect } from 'react';
import { Share2, Link2, Check, Send } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Custom SVG icons for social platforms not in lucide-react
  const XIcon = () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-y border-gray-100 my-6">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" /> Paylaş:
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:scale-105 border border-gray-100 cursor-pointer"
          title="X'te Paylaş"
        >
          <XIcon />
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-105 border border-gray-100 cursor-pointer"
          title="Facebook'ta Paylaş"
        >
          <FacebookIcon />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-blue-700 hover:text-white transition-all duration-300 shadow-sm hover:scale-105 border border-gray-100 cursor-pointer"
          title="LinkedIn'de Paylaş"
        >
          <LinkedinIcon />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-105 border border-gray-100 cursor-pointer"
          title="WhatsApp'ta Gönder"
        >
          <Send className="h-4 w-4 -rotate-45 relative left-0.5 bottom-0.5" />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-emerald-700 hover:text-white transition-all duration-300 shadow-sm hover:scale-105 border border-gray-100 cursor-pointer text-xs font-semibold"
          title="Bağlantıyı Kopyala"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Kopyalandı!</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" />
              <span>Kopyala</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
