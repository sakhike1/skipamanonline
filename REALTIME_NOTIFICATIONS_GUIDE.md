# Real-Time Admin-to-User Notifications Guide

## Overview
The SkipaMan store now has a comprehensive real-time notification system that allows administrators to send immediate updates to users. When admins update orders or send notifications, users will see them instantly without needing to refresh their browser.

## Features Implemented

### 1. **Admin Notification Banner** (`AdminNotificationBanner.tsx`)
- **Location**: Fixed at the top of the page
- **Purpose**: Shows urgent admin messages prominently
- **Features**:
  - Persistent notifications (cannot be dismissed)
  - Priority levels (low, medium, high, urgent)
  - Action buttons for user interaction
  - Auto-dismiss for non-persistent notifications
  - Urgent notifications have pulsing borders

### 2. **Toast Notifications** (`ToastNotification.tsx`)
- **Location**: Top-right corner (configurable)
- **Purpose**: Immediate feedback for order updates and notifications
- **Features**:
  - Auto-dismiss with progress bar
  - Multiple notification types (success, error, warning, info, order updates)
  - Staggered animations for multiple toasts
  - Click to dismiss manually

### 3. **Enhanced Socket.IO Integration** (`socket.ts`)
- **New Events**:
  - `adminBroadcast` - Broadcast messages to all users
  - `systemAnnouncement` - System-wide announcements
  - `orderUpdate` - Enhanced order status updates
  - `newNotification` - Individual user notifications

### 4. **Admin Notification Panel** (`AdminNotificationPanel.tsx`)
- **Purpose**: Admin interface for sending notifications
- **Features**:
  - Broadcast notifications to all users
  - System announcements
  - Priority levels and action requirements
  - Real-time preview

## How It Works

### Admin Actions Trigger User Notifications

#### 1. **Order Status Updates**
When an admin updates an order status:
```javascript
// Backend automatically sends:
// 1. Specific notification to the order owner
// 2. Broadcast notification to all users (for important statuses)
```

#### 2. **Admin Broadcasts**
Admins can send notifications to all users:
```javascript
// API: POST /api/admin/broadcast
{
  "title": "System Maintenance",
  "message": "We'll be performing maintenance tonight from 2-4 AM",
  "priority": "high",
  "actionRequired": false
}
```

#### 3. **System Announcements**
Admins can create system-wide announcements:
```javascript
// API: POST /api/admin/announcement
{
  "title": "New Feature Available",
  "message": "Check out our new custom design tool!",
  "type": "success",
  "persistent": false
}
```

### User Experience

#### 1. **Immediate Visibility**
- Notifications appear instantly when users are logged in
- No page refresh required
- Multiple notification types for different contexts

#### 2. **Priority-Based Display**
- **Urgent**: Red banner with pulsing animation
- **High**: Prominent display with longer duration
- **Medium**: Standard notification
- **Low**: Subtle notification

#### 3. **Action-Oriented**
- Notifications can include action buttons
- Direct links to relevant pages
- Mark as read/unread functionality

## Testing the Real-Time Flow

### 1. **Setup**
```bash
# Start the backend server
cd backend
npm run dev

# Start the frontend
cd ../
npm run dev
```

### 2. **Test Order Updates**
1. Login as admin
2. Go to Admin Dashboard
3. Update an order status to "shipped" or "delivered"
4. Login as the user who placed that order
5. See the real-time notification appear immediately

### 3. **Test Admin Broadcasts**
1. Login as admin
2. Use the Admin Notification Panel
3. Send a broadcast notification
4. Switch to any user account
5. See the notification banner appear at the top

### 4. **Test System Announcements**
1. Login as admin
2. Send a system announcement
3. All logged-in users will see the announcement immediately

## API Endpoints

### Admin Endpoints
```javascript
// Send broadcast notification
POST /api/admin/broadcast
{
  "title": "string",
  "message": "string", 
  "priority": "low|medium|high|urgent",
  "actionRequired": boolean,
  "actionUrl": "string"
}

// Send system announcement
POST /api/admin/announcement
{
  "title": "string",
  "message": "string",
  "type": "info|warning|success|error",
  "persistent": boolean
}

// Send individual notification
POST /api/admin/notifications
{
  "userId": "string",
  "type": "notification_type",
  "title": "string",
  "message": "string"
}
```

## Socket.IO Events

### Client-Side Events (Listening)
```javascript
// Listen for admin broadcasts
socketService.onAdminBroadcast((data) => {
  console.log('Admin broadcast:', data);
});

// Listen for system announcements
socketService.onSystemAnnouncement((data) => {
  console.log('System announcement:', data);
});

// Listen for order updates
socketService.onOrderUpdate((data) => {
  console.log('Order update:', data);
});
```

### Server-Side Events (Emitting)
```javascript
// Emit to all users
io.emit('adminBroadcast', notificationData);

// Emit to specific user
io.to(userId).emit('orderUpdate', orderData);

// Emit system announcement
io.emit('systemAnnouncement', announcementData);
```

## Configuration

### Environment Variables
```bash
# Socket.IO Configuration
VITE_SOCKET_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api

# Backend Socket.IO
JWT_SECRET=your_jwt_secret
```

### Notification Settings
- **Toast Duration**: 6-12 seconds (based on priority)
- **Banner Duration**: Until dismissed (except persistent)
- **Max Toasts**: 5 simultaneous notifications
- **Auto-reconnect**: 5 seconds on disconnect

## Benefits

1. **Immediate Communication**: Users see updates instantly
2. **No Page Refresh**: Seamless user experience
3. **Priority-Based**: Important messages get attention
4. **Action-Oriented**: Users can take immediate action
5. **Admin Control**: Full control over notification types and delivery
6. **Scalable**: Works with multiple concurrent users

## Future Enhancements

1. **Push Notifications**: Browser push notifications
2. **Email Integration**: Email notifications for important updates
3. **SMS Notifications**: Critical order updates via SMS
4. **Notification Preferences**: User-controlled notification settings
5. **Analytics**: Track notification engagement and effectiveness

This system ensures that admin updates are immediately visible to users, creating a responsive and engaging shopping experience.
