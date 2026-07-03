"use client";

import { useState } from 'react';
import { deleteArticleAction } from '@/app/actions/admin';
import { Trash2 } from 'lucide-react';

interface DeleteArticleButtonProps {
  id: string;
  title: string;
}

export default function DeleteArticleButton({ id, title }: DeleteArticleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm(`"${title}" başlıklı haberi silmek istediğinizden emin misiniz?`)) {
      setLoading(true);
      const res = await deleteArticleAction(id);
      if (!res.success) {
        alert(res.error || 'Silme işlemi başarısız oldu.');
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-650 p-1 transition-colors disabled:opacity-50 cursor-pointer"
      title="Sil"
    >
      <Trash2 className="h-4.5 w-4.5" />
    </button>
  );
}
