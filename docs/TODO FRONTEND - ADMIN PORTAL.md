# TODO FRONTEND - Admin Portal LP Ma'arif NU

## 📋 Overview
Dokumen ini berisi requirement lengkap untuk **Frontend Admin Portal** yang digunakan oleh admin untuk mengelola semua konten website LP Ma'arif NU. Portal ini terintegrasi dengan Backend API (TODO BACKEND.md).

---

## 🎯 Spesifikasi Teknis

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: JavaScript ES6+ / TypeScript
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand / React Context API
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios / Fetch API
- **Rich Text Editor**: TipTap / Quill
- **File Upload**: React Dropzone
- **Tables**: TanStack Table (React Table v8)
- **Charts**: Recharts / Chart.js
- **Icons**: Lucide React
- **Notifications**: React Hot Toast / Sonner
- **Date Picker**: React Day Picker
- **Package Manager**: pnpm

### Authentication
- JWT-based authentication
- Token stored in httpOnly cookies (secure)
- Refresh token mechanism
- Auto-logout on token expiry
- Protected routes with middleware

---

## 🎨 Design System - Admin Portal

### Color Palette (Mengikuti Brand Website)

```javascript
// tailwind.config.js - Admin Portal
const colors = {
  // Primary (Hijau - dari website)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main brand
    600: '#16a34a',  // Primary buttons
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Neutral (Admin UI)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Sidebar (Dark theme)
  sidebar: {
    bg: '#1e293b',        // slate-800
    hover: '#334155',     // slate-700
    active: '#22c55e',    // primary-500
    text: '#f1f5f9',      // slate-100
    textMuted: '#94a3b8', // slate-400
  },

  // Status colors
  status: {
    success: '#22c55e',   // green-500
    warning: '#f59e0b',   // amber-500
    error: '#ef4444',     // red-500
    info: '#3b82f6',      // blue-500
  },
}
```

### Layout Structure
- **Sidebar**: Fixed left, width 280px, dark theme
- **Topbar**: Fixed top, height 64px, white background
- **Content Area**: Main content with max-width 1600px
- **Breadcrumbs**: Below topbar
- **Cards**: White background, subtle shadow

---

## 📁 Struktur Folder Admin Portal

