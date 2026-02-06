'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { canAccessRoute } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  FileBox,
  ImageIcon,
  Users,
  Building2,
  FileEdit,
  Calendar,
  FolderOpen,
  Tags,
  Mail,
  Settings,
  Activity,
  ChevronDown,
  ChevronRight,
  LogOut,
  BarChart3,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['super_admin', 'admin', 'editor'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      href: '/users',
      roles: ['super_admin'],
    },
    {
      id: 'content',
      label: 'Konten',
      icon: FileEdit,
      roles: ['super_admin', 'admin', 'editor'],
      children: [
        {
          id: 'news',
          label: 'Berita',
          href: '/news',
          roles: ['super_admin', 'admin', 'editor'],
        },
        {
          id: 'opinions',
          label: 'Opini',
          href: '/opinions',
          roles: ['super_admin', 'admin', 'editor'],
        },
        {
          id: 'documents',
          label: 'Dokumen',
          href: '/documents',
          roles: ['super_admin', 'admin'],
        },
      ],
    },
    {
      id: 'hero-slides',
      label: 'Hero Slides',
      icon: ImageIcon,
      href: '/hero-slides',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'organization',
      label: 'Organisasi',
      icon: Building2,
      roles: ['super_admin', 'admin'],
      children: [
        {
          id: 'board-members',
          label: 'Pengurus',
          href: '/organization/board-members',
          roles: ['super_admin', 'admin'],
        },
        {
          id: 'pengurus',
          label: 'Struktur Organisasi',
          href: '/organization/pengurus',
          roles: ['super_admin', 'admin'],
        },
        {
          id: 'departments',
          label: 'Departemen',
          href: '/organization/departments',
          roles: ['super_admin', 'admin'],
        },
      ],
    },
    {
      id: 'pages',
      label: 'Halaman',
      icon: FileBox,
      href: '/pages',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'event-flyers',
      label: 'Event Flyers',
      icon: Calendar,
      href: '/event-flyers',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'media-library',
      label: 'Media Library',
      icon: FolderOpen,
      href: '/media-library',
      roles: ['super_admin', 'admin', 'editor'],
    },
    {
      id: 'taxonomy',
      label: 'Taksonomi',
      icon: Tags,
      roles: ['super_admin', 'admin'],
      children: [
        {
          id: 'categories',
          label: 'Kategori',
          href: '/categories',
          roles: ['super_admin', 'admin'],
        },
        {
          id: 'tags',
          label: 'Tag',
          href: '/tags',
          roles: ['super_admin', 'admin'],
        },
      ],
    },
    {
      id: 'contact-messages',
      label: 'Pesan Kontak',
      icon: Mail,
      href: '/contact-messages',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings,
      href: '/settings',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'activity-logs',
      label: 'Activity Logs',
      icon: Activity,
      href: '/activity-logs',
      roles: ['super_admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/80" aria-hidden="true" />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                LM
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">LP Ma'arif NU</div>
                <div className="text-xs text-gray-400">Admin Portal</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => (
                <li key={item.id}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors',
                          expandedMenus[item.id] && 'bg-gray-800 text-white'
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </div>
                        {expandedMenus[item.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {expandedMenus[item.id] && (
                        <ul className="mt-1 space-y-1 pl-11">
                          {item.children
                            .filter((child) => child.roles.includes(user?.role))
                            .map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    'block px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
                                    pathname === child.href &&
                                      'bg-gray-800 text-white'
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors',
                        pathname === item.href && 'bg-gray-800 text-white'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
