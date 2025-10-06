# Email Setup Guide for SkipaMan Store

## Overview
The SkipaMan store now includes a comprehensive email service that sends real emails to customers when orders are placed and updated. This guide will help you configure email functionality.

## Features

### ✅ **Email Types Sent:**
1. **Order Confirmation Emails** - Sent immediately when an order is placed
2. **Order Status Update Emails** - Sent for important status changes:
   - Shipped
   - Out for Delivery
   - Delivered
   - Cancelled

### ✅ **Email Features:**
- Professional HTML email templates
- Responsive design for mobile devices
- Order details included (items, pricing, shipping address)
- Branded SkipaMan Store styling
- Fallback text version for all emails
- User preference respect (users can disable email notifications)

## Email Configuration

### 1. **Gmail Setup (Recommended)**

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled

#### Step 2: Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Generate a new app password for "Mail"
4. Copy the 16-character password

#### Step 3: Configure Environment Variables
Create a `.env` file in your `backend` directory with:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=noreply@skipamanstore.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5174
```

### 2. **Other Email Providers**

#### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Yahoo Mail:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

#### Custom SMTP Server:
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## Testing Email Configuration

### 1. **Admin Dashboard Test**
1. Login to admin dashboard
2. Go to "Email Service" tab
3. Enter your email address
4. Click "Send Test Email"
5. Check your inbox for the test email

### 2. **Test Order Flow**
1. Create a test user account
2. Place a test order
3. Check the user's email for order confirmation
4. Update order status in admin dashboard
5. Check for status update emails

## Email Templates

### Order Confirmation Email Includes:
- Order number and date
- Complete order details (items, sizes, colors, quantities)
- Itemized pricing (subtotal, shipping, discounts, total)
- Shipping address
- Next steps information
- Link to view order details

### Order Status Update Email Includes:
- Order number
- New status
- Tracking number (if available)
- Estimated delivery date (if available)
- Link to track order

## User Email Preferences

Users can control their email notifications through their account preferences:
- Order updates (enabled by default)
- Promotions (enabled by default)
- Newsletter (disabled by default)
- Product recommendations (enabled by default)

## Troubleshooting

### Common Issues:

#### 1. **"Email credentials not provided"**
- Check that all email environment variables are set
- Verify the `.env` file is in the correct location (`backend/.env`)

#### 2. **"Authentication failed"**
- For Gmail: Use App Password instead of regular password
- Enable 2-Factor Authentication first
- Check username/password are correct

#### 3. **"Connection timeout"**
- Check firewall settings
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Try different port (465 for SSL, 587 for TLS)

#### 4. **Emails not being received**
- Check spam/junk folder
- Verify recipient email address is correct
- Check email provider's sending limits

### Debug Mode:
If email credentials are not configured, the system will log emails to the console instead of sending them. Check your backend console for:
```
📧 EMAIL WOULD BE SENT:
   To: customer@example.com
   Subject: Order Confirmation - ORD-12345
   Content: [Email content here]
```

## Security Best Practices

1. **Never commit email credentials to version control**
2. **Use environment variables for all sensitive data**
3. **Use App Passwords instead of main account passwords**
4. **Regularly rotate email passwords**
5. **Monitor email sending limits**

## Production Considerations

### 1. **Email Service Providers**
For production, consider using dedicated email services:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

### 2. **Rate Limiting**
Implement rate limiting to prevent spam:
- Limit emails per user per hour
- Implement queue system for bulk emails
- Monitor sending patterns

### 3. **Email Analytics**
Track email performance:
- Delivery rates
- Open rates
- Click rates
- Bounce rates

## API Endpoints

### Admin Email Test:
```
POST /api/admin/test-email
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test Email",
  "message": "This is a test email"
}
```

## Support

If you encounter issues with email configuration:
1. Check the backend console for error messages
2. Verify all environment variables are set correctly
3. Test with a simple email first
4. Check your email provider's documentation
5. Ensure firewall/network settings allow SMTP connections

---

**Note**: Email functionality is designed to gracefully degrade. If email credentials are not configured, the system will continue to work but will log emails to the console instead of sending them.
