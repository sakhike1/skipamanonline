import React from 'react';
import { useAuth } from '../../context/useAuth';

const AdminDebugPanel: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? 'Loaded' : 'None'}</p>
        <p><strong>Role:</strong> {user?.role || 'undefined'}</p>
        <p><strong>Email:</strong> {user?.email || 'undefined'}</p>
        <p><strong>ID:</strong> {user?.id || 'undefined'}</p>
      </div>
    </div>
  );
};

export default AdminDebugPanel;

