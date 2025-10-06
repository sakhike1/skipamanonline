const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PayFast configuration
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || 'your_merchant_id';
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || 'your_merchant_key';
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || 'your_passphrase';
const PAYFAST_URL = process.env.PAYFAST_URL || 'https://www.payfast.co.za/eng/process';

// Email configuration (you'll need to set up your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create PayFast Payment
app.post('/api/create-payfast-payment', async (req, res) => {
  try {
    const { amount, items, customer } = req.body;

    // Generate unique payment ID
    const paymentId = `PF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create item description
    const itemDescription = items.map(item => `${item.name} (${item.quantity}x)`).join(', ');

    // PayFast payment data
    const paymentData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${req.protocol}://${req.get('host')}/payment/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel`,
      notify_url: `${req.protocol}://${req.get('host')}/api/payfast-notify`,
      name_first: customer.customerName.split(' ')[0] || '',
      name_last: customer.customerName.split(' ').slice(1).join(' ') || '',
      email_address: customer.customerEmail,
      cell_number: customer.customerPhone || '',
      m_payment_id: paymentId,
      amount: (amount / 100).toFixed(2), // Convert cents to Rands
      item_name: itemDescription,
      item_description: `Order from SkipaMan Store - ${itemDescription}`,
    };

    // Generate signature
    const signatureString = Object.keys(paymentData)
      .sort()
      .map(key => `${key}=${encodeURIComponent(paymentData[key])}`)
      .join('&');

    const signature = crypto
      .createHmac('md5', PAYFAST_PASSPHRASE)
      .update(signatureString)
      .digest('hex');

    paymentData.signature = signature;

    // Create form data for PayFast
    const formData = Object.keys(paymentData)
      .map(key => `${key}=${encodeURIComponent(paymentData[key])}`)
      .join('&');

    const paymentUrl = `${PAYFAST_URL}?${formData}`;

    res.json({
      paymentUrl,
      paymentId,
    });
  } catch (error) {
    console.error('Error creating PayFast payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// PayFast Notification Handler
app.post('/api/payfast-notify', (req, res) => {
  try {
    const paymentData = req.body;
    
    // Verify PayFast signature
    const signature = paymentData.signature;
    delete paymentData.signature;
    
    const signatureString = Object.keys(paymentData)
      .sort()
      .map(key => `${key}=${encodeURIComponent(paymentData[key])}`)
      .join('&');
    
    const calculatedSignature = crypto
      .createHmac('md5', PAYFAST_PASSPHRASE)
      .update(signatureString)
      .digest('hex');
    
    if (signature === calculatedSignature && paymentData.payment_status === 'COMPLETE') {
      // Payment successful - update order status
      console.log('Payment successful:', paymentData.m_payment_id);
      // Here you would update your database with the successful payment
      
      res.status(200).send('OK');
    } else {
      console.log('Payment verification failed');
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('PayFast notification error:', error);
    res.status(500).send('Error processing notification');
  }
});

// Send Order Confirmation Email
app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { paymentId, customer, items } = req.body;

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create email content
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: customer.customerEmail,
      subject: `Order Confirmation - Payment ${paymentId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order!</h2>
          <p>Dear ${customer.customerName},</p>
          <p>Your payment has been processed successfully. Here are your order details:</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p><strong>Total Amount:</strong> R${(total / 100).toFixed(2)}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Shipping Address</h3>
            <p>${customer.customerName}</p>
            <p>${customer.shippingAddress.line1}</p>
            ${customer.shippingAddress.line2 ? `<p>${customer.shippingAddress.line2}</p>` : ''}
            <p>${customer.shippingAddress.city}, ${customer.shippingAddress.postal_code}</p>
            <p>${customer.shippingAddress.country}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h3>Items Ordered</h3>
            ${items.map(item => `
              <div style="margin: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Size: ${item.size}, Color: ${item.color.name}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: R${(item.price * item.quantity / 100).toFixed(2)}</p>
              </div>
            `).join('')}
          </div>

          <p>We'll send you a tracking number once your order ships.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(emailContent);

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
