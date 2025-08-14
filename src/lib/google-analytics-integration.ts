interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface GAEcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
}

interface GAConversionData {
  conversion_id: string;
  conversion_label?: string;
  transaction_id?: string;
  value?: number;
  currency?: string;
}

class GoogleAnalyticsIntegration {
  private gtag: string;
  private adWordsConversionId?: string;

  constructor() {
    this.gtag = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXX';
    this.adWordsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
    
    console.log('🔗 Google Analytics Integration initialized');
  }

  // 기본 이벤트 추적
  trackEvent(event: GAEvent): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
      
      console.log(`📊 GA Event tracked: ${event.action} - ${event.category}`);
    }
  }

  // 페이지뷰 추적
  trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.gtag, {
        page_path: path,
        page_title: title,
      });
      
      console.log(`📊 GA Page view tracked: ${path}`);
    }
  }

  // 환경 관련 특화 이벤트들
  trackEnvironmentalAction(action: 'article_read' | 'tip_viewed' | 'product_reviewed' | 'data_analyzed', details: any): void {
    this.trackEvent({
      action: action,
      category: 'Environmental_Engagement',
      label: details.title || details.type,
      value: details.duration || details.engagement_score
    });
  }

  // 뉴스레터 구독 추적
  trackNewsletterSignup(source: string = 'unknown'): void {
    this.trackEvent({
      action: 'newsletter_signup',
      category: 'Lead_Generation',
      label: source
    });

    // Google Ads 전환 추적 (설정된 경우)
    if (this.adWordsConversionId) {
      this.trackConversion({
        conversion_id: `${this.adWordsConversionId}/newsletter_signup`,
        conversion_label: 'newsletter',
      });
    }
  }

  // 제휴 링크 클릭 추적
  trackAffiliateClick(program: string, product: string, revenue?: number): void {
    this.trackEvent({
      action: 'affiliate_click',
      category: 'Revenue',
      label: `${program}_${product}`,
      value: revenue
    });
  }

  // 제품 구매 전환 추적
  trackAffiliatePurchase(transactionData: {
    affiliate_program: string;
    product_name: string;
    commission: number;
    order_value: number;
    transaction_id: string;
  }): void {
    // 이커머스 이벤트로 추적
    this.trackEcommerce('purchase', {
      transaction_id: transactionData.transaction_id,
      value: transactionData.commission,
      currency: 'USD',
      items: [{
        item_id: transactionData.transaction_id,
        item_name: transactionData.product_name,
        category: 'Affiliate_Commission',
        quantity: 1,
        price: transactionData.commission
      }]
    });

    // Google Ads 전환 추적
    if (this.adWordsConversionId) {
      this.trackConversion({
        conversion_id: `${this.adWordsConversionId}/affiliate_purchase`,
        conversion_label: 'affiliate',
        transaction_id: transactionData.transaction_id,
        value: transactionData.commission,
        currency: 'USD'
      });
    }
  }

  // AdSense 수익 추적 (간접적으로)
  trackAdSenseRevenue(data: {
    rpm: number;
    impressions: number;
    clicks: number;
    estimated_revenue: number;
  }): void {
    this.trackEvent({
      action: 'adsense_performance',
      category: 'Revenue',
      label: 'daily_summary',
      value: Math.round(data.estimated_revenue * 100) // 센트 단위
    });
  }

  // 콘텐츠 성과 추적
  trackContentPerformance(articleId: string, metrics: {
    read_time: number;
    scroll_depth: number;
    social_shares: number;
    affiliate_clicks: number;
  }): void {
    // 읽기 시간 추적
    this.trackEvent({
      action: 'content_engagement',
      category: 'Content',
      label: `article_${articleId}`,
      value: metrics.read_time
    });

    // 스크롤 깊이 추적
    if (metrics.scroll_depth > 0.75) { // 75% 이상 읽음
      this.trackEvent({
        action: 'deep_read',
        category: 'Content',
        label: `article_${articleId}`
      });
    }

    // 소셜 공유 추적
    if (metrics.social_shares > 0) {
      this.trackEvent({
        action: 'social_share',
        category: 'Engagement',
        label: `article_${articleId}`,
        value: metrics.social_shares
      });
    }
  }

  // 이커머스 이벤트 추적
  private trackEcommerce(eventName: string, data: {
    transaction_id: string;
    value: number;
    currency: string;
    items: GAEcommerceItem[];
  }): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        transaction_id: data.transaction_id,
        value: data.value,
        currency: data.currency,
        items: data.items,
      });
    }
  }

  // Google Ads 전환 추적
  private trackConversion(data: GAConversionData): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: data.conversion_id,
        transaction_id: data.transaction_id,
        value: data.value,
        currency: data.currency || 'USD',
      });
      
      console.log(`💰 Conversion tracked: ${data.conversion_id}`);
    }
  }

  // SEO 성과 추적
  trackSEOMetrics(data: {
    organic_sessions: number;
    avg_position: number;
    ctr: number;
    top_keywords: string[];
  }): void {
    this.trackEvent({
      action: 'seo_performance',
      category: 'SEO',
      label: 'organic_traffic',
      value: data.organic_sessions
    });

    // 주요 키워드 성과
    data.top_keywords.slice(0, 5).forEach((keyword, index) => {
      this.trackEvent({
        action: 'keyword_ranking',
        category: 'SEO',
        label: keyword,
        value: index + 1 // 순위
      });
    });
  }

  // 사용자 세그먼트 추적
  trackUserSegment(segment: {
    type: 'new' | 'returning' | 'subscriber' | 'high_engagement';
    value?: string;
  }): void {
    this.trackEvent({
      action: 'user_segment',
      category: 'Audience',
      label: segment.type,
      value: segment.value ? parseInt(segment.value) : undefined
    });
  }

  // A/B 테스트 결과 추적
  trackABTestResult(testName: string, variant: 'control' | 'variant', converted: boolean): void {
    this.trackEvent({
      action: 'ab_test_result',
      category: 'Optimization',
      label: `${testName}_${variant}_${converted ? 'converted' : 'no_conversion'}`
    });
  }

  // 환경 데이터 조회 추적
  trackEnvironmentalDataUsage(dataType: string, region: string): void {
    this.trackEvent({
      action: 'environmental_data_view',
      category: 'Data_Usage',
      label: `${dataType}_${region}`
    });
  }

  // 계절별 컨텐츠 성과 추적
  trackSeasonalContent(season: string, contentType: string, performance: number): void {
    this.trackEvent({
      action: 'seasonal_content_performance',
      category: 'Content_Strategy',
      label: `${season}_${contentType}`,
      value: performance
    });
  }

  // 수익 최적화 액션 추적
  trackRevenueOptimization(optimization: {
    type: 'ad_placement' | 'affiliate_program' | 'content_monetization';
    action: string;
    estimated_impact: number;
  }): void {
    this.trackEvent({
      action: 'revenue_optimization',
      category: 'Revenue_Strategy',
      label: `${optimization.type}_${optimization.action}`,
      value: Math.round(optimization.estimated_impact * 100)
    });
  }
}

export default GoogleAnalyticsIntegration;