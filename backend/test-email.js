// Simple email test script
// Run with: node test-email.js

const nodemailer = require('nodemailer');

// Email configuration (update with your credentials)
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password'     // Replace with your app password
  }
};

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter(emailConfig);
    
    // Verify configuration
    await transporter.verify();
    console.log('✅ Email configuration is valid!');
    
    // Send test email
    const mailOptions = {
      from: '"SkipaMan Store" <noreply@skipamanstore.com>',
      to: 'test@example.com', // Replace with your test email
      subject: 'SkipaMan Store - Email Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Test</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SkipaMan Store</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Email Configuration Test</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">🎉 Email Test Successful!</h2>
            <p>If you're receiving this email, your email configuration is working correctly.</p>
            <p>Your SkipaMan store is ready to send order confirmations and updates to customers!</p>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin-top: 0; color: #1976d2;">Next Steps</h3>
              <p style="margin-bottom: 0;">1. Update your backend .env file with these email settings</p>
              <p style="margin-bottom: 0;">2. Test order emails through the admin dashboard</p>
              <p style="margin-bottom: 0;">3. Place a test order to verify the complete flow</p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6c757d;">
            <p>&copy; 2024 SkipaMan Store. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        SkipaMan Store - Email Configuration Test
        
        🎉 Email Test Successful!
        
        If you're receiving this email, your email configuration is working correctly.
        Your SkipaMan store is ready to send order confirmations and updates to customers!
        
        Next Steps:
        1. Update your backend .env file with these email settings
        2. Test order emails through the admin dashboard
        3. Place a test order to verify the complete flow
        
        © 2024 SkipaMan Store. All rights reserved.
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox for the test email');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure you\'re using an App Password (not your regular password)');
    console.log('2. Enable 2-Factor Authentication on your Google account');
    console.log('3. Check that EMAIL_USER and EMAIL_PASS are correct');
    console.log('4. Verify the recipient email address is valid');
  }
}

// Run the test
testEmail();
