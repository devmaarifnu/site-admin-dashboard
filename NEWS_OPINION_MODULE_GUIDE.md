# 📝 News & Opinion Module - Implementation Guide

## Overview
Kedua module ini sudah **COMPLETE** dengan full CRUD functionality, form validation, rich text editor, image upload, dan SEO fields.

---

## 📂 File Structure

### News Module
```
src/
├── app/(dashboard)/news/
│   ├── page.jsx                    # List page dengan filters
│   ├── create/
│   │   └── page.jsx                # Create news page
│   └── [id]/
│       └── edit/
│           └── page.jsx            # Edit news page
├── components/news/
│   ├── NewsForm.jsx                # Main form component (650+ lines)
│   └── NewsTable.jsx               # Data table component
└── lib/api/
    └── news.js                     # News API functions
```

### Opinion Module
```
src/
├── app/(dashboard)/opinions/
│   ├── page.jsx                    # List page dengan filters
│   ├── create/
│   │   └── page.jsx                # Create opinion page
│   └── [id]/
│       └── edit/
│           └── page.jsx            # Edit opinion page
├── components/opinions/
│   ├── OpinionForm.jsx             # Main form component
│   └── OpinionTable.jsx            # Data table component
└── lib/api/
    └── opinions.js                 # Opinions API functions
```

---

## 🎨 News Form Features

### Form Fields
```javascript
{
  // Basic Information
  title: string (required, 5-200 chars),
  slug: string (auto-generated from title),
  excerpt: textarea (max 200 chars),
  
  // Content
  content: RichTextEditor (required, min 50 chars),
  featured_image: ImageUploader (CDN integration),
  
  // Taxonomy
  category_id: number (select dropdown, required),
  tag_ids: number[] (multi-select badges),
  
  // Publishing
  status: enum ['draft', 'published', 'archived'],
  is_featured: boolean (checkbox),
  published_at: datetime (optional, schedule publish),
  
  // SEO (collapsible section)
  meta_title: string (max 60 chars),
  meta_description: textarea (max 160 chars),
  meta_keywords: string (comma-separated, max 255 chars)
}
```

### Form Validation (Zod Schema)
```javascript
const newsSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(5).max(250),
  excerpt: z.string().max(200).optional(),
  category_id: z.number().min(1).nullable(),
  tag_ids: z.array(z.number()).optional(),
  content: z.string().min(50),
  featured_image: z.string().url().optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.string().optional(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
  meta_keywords: z.string().max(255).optional(),
});
```

### Key Features
1. **Auto-Slug Generation**: Slug dibuat otomatis dari title (lowercase, no special chars)
2. **Rich Text Editor**: TipTap editor dengan 20+ toolbar buttons
3. **Image Upload**: Drag & drop dengan progress bar, max 5MB
4. **Tag Selection**: Multi-select dengan badge UI
5. **Character Counter**: Real-time counter untuk excerpt, meta fields
6. **SEO Section**: Collapsible section untuk meta tags
7. **Status Management**: Draft, published, archived dengan badge
8. **Schedule Publish**: Datetime picker untuk scheduled publishing
9. **Featured Toggle**: Checkbox untuk featured articles
10. **Preview**: Preview button (placeholder untuk future implementation)

---

## 🎭 Opinion Form Differences

Opinion module memiliki perbedaan utama:

### Additional Fields (Author Information)
```javascript
{
  author_name: string (required, 2-100 chars),
  author_title: string (max 100 chars),
  author_bio: textarea (max 500 chars)
}
```

### No Category Field
Opinion tidak menggunakan category, hanya tags.

### Form Layout
```
┌─────────────────────────────────┬──────────────┐
│ Title & Slug                    │ Publish      │
│ Excerpt                         │ Settings     │
│ Author Information (Card)       │              │
│ Content (RichTextEditor)        │ Tags         │
│ Featured Image                  │              │
│ SEO Meta Tags (Collapsible)     │              │
└─────────────────────────────────┴──────────────┘
```

---

## 📊 Table Features

### NewsTable Component
- **Columns**: Image thumbnail, Title/Excerpt, Category, Status, Featured star, Views, Date, Actions
- **Actions Dropdown**: Edit, Publish (if draft), Toggle Featured, Delete
- **Featured Toggle**: Click star icon to toggle featured status
- **Delete Confirmation**: ConfirmDialog component
- **Empty State**: EmptyState component with "Create News" CTA

### OpinionTable Component
- **Columns**: Image thumbnail, Title/Excerpt, Author, Status, Views, Date, Actions
- **Actions Dropdown**: Edit, Publish (if draft), View (if published), Delete
- **Author Display**: Name + title
- **Tag Badges**: Display up to 3 tags + "+X more"

---

## 🔄 API Integration

### News API Methods
```javascript
newsApi.getAll(params)           // GET /api/v1/admin/news
newsApi.getById(id)              // GET /api/v1/admin/news/:id
newsApi.create(data)             // POST /api/v1/admin/news
newsApi.update(id, data)         // PUT /api/v1/admin/news/:id
newsApi.delete(id)               // DELETE /api/v1/admin/news/:id
newsApi.publish(id)              // POST /api/v1/admin/news/:id/publish
newsApi.archive(id)              // POST /api/v1/admin/news/:id/archive
newsApi.toggleFeatured(id)       // POST /api/v1/admin/news/:id/toggle-featured
```

