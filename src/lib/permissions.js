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
  },
  EDITOR: {
    news: ['create', 'read', 'update'],
    opinions: ['create', 'read', 'update'],
    media: ['upload', 'read'],
    categories: ['read'],
    tags: ['read'],
  },
};

export function hasPermission(userRole, resource, action) {
  const rolePermissions = PERMISSIONS[userRole.toUpperCase()];
  if (!rolePermissions) return false;
  
  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
}

export function canAccessRoute(userRole, route) {
  const routePermissions = {
    '/dashboard': ['super_admin', 'admin', 'editor'],
    '/users': ['super_admin'],
    '/news': ['super_admin', 'admin', 'editor'],
    '/opinions': ['super_admin', 'admin', 'editor'],
    '/documents': ['super_admin', 'admin'],
    '/hero-slides': ['super_admin', 'admin'],
    '/organization': ['super_admin', 'admin'],
    '/pages': ['super_admin', 'admin'],
    '/event-flyers': ['super_admin', 'admin'],
    '/media-library': ['super_admin', 'admin', 'editor'],
    '/categories': ['super_admin', 'admin'],
    '/tags': ['super_admin', 'admin'],
    '/contact-messages': ['super_admin', 'admin'],
    '/settings': ['super_admin', 'admin'],
    '/activity-logs': ['super_admin'],
    '/analytics': ['super_admin', 'admin'],
  };

  const allowedRoles = routePermissions[route];
  if (!allowedRoles) return true; // If route not defined, allow access
  
  return allowedRoles.includes(userRole.toLowerCase());
}
