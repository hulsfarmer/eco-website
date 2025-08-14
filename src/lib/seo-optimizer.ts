import { prisma } from './prisma';

interface SEOAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
  keywords: {
    primary: string[];
    secondary: string[];
    density: Record<string, number>;
  };
  readability: {
    score: number;
    level: string;
    avgWordsPerSentence: number;
    avgSyllablesPerWord: number;
  };
  structure: {
    hasH1: boolean;
    headingCount: number;
    paragraphCount: number;
    linkCount: number;
    imageCount: number;
  };
}

interface SEOOptimizedContent {
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  schema: any;
  seoScore: number;
}

class SEOOptimizer {
  private environmentalKeywords = [
    // 기본 환경 키워드
    'sustainability', 'sustainable', 'eco-friendly', 'environmental', 'green',
    'climate change', 'renewable energy', 'carbon footprint', 'biodiversity',
    
    // 구체적 기술/솔루션
    'solar energy', 'wind power', 'electric vehicles', 'recycling', 'composting',
    'energy efficiency', 'water conservation', 'organic farming', 'zero waste',
    
    // 행동/라이프스타일
    'green living', 'sustainable living', 'eco tips', 'environmental impact',
    'conservation', 'earth friendly', 'planet positive', 'climate action',
    
    // 제품 관련
    'eco products', 'green products', 'sustainable products', 'organic',
    'biodegradable', 'recyclable', 'renewable materials', 'fair trade'
  ];

  private stopWords = [
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with', 'the', 'this', 'but', 'they',
    'have', 'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how',
    'their', 'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so'
  ];

  // 콘텐츠 SEO 분석
  async analyzeContent(content: string, title: string): Promise<SEOAnalysis> {
    console.log(`🔍 Analyzing SEO for: "${title}"`);

    const wordCount = this.getWordCount(content);
    const keywords = this.extractKeywords(content);
    const structure = this.analyzeStructure(content);
    const readability = this.calculateReadability(content);
    
    let score = 0;
    const issues: string[] = [];
    const recommendations: string[] = [];

    // 제목 분석 (0-20점)
    if (title.length >= 30 && title.length <= 60) {
      score += 15;
    } else {
      issues.push('Title length should be 30-60 characters');
      recommendations.push('Optimize title length for better search visibility');
    }

    if (this.containsEnvironmentalKeywords(title)) {
      score += 5;
    } else {
      recommendations.push('Include relevant environmental keywords in title');
    }

    // 콘텐츠 길이 (0-15점)
    if (wordCount >= 1000 && wordCount <= 3000) {
      score += 15;
    } else if (wordCount >= 500) {
      score += 10;
      if (wordCount < 1000) {
        recommendations.push('Consider expanding content to 1000+ words for better SEO');
      }
    } else {
      issues.push('Content too short for good SEO performance');
      recommendations.push('Aim for 1000-3000 words for comprehensive coverage');
    }

    // 키워드 밀도 (0-15점)
    const keywordDensity = this.calculateKeywordDensity(content, keywords.primary);
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      score += 15;
    } else if (keywordDensity < 1) {
      issues.push('Keyword density too low');
      recommendations.push('Include more relevant keywords naturally in content');
    } else {
      issues.push('Keyword density too high (keyword stuffing)');
      recommendations.push('Reduce keyword repetition for more natural content');
    }

    // 구조 분석 (0-20점)
    if (structure.hasH1) score += 5;
    else recommendations.push('Add H1 heading for better structure');

    if (structure.headingCount >= 3) score += 5;
    else recommendations.push('Use more headings (H2, H3) to structure content');

    if (structure.paragraphCount >= 5) score += 5;
    else recommendations.push('Break content into more paragraphs for readability');

    if (structure.linkCount >= 2) score += 5;
    else recommendations.push('Add internal and external links');

    // 가독성 (0-15점)
    if (readability.score >= 60) {
      score += 15;
    } else if (readability.score >= 40) {
      score += 10;
      recommendations.push('Simplify language for better readability');
    } else {
      issues.push('Content readability is poor');
      recommendations.push('Use shorter sentences and simpler words');
    }

    // 환경 관련성 (0-15점)
    const environmentalRelevance = this.calculateEnvironmentalRelevance(content);
    score += Math.min(15, environmentalRelevance);

    if (environmentalRelevance < 10) {
      recommendations.push('Include more environmental keywords and topics');
    }

    console.log(`✅ SEO analysis completed. Score: ${score}/100`);

