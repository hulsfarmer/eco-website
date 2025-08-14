import { NextRequest, NextResponse } from 'next/server';
import AffiliateTrackingSystem from '@/lib/affiliate-tracking';

const affiliateTracker = new AffiliateTrackingSystem();

// 제휴 링크 클릭 및 전환 추적 API
export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    console.log(`🔗 Affiliate API called: ${action}`);
    let results;

    switch (action) {
      case 'track_click':
        if (!data?.affiliateProgram || !data?.productId || !data?.sessionId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: affiliateProgram, productId, sessionId'
          }, { status: 400 });
        }

        const clickData = {
          userId: data.userId,
          sessionId: data.sessionId,
          affiliateProgram: data.affiliateProgram,
          productId: data.productId,
          productName: data.productName || 'Unknown Product',
          commission: data.commission || 0,
          destinationUrl: data.destinationUrl,
          sourceUrl: data.sourceUrl || request.headers.get('referer') || '',
          userAgent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer'),
          ip: request.ip
        };

        results = await affiliateTracker.trackAffiliateClick(clickData);
        break;

      case 'track_conversion':
        if (!data?.clickId || !data?.transactionId || !data?.orderValue) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: clickId, transactionId, orderValue'
          }, { status: 400 });
        }

        const conversionData = {
          clickId: data.clickId,
          transactionId: data.transactionId,
          orderValue: data.orderValue,
          commissionAmount: data.commissionAmount || (data.orderValue * 0.05), // 5% 기본 커미션
          currency: data.currency || 'USD',
          conversionDate: new Date(),
          confirmed: data.confirmed || false
        };

        await affiliateTracker.trackAffiliateConversion(conversionData);
        results = { message: 'Conversion tracked successfully' };
        break;

      case 'generate_link':
        if (!data?.program || !data?.productId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: program, productId'
          }, { status: 400 });
        }

        results = {
          affiliateUrl: affiliateTracker.generateAffiliateLink(
            data.program,
            data.productId,
            data.customParams
          )
        };
        break;

      case 'optimize_strategy':
        results = await affiliateTracker.optimizeAffiliateStrategy(data.contentData || []);
        break;

      default:
        return NextResponse.json({
          success: false,
          message: `Unknown action: ${action}`,
          availableActions: ['track_click', 'track_conversion', 'generate_link', 'optimize_strategy']
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action: action,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Affiliate API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Affiliate operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 제휴 성과 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'performance';
    const days = parseInt(searchParams.get('days') || '30');
    
    let data;

    switch (type) {
      case 'performance':
        data = await affiliateTracker.analyzeAffiliatePerformance(days);
        break;

      case 'dashboard':
        data = await affiliateTracker.getRealTimeAffiliateDashboard();
        break;

      case 'comparison':
        data = await affiliateTracker.compareAffiliatePrograms(days);
        break;

      case 'optimization':
        data = await affiliateTracker.optimizeAffiliateStrategy([]);
        break;

      default:
        return NextResponse.json({
          success: false,
          message: `Unknown type: ${type}`,
          availableTypes: ['performance', 'dashboard', 'comparison', 'optimization']
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      type: type,
      period: type === 'dashboard' ? 'real-time' : `${days} days`,
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Affiliate data API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch affiliate data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}