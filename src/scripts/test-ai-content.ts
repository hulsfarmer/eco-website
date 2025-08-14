#!/usr/bin/env npx tsx

import AIContentGenerator from '../lib/ai-content-generator';
import SEOOptimizer from '../lib/seo-optimizer';
import ContentManager from '../lib/content-manager';

async function testAIContentGeneration() {
  console.log('🧪 Testing AI Content Generation System...\n');
  
  const aiGenerator = new AIContentGenerator();
  const seoOptimizer = new SEOOptimizer();
  const contentManager = new ContentManager();
  
  try {
    console.log('1️⃣ Testing AI Article Generation...');
    const article = await aiGenerator.generateEnvironmentalArticle(
      'renewable energy breakthrough', 
      [
        { dataType: 'renewable_energy_share', value: 32.8, unit: '%', region: 'global' },
        { dataType: 'co2_concentration', value: 421.4, unit: 'ppm', region: 'global' }
      ]
    );
    console.log(`✅ Generated article: "${article.title}"`);
    console.log(`📝 Content length: ${article.content.length} characters`);
    console.log(`⏱️ Read time: ${article.readTime} minutes\n`);
    
    console.log('2️⃣ Testing SEO Analysis...');
    const seoAnalysis = await seoOptimizer.analyzeContent(article.content, article.title);
    console.log(`📊 SEO Score: ${seoAnalysis.score}/100`);
    console.log(`🔍 Primary keywords: ${seoAnalysis.keywords.primary.slice(0, 5).join(', ')}`);
    console.log(`📖 Readability: ${seoAnalysis.readability.level} (${seoAnalysis.readability.score})`);
    if (seoAnalysis.issues.length > 0) {
      console.log(`⚠️ Issues: ${seoAnalysis.issues.slice(0, 3).join(', ')}`);
    }
    console.log('');
    
    console.log('3️⃣ Testing SEO Optimization...');
    const optimized = await seoOptimizer.optimizeContent(
      article.title,
      article.content,
      ['renewable energy', 'sustainability', 'climate change']
    );
    console.log(`✅ Optimized title: "${optimized.title}"`);
    console.log(`📝 Meta description: "${optimized.metaDescription}"`);
    console.log(`🔗 URL slug: ${optimized.slug}`);
    console.log(`📈 SEO Score: ${optimized.seoScore}/100\n`);
    
    console.log('4️⃣ Testing Eco Tip Generation...');
    const ecoTip = await aiGenerator.generateEcoTip('Energy Saving');
    console.log(`✅ Generated tip: "${ecoTip.title}"`);
    console.log(`🏷️ Category: ${ecoTip.category}`);
    console.log(`🔖 Tags: ${ecoTip.tags.join(', ')}\n`);
    
    console.log('5️⃣ Testing Product Review Generation...');
    const sampleProduct = {
      name: 'Solar Powered Phone Charger',
      brand: 'EcoTech',
      category: 'Electronics',
      price: 89.99,
      rating: 4.3,
      sustainability: 92,
      description: 'Portable solar charger with high efficiency panels'
    };
    
    const productReview = await aiGenerator.generateProductReview(sampleProduct);
    console.log(`✅ Generated review: "${productReview.title}"`);
    console.log(`📝 Review length: ${productReview.content.length} characters`);
    console.log(`⭐ Category: ${productReview.category}\n`);
    
    console.log('6️⃣ Testing Content Gap Analysis...');
    const contentGaps = await contentManager.analyzeContentGaps();
    console.log(`📊 Identified ${contentGaps.length} content gaps:`);
    console.log(`🎯 Top gaps: ${contentGaps.slice(0, 5).join(', ')}\n`);
    
    console.log('7️⃣ Testing Content Metrics...');
    const metrics = await contentManager.analyzeContentMetrics();
    console.log(`📈 Total articles: ${metrics.totalArticles}`);
    console.log(`📅 Published today: ${metrics.publishedToday}`);
    console.log(`🎯 Average SEO score: ${metrics.avgSEOScore}/100`);
    console.log(`⚠️ Need optimization: ${metrics.needsOptimization}\n`);
    
    console.log('8️⃣ Testing Keyword Suggestion...');
    const keywords = await seoOptimizer.suggestKeywords('solar energy', 'article');
    console.log(`🔑 Suggested keywords for 'solar energy':`);
    console.log(`📝 ${keywords.slice(0, 8).join(', ')}\n`);
    
    console.log('🎉 All AI content generation tests completed successfully!');
    
    console.log('\n📊 Test Results Summary:');
    console.log('==========================');
    console.log(`✅ Article generation: Success`);
    console.log(`✅ SEO analysis: ${seoAnalysis.score}/100 score`);
    console.log(`✅ Content optimization: ${optimized.seoScore}/100 score`);
    console.log(`✅ Eco tip generation: Success`);
    console.log(`✅ Product review: Success`);
    console.log(`✅ Content gap analysis: ${contentGaps.length} gaps found`);
    console.log(`✅ Metrics analysis: ${metrics.totalArticles} total articles`);
    console.log(`✅ Keyword suggestions: ${keywords.length} keywords`);
    
  } catch (error) {
    console.error('❌ AI content generation test failed:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      console.log('\n💡 Note: OpenAI API key not configured - some features running in fallback mode');
      console.log('   Add your OpenAI API key to .env.local to test full AI capabilities');
    }
    
    process.exit(1);
  }
  
  process.exit(0);
}

testAIContentGeneration();