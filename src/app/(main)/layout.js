'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        <Sidebar collapsed={collapsed} />
      </aside>

      <div className="flex-1 flex flex-col">
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
