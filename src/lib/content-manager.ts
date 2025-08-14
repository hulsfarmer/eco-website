import AIContentGenerator from './ai-content-generator';
import SEOOptimizer from './seo-optimizer';
import { prisma } from './prisma';

interface ContentPlan {
  type: 'article' | 'product_review' | 'eco_tip' | 'data_analysis';
  topic: string;
  targetKeywords: string[];
  priority: 'high' | 'medium' | 'low';
  scheduledDate?: Date;
}

interface ContentMetrics {
  totalArticles: number;
  publishedToday: number;
  avgSEOScore: number;
  topPerformers: any[];
  needsOptimization: number;
  contentGaps: string[];
}

class ContentManager {
  private aiGenerator: AIContentGenerator;
  private seoOptimizer: SEOOptimizer;

  constructor() {
    this.aiGenerator = new AIContentGenerator();
    this.seoOptimizer = new SEOOptimizer();
  }

  // 일일 자동 콘텐츠 생성 실행
  async runDailyContentGeneration(): Promise<any> {
    console.log('🚀 Starting daily AI content generation...');

    try {
      // 1. 콘텐츠 갭 분석
      const contentGaps = await this.analyzeContentGaps();
      
      // 2. 최신 환경 데이터 수집
      const environmentalData = await prisma.environmentalData.findMany({
        take: 10,
        orderBy: { recordedAt: 'desc' }
      });

      // 3. 콘텐츠 계획 수립
      const contentPlans = await this.createContentPlans(contentGaps);

      // 4. AI 콘텐츠 생성
      const generatedContent = [];

      for (const plan of contentPlans) {
        try {
          let content;
          
          switch (plan.type) {
            case 'article':
              content = await this.aiGenerator.generateEnvironmentalArticle(
                plan.topic,
                environmentalData
              );
              break;
              
            case 'eco_tip':
              content = await this.aiGenerator.generateEcoTip(plan.topic);
              break;
              
            case 'data_analysis':
              content = await this.aiGenerator.generateDataAnalysis(environmentalData);
              break;
              
            default:
              continue;
          }

          // 5. SEO 최적화
          const optimized = await this.seoOptimizer.optimizeContent(
            content.title,
            content.content,
            plan.targetKeywords
          );

          // 6. 데이터베이스 저장
          const savedArticle = await prisma.article.create({
            data: {
              title: optimized.title,
              content: optimized.content,
              excerpt: optimized.metaDescription,
              category: content.category,
              author: 'AI Content Generator',
              publishedAt: plan.scheduledDate || new Date(),
              source: 'AI Generated',
              sourceUrl: `https://ecolife.com/articles/${optimized.slug}`,
              trending: false,
              featured: false,
              tags: JSON.stringify(optimized.keywords),
              readTime: content.readTime
            }
          });

          generatedContent.push({
            plan,
            content: savedArticle,
            seoScore: optimized.seoScore
          });

          console.log(`✅ Generated: "${optimized.title}" (SEO: ${optimized.seoScore}/100)`);

          // API 요청 제한 방지
          await this.delay(3000);

        } catch (error) {
          console.error(`❌ Failed to generate content for ${plan.topic}:`, error);
        }
      }

      // 7. 기존 콘텐츠 최적화
      await this.optimizeExistingContent();

      const summary = {
        generated: generatedContent.length,
        totalPlanned: contentPlans.length,
        avgSEOScore: generatedContent.reduce((sum, c) => sum + c.seoScore, 0) / generatedContent.length,
        contentTypes: this.groupBy(generatedContent, 'plan.type'),
        timestamp: new Date()
      };

      console.log(`🎉 Daily content generation completed: ${summary.generated} articles`);
      return summary;

    } catch (error) {
      console.error('❌ Daily content generation failed:', error);
      throw error;
    }
  }

