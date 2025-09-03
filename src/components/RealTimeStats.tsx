'use client';

import React, { useState, useEffect } from 'react';
import { usePageViews } from '@/lib/page-views';

const RealTimeStats = () => {
  const { getTotalViews, getActiveUsers, getTodayViews } = usePageViews();
  const [stats, setStats] = useState({
    totalViews: 0,
    activeUsers: 0,
    todayViews: 0,
    isLoading: true,
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 통계 로드
    const loadStats = () => {
      setStats({
        totalViews: getTotalViews(),
        activeUsers: getActiveUsers(),
        todayViews: getTodayViews(),
        isLoading: false,
      });
    };

    loadStats();

    // 실시간 업데이트 시뮬레이션 (30초마다)
    const interval = setInterval(() => {
      setStats(prev => ({
        totalViews: prev.totalViews + Math.floor(Math.random() * 3), // 0-2 증가
        activeUsers: getActiveUsers(), // 활성 사용자는 변동
        todayViews: prev.todayViews + Math.floor(Math.random() * 5), // 0-4 증가
        isLoading: false,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [getTotalViews, getActiveUsers, getTodayViews]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  if (stats.isLoading) {
    return (
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-18"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6 text-sm">
      {/* 총 조회수 */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <span className="text-2xl">👥</span>
          <div className="ml-2">
            <div className="text-gray-900 font-semibold">
              {formatNumber(stats.totalViews)}
            </div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>
        </div>
      </div>

      {/* 오늘 조회수 */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <span className="text-2xl">📈</span>
          <div className="ml-2">
            <div className="text-gray-900 font-semibold">
              {formatNumber(stats.todayViews)}
            </div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
        </div>
      </div>

      {/* 실시간 활성 사용자 */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <div className="relative">
            <span className="text-2xl">🔴</span>
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="ml-2">
            <div className="text-gray-900 font-semibold">
              {stats.activeUsers}
            </div>
            <div className="text-xs text-gray-500">Online Now</div>
          </div>
        </div>
      </div>

      {/* 실시간 표시기 */}
      <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-700 font-medium">LIVE</span>
      </div>
    </div>
  );
};

// 간단한 페이지 뷰 카운터 컴포넌트
export const PageViewCounter = ({ path }: { path: string }) => {
  const { getViews, trackView } = usePageViews();
  const [views, setViews] = useState(0);

  useEffect(() => {
    // 페이지 뷰 추적 및 표시
    const newViews = trackView(path);
    setViews(newViews);
  }, [path, trackView]);

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-500">
      <span>👁️</span>
      <span>{views.toLocaleString()} views</span>
    </div>
  );
};

// 인기 페이지 위젯
export const PopularPagesWidget = () => {
  const { getPopularPages } = usePageViews();
  const [pages, setPages] = useState<Array<{path: string; views: number; title: string}>>([]);

  useEffect(() => {
    setPages(getPopularPages());
  }, [getPopularPages]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        🔥 Most Popular Pages
      </h3>
      <div className="space-y-3">
        {pages.slice(0, 5).map((page, index) => (
          <div key={page.path} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
              <span className="text-sm text-gray-900">{page.title}</span>
            </div>
            <div className="text-sm text-gray-500">
              {(page.views / 1000).toFixed(1)}K views
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeStats;