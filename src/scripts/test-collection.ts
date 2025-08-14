#!/usr/bin/env npx tsx

import ContentScheduler from '../lib/scheduler';

async function testContentCollection() {
  console.log('🧪 Testing automated content collection system...\n');
  
  const scheduler = new ContentScheduler();
  
  try {
    console.log('1️⃣ Testing RSS Collection...');
    const rssResults = await scheduler.runTaskManually('rss');
    console.log(`✅ RSS Collection: ${rssResults.length} new articles\n`);
    
    console.log('2️⃣ Testing Environmental Data Collection...');
    const dataResults = await scheduler.runTaskManually('data');
    console.log('✅ Environmental Data Collection completed\n');
    
    console.log('3️⃣ Testing Web Scraping...');
    const scrapingResults = await scheduler.runTaskManually('scraping');
    console.log(`✅ Web Scraping: ${scrapingResults.products.length} products, ${scrapingResults.news.length} articles\n`);
    
    console.log('4️⃣ Testing Data Cleanup...');
    await scheduler.runTaskManually('cleanup');
    console.log('✅ Data Cleanup completed\n');
    
    console.log('🎉 All content collection tests completed successfully!');
    console.log('\n📊 Test Results Summary:');
    console.log('==========================');
    console.log(`RSS Articles: ${rssResults.length}`);
    console.log(`Scraped Products: ${scrapingResults.products.length}`);
    console.log(`Scraped News: ${scrapingResults.news.length}`);
    console.log(`Price Comparisons: ${scrapingResults.priceComparisons.length}`);
    
  } catch (error) {
    console.error('❌ Content collection test failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

testContentCollection();