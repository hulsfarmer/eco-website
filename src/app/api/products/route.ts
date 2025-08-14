import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 제품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, price, sustainability
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    const skip = (page - 1) * limit;
    
    // 필터 조건 구성
    const where: any = {
      rating: { gte: minRating }
    };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (inStock === 'true') {
      where.inStock = true;
    }
    
    if (maxPrice < 999999) {
      where.price = { lte: maxPrice };
    }
    
    // 정렬 조건
    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'sustainability') {
      orderBy.sustainability = sortOrder;
    } else {
      orderBy.rating = sortOrder;
    }
    
    // 제품 조회
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);
    
    // 제품 데이터 처리
    const productsWithMeta = products.map(product => ({
      ...product,
      pros: product.pros ? JSON.parse(product.pros) : [],
      cons: product.cons ? JSON.parse(product.cons) : [],
      sustainabilityGrade: getSustainabilityGrade(product.sustainability || 0),
      priceRange: getPriceRange(product.price || 0)
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        products: productsWithMeta,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: skip + limit < totalCount,
          hasPrev: page > 1
        },
        filters: {
          categories: await getProductCategories(),
          priceRanges: getPriceRanges(),
          ratingOptions: [4.5, 4.0, 3.5, 3.0]
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Products API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 새 제품 추가 (관리자용)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price,
        rating: data.rating,
        sustainability: data.sustainability,
        description: data.description,
        pros: JSON.stringify(data.pros || []),
        cons: JSON.stringify(data.cons || []),
        imageUrl: data.imageUrl,
        affiliateUrl: data.affiliateUrl,
        inStock: data.inStock !== false,
        featured: data.featured || false,
        reviewCount: data.reviewCount || 0
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        pros: JSON.parse(product.pros || '[]'),
        cons: JSON.parse(product.cons || '[]'),
      },
      message: 'Product created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Create product error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 제품 업데이트 (가격, 재고 등)
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required'
      }, { status: 400 });
    }
    
    // JSON 필드 처리
    if (updateData.pros) {
      updateData.pros = JSON.stringify(updateData.pros);
    }
    if (updateData.cons) {
      updateData.cons = JSON.stringify(updateData.cons);
    }
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        pros: JSON.parse(product.pros || '[]'),
        cons: JSON.parse(product.cons || '[]'),
      },
      message: 'Product updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Update product error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 유틸리티 함수들

// 제품 카테고리 목록 조회
async function getProductCategories() {
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category']
  });
  
  return categories.map(c => c.category).filter(Boolean);
}

// 지속가능성 점수를 등급으로 변환
function getSustainabilityGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C+';
  if (score >= 40) return 'C';
  return 'D';
}

// 가격 범위 분류
function getPriceRange(price: number): string {
  if (price < 25) return 'Budget ($0-$25)';
  if (price < 50) return 'Value ($25-$50)';
  if (price < 100) return 'Mid-Range ($50-$100)';
  if (price < 200) return 'Premium ($100-$200)';
  return 'Luxury ($200+)';
}

// 가격 범위 옵션들
function getPriceRanges() {
  return [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: 999999 }
  ];
}