  // 콘텐츠 갭 분석
  async analyzeContentGaps(): Promise<string[]> {
    console.log('🔍 Analyzing content gaps...');

    // 최근 30일 콘텐츠 분석
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentArticles = await prisma.article.findMany({
      where: {
        publishedAt: { gte: thirtyDaysAgo }
      },
      select: { category: true, tags: true, title: true }
    });

    // 카테고리별 분포 분석
    const categoryCount: Record<string, number> = {};
    const allTags: string[] = [];

    recentArticles.forEach(article => {
      categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
      
      if (article.tags) {
        try {
          const tags = JSON.parse(article.tags);
          allTags.push(...tags);
        } catch (error) {
          // 태그 파싱 실패 무시
        }
      }
    });

    // 부족한 카테고리 식별
    const expectedCategories = [
      'Climate Science', 'Renewable Energy', 'Conservation', 
      'Green Technology', 'Policy', 'Lifestyle', 'Data Analysis'
    ];

    const gaps: string[] = [];

    expectedCategories.forEach(category => {
      const count = categoryCount[category] || 0;
      if (count < 3) { // 카테고리별 최소 3개 기사 목표
        gaps.push(category);
      }
    });

    // 트렌딩 환경 토픽 추가
    const trendingTopics = [
      'electric vehicles', 'sustainable fashion', 'green hydrogen',
      'carbon capture', 'biodiversity loss', 'circular economy',
      'renewable energy storage', 'climate adaptation', 'ocean plastic'
    ];

    // 언급 빈도가 낮은 트렌딩 토픽 추가
    trendingTopics.forEach(topic => {
      const mentioned = allTags.some(tag => 
        tag.toLowerCase().includes(topic.toLowerCase()) ||
        recentArticles.some(article => 
          article.title.toLowerCase().includes(topic.toLowerCase())
        )
      );

      if (!mentioned) {
        gaps.push(topic);
      }
    });

    console.log(`📊 Identified ${gaps.length} content gaps:`, gaps);
    return gaps.slice(0, 10); // 상위 10개만 반환
  }

  // 콘텐츠 계획 생성
  async createContentPlans(gaps: string[]): Promise<ContentPlan[]> {
    console.log('📋 Creating content plans...');

    const plans: ContentPlan[] = [];
    const today = new Date();

    // 갭 기반 계획 생성
    gaps.forEach((gap, index) => {
      let type: ContentPlan['type'] = 'article';
      let topic = gap;

      // 타입 결정 로직
      if (gap.includes('tips') || gap.includes('how to')) {
        type = 'eco_tip';
      } else if (gap === 'Data Analysis') {
        type = 'data_analysis';
      }

      // 키워드 제안
      const keywords = this.generateTopicKeywords(topic);

      // 우선순위 결정
      const priority = this.determinePriority(gap);

      // 스케줄링 (다음 7일 내 분산)
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + (index % 7));

      plans.push({
        type,
        topic,
        targetKeywords: keywords,
        priority,
        scheduledDate
      });
    });

    // 매일 정기 콘텐츠 추가
    const dailyTopics = [
      { topic: 'sustainability trends', type: 'article' as const },
      { topic: 'energy saving', type: 'eco_tip' as const },
      { topic: 'environmental data insights', type: 'data_analysis' as const }
    ];

