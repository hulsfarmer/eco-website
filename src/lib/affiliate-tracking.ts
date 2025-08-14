import { prisma } from './prisma';
import GoogleAnalyticsIntegration from './google-analytics-integration';

interface AffiliateClick {
  id?: string;
  userId?: string;
  sessionId: string;
  affiliateProgram: string;
  productId: string;
  productName: string;
  commission: number;
  destinationUrl: string;
  sourceUrl: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  ip?: string;
}

interface AffiliateConversion {
  id?: string;
  clickId: string;
  transactionId: string;
  orderValue: number;
  commissionAmount: number;
  currency: string;
  conversionDate: Date;
  confirmed: boolean;
}

interface AffiliatePerformance {
  program: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: string;
    clicks: number;
    revenue: number;
  }>;
}

class AffiliateTrackingSystem {
  private analytics: GoogleAnalyticsIntegration;
  private affiliatePrograms: Map<string, any>;

  constructor() {
    this.analytics = new GoogleAnalyticsIntegration();
    this.affiliatePrograms = new Map([
      ['amazon', {
        name: 'Amazon Associates',
        baseUrl: 'https://amazon.com/dp/',
        tagParam: 'tag',
        tagValue: process.env.AMAZON_ASSOCIATE_TAG || 'ecolife-20',
        commission: 0.045, // 4.5% 평균
        cookieDuration: 24 // 24시간
      }],
      ['impact', {
        name: 'Impact Radius',
        baseUrl: 'https://impact.com/track/',
        tagParam: 'CampaignId',
        tagValue: process.env.IMPACT_CAMPAIGN_ID || '12345',
        commission: 0.08,
        cookieDuration: 30
      }],
      ['cj', {
        name: 'Commission Junction',
        baseUrl: 'https://click.linksynergy.com/deeplink',
        tagParam: 'id',
        tagValue: process.env.CJ_WEBSITE_ID || '67890',
        commission: 0.06,
        cookieDuration: 30
      }],
      ['shareAsale', {
        name: 'ShareASale',
        baseUrl: 'https://shareasale.com/r.cfm',
        tagParam: 'u',
        tagValue: process.env.SHAREASALE_AFFILIATE_ID || '123456',
        commission: 0.07,
        cookieDuration: 60
      }]
    ]);

    console.log('🔗 Affiliate Tracking System initialized');
  }

  // 제휴 링크 클릭 추적
  async trackAffiliateClick(clickData: Omit<AffiliateClick, 'id' | 'timestamp'>): Promise<string> {
    try {
      const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const click: AffiliateClick = {
        ...clickData,
        id: clickId,
        timestamp: new Date()
      };

      // 데이터베이스에 클릭 정보 저장 (실제로는 affiliate_clicks 테이블)
      console.log(`🔗 Affiliate click tracked: ${click.affiliateProgram} - ${click.productName}`);

      // Google Analytics로 전송
      this.analytics.trackAffiliateClick(
        click.affiliateProgram,
        click.productName,
        click.commission
      );

      // 쿠키에 클릭 정보 저장 (클라이언트에서 처리)
      this.setAffiliateClickCookie(clickId, click.affiliateProgram);

      return clickId;

    } catch (error) {
      console.error('❌ Affiliate click tracking failed:', error);
      throw error;
    }
  }

  // 제휴 전환 추적
  async trackAffiliateConversion(conversionData: Omit<AffiliateConversion, 'id'>): Promise<void> {
    try {
      const conversion: AffiliateConversion = {
        ...conversionData,
        id: `conv_${Date.now()}`
      };

      // 클릭 정보 조회
      const clickInfo = await this.getAffiliateClick(conversion.clickId);
      if (!clickInfo) {
        throw new Error(`Click not found: ${conversion.clickId}`);
      }

      // 데이터베이스에 전환 정보 저장
      console.log(`💰 Affiliate conversion tracked: ${clickInfo.affiliateProgram} - $${conversion.commissionAmount}`);

      // Google Analytics로 전송
      this.analytics.trackAffiliatePurchase({
        affiliate_program: clickInfo.affiliateProgram,
        product_name: clickInfo.productName,
        commission: conversion.commissionAmount,
        order_value: conversion.orderValue,
        transaction_id: conversion.transactionId
      });

      // 실시간 수익 업데이트
      await this.updateRealTimeRevenue(clickInfo.affiliateProgram, conversion.commissionAmount);

    } catch (error) {
      console.error('❌ Affiliate conversion tracking failed:', error);
      throw error;
    }
  }

