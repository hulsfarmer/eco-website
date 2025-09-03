'use client';

import { useEffect, useState } from 'react';

const AutoNewsUpdater = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 자동으로 RSS 초기화 및 수집 시작
    const initializeNews = async () => {
      try {
        console.log('🚀 Starting automatic news collection...');
        
        // RSS 초기화 및 데이터 수집 시작
        const initResponse = await fetch('/api/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (initResponse.ok) {
          const result = await initResponse.json();
          console.log('✅ News initialization successful:', result.message);
          setIsInitialized(true);
          setLastUpdate(new Date().toISOString());
          
          // 5분 후 추가 수집 트리거 (백그라운드)
          setTimeout(() => {
            fetch('/api/collect', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ taskType: 'rss' }),
            }).catch(error => {
              console.warn('Background news collection failed:', error);
            });
          }, 5 * 60 * 1000);
          
        } else {
          console.warn('News initialization failed:', await initResponse.text());
        }
        
      } catch (error) {
        console.error('News initialization error:', error);
        // 초기화 실패해도 fallback 뉴스는 보여줌
        setIsInitialized(true);
      }
    };

    // 페이지 로드 후 3초 뒤에 초기화 (다른 중요한 로딩 방해하지 않음)
    const timer = setTimeout(initializeNews, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 주기적 업데이트 (30분마다)
  useEffect(() => {
    if (!isInitialized) return;

    const updateInterval = setInterval(async () => {
      try {
        console.log('🔄 Updating news in background...');
        
        await fetch('/api/collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskType: 'rss' }),
        });
        
        setLastUpdate(new Date().toISOString());
        
      } catch (error) {
        console.warn('Periodic news update failed:', error);
      }
    }, 30 * 60 * 1000); // 30분

    return () => clearInterval(updateInterval);
  }, [isInitialized]);

  // UI에는 표시하지 않음 (백그라운드 프로세스)
  return null;
};

export default AutoNewsUpdater;