### Opinion API Methods
```javascript
opinionsApi.getAll(params)       // GET /api/v1/admin/opinions
opinionsApi.getById(id)          // GET /api/v1/admin/opinions/:id
opinionsApi.create(data)         // POST /api/v1/admin/opinions
opinionsApi.update(id, data)     // PUT /api/v1/admin/opinions/:id
opinionsApi.delete(id)           // DELETE /api/v1/admin/opinions/:id
opinionsApi.publish(id)          // POST /api/v1/admin/opinions/:id/publish
opinionsApi.archive(id)          // POST /api/v1/admin/opinions/:id/archive
```

---

## 🎯 Usage Examples

### Create News
```javascript
// Navigate to /news/create
router.push('/news/create');

// Form will submit to:
await newsApi.create({
  title: "Judul Berita",
  slug: "judul-berita",
  excerpt: "Ringkasan singkat...",
  content: "<p>Konten HTML dari TipTap...</p>",
  category_id: 1,
  tag_ids: [1, 2, 3],
  featured_image: "https://cdn.lpmaarifnu.or.id/...",
  is_featured: true,
  status: "published",
  published_at: "2026-02-03T10:00:00",
  meta_title: "SEO Title",
  meta_description: "SEO Description",
  meta_keywords: "keyword1, keyword2"
});
```

### Edit News
```javascript
// Navigate to /news/123/edit
router.push(`/news/${id}/edit`);

// Page will fetch data:
const response = await newsApi.getById(id);
// Then populate form with initialData
<NewsForm mode="edit" initialData={response.data} />
```

### Delete News
```javascript
// From NewsTable actions dropdown
const handleDelete = async (id) => {
  // ConfirmDialog akan muncul
  await newsApi.delete(id);
  toast.success('Berita berhasil dihapus');
  fetchNews(); // Refresh list
};
```

---

## 🛠️ Customization Tips

### 1. Modify Form Fields
Edit `NewsForm.jsx` atau `OpinionForm.jsx`:
```javascript
// Add new field
<div>
  <Label htmlFor="custom_field">Custom Field</Label>
  <Input
    id="custom_field"
    {...register('custom_field')}
    error={errors.custom_field?.message}
  />
</div>

// Update validation schema
const newsSchema = z.object({
  // ... existing fields
  custom_field: z.string().optional(),
});
```

### 2. Change Category/Tag Loading
Replace mock data dengan actual API:
```javascript
// In NewsForm.jsx
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getByType('news');
      setCategories(response.data);
    } catch (error) {
      toast.error('Gagal memuat kategori');
    }
  };
  fetchCategories();
}, []);
```

### 3. Add Preview Modal
Implement preview functionality:
```javascript
const handlePreview = () => {
  const formData = watch(); // Get current form data
  // Open modal or new window with preview
  window.open(`/preview/news?data=${encodeURIComponent(JSON.stringify(formData))}`, '_blank');
};
```

### 4. Custom Table Columns
Edit `NewsTable.jsx`:
```javascript
// Add new column
<th>Custom Column</th>

// In tbody map
<td>{news.custom_field}</td>
```

---

## 🔍 Troubleshooting

### Form Validation Errors
Check browser console untuk Zod validation errors. Pastikan semua required fields terisi.

### Image Upload Fails
1. Check CDN URL di `.env.local`
2. Check file size (max 5MB)
3. Check file type (jpg, jpeg, png, gif, webp)

### Slug Already Exists
Backend akan return error jika slug sudah digunakan. Tambahkan error handling:
```javascript
catch (error) {
  if (error.response?.data?.field === 'slug') {
    setError('slug', { message: 'Slug sudah digunakan' });
  }
}
```

### Category/Tag Not Loading
Pastikan API endpoint sudah implement. Sementara ini menggunakan mock data.

---

## 📈 Next Steps

1. **Integrate Real Categories & Tags API**: Replace mock data dengan actual API calls
2. **Implement Preview Modal**: Create preview modal untuk melihat draft sebelum publish
3. **Add Bulk Operations**: Multi-select untuk bulk delete/publish
4. **Add Export Feature**: Export news list ke CSV/Excel
5. **Add Media Library Integration**: Replace ImageUploader dengan media selector modal
6. **Add Version History**: Track changes dan revert functionality
7. **Add Comments Moderation**: Jika ada fitur komentar

---

## ✅ Module Status

| Feature | News | Opinion | Status |
|---------|------|---------|--------|
| List Page | ✅ | ✅ | Complete |
| Create Form | ✅ | ✅ | Complete |
| Edit Form | ✅ | ✅ | Complete |
| Delete | ✅ | ✅ | Complete |
| Publish | ✅ | ✅ | Complete |
| Archive | ✅ | ✅ | Complete |
| Featured | ✅ | ❌ | News only |
| Category | ✅ | ❌ | News only |
| Tags | ✅ | ✅ | Complete |
| Author Info | ❌ | ✅ | Opinion only |
| SEO Fields | ✅ | ✅ | Complete |
| Rich Editor | ✅ | ✅ | Complete |
| Image Upload | ✅ | ✅ | Complete |
| Validation | ✅ | ✅ | Complete |

---

**Happy Coding! 🚀**
