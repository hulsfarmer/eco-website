import { NextRequest, NextResponse } from 'next/server';
import ContentScheduler from '@/lib/content-scheduler';
import AnalyticsManager from '@/lib/analytics-manager';

const contentScheduler = new ContentScheduler();
const analyticsManager = new AnalyticsManager();

// 자동 발행 및 스케줄링 API
export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json();
    
    console.log(`📅 Publishing API called: ${action}`);
    let results;

    switch (action) {
      case 'start_auto_publishing':
        await contentScheduler.startAutoPublishing();
        results = { message: 'Auto-publishing system started', status: 'active' };
        break;
        
      case 'plan_daily_content':
        results = await contentScheduler.planDailyContent();
        break;
        
      case 'publish_scheduled':
        results = await contentScheduler.publishScheduledContent();
        break;
        
      case 'publish_to_social':
        results = await contentScheduler.publishToSocialMedia();
        break;
        
      case 'send_newsletter':
        results = await contentScheduler.sendWeeklyNewsletter();
        break;
        
      case 'schedule_post':
        if (!params?.articleId || !params?.publishAt) {
          return NextResponse.json({
            success: false,
            message: 'Missing required parameters: articleId, publishAt'
          }, { status: 400 });
        }
        
        results = await contentScheduler.schedulePost({
          articleId: params.articleId,
          publishAt: new Date(params.publishAt),
          channels: params.channels || ['website'],
          priority: params.priority || 'medium'
        });
        break;
        
      case 'get_stats':
        const days = params?.days || 7;
        results = await contentScheduler.getPublishingStats(days);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: `Unknown action: ${action}`,
          availableActions: [
            'start_auto_publishing', 'plan_daily_content', 'publish_scheduled',
            'publish_to_social', 'send_newsletter', 'schedule_post', 'get_stats'
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
    console.error(`❌ Publishing API error:`, error);
    
    return NextResponse.json({
      success: false,
      message: 'Publishing operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 발행 상태 및 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const days = parseInt(searchParams.get('days') || '7');
    
    let data;
    
    switch (type) {
      case 'stats':
        data = await contentScheduler.getPublishingStats(days);
        break;
        
      case 'performance':
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
        
      default:
        data = await contentScheduler.getPublishingStats(days);
    }
    
    return NextResponse.json({
      success: true,
      type: type,
      period: `${days} days`,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Publishing stats API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch publishing statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}