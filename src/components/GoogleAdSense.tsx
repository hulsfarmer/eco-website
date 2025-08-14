'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAdSenseProps {
  publisherId?: string;
  slot?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID || 'ca-pub-xxxxxxxxx',
  slot = '1234567890',
  format = 'auto',
  style = {},
  className = '',
  responsive = true
}) => {
  const adClientId = publisherId.replace('ca-pub-', '');

  useEffect(() => {
    // AdSense 광고 로드
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        console.log('💰 AdSense ad loaded');
      } catch (error) {
        console.error('❌ AdSense loading error:', error);
      }
    }
  }, []);

  if (!publisherId || publisherId === 'ca-pub-xxxxxxxxx') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 p-4 text-center ${className}`}>
        <p className="text-gray-500 text-sm">AdSense 광고 영역</p>
        <p className="text-xs text-gray-400 mt-1">Publisher ID를 설정해주세요</p>
      </div>
    );
  }

  const adStyle = {
    display: 'block',
    ...style
  };

  return (
    <>
      {/* AdSense 스크립트 로드 */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${adClientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* 광고 컨테이너 */}
      <div className={className}>
        <ins
          className="adsbygoogle"
          style={adStyle}
          data-ad-client={publisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        ></ins>
      </div>
    </>
  );
};

// 다양한 광고 형태의 프리셋 컴포넌트들
export const AdSenseHeaderBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <GoogleAdSense
    slot="1111111111"
    format="horizontal"
    className={`w-full max-w-4xl mx-auto ${className}`}
    style={{ width: '728px', height: '90px' }}
  />
);

export const AdSenseSidebarRectangle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <GoogleAdSense
    slot="2222222222"
    format="rectangle"
    className={`${className}`}
    style={{ width: '300px', height: '250px' }}
  />
);

export const AdSenseInArticle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <GoogleAdSense
    slot="3333333333"
    format="auto"
    className={`my-8 ${className}`}
    responsive={true}
  />
);

export const AdSenseFooterBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <GoogleAdSense
    slot="4444444444"
    format="horizontal"
    className={`w-full max-w-4xl mx-auto ${className}`}
    style={{ width: '728px', height: '90px' }}
  />
);

// 자동 광고 컴포넌트
export const AdSenseAutoAds: React.FC = () => {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID || 'ca-pub-xxxxxxxxx';

  if (!publisherId || publisherId === 'ca-pub-xxxxxxxxx') {
    return null;
  }

  return (
    <Script
      id="adsense-auto-ads"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${publisherId}",
            enable_page_level_ads: true
          });
        `,
      }}
    />
  );
};

export default GoogleAdSense;