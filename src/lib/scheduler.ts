import * as cron from 'node-cron';
import RSSCollector from './rss-collector';
import DataCollector from './data-collector';
import WebScraper from './web-scraper';
import { prisma } from './prisma';

interface ScheduledTask {
  name: string;
  schedule: string;
  description: string;
  lastRun?: Date;
  nextRun?: Date;
  isRunning: boolean;
}

class ContentScheduler {
  private rssCollector: RSSCollector;
  private dataCollector: DataCollector;
  private webScraper: WebScraper;
  private scheduledTasks: Map<string, ScheduledTask> = new Map();

  constructor() {
    this.rssCollector = new RSSCollector();
    this.dataCollector = new DataCollector();
    this.webScraper = new WebScraper();
  }

  // 모든 자동 수집 작업 시작
  async startAllScheduledJobs() {
    console.log('🚀 Starting content collection scheduler...');
    
    // RSS 피드 수집: 매 4시간마다
    this.scheduleRSSCollection();
    
    // 환경 데이터 수집: 매 6시간마다  
    this.scheduleDataCollection();
    
    // 웹 스크래핑: 매일 오전 2시
    this.scheduleWebScraping();
    
    // 데이터 정리: 매일 오전 3시
    this.scheduleDataCleanup();

    // 초기 RSS 소스 설정
    await this.initializeSystem();

    console.log('✅ All scheduled jobs started successfully');
    this.printScheduleStatus();
  }

  // RSS 수집 스케줄 (4시간마다)
  private scheduleRSSCollection() {
    const schedule = '0 */4 * * *'; // 매 4시간 (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
    
    const task: ScheduledTask = {
      name: 'RSS Collection',
      schedule: schedule,
      description: 'Collect articles from environmental RSS feeds',
      isRunning: false
    };

    cron.schedule(schedule, async () => {
      if (task.isRunning) {
        console.log('⚠️ RSS collection already running, skipping...');
        return;
      }

      try {
        task.isRunning = true;
        task.lastRun = new Date();
        console.log('📡 Starting scheduled RSS collection...');
        
        const articles = await this.rssCollector.collectFromAllSources();
        
        console.log(`✅ RSS collection completed: ${articles.length} new articles`);
        
      } catch (error) {
        console.error('❌ RSS collection failed:', error);
      } finally {
        task.isRunning = false;
      }
    });

    this.scheduledTasks.set('rss-collection', task);
    console.log(`📡 RSS collection scheduled: ${schedule}`);
  }

  // 환경 데이터 수집 스케줄 (6시간마다)
  private scheduleDataCollection() {
    const schedule = '0 */6 * * *'; // 매 6시간 (00:00, 06:00, 12:00, 18:00)
    
    const task: ScheduledTask = {
      name: 'Environmental Data Collection',
      schedule: schedule,
      description: 'Collect environmental metrics and statistics',
      isRunning: false
    };

    cron.schedule(schedule, async () => {
      if (task.isRunning) {
        console.log('⚠️ Data collection already running, skipping...');
        return;
      }

      try {
        task.isRunning = true;
        task.lastRun = new Date();
        console.log('📊 Starting scheduled data collection...');
        
        const data = await this.dataCollector.collectAllEnvironmentalData();
        
        console.log('✅ Environmental data collection completed');
        
      } catch (error) {
        console.error('❌ Data collection failed:', error);
      } finally {
        task.isRunning = false;
      }
    });

    this.scheduledTasks.set('data-collection', task);
    console.log(`📊 Data collection scheduled: ${schedule}`);
  }

  // 웹 스크래핑 스케줄 (매일 오전 2시)
  private scheduleWebScraping() {
    const schedule = '0 2 * * *'; // 매일 오전 2시
    
    const task: ScheduledTask = {
      name: 'Web Scraping',
      schedule: schedule,
      description: 'Scrape product information and additional news',
      isRunning: false
    };

    cron.schedule(schedule, async () => {
      if (task.isRunning) {
        console.log('⚠️ Web scraping already running, skipping...');
        return;
      }

      try {
        task.isRunning = true;
        task.lastRun = new Date();
        console.log('🕷️ Starting scheduled web scraping...');
        
        const results = await this.webScraper.runAllScrapingJobs();
        
        console.log(`✅ Web scraping completed: ${results.products.length} products, ${results.news.length} articles`);
        
      } catch (error) {
        console.error('❌ Web scraping failed:', error);
      } finally {
        task.isRunning = false;
      }
    });

    this.scheduledTasks.set('web-scraping', task);
    console.log(`🕷️ Web scraping scheduled: ${schedule}`);
  }