```
admin-portal/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.jsx
│   │   │   ├── users/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/edit/
│   │   │   ├── news/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/edit/
│   │   │   ├── opinions/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/edit/
│   │   │   ├── documents/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── upload/
│   │   │   │   └── [id]/
│   │   │   ├── hero-slides/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/edit/
│   │   │   ├── organization/
│   │   │   │   ├── board-members/
│   │   │   │   ├── pengurus/
│   │   │   │   ├── departments/
│   │   │   │   ├── editorial-team/
│   │   │   │   └── editorial-council/
│   │   │   ├── pages/
│   │   │   │   ├── visi-misi/
│   │   │   │   ├── sejarah/
│   │   │   │   └── program-strategis/
│   │   │   ├── event-flyers/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/edit/
│   │   │   ├── media-library/
│   │   │   │   └── page.jsx
│   │   │   ├── categories/
│   │   │   │   └── page.jsx
│   │   │   ├── tags/
│   │   │   │   └── page.jsx
│   │   │   ├── contact-messages/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [id]/
│   │   │   ├── settings/
│   │   │   │   ├── general/
│   │   │   │   ├── seo/
│   │   │   │   └── appearance/
│   │   │   ├── analytics/
│   │   │   │   └── page.jsx
│   │   │   ├── activity-logs/
│   │   │   │   └── page.jsx
│   │   │   ├── profile/
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── route.js
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminTopbar.jsx
│   │   │   ├── AdminBreadcrumb.jsx
│   │   │   └── UserDropdown.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── AnalyticsChart.jsx
│   │   │   └── QuickActions.jsx
│   │   ├── users/
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserForm.jsx
│   │   │   └── UserStatusBadge.jsx
│   │   ├── news/
│   │   │   ├── NewsTable.jsx
│   │   │   ├── NewsForm.jsx
│   │   │   ├── NewsEditor.jsx
│   │   │   └── NewsPreview.jsx
│   │   ├── opinions/
│   │   │   ├── OpinionTable.jsx
│   │   │   ├── OpinionForm.jsx
│   │   │   └── OpinionEditor.jsx
│   │   ├── documents/
│   │   │   ├── DocumentTable.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   └── DocumentCard.jsx
│   │   ├── hero-slides/
│   │   │   ├── HeroSlideTable.jsx
│   │   │   ├── HeroSlideForm.jsx
│   │   │   ├── HeroSlidePreview.jsx
│   │   │   └── SlideSorter.jsx
│   │   ├── organization/
│   │   │   ├── BoardMemberForm.jsx
│   │   │   ├── PengurusForm.jsx
│   │   │   ├── OrganizationChart.jsx
│   │   │   └── MemberCard.jsx
│   │   ├── pages/
│   │   │   ├── VisiMisiEditor.jsx
│   │   │   ├── SejarahEditor.jsx
│   │   │   └── TimelineEditor.jsx
│   │   ├── event-flyers/
│   │   │   ├── FlyerTable.jsx
│   │   │   ├── FlyerForm.jsx
│   │   │   └── FlyerCard.jsx
│   │   ├── media/
│   │   │   ├── MediaLibrary.jsx
│   │   │   ├── MediaUploader.jsx
│   │   │   ├── MediaGrid.jsx
│   │   │   ├── MediaDetails.jsx
│   │   │   └── MediaSelector.jsx
│   │   ├── categories/
│   │   │   ├── CategoryTable.jsx
│   │   │   └── CategoryForm.jsx
│   │   ├── tags/
│   │   │   ├── TagTable.jsx
│   │   │   ├── TagForm.jsx
│   │   │   └── TagCloud.jsx
│   │   ├── contact/
│   │   │   ├── MessageTable.jsx
│   │   │   ├── MessageDetail.jsx
│   │   │   └── MessageStatusBadge.jsx
│   │   ├── settings/
│   │   │   ├── GeneralSettings.jsx
│   │   │   ├── SEOSettings.jsx
│   │   │   ├── LogoUploader.jsx
│   │   │   └── SocialMediaSettings.jsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsOverview.jsx
│   │   │   ├── ContentStats.jsx
│   │   │   ├── UserActivityChart.jsx
│   │   │   └── PopularContent.jsx
│   │   ├── shared/
│   │   │   ├── DataTable.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   ├── DateRangePicker.jsx
│   │   │   └── EmptyState.jsx
│   │   └── ui/
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── table.jsx
│   │       ├── tabs.jsx
│   │       ├── toast.jsx
│   │       └── ... (shadcn components)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── news.js
│   │   │   ├── opinions.js
│   │   │   ├── documents.js
│   │   │   ├── organization.js
│   │   │   ├── media.js
│   │   │   └── settings.js
│   │   ├── utils.js
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── permissions.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useNews.js
│   │   ├── useMediaUpload.js
│   │   ├── useTable.js
│   │   └── useDebounce.js
│   ├── store/
│   │   ├── authStore.js
│   │   ├── userStore.js
│   │   └── uiStore.js
│   └── middleware.js
├── public/
│   ├── images/
│   └── icons/
├── .env.local
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### 1. Login Page

**Route**: `/login`

**Features**:
- Email & password input
- Remember me checkbox
- Forgot password link
- Form validation
- Error handling
- Loading state
- Redirect to dashboard on success

**Component**: `LoginForm.jsx`

```javascript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional(),
})

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login(data)
      toast.success('Login berhasil!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Login gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@lpmaarifnu.or.id"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </Button>
    </form>
  )
}
```

### 2. Protected Routes

**Middleware**: `middleware.js`

```javascript
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request) {
  const token = request.cookies.get('auth_token')?.value

  // Public routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verify token
  if (token) {
    try {
      const user = await verifyToken(token)

      // Check role-based access
      const path = request.nextUrl.pathname

      // Super Admin only routes
      if (path.startsWith('/users') || path.startsWith('/activity-logs')) {
        if (user.role !== 'super_admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      // Redaktur restricted routes
      if (user.role === 'redaktur') {
        const allowedPaths = ['/dashboard', '/news', '/opinions', '/media-library', '/profile']
        const isAllowed = allowedPaths.some(p => path.startsWith(p))

        if (!isAllowed) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 🎨 ADMIN LAYOUT COMPONENTS

### 1. Admin Sidebar

**Component**: `AdminSidebar.jsx`

**Features**:
- Logo LP Ma'arif NU di atas
- Navigation menu dengan icons
- Nested menu support (dropdown)
- Active state indicator
- Collapse/expand functionality
- Role-based menu visibility
- Logout button di bawah

**Menu Structure** (sesuai role):

```javascript
// Super Admin Menu
const superAdminMenu = [
  {
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
  },
  {
    title: 'User Management',
    icon: 'Users',
    href: '/users',
    badge: 'Super Admin',
  },
  {
    title: 'Konten',
    icon: 'FileText',
    children: [
      { title: 'News', href: '/news' },
      { title: 'Opini', href: '/opinions' },
      { title: 'Dokumen', href: '/documents' },
    ],
  },
  {
    title: 'Tampilan Website',
    icon: 'Layout',
    children: [
      { title: 'Hero Slides', href: '/hero-slides' },
      { title: 'Event Flyers', href: '/event-flyers' },
    ],
  },
  {
    title: 'Organisasi',
    icon: 'Building',
    children: [
      { title: 'Board Members', href: '/organization/board-members' },
      { title: 'Pengurus', href: '/organization/pengurus' },
      { title: 'Departments', href: '/organization/departments' },
      { title: 'Editorial Team', href: '/organization/editorial-team' },
      { title: 'Editorial Council', href: '/organization/editorial-council' },
    ],
  },
  {
    title: 'Halaman',
    icon: 'FileEdit',
    children: [
      { title: 'Visi & Misi', href: '/pages/visi-misi' },
      { title: 'Sejarah', href: '/pages/sejarah' },
      { title: 'Program Strategis', href: '/pages/program-strategis' },
    ],
  },
  {
    title: 'Media Library',
    icon: 'Image',
    href: '/media-library',
  },
  {
    title: 'Kategori & Tags',
    icon: 'Tags',
    children: [
      { title: 'Kategori', href: '/categories' },
      { title: 'Tags', href: '/tags' },
    ],
  },
  {
    title: 'Pesan Kontak',
    icon: 'Mail',
    href: '/contact-messages',
    badge: '5 new',
  },
  {
    title: 'Settings',
    icon: 'Settings',
    children: [
      { title: 'General', href: '/settings/general' },
      { title: 'SEO', href: '/settings/seo' },
      { title: 'Appearance', href: '/settings/appearance' },
    ],
  },
  {
    title: 'Analytics',
    icon: 'BarChart3',
    href: '/analytics',
  },
  {
    title: 'Activity Logs',
    icon: 'History',
    href: '/activity-logs',
    badge: 'Super Admin',
  },
]

// Admin Menu (sama, tanpa User Management & Activity Logs)

// Redaktur Menu (hanya News, Opini, Media Library)
const redakturMenu = [
  {
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
  },
  {
    title: 'News',
    icon: 'Newspaper',
    href: '/news',
  },
  {
    title: 'Opini',
    icon: 'FileText',
    href: '/opinions',
  },
  {
    title: 'Media Library',
    icon: 'Image',
    href: '/media-library',
  },
]
```

### 2. Admin Topbar

**Component**: `AdminTopbar.jsx`

**Features**:
- Breadcrumb navigation
- Search bar (global)
- Notifications dropdown (bell icon)
- User profile dropdown
  - Lihat Profile
  - Change Password
  - Logout

### 3. Breadcrumb

**Component**: `AdminBreadcrumb.jsx`

**Example**:
```
Dashboard > Organization > Pengurus > Edit
```

---

## 📊 DASHBOARD PAGE

**Route**: `/dashboard`

**Layout**: 4 kolom grid

### Sections:

#### 1. Statistics Cards (Top Row)
- Total News Articles (dengan trend)
- Total Opinions (dengan trend)
- Total Documents (dengan trend)
- Total Views This Month (dengan trend)

**Component**: `StatCard.jsx`

#### 2. Charts Row
- **Content Performance Chart** (Line chart - views per day)
- **Content Distribution** (Pie chart - by category)

#### 3. Recent Activity
- List of recent actions (created, updated, deleted)
- User who performed action
- Timestamp
- Action type badge

#### 4. Quick Actions
- Create News
- Create Opinion
- Upload Document
- Upload Event Flyer
- View Contact Messages

#### 5. Popular Content
- Top 5 news by views
- Top 5 documents by downloads
- Top 5 opinions by views

---

## 📰 NEWS MANAGEMENT

### 1. News List Page

**Route**: `/news`

**Features**:
- Data table dengan sorting, filtering, pagination
- Search by title
- Filter by:
  - Category
  - Status (draft, published, archived)
  - Author (if super admin/admin)
  - Date range
  - Featured status
- Bulk actions:
  - Delete
  - Change status
  - Set featured
- Quick actions:
  - Edit
  - Delete
  - View (preview)
  - Publish/Unpublish

**Columns**:
| Column | Width | Sortable | Filterable |
|--------|-------|----------|------------|
| Thumbnail | 80px | No | No |
| Title | Auto | Yes | No |
| Category | 120px | Yes | Yes |
| Author | 150px | Yes | Yes |
| Status | 100px | Yes | Yes |
| Views | 80px | Yes | No |
| Featured | 80px | Yes | Yes |
| Published Date | 150px | Yes | Yes |
| Actions | 100px | No | No |

**Component**: `NewsTable.jsx`

### 2. Create/Edit News Page

**Route**: `/news/create` atau `/news/[id]/edit`

**Form Sections**:

#### Basic Information
- Title (required)
- Slug (auto-generated, editable)
- Excerpt (required, max 200 chars)
- Category (dropdown, required)
- Tags (multi-select)

#### Content
- Rich Text Editor (TipTap/Quill)
  - Formatting: Bold, Italic, Underline, Strikethrough
  - Headings: H2, H3, H4
  - Lists: Bullet, Numbered
  - Links
  - Images (upload via media library)
  - Tables
  - Code blocks
  - Undo/Redo

#### Featured Image
- Image uploader (drag & drop)
- Upload to CDN
- Image preview
- Alt text input
- Recommended size: 1200x675px

#### Publishing Options
- Status (Draft, Published, Archived)
- Published Date & Time (datetime picker)
- Featured Article (checkbox)
- Author (auto-filled, read-only for redaktur)

#### SEO Meta
- Meta Title (optional, defaults to title)
- Meta Description (optional, max 160 chars)
- Meta Keywords (optional, comma-separated)

**Actions**:
- Save as Draft
- Publish Now
- Schedule Publish
- Preview
- Cancel

**Component**: `NewsForm.jsx` + `NewsEditor.jsx`

**Validation**:
```javascript
const newsSchema = z.object({
  title: z.string().min(10, 'Title minimal 10 karakter').max(500),
  excerpt: z.string().min(50, 'Excerpt minimal 50 karakter').max(200),
  content: z.string().min(100, 'Content minimal 100 karakter'),
  image: z.string().url('Image harus berupa URL valid'),
  category_id: z.number().positive('Category wajib dipilih'),
  tags: z.array(z.number()).min(1, 'Minimal 1 tag'),
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.string().optional(),
  is_featured: z.boolean(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(160).optional(),
  meta_keywords: z.string().optional(),
})
```

---

## 📝 OPINION MANAGEMENT

**Similar to News, with additional fields:**

### Opinion Form Sections:

#### Author Information (Different from News)
- Author Name (text input, required)
- Author Title (text input, optional)
- Author Photo (image upload)
- Author Bio (textarea, max 500 chars)

**Note**: Opinion tidak punya category, hanya tags

---

## 📄 DOCUMENT MANAGEMENT

### 1. Document List Page

**Route**: `/documents`

**Features**:
- Grid/List view toggle
- Search by title
- Filter by:
  - Category
  - File type (PDF, DOC, XLS, etc)
  - Upload date
  - Public/Private
- Sort by:
  - Upload date
  - Download count
  - File size
  - Title

**Card View** (Grid):
- File icon (by type)
- Title
- File size
- Download count
- Upload date
- Public/Private badge
- Actions dropdown

**Component**: `DocumentTable.jsx` / `DocumentCard.jsx`

### 2. Upload Document Page

**Route**: `/documents/upload`

**Form**:
- Title (required)
- Description (optional)
- Category (dropdown)
- File Upload (drag & drop)
  - Max size: 50MB
  - Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
  - Upload to CDN
- Public/Private toggle
- Upload progress bar

**Component**: `DocumentUpload.jsx`

---

## 🎨 HERO SLIDES MANAGEMENT

### 1. Hero Slides List

**Route**: `/hero-slides`

**Features**:
- Visual grid with preview
- Drag & drop to reorder
- Active/Inactive toggle
- Schedule display period

**Card**:
- Slide preview image
- Title
- CTA buttons preview
- Active status toggle
- Display period
- Actions (Edit, Delete)

**Component**: `HeroSlideTable.jsx` + `SlideSorter.jsx`

### 2. Create/Edit Hero Slide

**Route**: `/hero-slides/create` or `/hero-slides/[id]/edit`

**Form**:
- Title (required)
- Description (textarea, max 200 chars)
- Image Upload (required)
  - Recommended: 1920x1080px
  - Upload to CDN
- Primary CTA
  - Label
  - Link
- Secondary CTA (optional)
  - Label
  - Link
- Order Number (auto, editable)
- Active Status (toggle)
- Display Period
  - Start Date (optional)
  - End Date (optional)

**Preview**:
- Live preview of slide design
- Desktop & mobile preview

**Component**: `HeroSlideForm.jsx` + `HeroSlidePreview.jsx`

---

## 🏢 ORGANIZATION MANAGEMENT

### 1. Board Members

**Route**: `/organization/board-members`

**Features**:
- List of board members
- Grouped by position
- Drag & drop to reorder within position
- Period filter

**Form Fields**:
- Position (dropdown from organization_positions)
- Name (required)
- Title (gelar akademik)
- Photo Upload (CDN)
- Bio (rich text)
- Email (optional)
- Phone (optional)
- Social Media
  - Facebook URL
  - Twitter URL
  - Instagram URL
  - LinkedIn URL
- Period Start (year picker)
- Period End (year picker)
- Active Status
- Order Number

**Component**: `BoardMemberForm.jsx`

### 2. Pengurus

**Route**: `/organization/pengurus`

**Features**:
- Similar to Board Members
- Grouped by kategori (pimpinan_utama, bidang, sekretariat, bendahara)
- Drag & drop to reorder

**Form Fields**:
- Nama (required)
- Jabatan (required)
- Kategori (dropdown)
- Foto (CDN upload)
- Bio
- Email (optional)
- Phone (optional)
- Periode Mulai (year)
- Periode Selesai (year)
- Order Number
- Active Status

**Component**: `PengurusForm.jsx`

### 3. Departments

**Simple CRUD table**

### 4. Editorial Team

**Simple CRUD table with photo upload**

### 5. Editorial Council

**Simple CRUD table with photo upload**

---

## 📃 PAGES MANAGEMENT

### 1. Visi & Misi Editor

**Route**: `/pages/visi-misi`

**Form Structure (JSON content)**:
- Visi (textarea)
- Misi (array of text)
  - Add/Remove misi items
- Nilai-nilai (array of objects)
  - Title
  - Description
  - Add/Remove nilai items

**Component**: `VisiMisiEditor.jsx`

### 2. Sejarah Editor

**Route**: `/pages/sejarah`

**Form Structure**:
- Content (Rich Text Editor)
- Timeline (array of objects)
  - Year
  - Title
  - Description
  - Add/Remove timeline items

**Component**: `SejarahEditor.jsx` + `TimelineEditor.jsx`

### 3. Program Strategis

**Similar to Sejarah with list of programs**

---

## 🎉 EVENT FLYERS

**Route**: `/event-flyers`

**Similar to Hero Slides, with additional fields:**

### Form Fields:
- Title (required)
- Description
- Image Upload (flyer/poster)
- Event Date (date picker)
- Event Location (text)
- Registration URL (optional)
- Contact Person
- Contact Phone
- Contact Email
- Order Number
- Active Status
- Display Period
  - Start Display Date
  - End Display Date

**Component**: `FlyerForm.jsx` + `FlyerCard.jsx`

---

## 📁 MEDIA LIBRARY

**Route**: `/media-library`

**Features**:
- Grid view with thumbnails
- Upload multiple files (drag & drop)
- Search by filename
- Filter by:
  - Folder/Tag
  - File type
  - Upload date
  - Uploaded by user
- Bulk actions:
  - Delete
  - Move to folder
  - Download
- File details panel:
  - Preview
  - Filename
  - File size
  - Dimensions (for images)
  - Upload date
  - Uploaded by
  - URL (copy button)
  - Used in (where file is used)
  - Alt text (editable)
  - Caption (editable)

**Upload Flow**:
1. Select files or drag & drop
2. Files upload to CDN automatically
3. Save metadata to backend
4. Show in grid

**Component**: `MediaLibrary.jsx` + `MediaUploader.jsx` + `MediaGrid.jsx` + `MediaDetails.jsx`

**Media Selector** (for use in forms):
- Modal dialog
- Search & filter
- Select single or multiple
- Preview selected
- Upload new file inline

**Component**: `MediaSelector.jsx`

---

## 🏷️ CATEGORIES & TAGS

### 1. Categories

**Route**: `/categories`

**Simple CRUD table**:
- Name
- Slug (auto-generated)
- Description
- Type (news, opinion, document)
- Icon (optional)
- Color (color picker)
- Order Number
- Active Status
- Article Count (read-only)

**Validation**: Cannot delete category with articles

**Component**: `CategoryTable.jsx` + `CategoryForm.jsx`

### 2. Tags

**Route**: `/tags`

**Features**:
- Tag cloud visualization
- Size based on usage count
- CRUD table
- Merge tags functionality

**Form**:
- Name
- Slug (auto-generated)
- Type (general)
- Usage Count (read-only)
- Active Status

**Merge Tags**:
- Select multiple tags
- Choose target tag
- Confirm merge

**Component**: `TagTable.jsx` + `TagForm.jsx` + `TagCloud.jsx`

---

## 📩 CONTACT MESSAGES

**Route**: `/contact-messages`

**Features**:
- Table with message list
- Search by name, email, subject
- Filter by:
  - Status (new, read, in_progress, resolved, closed)
  - Priority (low, medium, high, urgent)
  - Assigned to user
  - Date range
- Sort by date, priority
- Bulk actions:
  - Mark as read
  - Assign to user
  - Delete

**Message Detail Page**:

**Route**: `/contact-messages/[id]`

**Layout**:
- Left panel: Message info
  - Ticket ID
  - Name, Email, Phone
  - Subject
  - Message (full text)
  - IP Address
  - User Agent
  - Received date
- Right panel: Actions
  - Status dropdown
  - Priority dropdown
  - Assign to (user dropdown)
  - Internal notes (textarea)
  - Action buttons:
    - Mark as Replied
    - Mark as Resolved
    - Delete

**Component**: `MessageTable.jsx` + `MessageDetail.jsx` + `MessageStatusBadge.jsx`

---

## ⚙️ SETTINGS

### 1. General Settings

**Route**: `/settings/general`

**Sections**:

#### Site Information
- Site Name
- Tagline
- Description
- Logo (image upload)
- Logo Dark (image upload)
- Favicon (image upload)

#### Contact Information
- Email
- Phone
- WhatsApp
- Address (textarea)

#### Social Media
- Facebook URL
- Twitter URL
- Instagram URL
- YouTube URL
- LinkedIn URL

**Component**: `GeneralSettings.jsx` + `LogoUploader.jsx` + `SocialMediaSettings.jsx`

### 2. SEO Settings

**Route**: `/settings/seo`

**Fields**:
- Meta Title
- Meta Description
- Meta Keywords
- Google Analytics ID
- Google Site Verification Code

**Component**: `SEOSettings.jsx`

### 3. Appearance Settings

**Route**: `/settings/appearance`

**Fields**:
- Maintenance Mode (toggle)
- Maintenance Message
- Allow Public API (toggle)
- Enable Registration (toggle)
- Enable Comments (toggle)

---

## 📊 ANALYTICS

**Route**: `/analytics`

**Layout**: Dashboard-style

### Sections:

#### Overview Stats (Top)
- Total News
- Total Opinions
- Total Documents
- Total Users
- Total Views This Month
- Total Downloads This Month

#### Recent Stats
- News Published This Week
- Opinions Published This Week
- Documents Uploaded This Week
- New Messages This Week

#### Popular Content
- Top 10 News (by views)
- Top 10 Opinions (by views)
- Top 10 Documents (by downloads)

#### Traffic Chart
- Daily views (last 30 days)
- Line chart

#### Top Referrers
- Google, Facebook, etc.
- Pie chart

#### Export
- Export to CSV
- Export to Excel
- Export to PDF
- Date range selector

**Component**: `AnalyticsOverview.jsx` + `ContentStats.jsx` + `UserActivityChart.jsx` + `PopularContent.jsx`

---

## 📝 ACTIVITY LOGS (Super Admin Only)

**Route**: `/activity-logs`

**Features**:
- Table with all user actions
- Search
- Filter by:
  - Log type (auth, content, settings, users)
  - User
  - Subject type (news_articles, users, documents)
  - Date range
- Sort by date
- View details (JSON properties)

**Columns**:
- ID
- User
- Action
- Subject Type
- Subject ID
- IP Address
- Date/Time
- Details (expand button)

**Component**: `ActivityLogTable.jsx` + `LogDetailsDialog.jsx`

---

## 👤 PROFILE & ACCOUNT

**Route**: `/profile`

**Sections**:

#### Profile Information
- Avatar (image upload)
- Name
- Email (read-only)
- Role (read-only)
- Last Login (read-only)

#### Change Password
- Current Password
- New Password
- Confirm New Password

**Component**: `ProfilePage.jsx`

---

## 🧩 SHARED COMPONENTS

### 1. DataTable Component

**Reusable table dengan features:**
- Sorting (client & server-side)
- Filtering
- Pagination
- Row selection
- Bulk actions
- Column visibility toggle
- Export (CSV, Excel)
- Responsive (mobile: card view)

**Usage**:
```javascript
<DataTable
  columns={columns}
  data={data}
  pagination={pagination}
  onSort={handleSort}
  onFilter={handleFilter}
  onPageChange={handlePageChange}
  onRowSelect={handleRowSelect}
  bulkActions={bulkActions}
/>
```

**Component**: `DataTable.jsx`

### 2. ImageUploader Component

**Features**:
- Drag & drop
- Click to browse
- Preview
- Progress bar
- Validation (size, type)
- CDN upload
- Error handling

**Usage**:
```javascript
<ImageUploader
  onUpload={handleUpload}
  maxSize={5} // MB
  acceptedTypes={['image/jpeg', 'image/png']}
  tag="news"
  isPublic={true}
/>
```

**Component**: `ImageUploader.jsx`

### 3. RichTextEditor Component

**Features**:
- TipTap/Quill editor
- Toolbar dengan formatting options
- Image upload via media library
- Link insertion
- Code blocks
- Tables
- Full-screen mode

**Usage**:
```javascript
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Tulis konten di sini..."
  minHeight={400}
/>
```

**Component**: `RichTextEditor.jsx`

### 4. ConfirmDialog Component

**Usage**:
```javascript
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Hapus News Article?"
  description="Artikel akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
  onConfirm={handleDelete}
  confirmText="Hapus"
  variant="destructive"
/>
```

**Component**: `ConfirmDialog.jsx`

### 5. StatusBadge Component

**Usage**:
```javascript
<StatusBadge status="published" />
<StatusBadge status="draft" />
<StatusBadge status="archived" />
```

**Component**: `StatusBadge.jsx`

---

## 🔌 API INTEGRATION

### API Client Setup

**File**: `lib/api/client.js`

```javascript
import axios from 'axios'
import { getAuthToken, refreshAuthToken, logout } from './auth'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newToken = await refreshAuthToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
```

### API Service Examples

**File**: `lib/api/news.js`

```javascript
import apiClient from './client'

export const newsApi = {
  getAll: (params) => apiClient.get('/api/v1/admin/news', { params }),

  getById: (id) => apiClient.get(`/api/v1/admin/news/${id}`),

  create: (data) => apiClient.post('/api/v1/admin/news', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  update: (id, data) => apiClient.put(`/api/v1/admin/news/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  delete: (id) => apiClient.delete(`/api/v1/admin/news/${id}`),

  publish: (id, publishedAt) =>
    apiClient.patch(`/api/v1/admin/news/${id}/publish`, { published_at: publishedAt }),

  archive: (id) => apiClient.patch(`/api/v1/admin/news/${id}/archive`),

  toggleFeatured: (id, isFeatured) =>
    apiClient.patch(`/api/v1/admin/news/${id}/featured`, { is_featured: isFeatured }),
}
```

---

## 🎨 UI/UX GUIDELINES

### Color Usage

**Buttons**:
- Primary action: `bg-primary-600 hover:bg-primary-700`
- Secondary: `bg-neutral-200 hover:bg-neutral-300`
- Destructive: `bg-red-600 hover:bg-red-700`
- Ghost: `hover:bg-neutral-100`

**Status Colors**:
- Draft: `bg-neutral-200 text-neutral-700`
- Published: `bg-green-100 text-green-700`
- Archived: `bg-amber-100 text-amber-700`

**Badges**:
- New: `bg-blue-100 text-blue-700`
- Important: `bg-red-100 text-red-700`
- Success: `bg-green-100 text-green-700`

### Spacing

**Page Layout**:
- Page padding: `p-6 lg:p-8`
- Section gap: `space-y-6`
- Card padding: `p-6`

**Form**:
- Field gap: `space-y-4`
- Label margin: `mb-2`
- Input height: `h-10`

### Typography

**Headings**:
- Page title: `text-3xl font-bold text-neutral-900`
- Section title: `text-xl font-semibold text-neutral-900`
- Card title: `text-lg font-medium text-neutral-900`

**Body**:
- Default: `text-base text-neutral-700`
- Muted: `text-sm text-neutral-500`

### Animations

**Transitions**:
- Default: `transition-all duration-200 ease-in-out`
- Hover scale: `hover:scale-105`
- Hover shadow: `hover:shadow-lg`

**Loading States**:
- Skeleton loading for tables
- Spinner for buttons
- Progress bar for uploads

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```javascript
// Tailwind config
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Layout Adaptations

**Sidebar**:
- Desktop: Fixed left (280px)
- Tablet: Collapsible (80px collapsed, 280px expanded)
- Mobile: Overlay drawer (slides in from left)

**Data Tables**:
- Desktop: Full table
- Tablet: Horizontal scroll
- Mobile: Card view (stacked)

**Forms**:
- Desktop: 2 columns where applicable
- Tablet: 1 column
- Mobile: 1 column, full width inputs

**Dashboard**:
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

---

## ⚡ PERFORMANCE OPTIMIZATION

### Code Splitting

```javascript
// Dynamic imports for heavy components
const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
})

const AnalyticsChart = dynamic(() => import('@/components/analytics/AnalyticsChart'), {
  ssr: false,
})
```

### Image Optimization

```javascript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={thumbnailUrl}
  alt={title}
  width={400}
  height={225}
  className="object-cover"
  loading="lazy"
/>
```

### Data Fetching

```javascript
// React Query for caching & optimistic updates
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function useNews(params) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => newsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

function useCreateNews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['news'])
      toast.success('News created!')
    },
  })
}
```

---

## 🧪 TESTING

### Unit Tests (Vitest + Testing Library)

```javascript
import { render, screen } from '@testing-library/react'
import { NewsCard } from '@/components/news/NewsCard'

describe('NewsCard', () => {
  const mockNews = {
    id: '1',
    title: 'Test News',
    excerpt: 'Test excerpt',
    image: '/test.jpg',
    category: { name: 'Nasional' },
    published_at: '2024-01-15',
  }

  it('renders news title', () => {
    render(<NewsCard news={mockNews} />)
    expect(screen.getByText('Test News')).toBeInTheDocument()
  })

  it('displays category badge', () => {
    render(<NewsCard news={mockNews} />)
    expect(screen.getByText('Nasional')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```javascript
import { test, expect } from '@playwright/test'

test('admin can create news article', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@test.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')

  // Navigate to news
  await page.click('text=News')
  await page.click('text=Create News')

  // Fill form
  await page.fill('[name="title"]', 'Test Article')
  await page.fill('[name="excerpt"]', 'This is a test excerpt')
  // ... fill other fields

  // Submit
  await page.click('text=Publish')

  // Verify
  await expect(page).toHaveURL('/news')
  await expect(page.getByText('News created successfully')).toBeVisible()
})
```

---

## 🔒 SECURITY CHECKLIST

- [ ] XSS protection (sanitize HTML input)
- [ ] CSRF protection (CSRF tokens)
- [ ] Input validation (client & server)
- [ ] File upload validation (type, size)
- [ ] Rate limiting for API calls
- [ ] Secure cookies (httpOnly, secure, sameSite)
- [ ] Role-based access control
- [ ] Audit logging (activity logs)
- [ ] Password strength requirements
- [ ] Auto-logout on inactivity

---

## 📦 DEPLOYMENT

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_NAME="LP Ma'arif NU Admin"
NEXT_PUBLIC_API_URL="https://api.lpmaarifnu.or.id"
NEXT_PUBLIC_CDN_URL="https://cdn.maarifnu.or.id"

# Private
API_SECRET_KEY="your-secret-key"
```

### Build & Deploy

```bash
# Build
pnpm build

# Start production
pnpm start

# Deploy to Vercel
vercel --prod
```

### Checklist

- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] CDN integration working
- [ ] Authentication working
- [ ] All routes protected
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] Browser tested (Chrome, Firefox, Safari)
- [ ] Lighthouse score > 90

---

## 📊 IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup & dependencies
- [ ] Design system implementation
- [ ] Layout components (Sidebar, Topbar)
- [ ] Authentication (Login, Logout)
- [ ] Protected routes middleware
- [ ] API client setup
- [ ] Dashboard page

### Phase 2: Content Management (Week 3-4)
- [ ] News management (List, Create, Edit, Delete)
- [ ] Opinion management
- [ ] Media Library
- [ ] Categories & Tags
- [ ] Rich Text Editor integration

### Phase 3: Advanced Features (Week 5-6)
- [ ] Document management
- [ ] Hero Slides management
- [ ] Event Flyers management
- [ ] Organization (Board Members, Pengurus)
- [ ] Pages editor (Visi-Misi, Sejarah)

### Phase 4: Communication & Settings (Week 7)
- [ ] Contact Messages
- [ ] Settings (General, SEO, Appearance)
- [ ] User Management (Super Admin)
- [ ] Profile & Account

### Phase 5: Analytics & Polish (Week 8)
- [ ] Analytics dashboard
- [ ] Activity Logs
- [ ] Notifications
- [ ] Error handling & validation
- [ ] Performance optimization
- [ ] Testing & bug fixes

---

## 📚 RELATED DOCUMENTATION

- **TODO BACKEND.md** - Backend API specification
- **API-CONTRACT.md** - CDN File Server API
- **website-project-prompt.md** - Public website design system
- **BACKEND-API-COVERAGE-CHECKLIST.md** - API coverage verification

---

**Version:** 1.0.0
**Last Updated:** 2025-01-29
**Status:** ✅ READY FOR IMPLEMENTATION

**Total Pages:** 50+ pages
**Total Components:** 100+ components
**Total Features:** 18 modules
**Estimated Development:** 8 weeks (2 developers)

---

**Prepared by:** Frontend Development Team
**Based on:** TODO BACKEND.md v2.2.0
**Design Reference:** website-project-prompt.md (Hijau Modern Theme)
