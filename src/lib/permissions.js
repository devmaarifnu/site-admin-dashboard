// Role-based permissions
export const PERMISSIONS = {
  SUPER_ADMIN: {
    users: ['create', 'read', 'update', 'delete'],
    news: ['create', 'read', 'update', 'delete', 'publish'],
    opinions: ['create', 'read', 'update', 'delete', 'publish'],
    documents: ['create', 'read', 'update', 'delete'],
    hero_slides: ['create', 'read', 'update', 'delete'],
    organization: ['create', 'read', 'update', 'delete'],
    pages: ['read', 'update'],
    events: ['create', 'read', 'update', 'delete'],
    media: ['upload', 'read', 'delete'],
    categories: ['create', 'read', 'update', 'delete'],
    tags: ['create', 'read', 'update', 'delete'],
    contact_messages: ['read', 'update', 'delete'],
    settings: ['read', 'update'],
    activity_logs: ['read'],
  },
  ADMIN: {
    news: ['create', 'read', 'update', 'delete', 'publish'],
    opinions: ['create', 'read', 'update', 'delete', 'publish'],
    documents: ['create', 'read', 'update', 'delete'],
    hero_slides: ['create', 'read', 'update', 'delete'],
    organization: ['create', 'read', 'update', 'delete'],
    pages: ['read', 'update'],
    events: ['create', 'read', 'update', 'delete'],
    media: ['upload', 'read', 'delete'],
    categories: ['create', 'read', 'update', 'delete'],
    tags: ['create', 'read', 'update', 'delete'],
    contact_messages: ['read', 'update', 'delete'],
    settings: ['read', 'update'],
    activity_logs: ['read'],
  },
  EDITOR: {
    news: ['create', 'read', 'update', 'delete', 'publish'],
    opinions: ['create', 'read', 'update', 'delete', 'publish'],
    categories: ['create', 'read', 'update', 'delete'],
    tags: ['create', 'read', 'update', 'delete'],
    media: ['upload', 'read'],
  },
  ADMIN_DOCUMENT: {
    documents: ['create', 'read', 'update', 'delete'],
  },
  KONTRIBUTOR: {
    news: ['create', 'read', 'update'],
    opinions: ['create', 'read', 'update'],
    categories: ['read'],
    tags: ['read'],
  },
};

export function hasPermission(userRole, resource, action) {
  const roleKey = userRole.toUpperCase();
  const rolePermissions = PERMISSIONS[roleKey];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
}

export function canAccessRoute(userRole, route) {
  const routePermissions = {
    '/dashboard': ['super_admin', 'admin', 'editor', 'admin_document', 'kontributor'],
    '/users': ['super_admin'],
    '/news': ['super_admin', 'admin', 'editor', 'kontributor'],
    '/opinions': ['super_admin', 'admin', 'editor', 'kontributor'],
    '/documents': ['super_admin', 'admin', 'admin_document'],
    '/hero-slides': ['super_admin', 'admin'],
    '/organization': ['super_admin', 'admin'],
    '/pages': ['super_admin', 'admin'],
    '/event-flyers': ['super_admin', 'admin'],
    '/media-library': ['super_admin', 'admin'],
    '/categories': ['super_admin', 'admin', 'editor'],
    '/tags': ['super_admin', 'admin', 'editor'],
    '/contact-messages': ['super_admin', 'admin'],
    '/settings': ['super_admin', 'admin'],
    '/activity-logs': ['super_admin', 'admin'],
    '/analytics': ['super_admin', 'admin'],
  };

  const allowedRoles = routePermissions[route];
  if (!allowedRoles) return true;

  return allowedRoles.includes(userRole.toLowerCase());
}
