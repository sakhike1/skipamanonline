import React, { useMemo, useState } from 'react';
import { Bell, Save } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  productRecommendations: boolean;
}

interface NotificationSettingsTabProps {
  notifications: NotificationSettings;
  isLoading: boolean;
  onNotificationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({
  notifications,
  isLoading,
  onNotificationChange,
  onSave
}) => {
  const [permissionRequesting, setPermissionRequesting] = useState(false);

  const canUseNotifications = typeof window !== 'undefined' && 'Notification' in window;
  const permission = useMemo(() => {
    if (!canUseNotifications) return 'unsupported' as const;
    return Notification.permission;
  }, [canUseNotifications]);

  const requestPermission = async () => {
    if (!canUseNotifications) return;
    if (Notification.permission !== 'default') return;

    setPermissionRequesting(true);
    try {
      await Notification.requestPermission();
    } finally {
      setPermissionRequesting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex items-center px-6 py-3 text-sm font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-50 rounded-2xl shadow-lg transition-all duration-300"
        >
          {isLoading ? (
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save
        </button>
      </div>

      <div className="mb-6 p-4 border-[0.5px] border-gray-100 rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-700" />
              <h3 className="text-sm font-medium text-gray-900">Browser notifications</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enable system notifications for order updates and important messages. You can change this any time in your browser settings.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Status:{' '}
              {permission === 'unsupported'
                ? 'Not supported on this device/browser'
                : permission === 'granted'
                  ? 'Enabled'
                  : permission === 'denied'
                    ? 'Blocked'
                    : 'Not yet enabled'}
            </p>
          </div>

          <button
            type="button"
            onClick={requestPermission}
            disabled={!canUseNotifications || permission !== 'default' || permissionRequesting}
            className="flex items-center px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-50 rounded-2xl shadow-sm transition-all duration-300 whitespace-nowrap"
          >
            {permissionRequesting ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Bell className="w-4 h-4 mr-2" />
            )}
            Enable
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={notifications.emailNotifications}
              onChange={onNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Order Updates</h3>
            <p className="text-sm text-gray-500">Get notified about order status changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="orderUpdates"
              checked={notifications.orderUpdates}
              onChange={onNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Promotions</h3>
            <p className="text-sm text-gray-500">Receive special offers and discounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="promotions"
              checked={notifications.promotions}
              onChange={onNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
            <p className="text-sm text-gray-500">Subscribe to our newsletter</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="newsletter"
              checked={notifications.newsletter}
              onChange={onNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Product Recommendations</h3>
            <p className="text-sm text-gray-500">Get personalized product suggestions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="productRecommendations"
              checked={notifications.productRecommendations}
              onChange={onNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsTab;
































