    dailyTopics.forEach((daily, index) => {
      const keywords = this.generateTopicKeywords(daily.topic);
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + index);

      plans.push({
        type: daily.type,
        topic: daily.topic,
        targetKeywords: keywords,
        priority: 'medium',
        scheduledDate
      });
    });

    // 우선순위별 정렬
    plans.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    console.log(`📝 Created ${plans.length} content plans`);
    return plans.slice(0, 5); // 하루 최대 5개 컨텐츠
  }

  // 기존 콘텐츠 최적화
  async optimizeExistingContent(limit: number = 5): Promise<any> {
    console.log(`⚡ Optimizing existing content (${limit} articles)...`);

    try {
      // SEO 점수가 낮거나 오래된 기사들 선택
      const articles = await prisma.article.findMany({
        where: {
          source: { not: 'AI Generated' }, // AI 생성 콘텐츠는 제외
          updatedAt: {
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7일 이상된 것
          }
        },
        orderBy: { updatedAt: 'asc' },
        take: limit
      });

      const optimizedCount = await this.seoOptimizer.optimizeExistingContent(articles.length);
      
      console.log(`✅ Optimized ${optimizedCount.length} articles`);
      return optimizedCount;

    } catch (error) {
      console.error('❌ Content optimization failed:', error);
      return [];
    }
  }

  // 콘텐츠 성과 분석
  async analyzeContentMetrics(): Promise<ContentMetrics> {
    console.log('📊 Analyzing content metrics...');

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalArticles,
      publishedToday,
      recentArticles,
      needsOptimization
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({
        where: { publishedAt: { gte: startOfDay } }
      }),
      prisma.article.findMany({
        where: { publishedAt: { gte: thirtyDaysAgo } },
        select: { title: true, category: true, tags: true, trending: true, featured: true }
      }),
      prisma.article.count({
        where: {
          updatedAt: { lt: thirtyDaysAgo },
          source: { not: 'AI Generated' }
        }
      })
    ]);

    // SEO 성과 분석
    const seoPerformance = await this.seoOptimizer.analyzeSEOPerformance();

    // 상위 수행 기사들
    const topPerformers = recentArticles
      .filter(article => article.trending || article.featured)
      .slice(0, 5);

    // 콘텐츠 갭 재분석
    const contentGaps = await this.analyzeContentGaps();

    return {
      totalArticles,
      publishedToday,
      avgSEOScore: seoPerformance.averageSEOScore,
      topPerformers,
      needsOptimization,
      contentGaps
    };
  }

  // 제품 리뷰 자동 생성
  async generateProductReviews(limit: number = 3): Promise<any[]> {
    console.log(`🛍️ Generating product reviews (${limit} products)...`);

    // 리뷰가 없거나 부족한 제품들 선택
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { reviewCount: { lt: 10 } },
          { updatedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
        ]
      },
      orderBy: { rating: 'desc' },
      take: limit
    });

    const generatedReviews = [];

    for (const product of products) {
      try {
        // AI 리뷰 생성
        const review = await this.aiGenerator.generateProductReview(product);

        // SEO 최적화
        const keywords = await this.seoOptimizer.suggestKeywords(product.name, 'product');
        const optimized = await this.seoOptimizer.optimizeContent(
          review.title,
          review.content,
          keywords
        );

        // 데이터베이스 저장 (별도 리뷰 테이블이 있다면)
        const savedReview = await prisma.article.create({
          data: {
            title: optimized.title,
            content: optimized.content,
            excerpt: optimized.metaDescription,
            category: 'Product Reviews',
            author: 'EcoLife Review Team',
            publishedAt: new Date(),
            source: 'AI Generated Review',
            sourceUrl: `https://ecolife.com/reviews/${optimized.slug}`,
            trending: false,
            featured: product.featured,
            tags: JSON.stringify(optimized.keywords),
            readTime: review.readTime
          }
        });

        generatedReviews.push({
          product: product,
          review: savedReview,
          seoScore: optimized.seoScore
        });

        console.log(`✅ Generated review for: "${product.name}"`);
        await this.delay(2000);

      } catch (error) {
        console.error(`❌ Failed to generate review for ${product.name}:`, error);
      }
    }

    console.log(`🎉 Product review generation completed: ${generatedReviews.length} reviews`);
    return generatedReviews;
  }

  // 콘텐츠 품질 관리
  async performQualityCheck(): Promise<any> {
    console.log('🔍 Performing content quality check...');

    // 최근 AI 생성 콘텐츠 검증
    const recentAIContent = await prisma.article.findMany({
      where: {
        source: 'AI Generated',
        publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { id: true, title: true, content: true, tags: true }
    });

    const qualityIssues = [];

    for (const article of recentAIContent) {
      const seoAnalysis = await this.seoOptimizer.analyzeContent(article.content, article.title);
      
      if (seoAnalysis.score < 70) {
        qualityIssues.push({
          articleId: article.id,
          title: article.title,
          issues: seoAnalysis.issues,
          score: seoAnalysis.score
        });
      }
    }

    console.log(`📊 Quality check completed. Found ${qualityIssues.length} articles needing attention`);

    return {
      totalChecked: recentAIContent.length,
      issuesFound: qualityIssues.length,
      qualityIssues: qualityIssues.slice(0, 10),
      averageQuality: recentAIContent.length > 0 
        ? qualityIssues.reduce((sum, issue) => sum + issue.score, 0) / qualityIssues.length 
        : 0
    };
  }

  // === 헬퍼 메서드들 ===

  private generateTopicKeywords(topic: string): string[] {
    const baseKeywords = [
      `${topic}`,
      `${topic} guide`,
      `${topic} tips`,
      `sustainable ${topic}`,
      `eco-friendly ${topic}`,
      `environmental ${topic}`
    ];

    return baseKeywords.slice(0, 5);
  }

  private determinePriority(gap: string): 'high' | 'medium' | 'low' {
    const highPriorityTopics = ['climate change', 'renewable energy', 'sustainability'];
    const lowPriorityTopics = ['lifestyle', 'tips'];

    if (highPriorityTopics.some(topic => gap.toLowerCase().includes(topic))) {
      return 'high';
    } else if (lowPriorityTopics.some(topic => gap.toLowerCase().includes(topic))) {
      return 'low';
    }
    return 'medium';
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((groups, item) => {
      const value = this.getNestedValue(item, key);
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ContentManager;