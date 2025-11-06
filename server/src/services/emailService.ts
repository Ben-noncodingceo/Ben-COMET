import nodemailer from 'nodemailer';
import { Asset, Alert, AlertCondition } from '../types';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendPriceAlert(
    alert: Alert,
    asset: Asset,
    currentPrice: number
  ): Promise<void> {
    const condition = alert.condition === AlertCondition.ABOVE ? '高于' : '低于';
    const emoji = alert.condition === AlertCondition.ABOVE ? '📈' : '📉';

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: alert.user_email,
      subject: `${emoji} 价格提醒: ${asset.symbol} ${condition}目标价格`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .price-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
            .price { font-size: 32px; font-weight: bold; color: #667eea; }
            .label { color: #666; font-size: 14px; margin-bottom: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${emoji} 价格提醒触发</h1>
            </div>
            <div class="content">
              <h2>您的价格提醒已触发！</h2>

              <div class="price-box">
                <div class="label">资产名称</div>
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">
                  ${asset.name} (${asset.symbol})
                </div>

                <div class="label">当前价格</div>
                <div class="price">$${currentPrice.toFixed(2)}</div>

                <div class="label" style="margin-top: 15px;">目标价格</div>
                <div style="font-size: 20px; font-weight: bold;">
                  ${condition} $${alert.target_price}
                </div>
              </div>

              <p><strong>提醒条件：</strong> 当价格${condition} $${alert.target_price} 时通知</p>
              <p><strong>触发时间：</strong> ${new Date().toLocaleString('zh-CN')}</p>

              <p style="margin-top: 30px;">
                <a href="http://localhost:3000" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  查看详情
                </a>
              </p>
            </div>
            <div class="footer">
              <p>此邮件由 Ben-COMET 金融监控系统自动发送</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Alert email sent to ${alert.user_email} for ${asset.symbol}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendTestEmail(email: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '测试邮件 - Ben-COMET 金融监控系统',
      html: `
        <h1>邮件配置成功！</h1>
        <p>您的邮件通知功能已正确配置。</p>
        <p>当价格达到您设定的目标时，您将收到类似的提醒邮件。</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
