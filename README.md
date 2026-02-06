# LP Ma'arif NU - Admin Portal

## 📋 Project Overview

Admin Portal untuk mengelola konten website LP Ma'arif NU. Dibangun dengan Next.js 14 (App Router), React, Tailwind CSS, dan Shadcn/UI.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local dengan konfigurasi Anda

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
site-admin-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, forgot-password)
│   │   ├── (dashboard)/       # Dashboard pages (protected)
│   │   ├── layout.jsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/            # Layout components (Sidebar, Topbar, Breadcrumb)
│   │   ├── auth/              # Auth components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── news/              # News management components
│   │   ├── opinions/          # Opinion management components
│   │   ├── documents/         # Document management components
│   │   ├── shared/            # Shared/reusable components
│   │   └── ui/                # UI components (shadcn/ui)
│   ├── lib/
│   │   ├── api/               # API client functions
│   │   ├── utils.js           # Utility functions
│   │   ├── constants.js       # Constants
│   │   └── permissions.js     # Permission helpers
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand stores
│   └── middleware.js          # Next.js middleware for auth
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies
```

## 🔑 Features

### ✅ Implemented

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Super Admin, Admin, Editor)
   - Protected routes with middleware
   - Login/Logout/Forgot Password

2. **Dashboard**
   - Statistics cards (News, Opinions, Documents, Views)
   - Recent activity feed
   - Quick actions
   - Popular content

3. **Layout Components**
   - Responsive sidebar navigation
   - Top navigation bar with search and notifications
   - Breadcrumb navigation
   - User dropdown menu

4. **News Management**
   - List view with filters and pagination
   - CRUD operations
   - Status management (Draft, Published, Archived)
   - Featured articles toggle
   - Rich text editor (to be completed)
   - Image upload (to be completed)

5. **Shared Components**
   - Data tables with sorting and pagination
   - Search bar with debounce
   - Status badges
   - Empty states
   - Confirm dialogs
   - Form controls (Input, Select, Textarea, etc.)

6. **API Integration**
   - Axios client with interceptors
   - Token refresh mechanism
   - Error handling
   - API functions for all endpoints

### 🚧 To Be Implemented

1. **Content Management**
   - Complete News create/edit forms
   - Opinion Management
   - Document Management
   - Hero Slides Management
   - Event Flyers Management

2. **Organization Management**
   - Board Members
   - Pengurus (Organizational Structure)
   - Departments
   - Editorial Team/Council

3. **Pages Management**
   - Visi & Misi Editor
   - Sejarah (History) Editor
   - Program Strategis

4. **Media Library**
   - File upload with drag & drop
   - Media grid view
   - Media selector modal
   - CDN integration

5. **Taxonomy**
   - Categories Management
   - Tags Management
   - Tag cloud visualization

6. **Contact Messages**
   - Inbox view
   - Message detail
   - Status management

7. **Settings**
   - General Settings
   - SEO Settings
   - Appearance Settings

8. **Analytics & Logs**
   - Analytics Dashboard
   - Activity Logs
   - User activity tracking

## 🎨 Design System

### Colors

- **Primary**: Green (#059669)
- **Secondary**: Blue (#1E40AF)
- **Destructive**: Red
- **Gray**: Neutral colors

### Typography

- Font: Inter
- Sizes: text-sm (14px), text-base (16px), text-lg (18px), etc.

### Components

Based on Shadcn/UI with Radix UI primitives. All components are fully customizable and follow accessibility best practices.

## 📡 API Integration

### Base URL

- Development: `http://localhost:3000/api/v1/admin`
- Production: `https://api.maarifnu.or.id/api/v1/admin`

### Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer {access_token}
```

### Available API Modules

- `authApi` - Authentication
- `usersApi` - User management
- `newsApi` - News articles
- `opinionsApi` - Opinion articles
- `documentsApi` - Documents
- `mediaApi` - Media/file management

See [API_CONTRACT.md](./API_CONTRACT.md) and [API-CONTRACT-FILESERVER.md](./API-CONTRACT-FILESERVER.md) for complete API documentation.

## 🔒 Permissions

### Roles

1. **Super Admin**
   - Full access to all features
   - User management
   - Activity logs
   - Settings

2. **Admin**
   - Content management (News, Opinions, Documents)
   - Organization management
   - Media library
   - Contact messages

3. **Editor**
   - Create and edit News/Opinions
   - Upload media
   - View categories and tags

### Permission Helper

```javascript
import { hasPermission } from '@/lib/permissions';

// Check if user has permission
if (hasPermission(user.role, 'news', 'create')) {
  // User can create news
}
```

## 🛠️ Development Guide

### Adding New Pages

1. Create page in `src/app/(dashboard)/your-page/page.jsx`
2. Add route to sidebar in `src/components/layout/AdminSidebar.jsx`
3. Create components in `src/components/your-feature/`
4. Add API functions in `src/lib/api/your-api.js`

### Creating New Components

```javascript
// src/components/shared/YourComponent.jsx
'use client';

import { cn } from '@/lib/utils';

export default function YourComponent({ className, ...props }) {
  return (
    <div className={cn('your-classes', className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

### Using API

```javascript
import { newsApi } from '@/lib/api/news';
import { toast } from 'sonner';

const fetchNews = async () => {
  try {
    const response = await newsApi.getAll({ page: 1, limit: 10 });
    console.log(response.data);
  } catch (error) {
    toast.error('Failed to fetch news');
  }
};
```

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## 📦 Build & Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel
vercel deploy
```

## 🤝 Contributing

1. Create feature branch from `main`
2. Make your changes
3. Submit pull request
4. Wait for review

## 📝 Next Steps

Priority tasks to complete the project:

1. ✅ **Rich Text Editor Integration**
   - Integrate TipTap editor
   - Add toolbar controls
   - Image upload in editor

2. ✅ **Image Upload Component**
   - Drag & drop uploader
   - Integration with File Server API
   - Image preview

3. ✅ **Complete News Create/Edit Form**
   - All form fields
   - Validation
   - Auto-save draft

4. ✅ **Opinion Management** (similar to News)

5. ✅ **Document Management**
   - File upload
   - Document preview
   - Download statistics

6. ✅ **Media Library**
   - Grid view
   - Bulk operations
   - Media selector modal

7. ✅ **Other Management Modules**
   - Hero Slides
   - Organization
   - Events
   - Pages

8. ✅ **Settings & Configuration**

## 📞 Support

For questions or issues, please contact the development team.

---

© 2024 LP Ma'arif NU. All rights reserved.
