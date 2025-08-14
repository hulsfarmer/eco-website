import { NextRequest, NextResponse } from 'next/server';
import RevenueOptimizer from '@/lib/revenue-optimizer';
import AnalyticsManager from '@/lib/analytics-manager';
import AffiliateTrackingSystem from '@/lib/affiliate-tracking';

const revenueOptimizer = new RevenueOptimizer();
const analyticsManager = new AnalyticsManager();
const affiliateTracker = new AffiliateTrackingSystem();

// 수익 최적화 및 분석 API
export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json();
    
    console.log(`💰 Revenue API called: ${action}`);
    let results;

    switch (action) {
      case 'optimize_revenue':
        results = await revenueOptimizer.optimizeRevenue();
        break;

      case 'generate_report':
        const days = params?.days || 30;
        results = await revenueOptimizer.generateRevenueReport(days);
        break;

      case 'run_ab_tests':
        results = await revenueOptimizer.runRevenueABTests();
        break;

      case 'get_seasonal_strategy':
        results = await revenueOptimizer.getSeasonalRevenueStrategy();
        break;

      case 'track_adsense_performance':
        if (!params?.impressions || !params?.clicks) {
          return NextResponse.json({
            success: false,
            message: 'Missing required AdSense metrics: impressions, clicks'
          }, { status: 400 });
        }

        // AdSense 성과 추적
        const rpm = (params.revenue || 0) / (params.impressions / 1000);
        const ctr = params.clicks / params.impressions;
        
        results = {
          rpm,
          ctr,
          estimated_revenue: params.revenue || (rpm * (params.impressions / 1000)),
          optimization_score: rpm > 15 ? 'Good' : rpm > 10 ? 'Average' : 'Needs Improvement'
        };
        break;

      case 'optimize_ad_placement':
        const contentData = params?.contentData || [];
        const revenueData = params?.revenueData || {};
        results = await revenueOptimizer.optimizeAdPlacements(contentData, revenueData);
        break;

      case 'analyze_affiliate_performance':
        results = await affiliateTracker.analyzeAffiliatePerformance(params?.days || 30);
        break;

      default:
        return NextResponse.json({
          success: false,
          message: `Unknown action: ${action}`,
          availableActions: [
            'optimize_revenue', 'generate_report', 'run_ab_tests', 
            'get_seasonal_strategy', 'track_adsense_performance', 
            'optimize_ad_placement', 'analyze_affiliate_performance'
          ]
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action: action,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Revenue API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Revenue operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 수익 데이터 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';
    const days = parseInt(searchParams.get('days') || '30');
    
    let data;

    switch (type) {
      case 'dashboard':
        // 종합 수익 대시보드
        const [revenueReport, affiliatePerformance, optimization] = await Promise.all([
          revenueOptimizer.generateRevenueReport(days),
          affiliateTracker.analyzeAffiliatePerformance(days),
          revenueOptimizer.optimizeRevenue()
        ]);

        data = {
          overview: {
            totalRevenue: revenueReport.totalRevenue,
            growth: revenueReport.growth,
            optimizationScore: revenueReport.optimizationScore
          },
          revenueBreakdown: revenueReport.breakdown,
          topPerformers: revenueReport.topPerformers,
          affiliatePrograms: affiliatePerformance,
          optimizationOpportunities: {
            adPlacement: optimization.adPlacement,
            affiliateOpportunities: optimization.affiliateOpportunities,
            contentMonetization: optimization.contentMonetization
          },
          realTimeMetrics: await generateRealTimeRevenueMetrics()
        };
        break;

      case 'adsense':
        data = await generateAdSenseAnalytics(days);
        break;

      case 'affiliate':
        data = await affiliateTracker.analyzeAffiliatePerformance(days);
        break;

      case 'optimization':
        data = await revenueOptimizer.optimizeRevenue();
        break;

      case 'seasonal':
        data = await revenueOptimizer.getSeasonalRevenueStrategy();
        break;

      case 'comparison':
        // 기간별 수익 비교
        const [currentPeriod, previousPeriod] = await Promise.all([
          revenueOptimizer.generateRevenueReport(days),
          revenueOptimizer.generateRevenueReport(days * 2) // 이전 기간
        ]);

        data = {
          current: currentPeriod,
          previous: {
            ...previousPeriod,
            totalRevenue: previousPeriod.totalRevenue * 0.85, // Mock 이전 기간 수익
          },
          growth: {
            revenue: (currentPeriod.totalRevenue - (previousPeriod.totalRevenue * 0.85)) / (previousPeriod.totalRevenue * 0.85),
            adsense: Math.random() * 0.3 - 0.1, // -10% to +20%
            affiliate: Math.random() * 0.4 - 0.1, // -10% to +30%
          }
        };
        break;

      case 'forecast':
        data = await generateRevenueForecast(days);
        break;

      default:
        return NextResponse.json({
          success: false,
          message: `Unknown type: ${type}`,
          availableTypes: [
            'dashboard', 'adsense', 'affiliate', 'optimization', 
            'seasonal', 'comparison', 'forecast'
          ]
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      type: type,
      period: `${days} days`,
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Revenue data API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch revenue data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// === 헬퍼 함수들 ===

async function generateRealTimeRevenueMetrics(): Promise<any> {
  return {
    todayRevenue: Math.floor(Math.random() * 150) + 50,
    activeUsers: Math.floor(Math.random() * 200) + 100,
    adImpressions: Math.floor(Math.random() * 5000) + 2000,
    affiliateClicks: Math.floor(Math.random() * 50) + 20,
    conversionRate: Math.random() * 0.05 + 0.02,
    topEarningPage: {
      url: '/reviews/best-solar-panels-2024',
      revenue: Math.floor(Math.random() * 25) + 15,
      type: 'affiliate'
    }
  };
}

async function generateAdSenseAnalytics(days: number): Promise<any> {
  const impressions = Math.floor(Math.random() * 50000) + 25000;
  const clicks = Math.floor(impressions * (Math.random() * 0.02 + 0.01));
  const revenue = Math.floor(Math.random() * 800) + 400;

  return {
    period: `${days} days`,
    impressions,
    clicks,
    ctr: clicks / impressions,
    revenue,
    rpm: (revenue / impressions) * 1000,
    topPerformingUnits: [
      { unit: 'Header Banner', revenue: revenue * 0.4, ctr: 0.025 },
      { unit: 'Sidebar Rectangle', revenue: revenue * 0.35, ctr: 0.018 },
      { unit: 'In-Article Native', revenue: revenue * 0.25, ctr: 0.032 }
    ],
    recommendations: [
      'Consider removing footer ads due to low CTR',
      'Test sticky sidebar for better viewability',
      'Implement lazy loading for better Core Web Vitals'
    ]
  };
}

async function generateRevenueForecast(days: number): Promise<any> {
  const baseRevenue = Math.floor(Math.random() * 3000) + 2000;
  
  // 다음 30일 예측
  const forecast = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    
    // 계절적 요인 + 성장 트렌드 + 랜덤 변동
    const seasonalFactor = 1 + Math.sin((date.getMonth() + i/30) * Math.PI / 6) * 0.1;
    const growthFactor = 1 + (i * 0.002); // 월 6% 성장
    const randomFactor = 1 + (Math.random() - 0.5) * 0.2;
    
    const dailyRevenue = (baseRevenue / 30) * seasonalFactor * growthFactor * randomFactor;
    
    return {
      date: date.toISOString().split('T')[0],
      revenue: Math.round(dailyRevenue * 100) / 100,
      confidence: Math.max(0.6, 1 - (i * 0.01)) // 신뢰도는 시간이 지날수록 감소
    };
  });

  const totalForecast = forecast.reduce((sum, day) => sum + day.revenue, 0);
  const currentRevenue = baseRevenue;
  const expectedGrowth = (totalForecast - currentRevenue) / currentRevenue;

  return {
    period: '30 days forecast',
    currentRevenue,
    forecastRevenue: totalForecast,
    expectedGrowth,
    dailyForecast: forecast,
    factors: [
      { name: 'Seasonal trends', impact: 0.15, description: 'Winter holiday boost expected' },
      { name: 'Content growth', impact: 0.12, description: 'New articles driving traffic' },
      { name: 'SEO improvements', impact: 0.08, description: 'Better search rankings' },
      { name: 'Affiliate optimization', impact: 0.10, description: 'Higher converting programs' }
    ]
  };
}