import Parser from 'rss-parser';
import { prisma } from './prisma';

interface FeedItem {
  title: string;
  content?: string;
  contentSnippet?: string;
  link?: string;
  pubDate?: string;
  author?: string;
  categories?: string[];
}

class RSSCollector {
  private parser: Parser<any, FeedItem>;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'media'],
          ['enclosure', 'enclosure']
        ]
      }
    });
  }

  // 환경 관련 RSS 소스들
  private defaultSources = [
    {
      name: 'NASA Climate Change',
      url: 'https://climate.nasa.gov/rss/news.rss',
      category: 'Climate Science'
    },
    {
      name: 'EPA News',
      url: 'https://www.epa.gov/newsreleases/rss.xml',
      category: 'Policy'
    },
    {
      name: 'Environmental News Network',
      url: 'https://www.enn.com/rss',
      category: 'General'
    },
    {
      name: 'Yale Environment 360',
      url: 'https://e360.yale.edu/feed',
      category: 'Research'
    },
    {
      name: 'Green Building Advisor',
      url: 'https://www.greenbuildingadvisor.com/rss.xml',
      category: 'Green Building'
    },
    {
      name: 'Renewable Energy World',
      url: 'https://www.renewableenergyworld.com/feed/',
      category: 'Renewable Energy'
    },
    {
      name: 'Environmental Defense Fund',
      url: 'https://www.edf.org/rss.xml',
      category: 'Conservation'
    },
    {
      name: 'CleanTechnica',
      url: 'https://cleantechnica.com/feed/',
      category: 'Clean Technology'
    }
  ];

  // RSS 소스들을 데이터베이스에 초기화
  async initializeSources() {
    console.log('🌱 Initializing RSS sources...');
    
    for (const source of this.defaultSources) {
      try {
        await prisma.rSSSource.upsert({
          where: { url: source.url },
          update: { 
            name: source.name,
            category: source.category,
            active: true
          },
          create: {
            name: source.name,
            url: source.url,
            category: source.category,
            active: true
          }
        });
      } catch (error) {
        console.error(`❌ Error initializing source ${source.name}:`, error);
      }
    }
    
    console.log('✅ RSS sources initialized');
  }

  // 단일 RSS 피드에서 기사 수집
  async collectFromFeed(source: any) {
    try {
      console.log(`📡 Fetching from: ${source.name}`);
      
      const feed = await this.parser.parseURL(source.url);
      const articles = [];

      for (const item of feed.items.slice(0, 20)) { // 최근 20개 기사만
        if (!item.link) continue;

        // 중복 확인
        const existingArticle = await prisma.article.findUnique({
          where: { sourceUrl: item.link }
        });

        if (existingArticle) continue;

        // 기사 내용 정리
        const content = item.content || item.contentSnippet || '';
        const excerpt = this.generateExcerpt(content);
        const readTime = this.calculateReadTime(content);

        const article = {
          title: item.title || 'Untitled',
          content: content,
          excerpt: excerpt,
          category: source.category,
          author: item.author || source.name,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: source.name,
          sourceUrl: item.link,
          readTime: readTime,
          tags: JSON.stringify(item.categories || [])
        };

        try {
          const savedArticle = await prisma.article.create({
            data: article
          });
          articles.push(savedArticle);
        } catch (error) {
          console.error(`❌ Error saving article: ${item.title}`, error);
        }
      }

      // 마지막 수집 시간 업데이트
      await prisma.rSSSource.update({
        where: { id: source.id },
        data: { lastFetched: new Date() }
      });

      console.log(`✅ Collected ${articles.length} new articles from ${source.name}`);
      return articles;

    } catch (error) {
      console.error(`❌ Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  // 모든 활성 RSS 소스에서 수집
  async collectFromAllSources() {
    console.log('🚀 Starting RSS collection from all sources...');
    
    const sources = await prisma.rSSSource.findMany({
      where: { active: true }
    });

    const allArticles = [];
    
    for (const source of sources) {
      const articles = await this.collectFromFeed(source);
      allArticles.push(...articles);
      
      // API 호출 간 딜레이 (과부하 방지)
      await this.delay(2000);
    }

    await this.updateTrendingArticles();
    
    console.log(`🎉 RSS collection completed! Total new articles: ${allArticles.length}`);
    return allArticles;
  }

  // 트렌딩 기사 업데이트 (최근성과 키워드 기반)
  async updateTrendingArticles() {
    const trendingKeywords = [
      'climate change', 'renewable energy', 'sustainability', 'carbon',
      'solar', 'wind energy', 'electric vehicle', 'green technology',
      'biodiversity', 'conservation', 'pollution', 'recycling'
    ];

    // 최근 7일 내 기사 중 트렌딩 키워드 포함된 것들
    const recentArticles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    for (const article of recentArticles.slice(0, 10)) {
      const hasKeyword = trendingKeywords.some(keyword => 
        article.title.toLowerCase().includes(keyword) ||
        article.content.toLowerCase().includes(keyword)
      );

      if (hasKeyword) {
        await prisma.article.update({
          where: { id: article.id },
          data: { trending: true }
        });
      }
    }

    // 오래된 트렌딩 리셋
    await prisma.article.updateMany({
      where: {
        trending: true,
        publishedAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      data: { trending: false }
    });
  }

  // 요약 생성 (첫 2문장)
  private generateExcerpt(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.length > 20);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  }

  // 읽기 시간 계산 (분)
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // 딜레이 함수
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // RSS 소스 추가
  async addSource(name: string, url: string, category: string) {
    return await prisma.rSSSource.create({
      data: { name, url, category, active: true }
    });
  }

  // RSS 소스 비활성화
  async deactivateSource(id: string) {
    return await prisma.rSSSource.update({
      where: { id },
      data: { active: false }
    });
  }
}

export default RSSCollector;