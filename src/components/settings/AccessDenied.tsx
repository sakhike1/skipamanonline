import React from 'react';
import { AlertCircle } from 'lucide-react';

const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Access Denied</h2>
        <p className="text-gray-500">Please log in to access settings.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
































































