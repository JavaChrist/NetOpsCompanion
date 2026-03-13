import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-surface-900">
      {/* Desktop : sidebar dans le flux, largeur fixe */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Mobile : sidebar fixed hors flux */}
      <div className="lg:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto safe-pb">
          <div className="max-w-7xl mx-auto px-4 py-6 safe-pl safe-pr">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
