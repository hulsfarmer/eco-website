#!/usr/bin/env npx tsx

import ContentScheduler from '../lib/content-scheduler';
import SocialMediaManager from '../lib/social-media-manager';
import EmailMarketingManager from '../lib/email-marketing-manager';
import AnalyticsManager from '../lib/analytics-manager';

async function testPhase4Systems() {
  console.log('🧪 Testing Phase 4: Auto-Publishing & Optimization Systems...\n');
  
  const contentScheduler = new ContentScheduler();
  const socialMediaManager = new SocialMediaManager();
  const emailMarketingManager = new EmailMarketingManager();
  const analyticsManager = new AnalyticsManager();
  
  try {
    console.log('1️⃣ Testing Content Scheduling System...');
    const dailyPlan = await contentScheduler.planDailyContent();
    console.log(`✅ Daily content planned: ${dailyPlan.scheduled || 0} posts scheduled`);
    console.log(`📅 Publishing times: ${dailyPlan.publishingTimes?.join(', ') || 'TBD'}\n`);
    
    console.log('2️⃣ Testing Publishing System...');
    const publishResults = await contentScheduler.publishScheduledContent();
    console.log(`✅ Publishing completed: ${publishResults.published} posts published\n`);
    
    console.log('3️⃣ Testing Social Media Manager...');
    const mockArticle = {
      id: 'test_article_1',
      title: 'Revolutionary Solar Technology Breaks Efficiency Records',
      excerpt: 'New perovskite solar cells achieve 47% efficiency in laboratory tests, promising cheaper renewable energy.',
      category: 'Technology'
    };
    
    const socialResults = await socialMediaManager.shareArticle(mockArticle);
    console.log(`✅ Social sharing completed: ${socialResults.filter(r => r.success).length}/${socialResults.length} successful`);
    socialResults.forEach(result => {
      if (result.success) {
        console.log(`   📱 ${result.platform}: ${result.engagement?.likes} likes, ${result.engagement?.shares} shares`);
      }
    });
    console.log('');
    
    console.log('4️⃣ Testing Email Marketing System...');
    const mockNewsletterContent = {
      weekOf: new Date().toLocaleDateString(),
      topArticles: [mockArticle],
      environmentalHighlights: [
        { dataType: 'Global Temperature', value: 1.28, unit: '°C', region: 'global' },
        { dataType: 'CO2 Concentration', value: 421.4, unit: 'ppm', region: 'global' }
      ]
    };
    
    const emailResults = await emailMarketingManager.sendWeeklyNewsletter(mockNewsletterContent);
    console.log(`✅ Newsletter sent to ${emailResults.sent} subscribers`);
    if (emailResults.failed > 0) {
      console.log(`⚠️ ${emailResults.failed} emails failed to send`);
    }
    console.log('');
    
    console.log('5️⃣ Testing Analytics & Performance...');
    const dashboard = await analyticsManager.generatePerformanceDashboard(7);
    console.log(`📊 Performance Dashboard (7 days):`);
    console.log(`   Total Views: ${dashboard.totalViews.toLocaleString()}`);
    console.log(`   Unique Visitors: ${dashboard.uniqueVisitors.toLocaleString()}`);
    console.log(`   Bounce Rate: ${(dashboard.bounceRate * 100).toFixed(1)}%`);
    console.log(`   Newsletter Signups: ${dashboard.conversions.newsletterSignups}`);
    console.log(`   Top Article: "${dashboard.topArticles[0]?.title}" (${dashboard.topArticles[0]?.views} views)\n`);
    
    console.log('6️⃣ Testing Content Performance Analysis...');
    const contentPerformance = await analyticsManager.analyzeContentPerformance(30);
    console.log(`📈 Content Performance (30 days):`);
    console.log(`   Total Articles Analyzed: ${contentPerformance.length}`);
    if (contentPerformance.length > 0) {
      const topArticle = contentPerformance[0];
      console.log(`   Top Performer: "${topArticle.title}"`);
      console.log(`   Views: ${topArticle.views.toLocaleString()}`);
      console.log(`   Avg Read Time: ${Math.floor(topArticle.avgReadTime / 60)}:${(topArticle.avgReadTime % 60).toString().padStart(2, '0')}`);
      console.log(`   Engagement Rate: ${(topArticle.engagement * 100).toFixed(1)}%`);
    }
    console.log('');
    
    console.log('7️⃣ Testing SEO Performance Analysis...');
    const seoMetrics = await analyticsManager.analyzeSEOPerformance();
    console.log(`🔍 SEO Performance:`);
    console.log(`   Organic Sessions: ${seoMetrics.organicTraffic.sessions.toLocaleString()}`);
    console.log(`   Average Position: ${seoMetrics.organicTraffic.avgPosition.toFixed(1)}`);
    console.log(`   Click-through Rate: ${(seoMetrics.organicTraffic.ctr * 100).toFixed(2)}%`);
    console.log(`   Page Speed Score: ${seoMetrics.technicalSEO.pageSpeed}`);
    console.log(`   Top Keyword: "${seoMetrics.topKeywords[0].keyword}" (Position ${seoMetrics.topKeywords[0].position})\n`);
    
    console.log('8️⃣ Testing A/B Testing System...');
    const abTest = await analyticsManager.createABTest({
      name: 'Homepage Hero CTA Button',
      variants: { 
        control: 'Get Started',
        variant: 'Join EcoLife' 
      },
      metric: 'newsletter_signup_rate',
      trafficSplit: 0.5
    });
    console.log(`🧪 A/B Test Created: "${abTest.name}" (${abTest.id})`);
    
    const testResults = await analyticsManager.getABTestResults(abTest.id);
    if (testResults?.results) {
      console.log(`   Control: ${(testResults.results.control.rate * 100).toFixed(2)}% conversion`);
      console.log(`   Variant: ${(testResults.results.variant.rate * 100).toFixed(2)}% conversion`);
      console.log(`   Winner: ${testResults.results.winner} (${(testResults.results.confidence * 100).toFixed(1)}% confidence)\n`);
    }
    
    console.log('9️⃣ Testing Revenue Analysis...');
    const revenueAnalysis = await analyticsManager.analyzeRevenue(30);
    console.log(`💰 Revenue Analysis (30 days):`);
    console.log(`   Total Revenue: $${revenueAnalysis.totalRevenue.toLocaleString()}`);
    console.log(`   AdSense: $${revenueAnalysis.sources.adsense.revenue} (RPM: $${revenueAnalysis.sources.adsense.rpm.toFixed(2)})`);
    console.log(`   Affiliate: $${revenueAnalysis.sources.affiliate.revenue} (${(revenueAnalysis.sources.affiliate.conversionRate * 100).toFixed(1)}% CR)`);
    console.log(`   Newsletter: $${revenueAnalysis.sources.newsletter.revenue}\n`);
    
    console.log('🔟 Testing Real-time Analytics...');
    const realTimeStats = await analyticsManager.getRealTimeStats();
    console.log(`⏱️ Real-time Statistics:`);
    console.log(`   Active Users: ${realTimeStats.activeUsers}`);
    console.log(`   Current Page Views: ${realTimeStats.currentPageViews}`);
    console.log(`   Top Active Page: ${realTimeStats.topActivePages[0]?.page} (${realTimeStats.topActivePages[0]?.activeUsers} users)`);
    console.log(`   Recent Event: ${realTimeStats.recentEvents[0]?.type} on ${realTimeStats.recentEvents[0]?.page}\n`);
    
    console.log('🎉 All Phase 4 systems tested successfully!');
    
    console.log('\n📊 Phase 4 Test Results Summary:');
    console.log('=================================');
    console.log(`✅ Content Scheduling: ${dailyPlan.scheduled || 'N/A'} posts planned`);
    console.log(`✅ Publishing System: ${publishResults.published} posts published`);
    console.log(`✅ Social Media: ${socialResults.filter(r => r.success).length}/${socialResults.length} platforms successful`);
    console.log(`✅ Email Marketing: ${emailResults.sent} newsletter subscribers reached`);
    console.log(`✅ Analytics Dashboard: ${dashboard.totalViews.toLocaleString()} total views tracked`);
    console.log(`✅ Content Performance: ${contentPerformance.length} articles analyzed`);
    console.log(`✅ SEO Analysis: ${seoMetrics.organicTraffic.sessions.toLocaleString()} organic sessions`);
    console.log(`✅ A/B Testing: "${abTest.name}" test created and analyzed`);
    console.log(`✅ Revenue Tracking: $${revenueAnalysis.totalRevenue.toLocaleString()} total revenue analyzed`);
    console.log(`✅ Real-time Stats: ${realTimeStats.activeUsers} active users monitored`);
    
  } catch (error) {
    console.error('❌ Phase 4 testing failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

testPhase4Systems();