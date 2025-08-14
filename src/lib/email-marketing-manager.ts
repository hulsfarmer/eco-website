import nodemailer from 'nodemailer';
import { prisma } from './prisma';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface NewsletterContent {
  weekOf: string;
  topArticles: any[];
  environmentalHighlights: any[];
  weeklyTip?: any;
  productSpotlight?: any;
}

interface EmailResult {
  sent: number;
  failed: number;
  results: any[];
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  preferences: {
    newsletter: boolean;
    productUpdates: boolean;
    ecoTips: boolean;
  };
  subscribedAt: Date;
  active: boolean;
}

class EmailMarketingManager {
  private transporter: nodemailer.Transporter | null = null;
  
  constructor() {
    this.initializeEmailService();
  }

  // 이메일 서비스 초기화
  private async initializeEmailService() {
    const emailConfig = {
      service: 'gmail', // 또는 다른 이메일 서비스
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    if (emailConfig.auth.user && emailConfig.auth.pass) {
      try {
        this.transporter = nodemailer.createTransporter(emailConfig);
        console.log('✅ Email service initialized');
      } catch (error) {
        console.error('❌ Email service initialization failed:', error);
      }
    } else {
      console.warn('⚠️ Email credentials not configured - using mock mode');
    }
  }

  // 주간 뉴스레터 발송
  async sendWeeklyNewsletter(content: NewsletterContent): Promise<EmailResult> {
    console.log(`📧 Sending weekly newsletter for week of ${content.weekOf}...`);

    try {
      // 구독자 목록 조회 (실제로는 subscribers 테이블에서)
      const subscribers = await this.getActiveSubscribers('newsletter');
      
      if (subscribers.length === 0) {
        console.log('⚠️ No newsletter subscribers found');
        return { sent: 0, failed: 0, results: [] };
      }

      // 뉴스레터 템플릿 생성
      const newsletter = this.generateNewsletterTemplate(content);

      const results = [];
      let sent = 0;
      let failed = 0;

      // 배치 발송 (너무 많은 동시 요청 방지)
      const batchSize = 50;
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const batchResults = await Promise.allSettled(
          batch.map(subscriber => 
            this.sendEmail(subscriber.email, newsletter, subscriber)
          )
        );

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.success) {
            sent++;
          } else {
            failed++;
            console.error(`❌ Failed to send to ${batch[index].email}:`, 
              result.status === 'rejected' ? result.reason : result.value.error
            );
          }
          results.push(result);
        });

