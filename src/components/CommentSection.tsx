"use client";

import { useState } from 'react';
import { createCommentAction } from '@/app/actions/comments';
import { MessageSquare, User, Calendar, CheckCircle } from 'lucide-react';

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
}

export default function CommentSection({ articleId, comments }: CommentSectionProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.set('authorName', authorName.trim());
    formData.set('authorEmail', authorEmail.trim());
    formData.set('content', content.trim());
    formData.set('consent', consent ? 'true' : 'false');

    const res = await createCommentAction(articleId, formData);

    if (res.success) {
      setSuccess(res.message || 'Yorumunuz başarıyla gönderildi.');
      setAuthorName('');
      setAuthorEmail('');
      setContent('');
      setConsent(false);
      setLoading(false);
    } else {
      setError(res.error || 'Bir hata oluştu.');
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border-t border-gray-100 pt-8 mt-12 space-y-8">
      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="h-5 w-5 text-emerald-600 mr-2" />
          Yorumlar ({comments.length})
        </h3>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900 flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1.5 shrink-0" />
                    {comment.authorName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Bu haber için henüz yorum yapılmamış. İlk yorumu siz yazın!
          </p>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
        <h4 className="text-lg font-bold text-gray-900">Yorum Yazın</h4>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm p-4 rounded-xl flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Teşekkürler!</p>
              <p className="mt-0.5">{success}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-650 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="authorName" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Ad Soyad *
                </label>
                <input
                  id="authorName"
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="İsminiz"
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="authorEmail" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                  E-Posta (Yayınlanmayacak)
                </label>
                <input
                  id="authorEmail"
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="content" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Yorumunuz *
              </label>
              <textarea
                id="content"
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Yorumunuzu buraya yazın..."
                className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start space-x-3 py-1">
              <input
                id="consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="h-4 w-4 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="consent" className="text-xs text-gray-500 leading-normal cursor-pointer select-none">
                <span className="font-semibold text-gray-700">KVKK Onayı:</span> Yorum yaparken paylaştığım kişisel verilerimin, gizlilik ve kullanım şartlarına uygun olarak yorum modifikasyonu amacıyla enerjic.com veritabanında saklanmasını kabul ediyorum.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
