import * as cron from 'node-cron';
import { prisma } from './prisma';
import ContentManager from './content-manager';
import SocialMediaManager from './social-media-manager';
import EmailMarketingManager from './email-marketing-manager';

interface ScheduledPost {
  id: string;
  articleId: string;
  publishAt: Date;
  status: 'pending' | 'published' | 'failed';
  channels: ('website' | 'twitter' | 'facebook' | 'email')[];
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

interface PublishingPlan {
  dailyTargets: {
    articles: number;
    tips: number;
    reviews: number;
  };
  bestTimes: {
    morning: string; // '08:00'
    afternoon: string; // '14:00'  
    evening: string; // '19:00'
  };
  weeklySchedule: {
    [key: string]: number; // day: priority (1-7)
  };
}

class ContentScheduler {
  private contentManager: ContentManager;
  private socialMediaManager: SocialMediaManager;
  private emailMarketingManager: EmailMarketingManager;
  private publishingPlan: PublishingPlan;

  constructor() {
    this.contentManager = new ContentManager();
    this.socialMediaManager = new SocialMediaManager();
    this.emailMarketingManager = new EmailMarketingManager();
    
    this.publishingPlan = {
      dailyTargets: {
        articles: 3,
        tips: 2,
        reviews: 1
      },
      bestTimes: {
        morning: '08:00',
        afternoon: '14:00',
        evening: '19:00'
      },
      weeklySchedule: {
        Monday: 7,    // 높은 우선순위 (새로운 주 시작)
        Tuesday: 6,
        Wednesday: 5,
        Thursday: 4,
        Friday: 3,    // 낮은 우선순위 (주말 준비)
        Saturday: 2,
        Sunday: 1     // 가장 낮음 (휴식)
      }
    };
  }

  // 자동 발행 시스템 시작
  async startAutoPublishing() {
    console.log('📅 Starting automated content publishing system...');

    // 매일 오전 6시: 일일 콘텐츠 생성 및 발행 계획
    cron.schedule('0 6 * * *', async () => {
      await this.planDailyContent();
    });

    // 매일 지정 시간: 콘텐츠 발행
    cron.schedule('0 8,14,19 * * *', async () => {
      await this.publishScheduledContent();
    });

    // 매일 오후 6시: 소셜 미디어 포스팅
    cron.schedule('0 18 * * *', async () => {
      await this.publishToSocialMedia();
    });

    // 매주 월요일 오전 9시: 주간 뉴스레터 발송
    cron.schedule('0 9 * * 1', async () => {
      await this.sendWeeklyNewsletter();
    });

    // 매시간: 발행 대기 중인 콘텐츠 처리
    cron.schedule('0 * * * *', async () => {
      await this.processScheduledPosts();
    });

    console.log('✅ Auto-publishing system started with following schedule:');
    console.log('  📝 Daily content planning: 06:00');
    console.log('  📤 Content publishing: 08:00, 14:00, 19:00');
    console.log('  📱 Social media: 18:00');
    console.log('  📧 Newsletter: Monday 09:00');
    console.log('  ⏰ Processing queue: Every hour');
  }