        // 배치 간 딜레이 (이메일 서비스 제한 방지)
        if (i + batchSize < subscribers.length) {
          await this.delay(5000); // 5초 딜레이
        }
      }

      // 발송 결과 로깅
      await this.logEmailCampaign({
        type: 'weekly_newsletter',
        subject: newsletter.subject,
        sent: sent,
        failed: failed,
        totalSubscribers: subscribers.length,
        sentAt: new Date()
      });

      console.log(`✅ Newsletter sent: ${sent} successful, ${failed} failed`);
      return { sent, failed, results };

    } catch (error) {
      console.error('❌ Weekly newsletter sending failed:', error);
      return { sent: 0, failed: 0, results: [{ error: error instanceof Error ? error.message : 'Unknown error' }] };
    }
  }

  // 환경 팁 이메일 시리즈
  async sendEcoTipSeries(tips: any[]): Promise<EmailResult> {
    console.log(`💡 Sending eco tip email series (${tips.length} tips)...`);

    const subscribers = await this.getActiveSubscribers('ecoTips');
    const results = [];
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < tips.length; i++) {
      const tip = tips[i];
      
      try {
        // 각 팁을 하루씩 간격으로 발송 예약
        const sendDate = new Date();
        sendDate.setDate(sendDate.getDate() + i);

        const template = this.generateEcoTipTemplate(tip, i + 1, tips.length);
        
        // 실제로는 이메일 스케줄러에 예약
        // 여기서는 즉시 발송
        const result = await this.sendBulkEmail(subscribers, template);
        
        totalSent += result.sent;
        totalFailed += result.failed;
        results.push({
          tip: tip.title,
          sent: result.sent,
          failed: result.failed,
          scheduledFor: sendDate
        });

        console.log(`📧 Eco tip ${i + 1} scheduled: "${tip.title}"`);

      } catch (error) {
        console.error(`❌ Failed to schedule tip ${i + 1}:`, error);
        totalFailed += subscribers.length;
      }
    }

    console.log(`✅ Eco tip series scheduled: ${totalSent} total sends`);
    return { sent: totalSent, failed: totalFailed, results };
  }

  // 제품 할인 및 프로모션 이메일
  async sendProductPromotion(products: any[], discount?: { percent: number; code: string }): Promise<EmailResult> {
    console.log(`🛍️ Sending product promotion email for ${products.length} products...`);

    const subscribers = await this.getActiveSubscribers('productUpdates');
    
    const template = this.generateProductPromotionTemplate(products, discount);
    const result = await this.sendBulkEmail(subscribers, template);

    await this.logEmailCampaign({
      type: 'product_promotion',
      subject: template.subject,
      sent: result.sent,
      failed: result.failed,
      totalSubscribers: subscribers.length,
      sentAt: new Date()
    });

    console.log(`✅ Product promotion sent: ${result.sent} successful`);
    return result;
  }

  // 환경 데이터 알림 (긴급)
  async sendEnvironmentalAlert(data: any, alertType: 'urgent' | 'warning' | 'info'): Promise<EmailResult> {
    console.log(`🚨 Sending environmental alert: ${alertType}`);

    // 알림 수신 동의 구독자만 (실제로는 별도 preference)
    const subscribers = await this.getActiveSubscribers('newsletter');
    
    const template = this.generateEnvironmentalAlertTemplate(data, alertType);
    const result = await this.sendBulkEmail(subscribers, template);

    console.log(`📊 Environmental alert sent: ${result.sent} recipients`);
    return result;
  }

  // 구독자 관리
  async addSubscriber(email: string, name?: string, preferences?: any): Promise<any> {
    console.log(`➕ Adding new subscriber: ${email}`);

    // 실제로는 subscribers 테이블에 저장
    // 여기서는 Mock 데이터 반환
    const subscriber = {
      id: `sub_${Date.now()}`,
      email,
      name,
      preferences: {
        newsletter: true,
        productUpdates: false,
        ecoTips: true,
        ...preferences
      },
      subscribedAt: new Date(),
      active: true
    };

    console.log(`✅ Subscriber added: ${email}`);
    return subscriber;
  }

  async unsubscribe(email: string, reason?: string): Promise<boolean> {
    console.log(`➖ Unsubscribing: ${email}`);
    
    // 실제로는 DB에서 구독자 비활성화
    console.log(`✅ Unsubscribed: ${email}${reason ? ` (${reason})` : ''}`);
    return true;
  }

  // 이메일 성과 분석
  async analyzeEmailPerformance(days: number = 30): Promise<any> {
    console.log(`📊 Analyzing email performance for last ${days} days...`);

    // Mock 분석 데이터
    const performance = {
      campaigns: Math.floor(Math.random() * 20) + 10,
      totalSent: Math.floor(Math.random() * 50000) + 25000,
      totalOpens: Math.floor(Math.random() * 20000) + 10000,
      totalClicks: Math.floor(Math.random() * 5000) + 2500,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0.5 + Math.random() * 1, // 0.5-1.5%
      topPerformingCampaigns: [
        {
          subject: 'Weekly Environmental Update',
          opens: Math.floor(Math.random() * 3000) + 1500,
          clicks: Math.floor(Math.random() * 800) + 400,
          sentAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000)
        },
        {
          subject: 'Top 10 Eco-Friendly Products This Month',
          opens: Math.floor(Math.random() * 2500) + 1200,
          clicks: Math.floor(Math.random() * 600) + 300,
          sentAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000)
        }
      ],
      subscriberGrowth: {
        newSubscribers: Math.floor(Math.random() * 500) + 200,
        unsubscribes: Math.floor(Math.random() * 100) + 50,
        netGrowth: 0
      }
    };

    // 비율 계산
    performance.openRate = Math.round((performance.totalOpens / performance.totalSent) * 100 * 100) / 100;
    performance.clickRate = Math.round((performance.totalClicks / performance.totalSent) * 100 * 100) / 100;
    performance.subscriberGrowth.netGrowth = performance.subscriberGrowth.newSubscribers - performance.subscriberGrowth.unsubscribes;

    console.log(`📈 Email performance summary:`);
    console.log(`   Campaigns: ${performance.campaigns}`);
    console.log(`   Open Rate: ${performance.openRate}%`);
    console.log(`   Click Rate: ${performance.clickRate}%`);
    console.log(`   Net Growth: +${performance.subscriberGrowth.netGrowth} subscribers`);

    return performance;
  }

  // === 템플릿 생성 메서드들 ===

  private generateNewsletterTemplate(content: NewsletterContent): EmailTemplate {
    const subject = `EcoLife Weekly: ${content.weekOf} Environmental Highlights`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #16a085, #27ae60); color: white; padding: 30px; text-align: center; }
          .content { padding: 20px; }
          .article { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
          .article h3 { color: #27ae60; margin-bottom: 10px; }
          .article p { margin-bottom: 15px; color: #666; }
          .cta-button { background: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .environmental-data { background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌍 EcoLife Weekly</h1>
          <p>Week of ${content.weekOf}</p>
        </div>
        
        <div class="content">
          <h2>🔥 This Week's Top Environmental Stories</h2>
          ${content.topArticles.slice(0, 5).map(article => `
            <div class="article">
              <h3>${article.title}</h3>
              <p>${article.excerpt}</p>
              <a href="https://ecolife.com/articles/${article.id}" class="cta-button">Read More</a>
            </div>
          `).join('')}
          
          ${content.environmentalHighlights.length > 0 ? `
            <div class="environmental-data">
              <h2>📊 Environmental Data Highlights</h2>
              ${content.environmentalHighlights.map(data => `
                <p><strong>${data.dataType}:</strong> ${data.value} ${data.unit} (${data.region})</p>
              `).join('')}
            </div>
          ` : ''}
          
          ${content.weeklyTip ? `
            <div class="article">
              <h2>💡 Eco Tip of the Week</h2>
              <h3>${content.weeklyTip.title}</h3>
              <p>${content.weeklyTip.excerpt}</p>
              <a href="https://ecolife.com/articles/${content.weeklyTip.id}" class="cta-button">Get the Full Tip</a>
            </div>
          ` : ''}
          
          ${content.productSpotlight ? `
            <div class="article">
              <h2>⭐ Product Spotlight</h2>
              <h3>${content.productSpotlight.title}</h3>
              <p>${content.productSpotlight.excerpt}</p>
              <a href="https://ecolife.com/articles/${content.productSpotlight.id}" class="cta-button">Read Review</a>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Thank you for being part of the EcoLife community!</p>
          <p>🌱 Together, we're building a more sustainable future.</p>
          <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="https://ecolife.com">Visit our website</a></p>
        </div>
      </body>
      </html>
    `;

    const text = `
EcoLife Weekly - Week of ${content.weekOf}

This Week's Top Environmental Stories:
${content.topArticles.slice(0, 5).map(article => `
${article.title}
${article.excerpt}
Read more: https://ecolife.com/articles/${article.id}
`).join('\n')}

${content.weeklyTip ? `
Eco Tip of the Week: ${content.weeklyTip.title}
${content.weeklyTip.excerpt}
Get the full tip: https://ecolife.com/articles/${content.weeklyTip.id}
` : ''}

Visit EcoLife: https://ecolife.com
Unsubscribe: {{unsubscribe_url}}
    `;

    return { subject, html, text };
  }

  private generateEcoTipTemplate(tip: any, tipNumber: number, totalTips: number): EmailTemplate {
    const subject = `💡 Eco Tip #${tipNumber}: ${tip.title}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 25px; }
          .tip-number { background: #e8f5e8; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
          .cta { text-align: center; margin: 25px 0; }
          .cta-button { background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💡 Daily Eco Tip</h1>
        </div>
        
        <div class="content">
          <div class="tip-number">
            <h2>Tip #${tipNumber} of ${totalTips}</h2>
          </div>
          
          <h2>${tip.title}</h2>
          <p>${tip.excerpt}</p>
          
          <div class="cta">
            <a href="https://ecolife.com/articles/${tip.id}" class="cta-button">Get Full Instructions</a>
          </div>
          
          <p><small>Tomorrow: Another great eco tip! 🌱</small></p>
        </div>
      </body>
      </html>
    `;

    const text = `
Daily Eco Tip #${tipNumber} of ${totalTips}

${tip.title}

${tip.excerpt}

Get full instructions: https://ecolife.com/articles/${tip.id}

Tomorrow: Another great eco tip! 🌱
    `;

    return { subject, html, text };
  }

  private generateProductPromotionTemplate(products: any[], discount?: { percent: number; code: string }): EmailTemplate {
    const subject = discount 
      ? `🛍️ ${discount.percent}% OFF Sustainable Products - Limited Time!`
      : '🌟 Featured Eco-Friendly Products This Week';
      
    const discountSection = discount ? `
      <div style="background: #ff6b35; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h2>🎉 ${discount.percent}% OFF Everything!</h2>
        <p>Use code: <strong>${discount.code}</strong></p>
        <p>Limited time offer - expires soon!</p>
      </div>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a085, #27ae60); color: white; padding: 30px; text-align: center;">
          <h1>🛍️ Sustainable Products</h1>
        </div>
        
        ${discountSection}
        
        <div style="padding: 20px;">
          ${products.map(product => `
            <div style="border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3>${product.name} by ${product.brand}</h3>
              <p><strong>Sustainability Score:</strong> ${product.sustainability}% 🌱</p>
              <p><strong>Rating:</strong> ${product.rating}/5 ⭐</p>
              <p><strong>Price:</strong> $${product.price}</p>
              <p>${product.description}</p>
              <a href="https://ecolife.com/products/${product.id}" style="background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Product</a>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    const text = products.map(p => `
${p.name} by ${p.brand}
Sustainability: ${p.sustainability}% | Rating: ${p.rating}/5 | Price: $${p.price}
${p.description}
View: https://ecolife.com/products/${p.id}
    `).join('\n');

    return { subject, html, text };
  }

  private generateEnvironmentalAlertTemplate(data: any, alertType: 'urgent' | 'warning' | 'info'): EmailTemplate {
    const urgencyMap = {
      urgent: { emoji: '🚨', color: '#e74c3c', title: 'URGENT Environmental Alert' },
      warning: { emoji: '⚠️', color: '#f39c12', title: 'Environmental Warning' },
      info: { emoji: 'ℹ️', color: '#3498db', title: 'Environmental Update' }
    };
    
    const config = urgencyMap[alertType];
    const subject = `${config.emoji} ${config.title}: ${data.dataType}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${config.color}; color: white; padding: 20px; text-align: center;">
          <h1>${config.emoji} ${config.title}</h1>
        </div>
        <div style="padding: 20px;">
          <h2>${data.dataType}: ${data.value} ${data.unit}</h2>
          <p><strong>Region:</strong> ${data.region}</p>
          <p><strong>Source:</strong> ${data.source}</p>
          <p><strong>Recorded:</strong> ${new Date(data.recordedAt).toLocaleDateString()}</p>
        </div>
      </div>
    `;

    const text = `${config.title}: ${data.dataType}
Value: ${data.value} ${data.unit}
Region: ${data.region}
Source: ${data.source}
Recorded: ${new Date(data.recordedAt).toLocaleDateString()}`;

    return { subject, html, text };
  }

  // === 헬퍼 메서드들 ===

  private async getActiveSubscribers(type: 'newsletter' | 'productUpdates' | 'ecoTips'): Promise<Subscriber[]> {
    // Mock 구독자 데이터 (실제로는 DB 조회)
    const mockSubscribers: Subscriber[] = Array.from({ length: 500 + Math.floor(Math.random() * 1000) }, (_, i) => ({
      id: `sub_${i + 1}`,
      email: `subscriber${i + 1}@example.com`,
      name: `Subscriber ${i + 1}`,
      preferences: {
        newsletter: Math.random() > 0.2,
        productUpdates: Math.random() > 0.5,
        ecoTips: Math.random() > 0.3
      },
      subscribedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      active: Math.random() > 0.05 // 95% 활성 구독자
    }));

    return mockSubscribers.filter(sub => 
      sub.active && sub.preferences[type]
    );
  }

  private async sendEmail(to: string, template: EmailTemplate, subscriber?: any): Promise<{ success: boolean; error?: string }> {
    if (!this.transporter) {
      // Mock 이메일 발송
      return {
        success: Math.random() > 0.05, // 95% 성공률
        error: Math.random() > 0.05 ? undefined : 'Mock email service error'
      };
    }

    try {
      // 개인화된 콘텐츠 (구독자 정보 활용)
      let personalizedHtml = template.html;
      let personalizedText = template.text;
      
      if (subscriber) {
        const unsubscribeUrl = `https://ecolife.com/unsubscribe?token=${subscriber.id}`;
        personalizedHtml = personalizedHtml.replace('{{unsubscribe_url}}', unsubscribeUrl);
        personalizedText = personalizedText.replace('{{unsubscribe_url}}', unsubscribeUrl);
        
        if (subscriber.name) {
          personalizedHtml = personalizedHtml.replace('{{name}}', subscriber.name);
          personalizedText = personalizedText.replace('{{name}}', subscriber.name);
        }
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: template.subject,
        html: personalizedHtml,
        text: personalizedText
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Email sending failed' 
      };
    }
  }

  private async sendBulkEmail(subscribers: Subscriber[], template: EmailTemplate): Promise<EmailResult> {
    const results = [];
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const result = await this.sendEmail(subscriber.email, template, subscriber);
      
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
      
      results.push(result);

      // 이메일 서비스 제한 방지 (초당 10개)
      await this.delay(100);
    }

    return { sent, failed, results };
  }

  private async logEmailCampaign(campaign: any): Promise<void> {
    // 실제로는 email_campaigns 테이블에 저장
    console.log(`📊 Campaign logged:`, {
      type: campaign.type,
      sent: campaign.sent,
      failed: campaign.failed,
      openRate: 'TBD',
      clickRate: 'TBD'
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default EmailMarketingManager;