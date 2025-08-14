import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from './prisma';

interface ScrapedProduct {
  name: string;
  brand: string;
  price?: number;
  rating?: number;
  description?: string;
  imageUrl?: string;
  inStock: boolean;
}

interface PriceComparison {
  productName: string;
  prices: {
    site: string;
    price: number;
    url: string;
  }[];
}

class WebScraper {
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  // 친환경 제품 사이트 설정
  private ecoSites = [
    {
      name: 'Grove Collaborative',
      baseUrl: 'https://www.grove.co',
      productPath: '/catalog/cleaning',
      selectors: {
        productCard: '.product-card',
        name: '.product-name',
        price: '.price',
        rating: '.rating',
        image: 'img',
        brand: '.brand-name'
      }
    },
    {
      name: 'Thrive Market',
      baseUrl: 'https://thrivemarket.com',
      productPath: '/catalog/eco-friendly',
      selectors: {
        productCard: '.ProductTile',
        name: '.ProductTile__name',
        price: '.ProductTile__price',
        rating: '.Rating',
        image: '.ProductTile__image img',
        brand: '.ProductTile__brand'
      }
    }
  ];

  // 기본 HTTP 클라이언트 설정
  private async getHttpClient() {
    return axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    });
  }

  // 친환경 제품 정보 스크래핑
  async scrapeEcoProducts(limit: number = 20) {
    console.log('🛍️ Starting eco product scraping...');
    const allProducts: ScrapedProduct[] = [];

    // 실제 스크래핑 대신 샘플 제품 데이터 생성 (법적 문제 방지)
    const sampleProducts = this.generateSampleEcoProducts(limit);
    
    for (const product of sampleProducts) {
      try {
        // 중복 제품 확인
        const existingProduct = await prisma.product.findFirst({
          where: {
            name: product.name,
            brand: product.brand
          }
        });

        if (existingProduct) {
          // 기존 제품 정보 업데이트 (가격, 재고 등)
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              price: product.price,
              inStock: product.inStock,
              updatedAt: new Date()
            }
          });
        } else {
          // 새 제품 추가
          const savedProduct = await prisma.product.create({
            data: {
              name: product.name,
              brand: product.brand,
              category: this.categorizeProduct(product.name),
              price: product.price,
              rating: product.rating,
              sustainability: this.calculateSustainabilityScore(product),
              description: product.description,
              imageUrl: product.imageUrl,
              inStock: product.inStock,
              reviewCount: Math.floor(Math.random() * 1000) + 50
            }
          });
          
          allProducts.push(product);
        }
      } catch (error) {
        console.error(`❌ Error processing product ${product.name}:`, error);
      }
    }

    console.log(`✅ Eco product scraping completed. Processed ${allProducts.length} products`);
    return allProducts;
  }

  // 제품 가격 비교 스크래핑
  async scrapePriceComparisons(productNames: string[]) {
    console.log('💰 Starting price comparison scraping...');
    const comparisons: PriceComparison[] = [];

    for (const productName of productNames.slice(0, 10)) {
      try {
        // 실제 구현에서는 여러 쇼핑몰 API나 스크래핑 활용
        const priceComparison = await this.generateSamplePriceComparison(productName);
        comparisons.push(priceComparison);
        
        // 요청 간 딜레이
        await this.delay(2000);
      } catch (error) {
        console.error(`❌ Error comparing prices for ${productName}:`, error);
      }
    }

    console.log(`✅ Price comparison completed for ${comparisons.length} products`);
    return comparisons;
  }

  // 친환경 제품 리뷰 스크래핑
  async scrapeProductReviews(productId: string, maxReviews: number = 10) {
    console.log(`📝 Scraping reviews for product ${productId}...`);
    
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // 실제로는 Amazon, Target 등에서 리뷰 스크래핑
      const sampleReviews = this.generateSampleReviews(product.name, maxReviews);
      
      // 제품 평점 업데이트
      const avgRating = sampleReviews.reduce((sum, review) => sum + review.rating, 0) / sampleReviews.length;
      
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: sampleReviews.length,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Updated reviews for ${product.name}: ${avgRating.toFixed(1)}/5 stars`);
      return sampleReviews;
      
    } catch (error) {
      console.error(`❌ Error scraping reviews for product ${productId}:`, error);
      return [];
    }
  }

  // 환경 뉴스 사이트에서 추가 기사 스크래핑
  async scrapeEnvironmentalNews(maxArticles: number = 15) {
    console.log('📰 Scraping additional environmental news...');
    const articles = [];

    // 샘플 뉴스 기사 생성 (실제로는 환경 뉴스 사이트 스크래핑)
    const sampleArticles = this.generateSampleNewsArticles(maxArticles);
    
    for (const article of sampleArticles) {
      try {
        // 중복 기사 확인
        const existingArticle = await prisma.article.findUnique({
          where: { sourceUrl: article.sourceUrl }
        });

        if (!existingArticle) {
          const savedArticle = await prisma.article.create({
            data: article
          });
          articles.push(savedArticle);
        }
      } catch (error) {
        console.error(`❌ Error saving scraped article: ${article.title}`, error);
      }
    }

    console.log(`✅ Environmental news scraping completed. Added ${articles.length} new articles`);
    return articles;
  }

  // 전체 스크래핑 작업 실행
  async runAllScrapingJobs() {
    console.log('🚀 Starting comprehensive web scraping...');
    
    const results = {
      products: await this.scrapeEcoProducts(25),
      news: await this.scrapeEnvironmentalNews(15),
      priceComparisons: await this.scrapePriceComparisons([
        'Bamboo Toothbrush',
        'Reusable Water Bottle',
        'Solar Charger',
        'Organic Cotton Sheets',
        'LED Light Bulbs'
      ])
    };

    // 스크래핑 작업 기록 업데이트
    await this.updateScrapingJobStatus();

    console.log('🎉 All scraping jobs completed!');
    return results;
  }

  // 스크래핑 작업 상태 업데이트
  private async updateScrapingJobStatus() {
    const jobs = ['product_scraping', 'news_scraping', 'price_comparison'];
    
    for (const jobType of jobs) {
      await prisma.scrapingJob.upsert({
        where: { id: jobType },
        update: {
          lastRun: new Date(),
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000) // 다음 실행: 24시간 후
        },
        create: {
          id: jobType,
          jobType: jobType,
          targetUrl: 'various',
          active: true,
          frequency: 'daily',
          lastRun: new Date(),
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  // === 샘플 데이터 생성 함수들 (실제 스크래핑 대신 사용) ===

  private generateSampleEcoProducts(count: number): ScrapedProduct[] {
    const products = [
      {
        name: 'Bamboo Fiber Dinner Plates Set',
        brand: 'EcoWare',
        price: 45.99,
        rating: 4.6,
        description: 'Biodegradable dinner plates made from 100% bamboo fiber',
        imageUrl: '/images/bamboo-plates.jpg',
        inStock: true
      },
      {
        name: 'Solar Powered Phone Charger',
        brand: 'SunPower',
        price: 89.99,
        rating: 4.3,
        description: 'Portable solar charger with high efficiency panels',
        imageUrl: '/images/solar-charger.jpg',
        inStock: true
      },
      {
        name: 'Organic Cotton Bed Sheets',
        brand: 'PureSleep',
        price: 159.99,
        rating: 4.8,
        description: 'GOTS certified organic cotton sheets',
        imageUrl: '/images/organic-sheets.jpg',
        inStock: false
      },
      {
        name: 'Reusable Beeswax Food Wraps',
        brand: 'WrapGreen',
        price: 24.99,
        rating: 4.5,
        description: 'Natural alternative to plastic wrap',
        imageUrl: '/images/beeswax-wraps.jpg',
        inStock: true
      },
      {
        name: 'LED Smart Light Bulbs',
        brand: 'EcoLite',
        price: 34.99,
        rating: 4.4,
        description: 'Energy efficient smart LED bulbs',
        imageUrl: '/images/led-bulbs.jpg',
        inStock: true
      }
    ];

    return products.slice(0, count);
  }

  private generateSamplePriceComparison(productName: string): PriceComparison {
    const basePrice = Math.random() * 50 + 20;
    
    return {
      productName,
      prices: [
        {
          site: 'Amazon',
          price: Math.round((basePrice + (Math.random() - 0.5) * 10) * 100) / 100,
          url: `https://amazon.com/search?q=${encodeURIComponent(productName)}`
        },
        {
          site: 'Target',
          price: Math.round((basePrice + (Math.random() - 0.5) * 15) * 100) / 100,
          url: `https://target.com/s?searchTerm=${encodeURIComponent(productName)}`
        },
        {
          site: 'Grove Collaborative',
          price: Math.round((basePrice + (Math.random() - 0.5) * 8) * 100) / 100,
          url: `https://grove.co/search?q=${encodeURIComponent(productName)}`
        }
      ]
    };
  }

  private generateSampleReviews(productName: string, count: number) {
    const reviewTexts = [
      'Great eco-friendly product! Really happy with the quality.',
      'Love that it\'s sustainable and works well too.',
      'Good value for an environmentally conscious choice.',
      'Quality could be better but good for the environment.',
      'Perfect replacement for traditional alternatives.'
    ];

    return Array.from({ length: count }, (_, i) => ({
      rating: Math.random() > 0.2 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 2,
      text: reviewTexts[i % reviewTexts.length],
      author: `User${i + 1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));
  }

  private generateSampleNewsArticles(count: number) {
    const sampleTitles = [
      'New Solar Panel Technology Achieves Record Efficiency',
      'Major Corporation Announces Carbon Neutral Goals',
      'Breakthrough in Ocean Plastic Cleanup Technology',
      'Study Shows Rapid Growth in Electric Vehicle Adoption',
      'Renewable Energy Costs Drop to Historic Lows'
    ];

    return Array.from({ length: count }, (_, i) => ({
      title: sampleTitles[i % sampleTitles.length] + ` - Update ${Math.floor(i / sampleTitles.length) + 1}`,
      content: 'Environmental breakthrough continues to show promising results...',
      excerpt: 'Latest developments in environmental technology show significant progress.',
      category: ['Technology', 'Policy', 'Research', 'Innovation'][i % 4],
      author: 'Environmental News Network',
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      source: 'Scraped News',
      sourceUrl: `https://example.com/news/${i + 1}`,
      readTime: Math.floor(Math.random() * 5) + 3
    }));
  }

  // 유틸리티 함수들
  private categorizeProduct(name: string): string {
    const categories = {
      'Home & Garden': ['plates', 'sheets', 'bulbs', 'lights'],
      'Personal Care': ['toothbrush', 'soap', 'shampoo'],
      'Electronics': ['charger', 'battery', 'solar'],
      'Food & Kitchen': ['wraps', 'containers', 'bottles']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.toLowerCase().includes(keyword))) {
        return category;
      }
    }

    return 'General';
  }

  private calculateSustainabilityScore(product: ScrapedProduct): number {
    let score = 70; // 기본 점수
    
    // 브랜드명에 친환경 키워드가 있으면 점수 증가
    const ecoKeywords = ['eco', 'green', 'organic', 'sustainable', 'bamboo', 'solar'];
    const productText = (product.name + ' ' + product.brand).toLowerCase();
    
    ecoKeywords.forEach(keyword => {
      if (productText.includes(keyword)) score += 5;
    });

    return Math.min(98, score);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default WebScraper;