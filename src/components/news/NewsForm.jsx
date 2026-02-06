'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Save, 
  X, 
  Eye, 
  Calendar,
  Hash,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from '@/components/shared/RichTextEditor';
import ImageUploader from '@/components/shared/ImageUploader';
import { newsApi } from '@/lib/api/news';

// Form validation schema
const newsSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200, 'Judul maksimal 200 karakter'),
  slug: z.string().min(5, 'Slug minimal 5 karakter').max(250, 'Slug maksimal 250 karakter'),
  excerpt: z.string().max(200, 'Excerpt maksimal 200 karakter').optional(),
  category_id: z.number().min(1, 'Pilih kategori').nullable(),
  tag_ids: z.array(z.number()).optional(),
  content: z.string().min(50, 'Konten minimal 50 karakter'),
  featured_image: z.string().url('URL gambar tidak valid').optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.string().optional(),
  meta_title: z.string().max(60, 'Meta title maksimal 60 karakter').optional(),
  meta_description: z.string().max(160, 'Meta description maksimal 160 karakter').optional(),
  meta_keywords: z.string().max(255, 'Meta keywords maksimal 255 karakter').optional(),
});

export default function NewsForm({ initialData = null, mode = 'create' }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [showSeoFields, setShowSeoFields] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      category_id: null,
      tag_ids: [],
      content: '',
      featured_image: '',
      is_featured: false,
      status: 'draft',
      published_at: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Loading initialData:', initialData);

      // Format published_at for datetime-local input (YYYY-MM-DDTHH:MM)
      let formattedPublishedAt = '';
      if (initialData.published_at) {
        const date = new Date(initialData.published_at);
        formattedPublishedAt = date.toISOString().slice(0, 16);
      }

      const formData = {
        ...initialData,
        featured_image: initialData.image || initialData.featured_image || '',
        published_at: formattedPublishedAt,
      };

      console.log('Resetting form with:', formData);
      reset(formData);
    }
  }, [initialData, reset]);

  const titleValue = watch('title');
  const contentValue = watch('content');
  const excerptValue = watch('excerpt');

  // Auto-generate slug from title
  useEffect(() => {
    if (titleValue && mode === 'create') {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [titleValue, mode, setValue]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // TODO: Replace with actual API call when categories endpoint is ready
        // const response = await categoriesApi.getAll({ type: 'news' });
        // setCategories(response.data);
        
        // Mock data for now
        setCategories([
          { id: 1, name: 'Berita Umum' },
          { id: 2, name: 'Pendidikan' },
          { id: 3, name: 'Kegiatan' },
          { id: 4, name: 'Pengumuman' },
        ]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Gagal memuat kategori');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Load tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // TODO: Replace with actual API call when tags endpoint is ready
        // const response = await tagsApi.getAll({ type: 'news' });
        // setTags(response.data);
        
        // Mock data for now
        setTags([
          { id: 1, name: 'Ma\'arif NU' },
          { id: 2, name: 'Pendidikan Islam' },
          { id: 3, name: 'Pesantren' },
          { id: 4, name: 'Madrasah' },
          { id: 5, name: 'Kurikulum' },
        ]);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        toast.error('Gagal memuat tags');
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  // Initialize selected tags from form data
  useEffect(() => {
    if (initialData?.tag_ids) {
      setSelectedTags(initialData.tag_ids);
      setValue('tag_ids', initialData.tag_ids);
    }
  }, [initialData, setValue]);

  const handleTagToggle = (tagId) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    setValue('tag_ids', newSelectedTags);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Convert datetime-local format to ISO 8601 with timezone
      // Map featured_image to image for backend
      const formattedData = {
        ...data,
        image: data.featured_image,
        published_at: data.published_at
          ? new Date(data.published_at).toISOString()
          : null,
      };

      // Remove featured_image as backend uses 'image'
      delete formattedData.featured_image;

      if (mode === 'create') {
        await newsApi.create(formattedData);
        toast.success('Berita berhasil dibuat');
      } else {
        await newsApi.update(initialData.id, formattedData);
        toast.success('Berita berhasil diperbarui');
      }

      router.push('/news');
      router.refresh();
    } catch (error) {
      console.error('Failed to save news:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan berita');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/news');
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    toast.info('Fitur preview akan segera tersedia');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            disabled={isSubmitting}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" required>
                  Judul Berita
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Masukkan judul berita..."
                  error={errors.title?.message}
                  className="text-lg font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="slug">
                  Slug (URL)
                </Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="judul-berita-otomatis"
                  error={errors.slug?.message}
                  disabled={mode === 'edit'}
                />
                {mode === 'edit' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Slug tidak dapat diubah setelah berita dibuat
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">
                  Ringkasan ({excerptValue?.length || 0}/200)
                </Label>
                <textarea
                  id="excerpt"
                  {...register('excerpt')}
                  rows={3}
                  placeholder="Tulis ringkasan singkat berita..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-600 mt-1">{errors.excerpt.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Content Editor */}
          <Card className="p-6">
            <div>
              <Label htmlFor="content" required>
                <FileText className="w-4 h-4 inline mr-2" />
                Konten Berita
              </Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Tulis konten berita di sini..."
                  />
                )}
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-2">{errors.content.message}</p>
              )}
            </div>
          </Card>

          {/* Featured Image */}
          <Card className="p-6">
            <div>
              <Label>
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Gambar Unggulan
              </Label>
              <Controller
                name="featured_image"
                control={control}
                render={({ field }) => {
                  console.log('Featured image field value:', field.value);
                  return (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      maxSize={1}
                    />
                  );
                }}
              />
              {errors.featured_image && (
                <p className="text-sm text-red-600 mt-2">{errors.featured_image.message}</p>
              )}
            </div>
          </Card>

          {/* SEO Fields */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  <Globe className="w-4 h-4 inline mr-2" />
                  SEO Meta Tags
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSeoFields(!showSeoFields)}
                >
                  {showSeoFields ? 'Sembunyikan' : 'Tampilkan'}
                </Button>
              </div>

              {showSeoFields && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="meta_title">
                      Meta Title (0-60 karakter)
                    </Label>
                    <Input
                      id="meta_title"
                      {...register('meta_title')}
                      placeholder="Judul untuk mesin pencari..."
                      error={errors.meta_title?.message}
                    />
                  </div>

                  <div>
                    <Label htmlFor="meta_description">
                      Meta Description (0-160 karakter)
                    </Label>
                    <textarea
                      id="meta_description"
                      {...register('meta_description')}
                      rows={2}
                      placeholder="Deskripsi untuk mesin pencari..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                    {errors.meta_description && (
                      <p className="text-sm text-red-600 mt-1">{errors.meta_description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="meta_keywords">
                      Meta Keywords (pisahkan dengan koma)
                    </Label>
                    <Input
                      id="meta_keywords"
                      {...register('meta_keywords')}
                      placeholder="keyword1, keyword2, keyword3"
                      error={errors.meta_keywords?.message}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4">Pengaturan Publish</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status" required>
                  Status
                </Label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="published_at">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Publish
                </Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  {...register('published_at')}
                  error={errors.published_at?.message}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan untuk publish segera
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="is_featured"
                  type="checkbox"
                  {...register('is_featured')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <Label htmlFor="is_featured" className="flex items-center cursor-pointer">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                  Tandai sebagai Unggulan
                </Label>
              </div>
            </div>
          </Card>

          {/* Category */}
          <Card className="p-6">
            <div>
              <Label htmlFor="category_id" required>
                Kategori
              </Label>
              {loadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <select
                    id="category_id"
                    {...register('category_id', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-sm text-red-600 mt-1">{errors.category_id.message}</p>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <div>
              <Label>
                <Hash className="w-4 h-4 inline mr-2" />
                Tags
              </Label>
              {loadingTags ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Klik untuk memilih/menghapus tag
              </p>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
