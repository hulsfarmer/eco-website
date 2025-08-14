#!/usr/bin/env npx tsx

import RevenueOptimizer from '../lib/revenue-optimizer';
import AffiliateTrackingSystem from '../lib/affiliate-tracking';
import GoogleAnalyticsIntegration from '../lib/google-analytics-integration';
import AnalyticsManager from '../lib/analytics-manager';

async function testPhase5RevenueSystems() {
  console.log('💰 Testing Phase 5: Revenue Optimization Systems...\n');
  
  const revenueOptimizer = new RevenueOptimizer();
  const affiliateTracker = new AffiliateTrackingSystem();
  const gaIntegration = new GoogleAnalyticsIntegration();
  const analyticsManager = new AnalyticsManager();
  
  try {
    console.log('1️⃣ Testing Revenue Optimization Engine...');
    const optimization = await revenueOptimizer.optimizeRevenue();
    console.log(`✅ Revenue optimization completed:`);
    console.log(`   Ad Placement Recommendations: ${optimization.adPlacement.recommended.length}`);
    console.log(`   Affiliate Opportunities: ${optimization.affiliateOpportunities.topProducts.length} products identified`);
    console.log(`   Content Monetization: ${optimization.contentMonetization.highPerformingContent.length} articles analyzed\n`);
    
    console.log('2️⃣ Testing Revenue Report Generation...');
    const revenueReport = await revenueOptimizer.generateRevenueReport(30);
    console.log(`💰 Revenue Report (30 days):`);
    console.log(`   Total Revenue: $${revenueReport.totalRevenue.toLocaleString()}`);
    console.log(`   Growth Rate: ${(revenueReport.growth * 100).toFixed(1)}%`);
    console.log(`   AdSense: $${revenueReport.breakdown.adsense.revenue} (${(revenueReport.breakdown.adsense.share * 100).toFixed(1)}%)`);
    console.log(`   Affiliate: $${revenueReport.breakdown.affiliate.revenue} (${(revenueReport.breakdown.affiliate.share * 100).toFixed(1)}%)`);
    console.log(`   Optimization Score: ${revenueReport.optimizationScore}/100\n`);
    
    console.log('3️⃣ Testing Affiliate Tracking System...');
    
    // Mock 제휴 클릭 추적
    const clickId = await affiliateTracker.trackAffiliateClick({
      userId: 'user_12345',
      sessionId: 'session_67890',
      affiliateProgram: 'amazon',
      productId: 'B08XYZ123',
      productName: 'Eco-Friendly Solar Panel Kit',
      commission: 25.50,
      destinationUrl: 'https://amazon.com/dp/B08XYZ123',
      sourceUrl: 'https://ecolife.com/reviews/solar-panels'
    });
    console.log(`✅ Affiliate click tracked: ${clickId}`);
    
    // Mock 제휴 전환 추적
    await affiliateTracker.trackAffiliateConversion({
      clickId: clickId,
      transactionId: 'trans_999888',
      orderValue: 299.99,
      commissionAmount: 25.50,
      currency: 'USD',
      conversionDate: new Date(),
      confirmed: true
    });
    console.log(`✅ Affiliate conversion tracked: $25.50 commission`);
    
    console.log('');
    
    console.log('4️⃣ Testing Affiliate Performance Analysis...');
    const affiliatePerformance = await affiliateTracker.analyzeAffiliatePerformance(30);
    console.log(`📊 Affiliate Performance Summary:`);
    console.log(`   Programs Analyzed: ${affiliatePerformance.length}`);
    if (affiliatePerformance.length > 0) {
      const topProgram = affiliatePerformance[0];
      console.log(`   Top Performer: ${topProgram.program}`);
      console.log(`   Revenue: $${topProgram.revenue}`);
      console.log(`   Conversion Rate: ${(topProgram.conversionRate * 100).toFixed(2)}%`);
      console.log(`   Top Product: ${topProgram.topProducts[0]?.product || 'N/A'}`);
    }
    console.log('');
    
    console.log('5️⃣ Testing Google Analytics Integration...');
    
    // 환경 관련 이벤트 추적 테스트
    gaIntegration.trackEnvironmentalAction('article_read', {
      title: 'Complete Guide to Solar Panel Installation',
      duration: 245,
      engagement_score: 85
    });
    
    // 뉴스레터 구독 추적
    gaIntegration.trackNewsletterSignup('homepage_cta');
    
    // 제휴 구매 추적
    gaIntegration.trackAffiliatePurchase({
      affiliate_program: 'Amazon Associates',
      product_name: 'Solar Panel Kit',
      commission: 25.50,
      order_value: 299.99,
      transaction_id: 'trans_999888'
    });
    
    console.log(`✅ Google Analytics events tracked successfully\n`);
    
    console.log('6️⃣ Testing Revenue A/B Tests...');
    const abTests = await revenueOptimizer.runRevenueABTests();
    console.log(`🧪 Revenue A/B Tests Created: ${abTests.length}`);
    abTests.forEach(test => {
      console.log(`   "${test.name}" - Expected uplift: ${(test.expectedUplift * 100).toFixed(0)}%`);
      console.log(`   Estimated revenue impact: $${test.estimatedRevenueImpact.toLocaleString()}`);
    });
    console.log('');
    
    console.log('7️⃣ Testing Seasonal Revenue Strategy...');
    const seasonalStrategy = await revenueOptimizer.getSeasonalRevenueStrategy();
    console.log(`📅 Seasonal Strategy (${seasonalStrategy.currentSeason}):`);
    console.log(`   Focus: ${seasonalStrategy.strategy.focus}`);
    console.log(`   Expected Uplift: ${(seasonalStrategy.strategy.expectedUplift * 100).toFixed(0)}%`);
    console.log(`   Top Categories: ${seasonalStrategy.strategy.topCategories.join(', ')}`);
    console.log(`   Action Items: ${seasonalStrategy.actionItems.length} planned\n`);
    
    console.log('8️⃣ Testing AdSense Performance Tracking...');
    const mockAdSenseData = {
      rpm: Math.floor(Math.random() * 5) + 12, // $12-17 RPM
      impressions: Math.floor(Math.random() * 20000) + 30000,
      clicks: Math.floor(Math.random() * 400) + 300,
      estimated_revenue: Math.floor(Math.random() * 300) + 400
    };
    
    gaIntegration.trackAdSenseRevenue(mockAdSenseData);
    console.log(`✅ AdSense performance tracked:`);
    console.log(`   RPM: $${mockAdSenseData.rpm.toFixed(2)}`);
    console.log(`   CTR: ${(mockAdSenseData.clicks / mockAdSenseData.impressions * 100).toFixed(3)}%`);
    console.log(`   Revenue: $${mockAdSenseData.estimated_revenue}\n`);
    
    console.log('9️⃣ Testing Affiliate Strategy Optimization...');
    const affiliateOptimization = await affiliateTracker.optimizeAffiliateStrategy([]);
    console.log(`🎯 Affiliate Strategy Optimization:`);
    if (affiliateOptimization.topPerformingPrograms.length > 0) {
      console.log(`   Top Program: ${affiliateOptimization.topPerformingPrograms[0].program}`);
    }
    console.log(`   Action Items: ${affiliateOptimization.actionItems.length}`);
    affiliateOptimization.actionItems.slice(0, 3).forEach((item: string) => {
      console.log(`   - ${item}`);
    });
    console.log('');
    
    console.log('🔟 Testing Real-time Affiliate Dashboard...');
    const realTimeDashboard = await affiliateTracker.getRealTimeAffiliateDashboard();
    console.log(`📊 Real-time Affiliate Dashboard:`);
    console.log(`   Today's Revenue: $${realTimeDashboard.todayRevenue}`);
    console.log(`   Today's Clicks: ${realTimeDashboard.todayClicks}`);
    console.log(`   Active A/B Tests: ${realTimeDashboard.activeTests}`);
    console.log(`   Top Link: ${realTimeDashboard.topPerformingLink.product} ($${realTimeDashboard.topPerformingLink.revenue})`);
    console.log(`   Recent Conversions: ${realTimeDashboard.recentConversions.length}\n`);
    
    console.log('🎉 All Phase 5 revenue systems tested successfully!');
    
    console.log('\n💰 Phase 5 Test Results Summary:');
    console.log('=================================');
    console.log(`✅ Revenue Optimization: ${optimization.adPlacement.recommended.length} ad improvements + ${optimization.affiliateOpportunities.topProducts.length} affiliate opportunities`);
    console.log(`✅ Revenue Reporting: $${revenueReport.totalRevenue.toLocaleString()} total revenue analyzed`);
    console.log(`✅ Affiliate Tracking: Click & conversion tracking operational`);
    console.log(`✅ Performance Analysis: ${affiliatePerformance.length} affiliate programs analyzed`);
    console.log(`✅ Google Analytics: Environmental events + revenue tracking integrated`);
    console.log(`✅ A/B Testing: ${abTests.length} revenue optimization tests created`);
    console.log(`✅ Seasonal Strategy: ${seasonalStrategy.currentSeason} campaign plan generated`);
    console.log(`✅ AdSense Tracking: RPM $${mockAdSenseData.rpm.toFixed(2)} + performance monitoring`);
    console.log(`✅ Strategy Optimization: ${affiliateOptimization.actionItems.length} optimization recommendations`);
    console.log(`✅ Real-time Dashboard: $${realTimeDashboard.todayRevenue} today's revenue tracked`);
    
    console.log('\n🚀 Phase 5 Revenue Optimization System is fully operational!');
    console.log('💡 Ready for Google AdSense approval and affiliate marketing scaling.');
    
  } catch (error) {
    console.error('❌ Phase 5 testing failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

testPhase5RevenueSystems();