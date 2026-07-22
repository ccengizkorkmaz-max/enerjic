'use client';

import { useState, useRef, useEffect } from 'react';
import { generateSocialCaptionsAction } from '@/app/actions/social';
import { Sparkles, Copy, Check, Download, Image as ImageIcon, FileText, Share2, RefreshCw } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface SocialMediaAssistantProps {
  article: Article;
}

export default function SocialMediaAssistant({ article }: SocialMediaAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<{ instagram: string; linkedin: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [template, setTemplate] = useState<'gradient' | 'image'>('gradient');
  const [aspectRatio, setAspectRatio] = useState<'post' | 'story'>('post');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // Generate captions using server action
  const handleGenerateCaptions = async () => {
    setLoading(true);
    try {
      const res = await generateSocialCaptionsAction(article.id);
      if (res.success && res.instagram && res.linkedin) {
        setCaptions({ instagram: res.instagram, linkedin: res.linkedin });
      } else {
        alert(res.error || 'Açıklamalar üretilemedi.');
      }
    } catch (err) {
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `enerjic_${article.id.substring(0, 8)}_${aspectRatio}.jpg`;
    link.href = url;
    link.click();
  };

  // Instagram Flow: Copy text + Download image + Open Instagram
  const shareOnInstagram = () => {
    if (!captions) {
      alert('Lütfen önce "Paylaşım Yazılarını Hazırla" butonuna basarak içerikleri üretin.');
      return;
    }
    
    // 1. Download image
    handleDownload();
    
    // 2. Copy text
    navigator.clipboard.writeText(captions.instagram);
    
    // 3. Status notification
    setShareSuccess('instagram');
    setTimeout(() => setShareSuccess(null), 5000);

    // 4. Open Instagram in a new tab
    window.open('https://www.instagram.com/', '_blank');
  };

  // LinkedIn Flow: Copy text + Open LinkedIn
  const shareOnLinkedIn = () => {
    if (!captions) {
      alert('Lütfen önce "Paylaşım Yazılarını Hazırla" butonuna basarak içerikleri üretin.');
      return;
    }

    // 1. Copy text
    navigator.clipboard.writeText(captions.linkedin);

    // 2. Status notification
    setShareSuccess('linkedin');
    setTimeout(() => setShareSuccess(null), 5000);

    // 3. Open LinkedIn Share
    const shareUrl = `https://www.linkedin.com/feed/`;
    window.open(shareUrl, '_blank');
  };

  // Draw share card on Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = aspectRatio === 'post' ? 1080 : 1080;
    const height = aspectRatio === 'post' ? 1080 : 1920;
    canvas.width = width;
    canvas.height = height;

    if (template === 'gradient' || !article.imageUrl) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#022c22');
      grad.addColorStop(0.5, '#064e3b');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(width * 0.1, height * 0.2, width * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.9, height * 0.8, width * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(5, 150, 105, 0.05)';
      ctx.fill();

      renderTextAndBranding(ctx, width, height);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2;
        } else {
          drawHeight = width / imgRatio;
          offsetY = (height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        const mask = ctx.createLinearGradient(0, 0, 0, height);
        mask.addColorStop(0, 'rgba(2, 44, 34, 0.3)');
        mask.addColorStop(0.5, 'rgba(2, 44, 34, 0.6)');
        mask.addColorStop(1, 'rgba(2, 44, 34, 0.95)');
        ctx.fillStyle = mask;
        ctx.fillRect(0, 0, width, height);

        renderTextAndBranding(ctx, width, height);
      };
      img.onerror = () => {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#022c22');
        grad.addColorStop(1, '#064e3b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        renderTextAndBranding(ctx, width, height);
      };
      img.src = article.imageUrl;
    }
  };

  const renderTextAndBranding = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('ENERJİC', 80, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '300 24px sans-serif';
    ctx.fillText('.COM', 245, 100);

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 130);
    ctx.lineTo(width - 80, 130);
    ctx.stroke();

    const categoryName = article.category.name.toUpperCase();
    ctx.font = 'bold 24px sans-serif';
    const badgeTextWidth = ctx.measureText(categoryName).width;
    const padX = 24;
    const badgeX = 80;
    const badgeY = height * 0.25;

    ctx.fillStyle = '#10b981';
    roundRect(ctx, badgeX, badgeY - 28, badgeTextWidth + padX * 2, 48, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(categoryName, badgeX + padX, badgeY + 4);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px sans-serif';
    const maxTextWidth = width - 160;
    const titleLines = wrapText(ctx, article.title, maxTextWidth);
    
    let currentY = height * 0.38;
    const lineHeight = 74;

    titleLines.forEach((line) => {
      ctx.fillText(line, 80, currentY);
      currentY += lineHeight;
    });

    if (aspectRatio === 'post' || titleLines.length <= 3) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '300 32px sans-serif';
      const summaryLines = wrapText(ctx, article.summary, maxTextWidth);
      currentY += 20;
      summaryLines.slice(0, 3).forEach((line) => {
        ctx.fillText(line, 80, currentY);
        currentY += 46;
      });
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '28px sans-serif';
    ctx.fillText('Temiz Enerji ve Sürdürülebilir Teknolojiler', 80, height - 90);
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  useEffect(() => {
    drawCanvas();
  }, [template, aspectRatio, article]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 mt-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <Share2 className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Sosyal Medya Paylaşım Asistanı</h3>
        </div>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          Pratik Hızlı Paylaşım
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
              <ImageIcon className="w-4 h-4 mr-1.5 text-emerald-600" /> Görsel Paylaşım Kartı
            </h4>
            <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setAspectRatio('post')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  aspectRatio === 'post' ? 'bg-white shadow text-emerald-700' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Gönderi (1:1)
              </button>
              <button
                onClick={() => setAspectRatio('story')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  aspectRatio === 'story' ? 'bg-white shadow text-emerald-700' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Hikaye (9:16)
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
            <div className={`relative bg-gray-950 shadow-md overflow-hidden ${
              aspectRatio === 'post' ? 'w-full max-w-[320px] aspect-square' : 'w-[200px] aspect-[9/16]'
            }`}>
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-gray-50 rounded-xl p-4 border border-gray-100 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Tasarım Teması</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTemplate('gradient')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    template === 'gradient'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Minimalist Degrade
                </button>
                <button
                  onClick={() => setTemplate('image')}
                  disabled={!article.imageUrl}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    !article.imageUrl ? 'opacity-40 cursor-not-allowed' : ''
                  } ${
                    template === 'image'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Fotoğraf Odaklı
                </button>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Görseli İndir</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-emerald-600" /> Paylaşım Açıklamaları (AI)
            </h4>

            {!captions && (
              <button
                onClick={handleGenerateCaptions}
                disabled={loading}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow transition duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{loading ? 'Üretiliyor...' : 'Yazıları Hazırla'}</span>
              </button>
            )}
          </div>

          {captions ? (
            <div className="space-y-6">
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Instagram Paylaşımı</span>
                  <button
                    onClick={() => copyToClipboard(captions.instagram, 'instagram')}
                    className="text-gray-500 hover:text-emerald-600 flex items-center space-x-1 text-xs"
                  >
                    {copiedField === 'instagram' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto pr-1">
                  {captions.instagram}
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">LinkedIn Paylaşımı</span>
                  <button
                    onClick={() => copyToClipboard(captions.linkedin, 'linkedin')}
                    className="text-gray-500 hover:text-emerald-600 flex items-center space-x-1 text-xs"
                  >
                    {copiedField === 'linkedin' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto pr-1">
                  {captions.linkedin}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <button
                  onClick={shareOnInstagram}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow hover:opacity-95 transition cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram'da Paylaş</span>
                </button>

                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center space-x-2 bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow hover:bg-blue-800 transition cursor-pointer"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn'de Paylaş</span>
                </button>
              </div>

              {shareSuccess === 'instagram' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 font-semibold text-center animate-fade-in">
                  🎉 Paylaşım kartı indirildi ve açıklama panoya kopyalandı! Instagram'da "+" butonuna basıp yapıştırabilirsiniz.
                </div>
              )}

              {shareSuccess === 'linkedin' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 font-semibold text-center animate-fade-in">
                  🎉 LinkedIn açıklaması panoya kopyalandı! Açılan sayfada doğrudan yapıştırabilirsiniz.
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleGenerateCaptions}
                  disabled={loading}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{loading ? 'Yeniden üretiliyor...' : 'Paylaşım Yazılarını Yenile'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl p-8 bg-gray-50/50">
              <Sparkles className="w-8 h-8 text-emerald-600 mb-2 opacity-50" />
              <p className="text-xs text-gray-500 text-center max-w-xs mb-4">
                Makale içeriğinden Instagram ve LinkedIn için optimize edilmiş, etkileşimi artıracak paylaşımlar üretmek için butona basın.
              </p>
              <button
                onClick={handleGenerateCaptions}
                disabled={loading}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition duration-200"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                <span>{loading ? 'İçerikler Üretiliyor...' : 'Paylaşım Yazılarını Hazırla'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
