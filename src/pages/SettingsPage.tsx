import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsMessage from '../components/settings/SettingsMessage';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import AccountSettingsTab from '../components/settings/AccountSettingsTab';
import NotificationSettingsTab from '../components/settings/NotificationSettingsTab';
import PrivacySettingsTab from '../components/settings/PrivacySettingsTab';
import AccessDenied from '../components/settings/AccessDenied';

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    productRecommendations: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    marketingConsent: false,
    dataSharing: false
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrivacy(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      if (!supabase || !user?.email) throw new Error('Unable to change password right now.');

      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      });
      if (signErr) throw new Error(signErr.message || 'Current password is incorrect');

      const { error: updErr } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      if (updErr) throw updErr;

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call for notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Notification preferences saved!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save notification preferences' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call for privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Privacy settings saved!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save privacy settings' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SettingsHeader />
        <SettingsMessage message={message} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-sm border-[0.5px] border-gray-100 p-6">
              {activeTab === 'account' && (
                <AccountSettingsTab
                  passwordForm={passwordForm}
                  showPasswords={showPasswords}
                  isLoading={isLoading}
                  onPasswordChange={handlePasswordChange}
                  onPasswordSubmit={handlePasswordSubmit}
                  onTogglePasswordVisibility={togglePasswordVisibility}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationSettingsTab
                  notifications={notifications}
                  isLoading={isLoading}
                  onNotificationChange={handleNotificationChange}
                  onSave={handleNotificationSave}
                />
              )}

              {activeTab === 'privacy' && (
                <PrivacySettingsTab
                  privacy={privacy}
                  isLoading={isLoading}
                  onPrivacyChange={handlePrivacyChange}
                  onSave={handlePrivacySave}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
