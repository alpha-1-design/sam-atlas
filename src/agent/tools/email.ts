import { Tool } from '../core/loop';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

export class EmailTool implements Tool {
  name = 'email';
  description = 'Send transactional and marketing emails';
  requiredCapabilities = ['api', 'resend'];

  async execute(input: Record<string, any>): Promise<any> {
    const action = input.action;

    switch (action) {
      case 'send':
        return this.sendEmail(input);
      case 'send_purchase_confirmation':
        return this.sendPurchaseConfirmation(input);
      case 'send_welcome':
        return this.sendWelcome(input);
      case 'send_marketing':
        return this.sendMarketing(input);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async sendEmail(options: EmailOptions): Promise<any> {
    console.log(`[Email] Sending to ${options.to}: ${options.subject}`);
    
    const templates: Record<string, string> = {
      purchase: this.getPurchaseTemplate(options.data || {}),
      welcome: this.getWelcomeTemplate(options.data || {}),
      support: this.getSupportTemplate(options.data || {}),
      marketing: this.getMarketingTemplate(options.data || {}),
    };

    const html = templates[options.template] || templates.purchase;

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      to: options.to,
      subject: options.subject,
      template: options.template,
    };
  }

  private async sendPurchaseConfirmation(input: any): Promise<any> {
    return this.sendEmail({
      to: input.email,
      subject: 'Your purchase is confirmed!',
      template: 'purchase',
      data: {
        productName: input.productName,
        orderId: input.orderId,
        downloadLink: `https://sam-atlas.vercel.app/downloads/${input.downloadFile}`,
        ...input,
      },
    });
  }

  private async sendWelcome(input: any): Promise<any> {
    return this.sendEmail({
      to: input.email,
      subject: 'Welcome to Sam Atlas!',
      template: 'welcome',
      data: input,
    });
  }

  private async sendMarketing(input: any): Promise<any> {
    return this.sendEmail({
      to: input.email,
      subject: input.subject,
      template: 'marketing',
      data: input,
    });
  }

  private getPurchaseTemplate(data: any): string {
    return `
      <h1>Thank you for your purchase!</h1>
      <p>You've purchased: ${data.productName || 'Our product'}</p>
      <p>Order ID: ${data.orderId || 'N/A'}</p>
      <p>Download your product here: <a href="${data.downloadLink || '#'}">Download</a></p>
      <p>Questions? Reply to this email anytime.</p>
      <p>- Sam Atlas</p>
    `;
  }

  private getWelcomeTemplate(data: any): string {
    return `
      <h1>Welcome to Sam Atlas!</h1>
      <p>Hi ${data.name || 'there'},</p>
      <p>Thanks for joining! I'm Sam Atlas, an autonomous AI agent designed to help you build and scale your online business.</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Check out our products</li>
        <li>Join our community</li>
        <li>Read our latest content</li>
      </ul>
      <p>Let me know if you have any questions!</p>
      <p>- Sam Atlas</p>
    `;
  }

  private getSupportTemplate(data: any): string {
    return `
      <h1>We received your message</h1>
      <p>Hi ${data.name || 'there'},</p>
      <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
      <p>Best,<br>Sam Atlas</p>
    `;
  }

  private getMarketingTemplate(data: any): string {
    return `
      <h1>${data.headline || 'Update from Sam Atlas'}</h1>
      <p>${data.body || ''}</p>
      ${data.cta ? `<p><a href="${data.ctaLink || '#'}">${data.cta}</a></p>` : ''}
    `;
  }
}

export const emailTool = new EmailTool();
