# Quick Start Guide - LP Ma'arif NU Admin Portal

## 🚀 Installation & Setup

```bash
# Navigate to project directory
cd site-admin-dashboard

# Install dependencies dengan pnpm
pnpm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1/admin
NEXT_PUBLIC_FILE_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_CDN_URL=https://cdn.lpmaarifnu.or.id

# Run development server
pnpm dev

# Open browser
# http://localhost:3002
```

## 📁 Important Files

```
Configuration:
- package.json                          # Dependencies
- next.config.js                        # Next.js config
- tailwind.config.js                    # Tailwind config
- .env.local                            # Environment variables

Documentation:
- README.md                             # Full documentation
- DEVELOPMENT_SUMMARY.md                # Development progress
- API_CONTRACT.md                       # Backend API contract
- API-CONTRACT-FILESERVER.md            # File server API
- TODO FRONTEND - ADMIN PORTAL.md       # Original requirements

Core Files:
- src/app/layout.jsx                    # Root layout
- src/app/(auth)/login/page.jsx         # Login page
- src/app/(dashboard)/layout.jsx        # Dashboard layout
- src/app/(dashboard)/dashboard/page.jsx # Dashboard page
- src/middleware.js                     # Auth middleware
- src/lib/api/client.js                 # API client
- src/store/authStore.js                # Auth state
```

## 🔑 Default Login (untuk testing)

```
Email: admin@lpmaarifnu.or.id
Password: password123
```

## 📂 Project Structure

```
site-admin-dashboard/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   ├── components/             # React components
│   │   ├── layout/            # Sidebar, Topbar, Breadcrumb
│   │   ├── ui/                # Base UI components
│   │   ├── shared/            # Reusable components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── news/              # News components
│   │   └── ...
│   ├── lib/
│   │   ├── api/               # API functions
│   │   ├── utils.js           # Helper functions
│   │   ├── constants.js       # Constants
│   │   └── permissions.js     # Permissions
│   ├── hooks/                 # Custom hooks
│   ├── store/                 # Zustand stores
│   └── middleware.js          # Auth middleware
├── public/                    # Static files
└── ...config files
```

## 🎨 Main Features Implemented

✅ Authentication (Login, Logout, Forgot Password)
✅ Dashboard dengan statistics
✅ News Management (List, Table, CRUD API)
✅ Responsive Sidebar Navigation
✅ Top Navigation dengan Search & Notifications
✅ Rich Text Editor (TipTap)
✅ Image Uploader dengan CDN
✅ Data Tables dengan Pagination
✅ Role-based Access Control
✅ API Integration Layer
✅ Toast Notifications
✅ Loading States
✅ Empty States
✅ Confirm Dialogs

## 🛠️ Common Commands

```bash
# Development
pnpm dev                # Run dev server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run linter
pnpm lint:fix           # Fix linting issues
```

## 📝 Adding New Features

### 1. Create New Page
```javascript
// src/app/(dashboard)/your-page/page.jsx
'use client';

export default function YourPage() {
  return (
    <div>
      <h1>Your Page</h1>
    </div>
  );
}
```

### 2. Add to Navigation
```javascript
// Edit src/components/layout/AdminSidebar.jsx
// Add item to menuItems array
```

### 3. Create API Functions
```javascript
// src/lib/api/your-api.js
import apiClient from './client';

export const yourApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/your-endpoint', { params });
    return response.data;
  },
  // ... more methods
};
```

## 🔐 Permission Check Example

```javascript
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';

const { user } = useAuth();

if (hasPermission(user.role, 'news', 'create')) {
  // Show create button
}
```

## 🎯 Next Development Tasks

1. ⏳ Complete News Create/Edit Form
2. ⏳ Opinion Management
3. ⏳ Document Management  
4. ⏳ Media Library
5. ⏳ Hero Slides
6. ⏳ Organization Management
7. ⏳ Pages Management
8. ⏳ Event Flyers
9. ⏳ Categories & Tags
10. ⏳ Contact Messages
11. ⏳ Settings
12. ⏳ Analytics
13. ⏳ Activity Logs
14. ⏳ Profile Page

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3002
npx kill-port 3002
# Or use different port
PORT=3003 pnpm dev
```

### Dependencies Error
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Build Error
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

## 📞 Support

Lihat dokumentasi lengkap di:
- README.md
- DEVELOPMENT_SUMMARY.md
- API_CONTRACT.md

---

Happy Coding! 🚀
