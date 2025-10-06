import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { 
  Send, 
  Megaphone, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Bell,
  Zap,
  Loader
} from 'lucide-react';

interface NotificationForm {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  actionUrl: string;
}

interface AnnouncementForm {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  persistent: boolean;
}

const AdminNotificationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'announcement'>('broadcast');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [broadcastForm, setBroadcastForm] = useState<NotificationForm>({
    title: '',
    message: '',
    priority: 'medium',
    actionRequired: false,
    actionUrl: ''
  });

  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>({
    title: '',
    message: '',
    type: 'info',
    persistent: false
  });

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await adminAPI.sendBroadcast({
        title: broadcastForm.title,
        message: broadcastForm.message,
        priority: broadcastForm.priority,
        actionRequired: broadcastForm.actionRequired,
        actionUrl: broadcastForm.actionUrl || undefined
      });

      if (response.success) {
        setSuccessMessage('Broadcast notification sent successfully!');
        setBroadcastForm({
          title: '',
          message: '',
          priority: 'medium',
          actionRequired: false,
          actionUrl: ''
        });
      } else {
        throw new Error(response.message || 'Failed to send broadcast');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send broadcast notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await adminAPI.sendAnnouncement({
        title: announcementForm.title,
        message: announcementForm.message,
        type: announcementForm.type,
        persistent: announcementForm.persistent
      });

      if (response.success) {
        setSuccessMessage('System announcement sent successfully!');
        setAnnouncementForm({
          title: '',
          message: '',
          type: 'info',
          persistent: false
        });
      } else {
        throw new Error(response.message || 'Failed to send announcement');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send system announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Zap className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Notifications</h2>
        <p className="text-gray-600">Send real-time notifications to all users or create system announcements.</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'broadcast'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Megaphone className="h-4 w-4 mr-2" />
                Broadcast to All Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('announcement')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'announcement'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                System Announcement
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Broadcast Form */}
      {activeTab === 'broadcast' && (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleBroadcastSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter notification title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your message..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={broadcastForm.priority}
                onChange={(e) => setBroadcastForm(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="actionRequired"
                checked={broadcastForm.actionRequired}
                onChange={(e) => setBroadcastForm(prev => ({ ...prev, actionRequired: e.target.checked }))}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="actionRequired" className="ml-2 text-sm text-gray-700">
                Action Required
              </label>
            </div>
          </div>

          {broadcastForm.actionRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action URL (Optional)
              </label>
              <input
                type="url"
                value={broadcastForm.actionUrl}
                onChange={(e) => setBroadcastForm(prev => ({ ...prev, actionUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="/orders, /profile, etc."
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !broadcastForm.title || !broadcastForm.message}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send Broadcast Notification
          </button>
        </motion.form>
      )}

      {/* Announcement Form */}
      {activeTab === 'announcement' && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleAnnouncementSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Title
            </label>
            <input
              type="text"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter announcement title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={announcementForm.message}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your announcement..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Type
              </label>
              <select
                value={announcementForm.type}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="persistent"
                checked={announcementForm.persistent}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, persistent: e.target.checked }))}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="persistent" className="ml-2 text-sm text-gray-700">
                Persistent (cannot be dismissed)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !announcementForm.title || !announcementForm.message}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            Send System Announcement
          </button>
        </motion.form>
      )}

      {/* Preview Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="space-y-3">
          {activeTab === 'broadcast' && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {getPriorityIcon(broadcastForm.priority)}
              <span className="font-medium">{broadcastForm.title || 'Notification Title'}</span>
              <span className="capitalize">({broadcastForm.priority} priority)</span>
            </div>
          )}
          {activeTab === 'announcement' && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {getTypeIcon(announcementForm.type)}
              <span className="font-medium">{announcementForm.title || 'Announcement Title'}</span>
              <span className="capitalize">({announcementForm.type})</span>
            </div>
          )}
          <p className="text-sm text-gray-600">
            {activeTab === 'broadcast' ? broadcastForm.message : announcementForm.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
