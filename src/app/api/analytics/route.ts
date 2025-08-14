import { NextRequest, NextResponse } from 'next/server';
import AnalyticsManager from '@/lib/analytics-manager';

const analyticsManager = new AnalyticsManager();

// 이벤트 추적 및 분석 데이터 제출
export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    let results;
    
    switch (action) {
      case 'track_event':
        if (!data?.eventType || !data?.page) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: eventType, page'
          }, { status: 400 });
        }
        
        await analyticsManager.trackEvent({
          eventType: data.eventType,
          userId: data.userId,
          sessionId: data.sessionId || `session_${Date.now()}`,
          page: data.page,
          title: data.title,
          category: data.category,
          metadata: data.metadata,
          timestamp: new Date(),
          userAgent: request.headers.get('user-agent') || undefined,
          referrer: data.referrer,
          ip: request.ip
        });
        
        results = { message: 'Event tracked successfully' };
        break;
        
      case 'create_ab_test':
        if (!data?.name || !data?.variants || !data?.metric) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: name, variants, metric'
          }, { status: 400 });
        }
        
        results = await analyticsManager.createABTest({
          name: data.name,
          variants: data.variants,
          metric: data.metric,
          trafficSplit: data.trafficSplit
        });
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: `Unknown action: ${action}`,
          availableActions: ['track_event', 'create_ab_test']
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      action: action,
      data: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`❌ Analytics POST API error:`, error);
    
    return NextResponse.json({
      success: false,
      message: 'Analytics operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 분석 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';
    const days = parseInt(searchParams.get('days') || '7');
    const testId = searchParams.get('testId');
    
    let data;
    
    switch (type) {
      case 'dashboard':
        data = await analyticsManager.generatePerformanceDashboard(days);
        break;
        
      case 'content_performance':
        data = await analyticsManager.analyzeContentPerformance(days);
        break;
        
      case 'seo':
        data = await analyticsManager.analyzeSEOPerformance();
        break;
        
      case 'revenue':
        data = await analyticsManager.analyzeRevenue(days);
        break;
        
      case 'realtime':
        data = await analyticsManager.getRealTimeStats();
        break;
        
      case 'user_segments':
        data = await analyticsManager.analyzeUserSegments();
        break;
        
      case 'ab_test':
        if (!testId) {
          return NextResponse.json({
            success: false,
            message: 'testId parameter required for A/B test results'
          }, { status: 400 });
        }
        data = await analyticsManager.getABTestResults(testId);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: `Unknown type: ${type}`,
          availableTypes: [
            'dashboard', 'content_performance', 'seo', 'revenue', 
            'realtime', 'user_segments', 'ab_test'
          ]
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      type: type,
      period: type === 'realtime' ? 'live' : `${days} days`,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Analytics GET API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}