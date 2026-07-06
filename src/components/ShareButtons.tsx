'use client';

import { useState, useEffect } from 'react';
import { Share2, Facebook, Linkedin, Link2, Check, Send } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Safely get window location on client side
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

  // Custom SVG for X (formerly Twitter)
  const XIcon = () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
          <Facebook className="h-4 w-4" />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-blue-700 hover:text-white transition-all duration-300 shadow-sm hover:scale-105 border border-gray-100 cursor-pointer"
          title="LinkedIn'de Paylaş"
        >
          <Linkedin className="h-4 w-4" />
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
