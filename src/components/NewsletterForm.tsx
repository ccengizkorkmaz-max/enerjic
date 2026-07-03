"use client";

import { useState } from 'react';
import { subscribeNewsletterAction } from '@/app/actions/newsletter';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterFormProps {
  layout?: 'sidebar' | 'footer';
}

export default function NewsletterForm({ layout = 'sidebar' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.set('email', email.trim());

    const res = await subscribeNewsletterAction(formData);

    if (res.success) {
      setSuccess(res.message || 'Başarıyla abone olundu.');
      setEmail('');
      setLoading(false);
    } else {
      setError(res.error || 'Abonelik sırasında bir hata oluştu.');
      setLoading(false);
    }
  };

  if (layout === 'footer') {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
          <Mail className="h-4 w-4 text-emerald-400 mr-1.5 shrink-0" />
          E-Bültene Abone Olun
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          En son temiz enerji ve teknoloji haberleri haftalık olarak e-posta adresinize gelsin.
        </p>

        {success ? (
          <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-300 text-xs p-3 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            {error && (
              <div className="bg-red-950/40 border border-red-900 text-red-300 text-xs p-2 rounded-lg flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {loading ? '...' : 'Abone Ol'}
              </button>
            </div>
            <div className="text-[10px] text-gray-500 leading-tight">
              Kayıt olarak haftalık bülten gönderimini ve KVKK gizlilik politikasını onaylamış olursunuz.
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-gray-900 text-sm">Haftalık E-Bülten</h4>
          <p className="text-xs text-gray-500">Enerji gündemini kaçırmayın</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed font-medium">
        Temiz enerji, elektrikli araçlar ve sürdürülebilirlik alanındaki en son haberleri haftalık olarak posta kutunuza ulaştırıyoruz.
      </p>

      {success ? (
        <div className="bg-emerald-100/60 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-650 shrink-0 mt-0.5" />
          <span className="font-semibold">{success}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-2.5 rounded-xl flex items-start space-x-1.5">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Abone Yapılıyor...' : 'Abone Ol'}
          </button>
          <div className="text-[9px] text-gray-450 leading-tight text-center">
            Abonelikle birlikte <a href="/gizlilik-politikasi" className="underline hover:text-emerald-700">KVKK politikamızı</a> kabul etmiş olursunuz.
          </div>
        </form>
      )}
    </div>
  );
}