    return {
      score,
      issues,
      recommendations,
      keywords,
      readability,
      structure
    };
  }

  // SEO 최적화된 콘텐츠 생성
  async optimizeContent(
    title: string,
    content: string,
    targetKeywords: string[] = []
  ): Promise<SEOOptimizedContent> {
    console.log(`⚡ Optimizing content: "${title}"`);

    // 키워드 분석 및 확장
    const contentKeywords = this.extractKeywords(content);
    const allKeywords = [...new Set([...targetKeywords, ...contentKeywords.primary])];
    
    // 제목 최적화
    const optimizedTitle = this.optimizeTitle(title, allKeywords);
    
    // 메타 설명 생성
    const metaDescription = this.generateMetaDescription(content, allKeywords);
    
    // URL 슬러그 생성
    const slug = this.generateSlug(optimizedTitle);
    
    // 구조화된 데이터 스키마
    const schema = this.generateSchema(optimizedTitle, content, metaDescription);
    
    // SEO 점수 계산
    const analysis = await this.analyzeContent(content, optimizedTitle);
    
    console.log(`✅ Content optimized. SEO Score: ${analysis.score}/100`);

    return {
      title: optimizedTitle,
      content: this.optimizeContentStructure(content, allKeywords),
      metaDescription,
      keywords: allKeywords,
      slug,
      schema,
      seoScore: analysis.score
    };
  }

  // 대량 콘텐츠 SEO 최적화
  async optimizeExistingContent(limit: number = 10): Promise<any[]> {
    console.log(`🔄 Optimizing existing content (${limit} articles)...`);

    // SEO 점수가 낮은 기사들 선택
    const articles = await prisma.article.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const optimizedArticles = [];

    for (const article of articles) {
      try {
        const optimized = await this.optimizeContent(
          article.title,
          article.content,
          article.tags ? JSON.parse(article.tags) : []
        );

        // 데이터베이스 업데이트
        const updatedArticle = await prisma.article.update({
          where: { id: article.id },
          data: {
            title: optimized.title,
            content: optimized.content,
            excerpt: optimized.metaDescription,
            tags: JSON.stringify(optimized.keywords),
            updatedAt: new Date()
          }
        });

        optimizedArticles.push({
          original: article,
          optimized: updatedArticle,
          seoScore: optimized.seoScore
        });

        console.log(`✅ Optimized: "${optimized.title}" (Score: ${optimized.seoScore}/100)`);

        // API 제한 방지
        await this.delay(1000);

      } catch (error) {
        console.error(`❌ Failed to optimize article ${article.id}:`, error);
      }
    }

    console.log(`🎉 Content optimization completed: ${optimizedArticles.length}/${limit} articles`);
    return optimizedArticles;
  }

  // 키워드 연구 및 제안
  async suggestKeywords(topic: string, type: 'article' | 'product' = 'article'): Promise<string[]> {
    const baseKeywords = this.environmentalKeywords.filter(keyword => 
      keyword.includes(topic.toLowerCase()) || topic.toLowerCase().includes(keyword)
    );

    const typeSpecificKeywords = type === 'article' 
      ? ['how to', 'benefits of', 'guide to', 'tips for', 'best practices']
      : ['review', 'best', 'compare', 'buy', 'price', 'features'];

    const suggestedKeywords = [
      ...baseKeywords,
      ...typeSpecificKeywords.map(prefix => `${prefix} ${topic}`),
      `${topic} sustainability`,
      `${topic} environmental impact`,
      `${topic} eco-friendly`,
      `${topic} green technology`,
      `sustainable ${topic}`
    ];

    // 중복 제거 및 정렬
    return [...new Set(suggestedKeywords)]
      .sort((a, b) => a.length - b.length)
      .slice(0, 15);
  }

  // SEO 성능 분석
  async analyzeSEOPerformance(): Promise<any> {
    console.log('📊 Analyzing overall SEO performance...');

    const articles = await prisma.article.findMany({
      select: { title: true, content: true, createdAt: true, tags: true }
    });

    let totalScore = 0;
    const analysisResults = [];

    for (const article of articles.slice(0, 20)) { // 샘플링
      const analysis = await this.analyzeContent(article.content, article.title);
      totalScore += analysis.score;
      analysisResults.push({
        title: article.title,
        score: analysis.score,
        issues: analysis.issues.length,
        createdAt: article.createdAt
      });
    }

    const averageScore = totalScore / analysisResults.length;

    return {
      averageSEOScore: Math.round(averageScore),
      totalArticles: articles.length,
      analyzedSample: analysisResults.length,
      topPerformers: analysisResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
      needsImprovement: analysisResults
        .filter(a => a.score < 70)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5),
      commonIssues: this.getCommonSEOIssues(analysisResults)
    };
  }

  // === 프라이빗 헬퍼 메서드들 ===

  private getWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private extractKeywords(text: string): { primary: string[], secondary: string[], density: Record<string, number> } {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !this.stopWords.includes(word));

    // 단어 빈도 계산
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // 환경 관련 키워드 우선순위
    const environmentalWords = words.filter(word => 
      this.environmentalKeywords.some(envKeyword => 
        envKeyword.includes(word) || word.includes(envKeyword.split(' ')[0])
      )
    );

    // 키워드 밀도 계산
    const totalWords = words.length;
    const density: Record<string, number> = {};
    Object.entries(wordFreq).forEach(([word, count]) => {
      density[word] = (count / totalWords) * 100;
    });

    // 상위 키워드 선택
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .map(([word]) => word);

    return {
      primary: [...new Set([...environmentalWords, ...sortedWords])].slice(0, 10),
      secondary: sortedWords.slice(10, 20),
      density
    };
  }

  private analyzeStructure(content: string) {
    const hasH1 = /<h1|# /.test(content);
    const headingCount = (content.match(/<h[1-6]|#{1,6} /g) || []).length;
    const paragraphCount = content.split(/\n\s*\n/).length;
    const linkCount = (content.match(/<a |https?:\/\//g) || []).length;
    const imageCount = (content.match(/<img |!\[.*\]/g) || []).length;

    return {
      hasH1,
      headingCount,
      paragraphCount,
      linkCount,
      imageCount
    };
  }

  private calculateReadability(text: string): { score: number; level: string; avgWordsPerSentence: number; avgSyllablesPerWord: number } {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/);
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateSyllables(text) / words.length;

    // Flesch Reading Ease 공식 근사치
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    let level = 'Very Difficult';
    if (score >= 90) level = 'Very Easy';
    else if (score >= 80) level = 'Easy';
    else if (score >= 70) level = 'Fairly Easy';
    else if (score >= 60) level = 'Standard';
    else if (score >= 50) level = 'Fairly Difficult';
    else if (score >= 30) level = 'Difficult';

    return {
      score: Math.max(0, Math.min(100, score)),
      level,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10
    };
  }

  private estimateSyllables(text: string): number {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    return words.reduce((total, word) => {
      // 음절 추정 (영어 기준)
      const syllables = word.replace(/[^aeiouAEIOU]/g, '').length || 1;
      return total + Math.max(1, syllables);
    }, 0);
  }

  private containsEnvironmentalKeywords(text: string): boolean {
    const textLower = text.toLowerCase();
    return this.environmentalKeywords.some(keyword => textLower.includes(keyword));
  }

  private calculateEnvironmentalRelevance(content: string): number {
    const contentLower = content.toLowerCase();
    const matches = this.environmentalKeywords.filter(keyword => 
      contentLower.includes(keyword)
    ).length;
    
    return Math.min(15, matches * 2);
  }

  private calculateKeywordDensity(content: string, keywords: string[]): number {
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = keywords.reduce((count, keyword) => {
      return count + (content.toLowerCase().match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
    }, 0);
    
    return (keywordCount / words.length) * 100;
  }

  private optimizeTitle(title: string, keywords: string[]): string {
    let optimizedTitle = title;

    // 길이 최적화 (50-60자)
    if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 57) + '...';
    } else if (optimizedTitle.length < 30 && keywords.length > 0) {
      // 키워드 추가
      const mainKeyword = keywords.find(k => !optimizedTitle.toLowerCase().includes(k.toLowerCase()));
      if (mainKeyword) {
        optimizedTitle = `${optimizedTitle} - ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}`;
      }
    }

    return optimizedTitle;
  }

  private generateMetaDescription(content: string, keywords: string[]): string {
    const firstParagraph = content.split('\n\n')[0].replace(/<[^>]*>/g, '').trim();
    let description = firstParagraph.substring(0, 120);
    
    // 키워드 포함 확인
    const hasKeyword = keywords.some(keyword => 
      description.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!hasKeyword && keywords[0]) {
      description = `${keywords[0]} - ${description}`.substring(0, 155);
    }

    // 문장 완성
    const lastPeriod = description.lastIndexOf('.');
    if (lastPeriod > 100) {
      description = description.substring(0, lastPeriod + 1);
    } else {
      description += '...';
    }

    return description;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  private generateSchema(title: string, content: string, description: string): any {
    const wordCount = this.getWordCount(content);
    const readTime = Math.ceil(wordCount / 200);

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "articleBody": content,
      "wordCount": wordCount,
      "timeRequired": `PT${readTime}M`,
      "about": {
        "@type": "Thing",
        "name": "Environmental Sustainability"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EcoLife",
        "url": "https://ecolife.com"
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  }

  private optimizeContentStructure(content: string, keywords: string[]): string {
    let optimizedContent = content;

    // 첫 번째 단락에 주요 키워드 포함 확인
    const firstParagraph = optimizedContent.split('\n\n')[0];
    if (keywords[0] && !firstParagraph.toLowerCase().includes(keywords[0].toLowerCase())) {
      const sentences = firstParagraph.split('.');
      sentences[0] += ` related to ${keywords[0]}`;
      optimizedContent = optimizedContent.replace(firstParagraph, sentences.join('.'));
    }

    return optimizedContent;
  }

  private getCommonSEOIssues(analysisResults: any[]): string[] {
    const issueMap: Record<string, number> = {};
    
    analysisResults.forEach(result => {
      if (result.issues && Array.isArray(result.issues)) {
        result.issues.forEach((issue: string) => {
          issueMap[issue] = (issueMap[issue] || 0) + 1;
        });
      }
    });

    return Object.entries(issueMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default SEOOptimizer;