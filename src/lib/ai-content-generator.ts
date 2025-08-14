import OpenAI from 'openai';
import { prisma } from './prisma';
import { encoding_for_model } from 'tiktoken';

interface ContentRequest {
  type: 'article' | 'product_review' | 'eco_tip' | 'data_analysis';
  topic?: string;
  data?: any;
  targetLength?: 'short' | 'medium' | 'long';
  seoKeywords?: string[];
  tone?: 'informative' | 'conversational' | 'technical' | 'inspiring';
}

interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  seoKeywords: string[];
  readTime: number;
  category: string;
  imagePrompt?: string;
}

class AIContentGenerator {
  private openai: OpenAI | null = null;
  private tokenEncoder: any;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      this.openai = new OpenAI({
        apiKey: apiKey
      });
      console.log('✅ OpenAI client initialized');
    } else {
      console.warn('⚠️ OpenAI API key not configured. AI features will be limited.');
    }

    try {
      this.tokenEncoder = encoding_for_model('gpt-4');
    } catch (error) {
      console.warn('⚠️ Token encoder initialization failed');
    }
  }

  // 환경 뉴스 기사 자동 생성
  async generateEnvironmentalArticle(topic?: string, environmentalData?: any): Promise<GeneratedContent> {
    if (!this.openai) {
      return this.generateFallbackContent('article', topic);
    }

    try {
      console.log(`🤖 Generating environmental article${topic ? ` about: ${topic}` : ''}...`);

      const prompt = this.buildArticlePrompt(topic, environmentalData);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert environmental journalist writing for EcoLife, a leading sustainability website. 
            Create engaging, factual, and SEO-optimized articles that inspire action while being scientifically accurate.
            Always include practical tips and maintain an optimistic but realistic tone.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedContent = this.parseGeneratedContent(response, 'article');
      
      console.log(`✅ Generated article: "${parsedContent.title}"`);
      return parsedContent;

    } catch (error) {
      console.error('❌ Article generation failed:', error);
      return this.generateFallbackContent('article', topic);
    }
  }

  // 제품 리뷰 자동 생성
  async generateProductReview(productData: any): Promise<GeneratedContent> {
    if (!this.openai) {
      return this.generateFallbackContent('product_review', productData?.name);
    }

    try {
      console.log(`🤖 Generating product review for: ${productData.name}`);

      const prompt = this.buildProductReviewPrompt(productData);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a sustainability expert who reviews eco-friendly products for EcoLife. 
            Write honest, detailed reviews focusing on environmental impact, sustainability, and practical value.
            Always include pros, cons, and a sustainability score explanation.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedContent = this.parseGeneratedContent(response, 'product_review');
      
      console.log(`✅ Generated review for: "${productData.name}"`);
      return parsedContent;

    } catch (error) {
      console.error('❌ Product review generation failed:', error);
      return this.generateFallbackContent('product_review', productData?.name);
    }
  }

  // 친환경 팁 자동 생성
  async generateEcoTip(category?: string): Promise<GeneratedContent> {
    if (!this.openai) {
      return this.generateFallbackContent('eco_tip', category);
    }

    try {
      console.log(`🤖 Generating eco tip${category ? ` for category: ${category}` : ''}...`);

      const prompt = this.buildEcoTipPrompt(category);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a sustainability expert creating practical eco-friendly tips for EcoLife readers.
            Focus on actionable advice that's easy to implement, cost-effective, and has measurable environmental impact.
            Include step-by-step instructions and explain the environmental benefits.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedContent = this.parseGeneratedContent(response, 'eco_tip');
      
      console.log(`✅ Generated eco tip: "${parsedContent.title}"`);
      return parsedContent;

    } catch (error) {
      console.error('❌ Eco tip generation failed:', error);
      return this.generateFallbackContent('eco_tip', category);
    }
  }

  // 환경 데이터 분석 기사 생성
  async generateDataAnalysis(environmentalData: any[]): Promise<GeneratedContent> {
    if (!this.openai) {
      return this.generateFallbackContent('data_analysis');
    }

    try {
      console.log('🤖 Generating environmental data analysis...');

      const prompt = this.buildDataAnalysisPrompt(environmentalData);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an environmental data scientist writing analysis for EcoLife.
            Transform complex environmental data into engaging, understandable insights for the general public.
            Focus on trends, implications, and what actions readers can take based on the data.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1800,
        temperature: 0.5
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedContent = this.parseGeneratedContent(response, 'data_analysis');
      
      console.log(`✅ Generated data analysis: "${parsedContent.title}"`);
      return parsedContent;

    } catch (error) {
      console.error('❌ Data analysis generation failed:', error);
      return this.generateFallbackContent('data_analysis');
    }
  }

  // 수집된 뉴스 기사 재작성 (SEO 최적화)
  async rewriteArticleForSEO(originalArticle: any, targetKeywords: string[]): Promise<GeneratedContent> {
    if (!this.openai) {
      return this.generateFallbackContent('article', originalArticle.title);
    }

    try {
      console.log(`🤖 Rewriting article for SEO: "${originalArticle.title}"`);

      const prompt = this.buildRewritePrompt(originalArticle, targetKeywords);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an SEO content specialist rewriting environmental articles for EcoLife.
            Maintain the original facts and insights while optimizing for search engines and readability.
            Naturally incorporate target keywords and improve structure for better engagement.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2200,
        temperature: 0.4
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedContent = this.parseGeneratedContent(response, 'article');
      
      console.log(`✅ Rewritten article: "${parsedContent.title}"`);
      return parsedContent;

    } catch (error) {
      console.error('❌ Article rewriting failed:', error);
      return this.generateFallbackContent('article', originalArticle.title);
    }
  }

  // 자동 콘텐츠 생성 배치 작업
  async generateContentBatch(count: number = 5): Promise<GeneratedContent[]> {
    console.log(`🚀 Starting batch content generation (${count} pieces)...`);

    const generatedContent: GeneratedContent[] = [];
    const contentTypes = ['article', 'eco_tip', 'data_analysis'] as const;

    // 최신 환경 데이터 가져오기
    const environmentalData = await prisma.environmentalData.findMany({
      take: 10,
      orderBy: { recordedAt: 'desc' }
    });

    // 인기 제품들 가져오기
    const products = await prisma.product.findMany({
      take: 5,
      where: { rating: { gte: 4.0 } },
      orderBy: { rating: 'desc' }
    });

    for (let i = 0; i < count; i++) {
      try {
        const contentType = contentTypes[i % contentTypes.length];
        let content: GeneratedContent;

        switch (contentType) {
          case 'article':
            const topics = [
              'renewable energy breakthrough',
              'climate change solutions',
              'sustainable living trends',
              'ocean conservation efforts',
              'green technology innovation'
            ];
            content = await this.generateEnvironmentalArticle(
              topics[i % topics.length],
              environmentalData.slice(0, 3)
            );
            break;

          case 'eco_tip':
            const categories = ['Energy Saving', 'Water Conservation', 'Waste Reduction', 'Transportation', 'Home & Garden'];
            content = await this.generateEcoTip(categories[i % categories.length]);
            break;

          case 'data_analysis':
            content = await this.generateDataAnalysis(environmentalData.slice(0, 5));
            break;

          default:
            content = await this.generateEnvironmentalArticle();
        }

        generatedContent.push(content);

        // API 요청 제한 방지
        await this.delay(2000);

      } catch (error) {
        console.error(`❌ Failed to generate content piece ${i + 1}:`, error);
      }
    }

    console.log(`🎉 Batch content generation completed: ${generatedContent.length}/${count} pieces`);
    return generatedContent;
  }

  // === 프라이빗 헬퍼 메서드들 ===

  private buildArticlePrompt(topic?: string, data?: any[]): string {
    let prompt = `Write a comprehensive environmental article for EcoLife website`;
    
    if (topic) {
      prompt += ` about "${topic}"`;
    }
    
    if (data && data.length > 0) {
      prompt += `\n\nUse this recent environmental data for context:\n`;
      data.forEach(d => {
        prompt += `- ${d.dataType}: ${d.value} ${d.unit} (${d.region}, recorded: ${d.recordedAt})\n`;
      });
    }

    prompt += `\n\nRequirements:
- Format as JSON with fields: title, content, excerpt, tags, category, imagePrompt
- 1500-2000 words, engaging and informative
- Include practical action steps for readers
- SEO-optimized with relevant keywords
- Scientific accuracy with accessible language
- Optimistic but realistic tone
- Category should be one of: Climate Science, Renewable Energy, Conservation, Green Technology, Policy, Lifestyle`;

    return prompt;
  }

  private buildProductReviewPrompt(productData: any): string {
    return `Write a detailed product review for EcoLife website about this eco-friendly product:

Product Details:
- Name: ${productData.name}
- Brand: ${productData.brand}
- Category: ${productData.category}
- Price: $${productData.price}
- Current Rating: ${productData.rating}/5
- Sustainability Score: ${productData.sustainability}%
- Description: ${productData.description}

Requirements:
- Format as JSON with fields: title, content, excerpt, tags, category, imagePrompt
- 800-1200 words comprehensive review
- Honest assessment of pros and cons
- Sustainability impact analysis
- Value for money evaluation
- Comparison with alternatives
- Clear recommendation
- Category: "Product Reviews"`;
  }

  private buildEcoTipPrompt(category?: string): string {
    return `Create a practical eco-friendly tip${category ? ` for ${category}` : ''} for EcoLife website.

Requirements:
- Format as JSON with fields: title, content, excerpt, tags, category, imagePrompt
- 500-800 words actionable guide
- Step-by-step instructions
- Environmental impact explanation
- Cost breakdown and savings
- Difficulty level (Easy/Medium/Hard)
- Materials/tools needed
- Time required
- Category: "Eco Tips"`;
  }

  private buildDataAnalysisPrompt(data: any[]): string {
    let prompt = `Write an environmental data analysis article for EcoLife using this recent data:

Environmental Data:
`;
    
    data.forEach(d => {
      prompt += `- ${d.dataType}: ${d.value} ${d.unit} (${d.region}) - ${d.source}\n`;
    });

    prompt += `\nRequirements:
- Format as JSON with fields: title, content, excerpt, tags, category, imagePrompt
- 1200-1500 words analytical article
- Explain trends and implications
- Connect data points to real-world impact
- Include actionable insights for readers
- Make complex data accessible
- Category: "Data Analysis"`;

    return prompt;
  }

  private buildRewritePrompt(article: any, keywords: string[]): string {
    return `Rewrite this environmental article for better SEO and engagement:

Original Article:
Title: ${article.title}
Content: ${article.content.substring(0, 1000)}...
Category: ${article.category}

Target Keywords: ${keywords.join(', ')}

Requirements:
- Format as JSON with fields: title, content, excerpt, tags, category, imagePrompt
- Maintain all original facts and insights
- Improve structure and readability
- Naturally incorporate target keywords
- Add engaging hooks and call-to-actions
- Optimize for featured snippets
- 1500-2000 words`;
  }

  private parseGeneratedContent(response: string, type: string): GeneratedContent {
    try {
      // JSON 응답 파싱 시도
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        return {
          title: parsed.title || 'Generated Environmental Content',
          content: parsed.content || response,
          excerpt: parsed.excerpt || this.generateExcerpt(parsed.content || response),
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          seoKeywords: Array.isArray(parsed.seoKeywords) ? parsed.seoKeywords : [],
          readTime: this.calculateReadTime(parsed.content || response),
          category: parsed.category || this.getDefaultCategory(type),
          imagePrompt: parsed.imagePrompt
        };
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse JSON response, using fallback parsing');
    }

    // 폴백 파싱
    const lines = response.split('\n').filter(line => line.trim());
    const title = lines.find(line => line.includes('Title:') || line.includes('#'))?.replace(/^[#\*]*\s*Title:\s*/, '') || 'Generated Content';
    
    return {
      title,
      content: response,
      excerpt: this.generateExcerpt(response),
      tags: this.extractTags(response),
      seoKeywords: [],
      readTime: this.calculateReadTime(response),
      category: this.getDefaultCategory(type)
    };
  }

  private generateFallbackContent(type: string, topic?: string): GeneratedContent {
    const fallbackContent = {
      article: {
        title: `Environmental Update: ${topic || 'Latest Sustainability Trends'}`,
        content: `Environmental sustainability continues to be a crucial topic in today's world. Recent developments show promising advances in renewable energy, conservation efforts, and green technology innovations.\n\nKey areas of progress include solar and wind energy adoption, electric vehicle infrastructure expansion, and corporate sustainability commitments. These changes represent significant steps toward a more sustainable future.\n\nWhat You Can Do:\n- Reduce energy consumption at home\n- Choose sustainable transportation options\n- Support eco-friendly businesses\n- Stay informed about environmental issues\n\nTogether, we can make a difference in creating a more sustainable world for future generations.`,
        category: 'General'
      },
      product_review: {
        title: `Review: ${topic || 'Eco-Friendly Product'}`,
        content: `This eco-friendly product represents a sustainable alternative to conventional options. Made with environmentally conscious materials and processes, it offers consumers a way to reduce their environmental impact.\n\nKey Features:\n- Sustainable materials\n- Reduced environmental footprint\n- Quality construction\n- Fair pricing\n\nOverall, this product demonstrates the growing availability of sustainable alternatives in the marketplace.`,
        category: 'Product Reviews'
      },
      eco_tip: {
        title: `Eco Tip: Sustainable ${topic || 'Living'}`,
        content: `Here's a simple way to make your daily routine more environmentally friendly.\n\nWhat You'll Need:\n- Common household items\n- A few minutes of your time\n\nSteps:\n1. Identify areas for improvement\n2. Make small, sustainable changes\n3. Track your progress\n4. Share with friends and family\n\nThis simple change can help reduce your environmental impact while saving money over time.`,
        category: 'Eco Tips'
      },
      data_analysis: {
        title: 'Environmental Data Analysis: Current Trends',
        content: `Recent environmental data shows both challenges and opportunities in our fight against climate change.\n\nKey Findings:\n- Global temperature continues to rise\n- Renewable energy adoption is accelerating\n- Conservation efforts are showing results\n- Individual actions are making a difference\n\nThe data suggests that while challenges remain, positive trends indicate progress toward sustainability goals. Continued action at all levels will be crucial for future success.`,
        category: 'Data Analysis'
      }
    };

    const template = fallbackContent[type as keyof typeof fallbackContent] || fallbackContent.article;
    
    return {
      title: template.title,
      content: template.content,
      excerpt: this.generateExcerpt(template.content),
      tags: this.extractTags(template.content),
      seoKeywords: [],
      readTime: this.calculateReadTime(template.content),
      category: template.category
    };
  }

  private generateExcerpt(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.length > 20);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
  }

  private extractTags(content: string): string[] {
    const keywords = [
      'sustainability', 'environment', 'climate', 'renewable', 'green', 'eco',
      'conservation', 'energy', 'carbon', 'solar', 'wind', 'recycling'
    ];
    
    const contentLower = content.toLowerCase();
    return keywords.filter(keyword => contentLower.includes(keyword));
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private getDefaultCategory(type: string): string {
    const categoryMap = {
      article: 'Environmental News',
      product_review: 'Product Reviews',
      eco_tip: 'Eco Tips',
      data_analysis: 'Data Analysis'
    };
    
    return categoryMap[type as keyof typeof categoryMap] || 'General';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 토큰 수 계산
  private countTokens(text: string): number {
    if (!this.tokenEncoder) return Math.ceil(text.length / 4); // 추정값
    
    try {
      return this.tokenEncoder.encode(text).length;
    } catch (error) {
      return Math.ceil(text.length / 4);
    }
  }

  // API 사용량 체크
  async checkAPIUsage(): Promise<boolean> {
    // 실제 구현에서는 OpenAI 사용량 API 체크
    return true;
  }
}

export default AIContentGenerator;