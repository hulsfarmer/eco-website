import { NextRequest, NextResponse } from 'next/server';
import RSSCollector from '@/lib/rss-collector';

// RSS 소스 초기화 및 데이터 수집 시작
export async function POST() {
  try {
    console.log('🌱 Initializing RSS sources and collecting initial data...');
    
    const rssCollector = new RSSCollector();
    
    // 1. RSS 소스들을 데이터베이스에 초기화
    await rssCollector.initializeSources();
    
    // 2. 초기 데이터 수집 (백그라운드에서 실행)
    // 전체 수집 대신 샘플 데이터를 빠르게 수집
    rssCollector.collectFromAllSources().catch(error => {
      console.error('Background RSS collection error:', error);
    });
    
    return NextResponse.json({
      success: true,
      message: 'RSS initialization started successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ RSS initialization error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'RSS initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// RSS 수집 상태 확인
export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    // 최근 기사 수와 소스 상태 확인
    const [articleCount, sourceCount, recentArticles] = await Promise.all([
      prisma.article.count(),
      prisma.rSSSource.count({ where: { active: true } }),
      prisma.article.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          source: true,
          publishedAt: true,
          createdAt: true
        }
      })
    ]);
    
    return NextResponse.json({
      success: true,
      status: {
        totalArticles: articleCount,
        activeSources: sourceCount,
        recentArticles: recentArticles,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ RSS status check error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to check RSS status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}