import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield } from 'lucide-react';

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'account', label: 'Account', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-xl shadow-sm border-[0.5px] border-gray-100 p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center px-6 py-4 text-sm font-bold rounded-2xl shadow-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default SettingsSidebar;
































