  // 데이터 정리 스케줄 (매일 오전 3시)
  private scheduleDataCleanup() {
    const schedule = '0 3 * * *'; // 매일 오전 3시
    
    const task: ScheduledTask = {
      name: 'Data Cleanup',
      schedule: schedule,
      description: 'Clean up old data and optimize database',
      isRunning: false
    };

    cron.schedule(schedule, async () => {
      if (task.isRunning) {
        console.log('⚠️ Data cleanup already running, skipping...');
        return;
      }

      try {
        task.isRunning = true;
        task.lastRun = new Date();
        console.log('🧹 Starting scheduled data cleanup...');
        
        await this.performDataCleanup();
        
        console.log('✅ Data cleanup completed');
        
      } catch (error) {
        console.error('❌ Data cleanup failed:', error);
      } finally {
        task.isRunning = false;
      }
    });

    this.scheduledTasks.set('data-cleanup', task);
    console.log(`🧹 Data cleanup scheduled: ${schedule}`);
  }

  // 시스템 초기화
  private async initializeSystem() {
    console.log('⚙️ Initializing content collection system...');
    
    try {
      // RSS 소스 초기화
      await this.rssCollector.initializeSources();
      
      // 초기 데이터 수집 (시작시 한 번)
      console.log('🔄 Running initial content collection...');
      
      // 병렬로 초기 수집 실행 (시간 단축)
      await Promise.all([
        this.rssCollector.collectFromAllSources(),
        this.dataCollector.collectAllEnvironmentalData()
      ]);
      
      console.log('✅ System initialization completed');
      
    } catch (error) {
      console.error('❌ System initialization failed:', error);
    }
  }

  // 데이터 정리 작업
  private async performDataCleanup() {
    try {
      // 30일 이상된 환경 데이터 삭제 (세부 데이터만)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      await prisma.environmentalData.deleteMany({
        where: {
          recordedAt: { lt: thirtyDaysAgo },
          dataType: { in: ['city_temperature'] }
        }
      });

      // 90일 이상된 기사 삭제 (인기 없는 것들만)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      await prisma.article.deleteMany({
        where: {
          publishedAt: { lt: ninetyDaysAgo },
          trending: false,
          featured: false
        }
      });

      // 비활성 제품 정리
      await prisma.product.deleteMany({
        where: {
          updatedAt: { lt: thirtyDaysAgo },
          inStock: false,
          featured: false
        }
      });

      console.log('🧹 Database cleanup completed');
      
    } catch (error) {
      console.error('❌ Data cleanup error:', error);
    }
  }

  // 수동으로 특정 작업 실행
  async runTaskManually(taskName: string) {
    console.log(`🔧 Manually running task: ${taskName}`);
    
    try {
      switch (taskName) {
        case 'rss':
          return await this.rssCollector.collectFromAllSources();
        
        case 'data':
          return await this.dataCollector.collectAllEnvironmentalData();
        
        case 'scraping':
          return await this.webScraper.runAllScrapingJobs();
        
        case 'cleanup':
          return await this.performDataCleanup();
        
        case 'all':
          const results = await Promise.all([
            this.rssCollector.collectFromAllSources(),
            this.dataCollector.collectAllEnvironmentalData(),
            this.webScraper.runAllScrapingJobs()
          ]);
          
          await this.performDataCleanup();
          return results;
        
        default:
          throw new Error(`Unknown task: ${taskName}`);
      }
    } catch (error) {
      console.error(`❌ Manual task execution failed for ${taskName}:`, error);
      throw error;
    }
  }

  // 스케줄 상태 출력
  printScheduleStatus() {
    console.log('\n📋 Scheduled Tasks Status:');
    console.log('===============================================');
    
    this.scheduledTasks.forEach((task, key) => {
      console.log(`📌 ${task.name}`);
      console.log(`   Schedule: ${task.schedule}`);
      console.log(`   Description: ${task.description}`);
      console.log(`   Status: ${task.isRunning ? '🔄 Running' : '⏸️ Waiting'}`);
      console.log(`   Last Run: ${task.lastRun ? task.lastRun.toLocaleString() : 'Never'}`);
      console.log('');
    });
    
    console.log('===============================================\n');
  }

  // 모든 스케줄된 작업 중지
  stopAllScheduledJobs() {
    console.log('🛑 Stopping all scheduled jobs...');
    
    // node-cron에서 모든 작업 중지
    cron.getTasks().forEach(task => {
      task.stop();
    });
    
    this.scheduledTasks.clear();
    console.log('✅ All scheduled jobs stopped');
  }

  // 스케줄 상태 조회
  getScheduleStatus() {
    return Array.from(this.scheduledTasks.entries()).map(([key, task]) => ({
      id: key,
      ...task
    }));
  }
}

export default ContentScheduler;