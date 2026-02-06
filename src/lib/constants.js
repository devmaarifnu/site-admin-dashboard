// Status options
export const STATUS_OPTIONS = {
  CONTENT: [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ],
  USER: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  MESSAGE: [
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
  ],
};

// Role options
export const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
];

// Category types
export const CATEGORY_TYPES = [
  { value: 'news', label: 'News' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'document', label: 'Document' },
];

// Organization categories
export const ORG_CATEGORIES = [
  { value: 'pimpinan_utama', label: 'Pimpinan Utama' },
  { value: 'bidang', label: 'Bidang' },
  { value: 'sekretariat', label: 'Sekretariat' },
  { value: 'bendahara', label: 'Bendahara' },
];

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  IMAGE: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  DOCUMENT: {
    maxSize: 50 * 1024 * 1024, // 50MB
    acceptedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    acceptedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  },
  VIDEO: {
    maxSize: 100 * 1024 * 1024, // 100MB
    acceptedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    acceptedExtensions: ['.mp4', '.webm', '.ogg'],
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: '/users',
  NEWS: '/news',
  OPINIONS: '/opinions',
  DOCUMENTS: '/documents',
  HERO_SLIDES: '/hero-slides',
  ORGANIZATION: {
    POSITIONS: '/organization/positions',
    BOARD_MEMBERS: '/organization/board-members',
    PENGURUS: '/organization/pengurus',
    DEPARTMENTS: '/organization/departments',
    EDITORIAL_TEAM: '/organization/editorial-team',
    EDITORIAL_COUNCIL: '/organization/editorial-council',
  },
  PAGES: '/pages',
  EVENT_FLYERS: '/event-flyers',
  MEDIA: '/media',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  CONTACT_MESSAGES: '/contact-messages',
  SETTINGS: '/settings',
  ACTIVITY_LOGS: '/activity-logs',
  NOTIFICATIONS: '/notifications',
};

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    CREATED: 'Data berhasil ditambahkan',
    UPDATED: 'Data berhasil diperbarui',
    DELETED: 'Data berhasil dihapus',
    PUBLISHED: 'Berhasil dipublikasikan',
    UNPUBLISHED: 'Berhasil dibatalkan publikasi',
  },
  ERROR: {
    GENERIC: 'Terjadi kesalahan, silakan coba lagi',
    NETWORK: 'Koneksi jaringan bermasalah',
    UNAUTHORIZED: 'Anda tidak memiliki akses',
    NOT_FOUND: 'Data tidak ditemukan',
    VALIDATION: 'Data tidak valid',
  },
};

// Editor toolbar configuration
export const EDITOR_TOOLBAR = [
  'bold',
  'italic',
  'underline',
  'strike',
  '|',
  'heading1',
  'heading2',
  'heading3',
  '|',
  'bulletList',
  'orderedList',
  '|',
  'link',
  'image',
  'blockquote',
  'codeBlock',
  '|',
  'textAlign',
  '|',
  'undo',
  'redo',
];
