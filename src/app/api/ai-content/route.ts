import { NextRequest, NextResponse } from 'next/server';
import ContentManager from '@/lib/content-manager';

const contentManager = new ContentManager();

// AI 콘텐츠 생성 API
export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json();
    
    console.log(`🤖 AI Content API called: ${action}`);
    let results;

    switch (action) {
      case 'generate_daily':
        results = await contentManager.runDailyContentGeneration();
        break;
        
      case 'generate_batch':
        const count = params?.count || 5;
        results = await contentManager.runDailyContentGeneration();
        break;
        
      case 'generate_reviews':
        const limit = params?.limit || 3;
        results = await contentManager.generateProductReviews(limit);
        break;
        
      case 'optimize_existing':
        const optimizeLimit = params?.limit || 5;
        results = await contentManager.optimizeExistingContent(optimizeLimit);
        break;
        
      case 'quality_check':
        results = await contentManager.performQualityCheck();
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: `Unknown action: ${action}`,
          availableActions: [
            'generate_daily', 'generate_batch', 'generate_reviews', 
            'optimize_existing', 'quality_check'
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
    console.error(`❌ AI Content API error:`, error);
    
    return NextResponse.json({
      success: false,
      message: 'AI content generation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 콘텐츠 메트릭스 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'metrics';
    
    let data;
    
    switch (type) {
      case 'metrics':
        data = await contentManager.analyzeContentMetrics();
        break;
        
      case 'gaps':
        data = await contentManager.analyzeContentGaps();
        break;
        
      case 'quality':
        data = await contentManager.performQualityCheck();
        break;
        
      default:
        data = await contentManager.analyzeContentMetrics();
    }
    
    return NextResponse.json({
      success: true,
      type: type,
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Content metrics API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch content metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}