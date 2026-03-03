'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Submit Report', href: '/submit', icon: '＋', roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.ADMIN] },
  { label: 'My Reports', href: '/my-reports', icon: '☰', roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.ADMIN] },
  { label: 'Review Queue', href: '/review', icon: '⊙', roles: [UserRole.COMPLIANCE_OFFICER, UserRole.SUPERVISOR, UserRole.ADMIN] },
  { label: 'Analytics', href: '/analytics', icon: '📊', roles: [UserRole.COMPLIANCE_OFFICER, UserRole.SUPERVISOR, UserRole.AUDITOR, UserRole.ADMIN] },
  { label: 'Model Info', href: '/model-info', icon: '🤖', roles: [UserRole.ML_OPS, UserRole.ADMIN] },
  { label: 'User Management', href: '/admin/users', icon: '👥', roles: [UserRole.ADMIN] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <span className="text-lg font-bold text-white">Gratifikasi AI</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && (
        <div className="border-t border-slate-700 px-4 py-3">
          <div className="text-xs text-slate-400">Signed in as</div>
          <div className="text-sm font-medium text-white">{user.username}</div>
          <div className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</div>
        </div>
      )}
    </div>
  );
}
