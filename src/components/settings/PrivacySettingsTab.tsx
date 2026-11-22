import React from 'react';
import { Save } from 'lucide-react';

interface PrivacySettings {
  profileVisibility: string;
  marketingConsent: boolean;
  dataSharing: boolean;
}

interface PrivacySettingsTabProps {
  privacy: PrivacySettings;
  isLoading: boolean;
  onPrivacyChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

const PrivacySettingsTab: React.FC<PrivacySettingsTabProps> = ({
  privacy,
  isLoading,
  onPrivacyChange,
  onSave
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
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

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            name="profileVisibility"
            value={privacy.profileVisibility}
            onChange={onPrivacyChange}
            className="w-full px-4 py-3 border-[0.5px] border-gray-100 rounded-xl hover:border-gray-400 focus:border-[0.5px] focus:border-gray-200 focus:ring-0 focus:outline-none transition-all duration-300"
          >
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
            <option value="public">Public</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Control who can see your profile information</p>
        </div>

        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Marketing Consent</h3>
            <p className="text-sm text-gray-500">Allow us to send you marketing communications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={privacy.marketingConsent}
              onChange={onPrivacyChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border-[0.5px] border-gray-100 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Data Sharing</h3>
            <p className="text-sm text-gray-500">Allow sharing of anonymized data for analytics</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="dataSharing"
              checked={privacy.dataSharing}
              onChange={onPrivacyChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsTab;
































































