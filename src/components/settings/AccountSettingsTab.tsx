import React from 'react';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface AccountSettingsTabProps {
  passwordForm: PasswordForm;
  showPasswords: ShowPasswords;
  isLoading: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordSubmit: (e: React.FormEvent) => void;
  onTogglePasswordVisibility: (field: 'current' | 'new' | 'confirm') => void;
}

const AccountSettingsTab: React.FC<AccountSettingsTabProps> = ({
  passwordForm,
  showPasswords,
  isLoading,
  onPasswordChange,
  onPasswordSubmit,
  onTogglePasswordVisibility
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Security</h2>
      
      <form onSubmit={onPasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={onPasswordChange}
              required
              className="w-full pl-10 pr-12 py-3 border-[0.5px] border-gray-100 rounded-xl hover:border-gray-400 focus:border-[0.5px] focus:border-gray-200 focus:ring-0 focus:outline-none transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => onTogglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={onPasswordChange}
              required
              minLength={6}
              className="w-full pl-10 pr-12 py-3 border-[0.5px] border-gray-100 rounded-xl hover:border-gray-400 focus:border-[0.5px] focus:border-gray-200 focus:ring-0 focus:outline-none transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => onTogglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={onPasswordChange}
              required
              minLength={6}
              className="w-full pl-10 pr-12 py-3 border-[0.5px] border-gray-100 rounded-xl hover:border-gray-400 focus:border-[0.5px] focus:border-gray-200 focus:ring-0 focus:outline-none transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => onTogglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-50 rounded-2xl shadow-lg transition-all duration-300"
        >
          {isLoading ? (
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Change Password
        </button>
      </form>
    </div>
  );
};

export default AccountSettingsTab;
































































