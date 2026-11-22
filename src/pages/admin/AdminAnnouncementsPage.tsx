import React from 'react';
import { Megaphone } from 'lucide-react';
import AdminNotificationPanel from '../../components/admin/AdminNotificationPanel';

const AdminAnnouncementsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-violet-400" aria-hidden />
          Store announcements
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Broadcast messages to shoppers (notification bell and banners where enabled).
        </p>
      </div>
      <AdminNotificationPanel />
    </div>
  );
};

export default AdminAnnouncementsPage;
