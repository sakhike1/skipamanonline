import React from 'react';
import EmailTestPanel from '../../components/admin/EmailTestPanel';

const AdminEmailPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Email tools</h1>
        <p className="mt-2 text-sm text-zinc-400">Test transactional email configuration.</p>
      </div>
      <EmailTestPanel />
    </div>
  );
};

export default AdminEmailPage;
