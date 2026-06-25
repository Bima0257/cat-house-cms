import { NavLink } from 'react-router-dom';
import { getAuthState } from '../../../hooks/useAuth';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthState } from '../../../hooks/useAuth';
import api from '../../../services/api';
import {
  IconLayoutDashboard,
  IconUser,
  IconPaw,
  IconCalendarMonth,
  IconCash,
  IconHistory,
  IconFileDescription,
  IconCircleCheck,
  IconUsers,
  IconLock,
  IconShield,
  IconTool,
  IconHome,
  IconChartBar,
  IconSettings,
  IconCategory,
  IconPackage,
  IconDatabase,
  IconNotebook,
  IconLogout,
} from '@tabler/icons-react';

const iconMap = {
  dashboard: IconLayoutDashboard,
  person: IconUser,
  pets: IconPaw,
  calendar_month: IconCalendarMonth,
  payments: IconCash,
  history: IconHistory,
  description: IconFileDescription,
  verified: IconCircleCheck,
  group: IconUsers,
  lock: IconLock,
  security: IconShield,
  build: IconTool,
  home: IconHome,
  bar_chart: IconChartBar,
  settings: IconSettings,
  category: IconCategory,
  package: IconPackage,
  database: IconDatabase,
  notebook: IconNotebook,
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { roles, user } = getAuthState();
  const role = roles[0] || 'user';
  const navigate = useNavigate();

  const menuSections = useMemo(() => {
    if (role === 'user') {
      return [
        {
          label: 'Utama',
          items: [
            { name: 'Dashboard', path: '/customer', icon: 'dashboard' },
            { name: 'Profil', path: '/customer/profile', icon: 'person' },
          ],
        },
        {
          label: 'Kucing',
          items: [
            { name: 'Kucing Saya', path: '/customer/cats', icon: 'pets' },
          ],
        },
        {
          label: 'Reservasi',
          items: [
            {
              name: 'Reservasi',
              path: '/customer/reservations',
              icon: 'calendar_month',
            },
            {
              name: 'Pembayaran',
              path: '/customer/payments',
              icon: 'payments',
            },
            { name: 'Riwayat', path: '/customer/history', icon: 'history' },
          ],
        },
      ];
    }

    if (role === 'staff') {
      return [
        {
          label: 'Utama',
          items: [
            { name: 'Dashboard', path: '/staff', icon: 'dashboard' },
            { name: 'Profil', path: '/staff/profile', icon: 'person' },
          ],
        },
        {
          label: 'Operasional',
          items: [
            {
              name: 'Reservasi',
              path: '/staff/reservations',
              icon: 'calendar_month',
            },
            {
              name: 'Laporan Harian',
              path: '/staff/daily-reports',
              icon: 'description',
            },
            {
              name: 'Verifikasi Bayar',
              path: '/staff/payments',
              icon: 'verified',
            },
          ],
        },
      ];
    }

    return [
      {
        label: 'Utama',
        items: [
          { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
          { name: 'Profil', path: '/admin/profile', icon: 'person' },
        ],
      },
      {
        label: 'Manajemen',
        items: [
          { name: 'Pengguna', path: '/admin/users', icon: 'group' },
          { name: 'Roles', path: '/admin/roles', icon: 'lock' },
        ],
      },
      {
        label: 'Master Data',
        items: [
          { name: 'Layanan', path: '/admin/services', icon: 'build' },
          { name: 'Kandang', path: '/admin/cages', icon: 'home' },
          {
            name: 'Kategori Produk',
            path: '/admin/kategori-produk',
            icon: 'category',
          },
          { name: 'Produk', path: '/admin/produk', icon: 'package' },
        ],
      },
      {
        label: 'Laporan',
        items: [
          { name: 'Laporan', path: '/admin/reports', icon: 'bar_chart' },
          ...(roles.includes('super_admin')
            ? [
                {
                  name: 'Database',
                  path: '/admin/backup-database',
                  icon: 'database',
                },
              ]
            : []),
          { name: 'Pengaturan', path: '/admin/settings', icon: 'settings' },
        ],
      },
      ...(roles.includes('super_admin')
        ? [
            {
              label: 'Sistem',
              items: [
                { name: 'Permissions', path: '/admin/permissions', icon: 'security' },
                {
                  name: 'Kategori Permission',
                  path: '/admin/permission-categories',
                  icon: 'category',
                },
                { name: 'Audit Log', path: '/admin/activity-logs', icon: 'notebook' },
              ],
            },
          ]
        : []),
    ];
  }, [role, roles]);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch {
      // ignore
    }
    clearAuthState();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-text-dark text-white flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo / Branding */}
        <div className='p-0'>
          <img
            src="/images/logo.png"
            alt="Cat House"
            className="h-20 w-auto ml-2"
          />
        </div>

        {/* Navigation */}
        <nav className='flex-1 mt-4 overflow-y-auto scrollbar-thin'>
          {menuSections.map((section) => (
            <div key={section.label}>
              <p className='px-6 text-[10px] font-ui-label tracking-widest uppercase text-white/30 mt-5 mb-1'>
                {section.label}
              </p>
              <ul className='space-y-0.5'>
                {section.items.map((item, index) => {
                  const IconComponent =
                    iconMap[item.icon] || IconLayoutDashboard;
                  return (
                    <li key={index} className='group'>
                      <NavLink
                        to={item.path}
                        end={index === 0} // Only apply 'end' to the first item (Dashboard) in each section
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-6 py-3 space-x-3 transition-all duration-200
                          ${
                            isActive
                              ? 'bg-white/10 border-l-4 border-amber-accent text-white'
                              : 'text-white/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                          }`
                        }
                      >
                        <span className='w-5 flex items-center justify-center'>
                          <IconComponent size={20} />
                        </span>
                        <span className='font-ui-label text-sm'>
                          {item.name}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className='p-6 border-t border-white/10'>
          <div className='flex items-center space-x-3 opacity-80'>
            <div className='w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden'>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <IconPaw size={16} className='text-secondary' />
              )}
            </div>
            <div className='flex-1 overflow-hidden'>
              <p className='text-xs font-semibold truncate'>
                {user?.name || 'User'}
              </p>
              <p className='text-[10px] text-white/50 truncate capitalize'>
                {role === 'super_admin' ? 'Super Admin' : role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className='hover:text-primary transition-colors'
              title='Logout'
            >
              <IconLogout size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className='fixed inset-0 bg-black/50 z-10 lg:hidden'
        />
      )}
    </>
  );
};

export default Sidebar;
