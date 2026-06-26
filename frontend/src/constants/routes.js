export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CUSTOMER: {
    DASHBOARD: '/customer',
    PROFILE: '/customer/profile',
    CATS: '/customer/cats',
    RESERVATIONS: '/customer/reservations',
    PAYMENTS: '/customer/payments',
    HISTORY: '/customer/history',
  },
  STAFF: {
    DASHBOARD: '/staff',
    PROFILE: '/staff/profile',
    RESERVATIONS: '/staff/reservations',
    DAILY_REPORTS: '/staff/daily-reports',
    PAYMENTS: '/staff/payments',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    PROFILE: '/admin/profile',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
    PERMISSION_CATEGORIES: '/admin/permission-categories',
    SERVICES: '/admin/services',
    CAGES: '/admin/cages',
    KATEGORI_PRODUK: '/admin/kategori-produk',
    PRODUK: '/admin/produk',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
    BACKUP_DATABASE: '/admin/backup-database',
    ACTIVITY_LOGS: '/admin/activity-logs',
  },
};

export const ROLE_DASHBOARD = {
  super_admin: ROUTES.ADMIN.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
  staff: ROUTES.STAFF.DASHBOARD,
  user: ROUTES.CUSTOMER.DASHBOARD,
};

export const ROLE_PROFILE = {
  super_admin: ROUTES.ADMIN.PROFILE,
  admin: ROUTES.ADMIN.PROFILE,
  staff: ROUTES.STAFF.PROFILE,
  user: ROUTES.CUSTOMER.PROFILE,
};
