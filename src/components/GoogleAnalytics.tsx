'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  gtag?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  gtag = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXX' 
}) => {
  useEffect(() => {
    // Google Analytics 초기화
    if (typeof window !== 'undefined' && gtag) {
      // gtag 함수 정의
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtagFunction(...args: any[]) {
        (window as any).dataLayer.push(arguments);
      }
      (window as any).gtag = gtagFunction;

      // Google Analytics 설정
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', gtag, {
        page_title: document.title,
        page_location: window.location.href,
      });

      console.log('📊 Google Analytics initialized:', gtag);
    }
  }, [gtag]);

  // 페이지뷰 추적
  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', gtag, {
        page_path: url,
      });
    }
  };

  // 커스텀 이벤트 추적
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // 전환 추적
  const trackConversion = (conversionId: string, transactionId?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: conversionId,
        transaction_id: transactionId,
      });
    }
  };

  // 이커머스 이벤트 추적
  const trackPurchase = (transactionData: {
    transaction_id: string;
    value: number;
    currency: string;
    items: Array<{
      item_id: string;
      item_name: string;
      category: string;
      quantity: number;
      price: number;
    }>;
  }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionData.transaction_id,
        value: transactionData.value,
        currency: transactionData.currency,
        items: transactionData.items,
      });
    }
  };

  // 글로벌 함수로 노출 (다른 컴포넌트에서 사용 가능)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackPageView = trackPageView;
      (window as any).trackEvent = trackEvent;
      (window as any).trackConversion = trackConversion;
      (window as any).trackPurchase = trackPurchase;
    }
  }, []);

  if (!gtag || gtag === 'G-XXXXXXXXX') {
    console.warn('⚠️ Google Analytics ID not configured');
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;