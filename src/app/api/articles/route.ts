import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 기사 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const trending = searchParams.get('trending');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    const skip = (page - 1) * limit;
    
    // 필터 조건 구성
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (trending === 'true') {
      where.trending = true;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    // 기사 조회
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where })
    ]);
    
    // 메타데이터 추가
    const articlesWithMeta = articles.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : []
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        articles: articlesWithMeta,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: skip + limit < totalCount,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Articles API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch articles',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 새 기사 생성 (관리자용)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const article = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 200) + '...',
        category: data.category,
        author: data.author,
        publishedAt: new Date(data.publishedAt || Date.now()),
        source: data.source,
        sourceUrl: data.sourceUrl,
        imageUrl: data.imageUrl,
        trending: data.trending || false,
        featured: data.featured || false,
        tags: JSON.stringify(data.tags || []),
        readTime: data.readTime || Math.ceil(data.content.split(' ').length / 200)
      }
    });
    
    return NextResponse.json({
      success: true,
      data: article,
      message: 'Article created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Create article error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create article',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}