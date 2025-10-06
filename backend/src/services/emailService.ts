import nodemailer from 'nodemailer';
import { IUser } from '../models/User';
import { IOrder } from '../models/Order';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_USER || 'noreply@skipamanstore.com';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const config: EmailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || ''
        }
      };

      // Only create transporter if email credentials are provided
      if (config.auth.user && config.auth.pass) {
        this.transporter = nodemailer.createTransport(config);
        console.log('📧 Email service initialized successfully');
      } else {
        console.log('⚠️ Email credentials not provided. Email service will log emails instead.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  private async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      if (!this.transporter) {
        // Log email instead of sending if no transporter
        console.log('📧 EMAIL WOULD BE SENT:');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${template.subject}`);
        console.log(`   Content: ${template.text}`);
        return true;
      }

      const mailOptions = {
        from: `"SkipaMan Store" <${this.fromEmail}>`,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  private generateOrderConfirmationTemplate(user: IUser, order: IOrder): EmailTemplate {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br>
          <small>Size: ${item.size} | Color: ${item.color.name} | Qty: ${item.quantity}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          R${item.total.toFixed(2)}
        </td>
      </tr>`
    ).join('');

    return {
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SkipaMan Store</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order!</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Order Confirmation</h2>
            <p>Dear ${user.firstName},</p>
            <p>Thank you for your order! We've received your order and are processing it now.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Order Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            </div>
            
            <h3 style="color: #333;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Subtotal:</span>
                <span>R${order.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Shipping:</span>
                <span>R${order.shipping.toFixed(2)}</span>
              </div>
              ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #28a745;">
                <span>Discount:</span>
                <span>-R${order.discount.toFixed(2)}</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #dee2e6; padding-top: 10px;">
                <span>Total:</span>
                <span>R${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <h3 style="color: #333;">Shipping Address</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p style="margin: 0;">
                ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                ${order.shippingAddress.address1}<br>
                ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br>' : ''}
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin-top: 0; color: #1976d2;">What's Next?</h3>
              <p style="margin-bottom: 0;">We'll send you another email when your order ships. You can track your order status anytime in your account.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/orders" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Order Details
              </a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6c757d;">
            <p>Questions about your order? Contact us at support@skipamanstore.com</p>
            <p>&copy; 2024 SkipaMan Store. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        SkipaMan Store - Order Confirmation
        
        Dear ${user.firstName},
        
        Thank you for your order! We've received your order and are processing it now.
        
        Order Details:
        - Order Number: ${order.orderNumber}
        - Order Date: ${orderDate}
        - Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        
        Order Items:
        ${order.items.map(item => 
          `- ${item.productName} (Size: ${item.size}, Color: ${item.color.name}, Qty: ${item.quantity}) - R${item.total.toFixed(2)}`
        ).join('\n')}
        
        Order Summary:
        - Subtotal: R${order.subtotal.toFixed(2)}
        - Shipping: R${order.shipping.toFixed(2)}
        ${order.discount > 0 ? `- Discount: -R${order.discount.toFixed(2)}\n` : ''}
        - Total: R${order.total.toFixed(2)}
        
        Shipping Address:
        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
        ${order.shippingAddress.address1}
        ${order.shippingAddress.address2 ? order.shippingAddress.address2 : ''}
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
        ${order.shippingAddress.country}
        Phone: ${order.shippingAddress.phone}
        
        What's Next?
        We'll send you another email when your order ships. You can track your order status anytime in your account.
        
        View your order: ${process.env.FRONTEND_URL || 'http://localhost:5174'}/orders
        
        Questions about your order? Contact us at support@skipamanstore.com
        
        © 2024 SkipaMan Store. All rights reserved.
      `
    };
  }

  private generateOrderStatusUpdateTemplate(user: IUser, order: IOrder, status: string): EmailTemplate {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed and will be shipped soon.',
      packed: 'Your order has been packed and is ready for shipment.',
      shipped: 'Your order has been shipped and is on its way to you.',
      out_for_delivery: 'Your order is out for delivery and should arrive within 8 hours.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.'
    };

    const statusMessage = statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated.';

    return {
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SkipaMan Store</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Order Status Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Order Update</h2>
            <p>Dear ${user.firstName},</p>
            <p>${statusMessage}</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Order Information</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
              ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
              ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}/orders/${order._id}" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Your Order
              </a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6c757d;">
            <p>Questions about your order? Contact us at support@skipamanstore.com</p>
            <p>&copy; 2024 SkipaMan Store. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        SkipaMan Store - Order Update
        
        Dear ${user.firstName},
        
        ${statusMessage}
        
        Order Information:
        - Order Number: ${order.orderNumber}
        - Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
        ${order.trackingNumber ? `- Tracking Number: ${order.trackingNumber}` : ''}
        ${order.estimatedDelivery ? `- Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}` : ''}
        
        Track your order: ${process.env.FRONTEND_URL || 'http://localhost:5174'}/orders/${order._id}
        
        Questions about your order? Contact us at support@skipamanstore.com
        
        © 2024 SkipaMan Store. All rights reserved.
      `
    };
  }

  // Public methods
  async sendOrderConfirmation(user: IUser, order: IOrder): Promise<boolean> {
    // Check if user has email notifications enabled
    if (!user.preferences?.emailNotifications?.orderUpdates) {
      console.log(`📧 Email notifications disabled for user ${user.email}`);
      return true;
    }

    const template = this.generateOrderConfirmationTemplate(user, order);
    return await this.sendEmail(user.email, template);
  }

  async sendOrderStatusUpdate(user: IUser, order: IOrder, status: string): Promise<boolean> {
    // Check if user has email notifications enabled
    if (!user.preferences?.emailNotifications?.orderUpdates) {
      console.log(`📧 Email notifications disabled for user ${user.email}`);
      return true;
    }

    // Only send emails for important status updates
    const importantStatuses = ['shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!importantStatuses.includes(status)) {
      return true;
    }

    const template = this.generateOrderStatusUpdateTemplate(user, order, status);
    return await this.sendEmail(user.email, template);
  }

  async sendCustomEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
    const template: EmailTemplate = { subject, html, text };
    return await this.sendEmail(to, template);
  }

  // Test email configuration
  async testEmailConfiguration(): Promise<boolean> {
    if (!this.transporter) {
      console.log('⚠️ Email transporter not configured');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email configuration is valid');
      return true;
    } catch (error) {
      console.error('❌ Email configuration test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
