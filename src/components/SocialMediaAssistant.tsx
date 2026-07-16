'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  generateSocialCaptionsAction, 
  checkInstagramConnectionAction, 
  disconnectInstagramAction,
  publishToInstagramAction 
} from '@/app/actions/social';
import { Sparkles, Copy, Check, Download, Image as ImageIcon, FileText, Share2, Link2, Unlink, RefreshCw } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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

  // Instagram Connection States
  const [igConnected, setIgConnected] = useState(false);
  const [igAccountName, setIgAccountName] = useState('');
  const [checkingIg, setCheckingIg] = useState(true);
  const [publishingToIg, setPublishingToIg] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState('');

  // Check Instagram connection status on load
  const checkConnection = async () => {
    setCheckingIg(true);
    try {
      const res = await checkInstagramConnectionAction();
      if (res.connected && res.accountName) {
        setIgConnected(true);
        setIgAccountName(res.accountName);
      } else {
        setIgConnected(false);
      }
    } catch (err) {
      setIgConnected(false);
    } finally {
      setCheckingIg(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleDisconnect = async () => {
    if (!confirm('Instagram bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
      const res = await disconnectInstagramAction();
      if (res.success) {
        setIgConnected(false);
        setIgAccountName('');
      } else {
        alert('Bağlantı kesilemedi.');
      }
    } catch (err) {
      alert('Hata oluştu.');
    }
  };

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

  // Direct publish to Instagram
  const handleDirectPublish = async () => {
    if (!canvasRef.current) return;
    if (!captions) {
      alert('Öncelikle paylaşım yazılarını hazırlamalısınız.');
      return;
    }

    setPublishingToIg(true);
    setPublishSuccess(false);
    setPublishError('');

    try {
      const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.95);
      const res = await publishToInstagramAction(base64Image, captions.instagram);
      
      if (res.success) {
        setPublishSuccess(true);
      } else {
        setPublishError(res.error || 'Paylaşım yapılamadı.');
      }
    } catch (err: any) {
      setPublishError(err.message || 'Bilinmeyen bir hata oluştu.');
    } finally {
      setPublishingToIg(false);
    }
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

    // 1. Draw Background
    if (template === 'gradient' || !article.imageUrl) {
      // Premium emerald/dark gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#022c22'); // very dark green
      grad.addColorStop(0.5, '#064e3b'); // dark emerald
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Add clean abstract glow circles
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
      // Image template (Full background image with overlay)
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw and cover image
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

        // Koyu degrade maske
        const mask = ctx.createLinearGradient(0, 0, 0, height);
        mask.addColorStop(0, 'rgba(2, 44, 34, 0.3)');
        mask.addColorStop(0.5, 'rgba(2, 44, 34, 0.6)');
        mask.addColorStop(1, 'rgba(2, 44, 34, 0.95)');
        ctx.fillStyle = mask;
        ctx.fillRect(0, 0, width, height);

        renderTextAndBranding(ctx, width, height);
      };
      img.onerror = () => {
        // Fallback to gradient if image fails due to CORS
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
    // Brand header
    ctx.fillStyle = '#10b981'; // Emerald 500
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('ENERJİC', 80, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '300 24px sans-serif';
    ctx.fillText('.COM', 245, 100);

    // Decorative line
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 130);
    ctx.lineTo(width - 80, 130);
    ctx.stroke();

    // Category Badge
    const categoryName = article.category.name.toUpperCase();
    ctx.font = 'bold 24px sans-serif';
    const badgeTextWidth = ctx.measureText(categoryName).width;
    const padX = 24;
    const padY = 14;
    const badgeX = 80;
    const badgeY = height * 0.25;

    // Draw badge background
    ctx.fillStyle = '#10b981';
    roundRect(ctx, badgeX, badgeY - 28, badgeTextWidth + padX * 2, 48, 12);
    ctx.fill();

    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(categoryName, badgeX + padX, badgeY + 4);

    // Draw Main Title
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

    // Draw summary text (if space allows)
    if (aspectRatio === 'post' || titleLines.length <= 3) {
      ctx.fillStyle = '#9ca3af'; // Gray 400
      ctx.font = '300 32px sans-serif';
      const summaryLines = wrapText(ctx, article.summary, maxTextWidth);
      currentY += 20;
      summaryLines.slice(0, 3).forEach((line) => {
        ctx.fillText(line, 80, currentY);
        currentY += 46;
      });
    }

    // Bottom Branding Footer
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

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `enerjic_${article.id.substring(0, 8)}_${aspectRatio}.jpg`;
    link.href = url;
    link.click();
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
          Görsel & Metin Asistanı
        </span>
      </div>

      {/* Connection Widget */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center text-white">
            <InstagramIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">Instagram API Bağlantısı</h4>
            <p className="text-xs text-gray-500">
              {checkingIg ? 'Bağlantı durumu kontrol ediliyor...' : igConnected ? `Bağlı Hesap: ${igAccountName}` : 'Doğrudan otomatik paylaşım için hesabınızı bağlayın.'}
            </p>
          </div>
        </div>

        <div>
          {checkingIg ? (
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          ) : igConnected ? (
            <button
              onClick={handleDisconnect}
              className="flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 font-bold bg-white border border-red-200 px-3.5 py-2 rounded-xl hover:bg-red-50 transition"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Bağlantıyı Kes</span>
            </button>
          ) : (
            <a
              href="/api/social/instagram/auth"
              className="flex items-center space-x-1.5 text-xs text-white font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-2.5 rounded-xl shadow hover:opacity-90 transition"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Instagram Hesabını Bağla</span>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Visual Card Generator */}
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

          {/* Preview Area */}
          <div className="flex justify-center bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
            <div className={`relative bg-gray-950 shadow-md overflow-hidden ${
              aspectRatio === 'post' ? 'w-full max-w-[320px] aspect-square' : 'w-[200px] aspect-[9/16]'
            }`}>
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Design Presets */}
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

        {/* Right Column: AI Caption Generator */}
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
              {/* Instagram Card */}
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

              {/* LinkedIn Card */}
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

              {/* Direct Publish Button */}
              {igConnected && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <button
                    onClick={handleDirectPublish}
                    disabled={publishingToIg}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-95 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition duration-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {publishingToIg ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Instagram'a Yükleniyor...</span>
                      </>
                    ) : (
                      <>
                        <InstagramIcon className="w-5 h-5" />
                        <span>Instagram'da Hemen Paylaş</span>
                      </>
                    )}
                  </button>

                  {publishSuccess && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center text-xs font-bold text-emerald-700">
                      🎉 Paylaşım başarıyla yapıldı! Instagram hesabınızı kontrol edebilirsiniz.
                    </div>
                  )}

                  {publishError && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 text-center text-xs font-bold text-red-700">
                      ❌ Hata: {publishError}
                    </div>
                  )}
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
