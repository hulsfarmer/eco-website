import { NextRequest, NextResponse } from 'next/server';
import ContentScheduler from '@/lib/scheduler';

const scheduler = new ContentScheduler();

// 수동 콘텐츠 수집 API
export async function POST(request: NextRequest) {
  try {
    const { taskType } = await request.json();
    
    console.log(`🚀 Manual content collection requested: ${taskType}`);
    
    const results = await scheduler.runTaskManually(taskType || 'all');
    
    return NextResponse.json({
      success: true,
      message: `Content collection completed for: ${taskType || 'all'}`,
      results: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Content collection API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Content collection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 스케줄 상태 조회
export async function GET() {
  try {
    const scheduleStatus = scheduler.getScheduleStatus();
    
    return NextResponse.json({
      success: true,
      scheduleStatus: scheduleStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Schedule status API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get schedule status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}