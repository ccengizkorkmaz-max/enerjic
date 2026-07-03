import React from 'react';
import AdSkeleton from './AdSkeleton';

interface InArticleAdProps {
  content: string;
  adPlacement?: any;
}

export default function InArticleAd({ content, adPlacement }: InArticleAdProps) {
  // Split the HTML content by closing paragraph tag </p>
  const paragraphs = content.split('</p>');
  
  if (paragraphs.length <= 3) {
    return (
      <div className="article-content prose max-w-none text-gray-800 leading-relaxed text-lg">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <AdSkeleton slotCode="in_article_p3" placement={adPlacement} />
      </div>
    );
  }

  // Insert the ad after the 3rd paragraph
  // Re-append the closing </p> tag for the sliced portions
  const firstPart = paragraphs.slice(0, 3).join('</p>') + '</p>';
  const secondPart = paragraphs.slice(3).join('</p>');

  return (
    <div className="article-content prose max-w-none text-gray-800 leading-relaxed text-lg">
      <div dangerouslySetInnerHTML={{ __html: firstPart }} />
      <AdSkeleton slotCode="in_article_p3" placement={adPlacement} />
      <div dangerouslySetInnerHTML={{ __html: secondPart }} />
    </div>
  );
}