  // 제휴 성과 분석
  async analyzeAffiliatePerformance(days: number = 30): Promise<AffiliatePerformance[]> {
    console.log(`📊 Analyzing affiliate performance for last ${days} days...`);

    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      // Mock 성과 데이터 (실제로는 데이터베이스 쿼리)
      const performanceData: AffiliatePerformance[] = Array.from(this.affiliatePrograms.entries()).map(([key, program]) => {
        const clicks = Math.floor(Math.random() * 1000) + 200;
        const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.01)); // 1-6% 전환율
        const revenue = conversions * (Math.random() * 50 + 25); // 평균 $25-75 커미션

        return {
          program: program.name,
          clicks,
          conversions,
          revenue: Math.round(revenue * 100) / 100,
          conversionRate: conversions / clicks,
          averageOrderValue: revenue / conversions || 0,
          topProducts: this.generateTopProducts(key, 5)
        };
      });

      // 수익순 정렬
      performanceData.sort((a, b) => b.revenue - a.revenue);

      console.log(`📊 Affiliate Performance Summary:`);
      performanceData.forEach(perf => {
        console.log(`   ${perf.program}: $${perf.revenue} (${(perf.conversionRate * 100).toFixed(1)}% CR)`);
      });

      return performanceData;

    } catch (error) {
      console.error('❌ Affiliate performance analysis failed:', error);
      return [];
    }
  }

  // 제휴 링크 생성
  generateAffiliateLink(program: string, productId: string, customParams?: Record<string, string>): string {
    const programConfig = this.affiliatePrograms.get(program);
    if (!programConfig) {
      throw new Error(`Unknown affiliate program: ${program}`);
    }

    let affiliateUrl = new URL(programConfig.baseUrl);
    
    // 기본 제휴 파라미터 추가
    affiliateUrl.searchParams.set(programConfig.tagParam, programConfig.tagValue);
    
    // 프로그램별 특화 파라미터
    switch (program) {
      case 'amazon':
        affiliateUrl.pathname = `/dp/${productId}`;
        break;
      case 'impact':
        affiliateUrl.searchParams.set('ProductId', productId);
        break;
      case 'cj':
        affiliateUrl.searchParams.set('url', `https://merchant.com/product/${productId}`);
        break;
      case 'shareAsale':
        affiliateUrl.searchParams.set('urllink', `https://merchant.com/product/${productId}`);
        break;
    }

    // 추적 파라미터 추가
    affiliateUrl.searchParams.set('utm_source', 'ecolife');
    affiliateUrl.searchParams.set('utm_medium', 'affiliate');
    affiliateUrl.searchParams.set('utm_campaign', `${program}_${productId}`);

    // 커스텀 파라미터 추가
    if (customParams) {
      Object.entries(customParams).forEach(([key, value]) => {
        affiliateUrl.searchParams.set(key, value);
      });
    }

    return affiliateUrl.toString();
  }

  // 제휴 수익 최적화 분석
  async optimizeAffiliateStrategy(contentData: any[]): Promise<any> {
    console.log('🎯 Optimizing affiliate marketing strategy...');

    const performance = await this.analyzeAffiliatePerformance(30);
    
    // 카테고리별 성과 분석
    const categoryPerformance = this.analyzeCategoryPerformance(contentData, performance);
    
    // 시즌별 기회 분석
    const seasonalOpportunities = this.analyzeSeasonalOpportunities();
    
    // 경쟁사 분석 (Mock)
    const competitorAnalysis = this.analyzeCompetitors();

    const optimization = {
      topPerformingPrograms: performance.slice(0, 3),
      underperformingPrograms: performance.filter(p => p.conversionRate < 0.02),
      categoryRecommendations: categoryPerformance,
      seasonalStrategy: seasonalOpportunities,
      competitorInsights: competitorAnalysis,
      actionItems: [
        `Focus on ${performance[0]?.program} - highest revenue generator`,
        `Optimize content for eco-products category - highest conversion potential`,
        `Create seasonal campaigns for upcoming holidays`,
        `Test new affiliate programs in underperforming categories`,
        `Implement A/B testing for affiliate link placement`
      ]
    };

    return optimization;
  }

  // 실시간 제휴 수익 대시보드
  async getRealTimeAffiliateDashboard(): Promise<any> {
    console.log('📊 Getting real-time affiliate dashboard...');

    // Mock 실시간 데이터
    const realTimeData = {
      todayRevenue: Math.floor(Math.random() * 200) + 50,
      todayClicks: Math.floor(Math.random() * 100) + 20,
      activeTests: Math.floor(Math.random() * 5) + 2,
      topPerformingLink: {
        program: 'Amazon Associates',
        product: 'Eco-Friendly Solar Panel Kit',
        revenue: Math.floor(Math.random() * 50) + 25,
        clicks: Math.floor(Math.random() * 20) + 10
      },
      recentConversions: this.generateRecentConversions(5),
      programStatus: Array.from(this.affiliatePrograms.entries()).map(([key, program]) => ({
        name: program.name,
        status: Math.random() > 0.1 ? 'active' : 'maintenance',
        todayRevenue: Math.floor(Math.random() * 30) + 5
      }))
    };

    return realTimeData;
  }

  // 제휴 프로그램 성과 비교
  async compareAffiliatePrograms(period: number = 30): Promise<any> {
    const performance = await this.analyzeAffiliatePerformance(period);
    
    const comparison = {
      bestConverting: performance.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      ),
      highestRevenue: performance.reduce((best, current) => 
        current.revenue > best.revenue ? current : best
      ),
      mostClicks: performance.reduce((best, current) => 
        current.clicks > best.clicks ? current : best
      ),
      averageMetrics: {
        conversionRate: performance.reduce((sum, p) => sum + p.conversionRate, 0) / performance.length,
        averageOrderValue: performance.reduce((sum, p) => sum + p.averageOrderValue, 0) / performance.length,
        totalRevenue: performance.reduce((sum, p) => sum + p.revenue, 0)
      }
    };

    return comparison;
  }

  // === 헬퍼 메서드들 ===

  private async getAffiliateClick(clickId: string): Promise<AffiliateClick | null> {
    // 실제로는 데이터베이스에서 조회
    // Mock 데이터 반환
    return {
      id: clickId,
      userId: 'user_123',
      sessionId: 'session_456',
      affiliateProgram: 'amazon',
      productId: 'B08XYZ123',
      productName: 'Eco-Friendly Solar Panel',
      commission: 15.50,
      destinationUrl: 'https://amazon.com/dp/B08XYZ123',
      sourceUrl: 'https://ecolife.com/reviews/solar-panels',
      timestamp: new Date(),
      userAgent: 'Mozilla/5.0...',
      referrer: 'https://google.com'
    };
  }

  private setAffiliateClickCookie(clickId: string, program: string): void {
    // 클라이언트 사이드에서 실행할 쿠키 설정 코드
    const cookieData = {
      clickId,
      program,
      timestamp: Date.now()
    };
    
    console.log(`🍪 Affiliate click cookie set: ${clickId}`);
  }

  private async updateRealTimeRevenue(program: string, amount: number): Promise<void> {
    // 실시간 수익 통계 업데이트 (Redis 등 사용)
    console.log(`💰 Real-time revenue updated: ${program} +$${amount}`);
  }

  private generateTopProducts(program: string, count: number): any[] {
    const productTemplates = [
      'Solar Panel Kit',
      'Eco-Friendly Water Filter',
      'Organic Cotton Bedding',
      'LED Light Bulb Set',
      'Bamboo Kitchen Utensils',
      'Electric Vehicle Charger',
      'Compost Bin',
      'Energy Monitor Device'
    ];

    return productTemplates.slice(0, count).map(product => ({
      product: `${product} (${program})`,
      clicks: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 100) + 20
    }));
  }

  private analyzeCategoryPerformance(contentData: any[], performance: AffiliatePerformance[]): any {
    return {
      'eco-products': { conversionRate: 0.045, revenue: 1250, recommendation: 'Increase content volume' },
      'renewable-energy': { conversionRate: 0.038, revenue: 980, recommendation: 'Focus on solar products' },
      'sustainable-living': { conversionRate: 0.032, revenue: 750, recommendation: 'Add more product reviews' },
      'home-efficiency': { conversionRate: 0.028, revenue: 650, recommendation: 'Create comparison guides' }
    };
  }

  private analyzeSeasonalOpportunities(): any {
    const currentMonth = new Date().getMonth();
    const seasons = {
      spring: { months: [2, 3, 4], focus: 'Garden & Solar', expectedUplift: 0.25 },
      summer: { months: [5, 6, 7], focus: 'Outdoor & Energy', expectedUplift: 0.20 },
      fall: { months: [8, 9, 10], focus: 'Home Efficiency', expectedUplift: 0.30 },
      winter: { months: [11, 0, 1], focus: 'Holiday Gifts', expectedUplift: 0.35 }
    };

    const currentSeason = Object.entries(seasons).find(([_, data]) => 
      data.months.includes(currentMonth)
    );

    return currentSeason ? currentSeason[1] : seasons.spring;
  }

  private analyzeCompetitors(): any {
    return [
      { site: 'GreenTechReviews', strength: 'Product depth', opportunity: 'Better user experience' },
      { site: 'EcoLivingBlog', strength: 'SEO rankings', opportunity: 'More affiliate programs' },
      { site: 'SustainableHome', strength: 'Social media', opportunity: 'Content freshness' }
    ];
  }

  private generateRecentConversions(count: number): any[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `conv_${Date.now() - i * 60000}`,
      program: ['Amazon Associates', 'Impact Radius', 'Commission Junction'][Math.floor(Math.random() * 3)],
      product: ['Solar Panel', 'Water Filter', 'LED Bulbs'][Math.floor(Math.random() * 3)],
      commission: Math.floor(Math.random() * 30) + 10,
      timestamp: new Date(Date.now() - i * 60000)
    }));
  }
}

export default AffiliateTrackingSystem;