  // 일일 콘텐츠 계획 수립
  async planDailyContent(): Promise<any> {
    console.log('📋 Planning daily content for:', new Date().toDateString());

    try {
      const today = new Date();
      const dayName = today.toLocaleDateString('en', { weekday: 'long' });
      const priority = this.publishingPlan.weeklySchedule[dayName] || 5;

      // 1. AI 콘텐츠 생성
      console.log('🤖 Generating AI content...');
      const generatedContent = await this.contentManager.runDailyContentGeneration();

      // 2. 발행 시간 계획
      const publishingTimes = this.calculatePublishingTimes(today, priority);

      // 3. 생성된 콘텐츠를 발행 큐에 추가
      const scheduledPosts = [];
      const articles = await prisma.article.findMany({
        where: {
          publishedAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          },
          source: 'AI Generated'
        },
        take: 6 // 하루 최대 6개 포스트
      });

      for (let i = 0; i < Math.min(articles.length, publishingTimes.length); i++) {
        const article = articles[i];
        const publishTime = publishingTimes[i];

        const scheduledPost = await this.schedulePost({
          articleId: article.id,
          publishAt: publishTime,
          channels: this.determineChannels(article),
          priority: this.determinePriority(article, priority)
        });

        scheduledPosts.push(scheduledPost);
      }

      const summary = {
        date: today.toDateString(),
        priority: priority,
        generated: generatedContent.generated,
        scheduled: scheduledPosts.length,
        publishingTimes: publishingTimes.map(t => t.toTimeString().slice(0, 5))
      };

      console.log(`✅ Daily content planned: ${summary.scheduled} posts scheduled`);
      return summary;

    } catch (error) {
      console.error('❌ Daily content planning failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 예약된 콘텐츠 발행
  async publishScheduledContent(): Promise<any> {
    console.log('📤 Publishing scheduled content...');

    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      // 발행할 콘텐츠 조회
      const pendingPosts = await prisma.article.findMany({
        where: {
          publishedAt: {
            gte: fiveMinutesAgo,
            lte: fiveMinutesFromNow
          },
          // 실제로는 별도의 scheduled_posts 테이블 사용
        },
        take: 10
      });

      const publishedPosts = [];

      for (const post of pendingPosts) {
        try {
          console.log(`📄 Publishing: "${post.title}"`);

          // 웹사이트 발행 (이미 DB에 저장되어 있음)
          await this.publishToWebsite(post);

          // 소셜 미디어 발행
          await this.socialMediaManager.shareArticle(post);

          // 발행 완료 상태 업데이트
          await prisma.article.update({
            where: { id: post.id },
            data: { 
              featured: true, // 최신 발행 콘텐츠로 표시
              updatedAt: new Date()
            }
          });

          publishedPosts.push({
            id: post.id,
            title: post.title,
            publishedAt: now
          });

          console.log(`✅ Published: "${post.title}"`);

          // 발행 간격 조절
          await this.delay(30000); // 30초 간격

        } catch (error) {
          console.error(`❌ Failed to publish ${post.id}:`, error);
        }
      }

      console.log(`📊 Publishing completed: ${publishedPosts.length} posts published`);
      return { published: publishedPosts.length, posts: publishedPosts };

    } catch (error) {
      console.error('❌ Scheduled publishing failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 소셜 미디어 자동 포스팅
  async publishToSocialMedia(): Promise<any> {
    console.log('📱 Publishing to social media...');

    try {
      // 오늘 발행된 주요 콘텐츠 선별
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const featuredArticles = await prisma.article.findMany({
        where: {
          publishedAt: { gte: startOfDay },
          OR: [
            { featured: true },
            { trending: true }
          ]
        },
        orderBy: { publishedAt: 'desc' },
        take: 3
      });

      const socialResults = [];

      for (const article of featuredArticles) {
        try {
          const result = await this.socialMediaManager.shareArticle(article);
          socialResults.push(result);

          // 포스팅 간격
          await this.delay(10000); // 10초 간격

        } catch (error) {
          console.error(`❌ Social media posting failed for ${article.id}:`, error);
        }
      }

      console.log(`📊 Social media posting completed: ${socialResults.length} posts`);
      return { posted: socialResults.length, results: socialResults };

    } catch (error) {
      console.error('❌ Social media publishing failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 주간 뉴스레터 발송
  async sendWeeklyNewsletter(): Promise<any> {
    console.log('📧 Preparing weekly newsletter...');

    try {
      // 지난 주 최고 성과 콘텐츠 수집
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const weeklyContent = await prisma.article.findMany({
        where: {
          publishedAt: { gte: lastWeek },
          OR: [
            { featured: true },
            { trending: true }
          ]
        },
        orderBy: { publishedAt: 'desc' },
        take: 10
      });

      // 이번 주 환경 데이터 하이라이트
      const weeklyData = await prisma.environmentalData.findMany({
        where: {
          recordedAt: { gte: lastWeek }
        },
        orderBy: { recordedAt: 'desc' },
        take: 5
      });

      const newsletterData = {
        weekOf: new Date().toLocaleDateString(),
        topArticles: weeklyContent.slice(0, 5),
        environmentalHighlights: weeklyData,
        weeklyTip: weeklyContent.find(article => 
          article.category === 'Eco Tips'
        ),
        productSpotlight: weeklyContent.find(article => 
          article.category === 'Product Reviews'
        )
      };

      const result = await this.emailMarketingManager.sendWeeklyNewsletter(newsletterData);

      console.log(`✅ Weekly newsletter sent to ${result.sent} subscribers`);
      return result;

    } catch (error) {
      console.error('❌ Weekly newsletter failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // 예약 포스트 처리
  async processScheduledPosts(): Promise<void> {
    console.log('⏰ Processing scheduled posts queue...');

    try {
      const now = new Date();
      
      // 실제로는 별도 scheduled_posts 테이블에서 조회
      // 여기서는 시뮬레이션으로 최근 생성된 미발행 콘텐츠 처리
      const readyToPublish = await prisma.article.findMany({
        where: {
          publishedAt: { lte: now },
          featured: false, // 아직 발행되지 않은 것으로 간주
          source: 'AI Generated'
        },
        take: 5
      });

      for (const article of readyToPublish) {
        await this.publishToWebsite(article);
      }

      if (readyToPublish.length > 0) {
        console.log(`✅ Processed ${readyToPublish.length} scheduled posts`);
      }

    } catch (error) {
      console.error('❌ Scheduled posts processing failed:', error);
    }
  }

  // 수동 콘텐츠 예약
  async schedulePost(params: {
    articleId: string;
    publishAt: Date;
    channels: ('website' | 'twitter' | 'facebook' | 'email')[];
    priority: 'high' | 'medium' | 'low';
  }): Promise<any> {
    console.log(`📅 Scheduling post for: ${params.publishAt}`);

    try {
      // 실제로는 별도 scheduled_posts 테이블에 저장
      // 여기서는 article의 publishedAt 시간을 조정
      const scheduledPost = await prisma.article.update({
        where: { id: params.articleId },
        data: {
          publishedAt: params.publishAt,
          featured: params.priority === 'high',
          updatedAt: new Date()
        }
      });

      return {
        id: scheduledPost.id,
        articleId: params.articleId,
        publishAt: params.publishAt,
        channels: params.channels,
        priority: params.priority,
        status: 'scheduled'
      };

    } catch (error) {
      console.error('❌ Post scheduling failed:', error);
      throw error;
    }
  }

  // 발행 통계 조회
  async getPublishingStats(days: number = 7): Promise<any> {
    console.log(`📊 Analyzing publishing stats for last ${days} days...`);

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalPublished,
      byCategory,
      bySource,
      avgPerDay
    ] = await Promise.all([
      prisma.article.count({
        where: { publishedAt: { gte: since } }
      }),
      prisma.article.groupBy({
        by: ['category'],
        where: { publishedAt: { gte: since } },
        _count: { id: true }
      }),
      prisma.article.groupBy({
        by: ['source'],
        where: { publishedAt: { gte: since } },
        _count: { id: true }
      }),
      prisma.article.count({
        where: { publishedAt: { gte: since } }
      }).then(count => Math.round(count / days * 10) / 10)
    ]);

    return {
      period: `${days} days`,
      totalPublished,
      avgPerDay,
      byCategory: byCategory.map(cat => ({
        category: cat.category,
        count: cat._count.id
      })),
      bySource: bySource.map(src => ({
        source: src.source,
        count: src._count.id
      })),
      generatedAt: new Date()
    };
  }

  // === 헬퍼 메서드들 ===

  private calculatePublishingTimes(date: Date, priority: number): Date[] {
    const times = [];
    const baseHours = [8, 14, 19]; // 기본 발행 시간

    // 우선순위에 따라 발행 횟수 조정
    const postsCount = Math.min(6, Math.max(1, Math.floor(priority * 0.8) + 2));

    for (let i = 0; i < postsCount; i++) {
      const hour = baseHours[i % baseHours.length];
      const minutes = i * 15; // 15분 간격으로 분산

      const publishTime = new Date(date);
      publishTime.setHours(hour, minutes, 0, 0);
      
      times.push(publishTime);
    }

    return times.sort((a, b) => a.getTime() - b.getTime());
  }

  private determineChannels(article: any): ('website' | 'twitter' | 'facebook' | 'email')[] {
    const channels: ('website' | 'twitter' | 'facebook' | 'email')[] = ['website'];

    // 카테고리별 채널 전략
    if (article.trending || article.featured) {
      channels.push('twitter', 'facebook');
    }

    if (article.category === 'Eco Tips') {
      channels.push('twitter');
    }

    if (article.category === 'Product Reviews') {
      channels.push('email');
    }

    return channels;
  }

  private determinePriority(article: any, dayPriority: number): 'high' | 'medium' | 'low' {
    if (article.trending && dayPriority >= 6) return 'high';
    if (article.featured || dayPriority >= 4) return 'medium';
    return 'low';
  }

  private async publishToWebsite(article: any): Promise<void> {
    // 웹사이트는 이미 DB에 있으므로 featured 상태만 업데이트
    await prisma.article.update({
      where: { id: article.id },
      data: {
        featured: true,
        updatedAt: new Date()
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ContentScheduler;