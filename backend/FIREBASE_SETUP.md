# Firebase Setup Guide for Skipaman Backend

This guide will help you set up Firebase for persistent user data, addresses, and orders storage.

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com/)
2. Firebase Admin SDK service account key

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "skipaman-ecommerce")
4. Follow the setup wizard
5. Note your Project ID

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose the closest to your users)
5. Click "Done"

## Step 3: Get Service Account Key

1. In Firebase Console, go to Project Settings (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. **Keep this file secure and never commit it to version control**

## Step 4: Configure Environment Variables

Create a `.env` file in the backend directory with the following:

### Option 1: Service Account Key (Recommended for production)

```env
# Copy the entire JSON content from your service account key file
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Option 2: Project ID (For development only)

```env
FIREBASE_PROJECT_ID=your-project-id
```

## Step 5: Install Dependencies

```bash
cd backend
npm install
```

## Step 6: Test the Setup

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Check the console output - you should see:
   - "Firebase Admin initialized with service account" (if using service account)
   - "Firebase Admin initialized with project ID" (if using project ID)
   - "Firebase Admin not initialized - using fallback authentication" (if no config)

## Step 7: Firestore Security Rules

Update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Data Structure

The app will automatically create the following collections:

### Users Collection
```javascript
{
  id: "firebase_uid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  dateOfBirth: "1990-01-01",
  gender: "male",
  addresses: [
    {
      id: "addr_1234567890",
      firstName: "John",
      lastName: "Doe",
      company: "Company Name",
      address1: "123 Main St",
      address2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      phone: "+1234567890",
      isDefault: true
    }
  ],
  preferences: {
    language: "en",
    currency: "USD",
    emailNotifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: true
    }
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Orders Collection
```javascript
{
  id: "order_1234567890",
  userId: "firebase_uid",
  status: "pending",
  paymentStatus: "pending",
  items: [
    {
      productId: "prod_001",
      productName: "Classic White T-Shirt",
      productImage: "https://...",
      size: "M",
      color: { name: "White", hex: "#FFFFFF" },
      quantity: 2,
      price: 29.99,
      total: 59.98
    }
  ],
  subtotal: 59.98,
  tax: 5.99,
  shipping: 5.99,
  discount: 0,
  total: 71.96,
  trackingNumber: "TRK123456789",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### "Firebase Admin not initialized" Error
- Check that your environment variables are set correctly
- Verify your service account key JSON is valid
- Ensure your project ID is correct

### "Permission denied" Error
- Check your Firestore security rules
- Verify the user is authenticated
- Ensure the user has permission to access the data

### "Token verification failed" Error
- Check that your Firebase project is properly configured
- Verify the client-side Firebase config matches your project
- Ensure the service account has the necessary permissions

## Production Considerations

1. **Security**: Use proper Firestore security rules
2. **Backup**: Set up automated backups for your Firestore data
3. **Monitoring**: Enable Firebase Analytics and Crashlytics
4. **Scaling**: Monitor your Firestore usage and costs
5. **Environment**: Use different Firebase projects for development and production

## Alternative: Local Development

If you want to develop without Firebase initially, the app will fall back to in-memory storage. Just don't set any Firebase environment variables, and the app will work with temporary data storage. 