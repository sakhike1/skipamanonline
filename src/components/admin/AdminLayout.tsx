import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  Package,
  Headphones,
  BarChart3,
  Mail,
  Megaphone,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Star,
} from 'lucide-react';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
    isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5',
  ].join(' ');

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/90">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-white font-bold tracking-tight">
            <Shield className="h-6 w-6 text-violet-400" aria-hidden />
            <span>Skipaman Admin</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            Overview
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClass}>
            <Package className="h-4 w-4 shrink-0" aria-hidden />
            Orders
          </NavLink>
          <NavLink to="/admin/tickets" className={navLinkClass}>
            <Headphones className="h-4 w-4 shrink-0" aria-hidden />
            Tickets
          </NavLink>
          <NavLink to="/admin/reviews" className={navLinkClass}>
            <Star className="h-4 w-4 shrink-0" aria-hidden />
            Reviews
          </NavLink>
          <NavLink to="/admin/subscribers" className={navLinkClass}>
            <Users className="h-4 w-4 shrink-0" aria-hidden />
            Newsletter
          </NavLink>
          <NavLink to="/admin/announcements" className={navLinkClass}>
            <Megaphone className="h-4 w-4 shrink-0" aria-hidden />
            Announcements
          </NavLink>
          <NavLink to="/admin/analytics" className={navLinkClass}>
            <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
            Analytics
          </NavLink>
          <NavLink to="/admin/email" className={navLinkClass}>
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            Email tools
          </NavLink>
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View storefront
          </a>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full flex items-center gap-2 text-left text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <p className="text-sm text-zinc-500 md:hidden font-medium">Admin</p>
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 hidden sm:inline"
            >
              Storefront
            </a>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
