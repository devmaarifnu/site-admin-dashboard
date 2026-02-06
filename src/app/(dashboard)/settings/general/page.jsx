'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { settingsApi } from '@/lib/api/modules'
import { toast } from 'sonner'
import Image from 'next/image'

const settingsSchema = z.object({
  site_name: z.string().min(3, 'Nama situs minimal 3 karakter'),
  tagline: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  facebook_url: z.string().optional(),
  twitter_url: z.string().optional(),
  instagram_url: z.string().optional(),
  youtube_url: z.string().optional(),
  linkedin_url: z.string().optional(),
})

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [logoUrl, setLogoUrl] = useState('')
  const [logoDarkUrl, setLogoDarkUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsApi.getGeneral()
      const data = response.data || response
      reset(data)
      setLogoUrl(data.logo_url || '')
      setLogoDarkUrl(data.logo_dark_url || '')
      setFaviconUrl(data.favicon_url || '')
    } catch (error) {
      toast.error('Gagal memuat pengaturan')
    } finally {
      setFetching(false)
    }
  }

  const handleImageUpload = async (file, type) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tag', 'logo')
    formData.append('is_public', 'true')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/cdn/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      const uploadedUrl = data.data?.url || data.url

      if (type === 'logo') setLogoUrl(uploadedUrl)
      else if (type === 'logo_dark') setLogoDarkUrl(uploadedUrl)
      else if (type === 'favicon') setFaviconUrl(uploadedUrl)

      toast.success('Logo berhasil diupload')
    } catch (error) {
      toast.error('Gagal mengupload logo')
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await settingsApi.updateGeneral({
        ...data,
        logo_url: logoUrl,
        logo_dark_url: logoDarkUrl,
        favicon_url: faviconUrl,
      })
      toast.success('Pengaturan berhasil disimpan')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-neutral-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">General Settings</h1>
        <p className="text-neutral-500 mt-1">Pengaturan umum website</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name *</Label>
              <Input
                id="site_name"
                {...register('site_name')}
                placeholder="LP Ma'arif NU"
                className="mt-2"
              />
              {errors.site_name && (
                <p className="text-sm text-red-600 mt-1">{errors.site_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                {...register('tagline')}
                placeholder="Lembaga Pendidikan Ma'arif NU"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Deskripsi website"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo & Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Logo (Light Mode)</Label>
              <div className="mt-2">
                {logoUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border rounded-lg p-2">
                      <Image src={logoUrl} alt="Logo" fill className="object-contain" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => handleImageUpload(e.target.files[0], 'logo')
                        input.click()
                      }}
                    >
                      Ganti Logo
                    </Button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'logo')}
                    className="block"
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Logo (Dark Mode)</Label>
              <div className="mt-2">
                {logoDarkUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border rounded-lg p-2 bg-neutral-900">
                      <Image src={logoDarkUrl} alt="Logo Dark" fill className="object-contain" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => handleImageUpload(e.target.files[0], 'logo_dark')
                        input.click()
                      }}
                    >
                      Ganti Logo
                    </Button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'logo_dark')}
                    className="block"
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Favicon</Label>
              <div className="mt-2">
                {faviconUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 border rounded-lg">
                      <Image src={faviconUrl} alt="Favicon" fill className="object-contain" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => handleImageUpload(e.target.files[0], 'favicon')
                        input.click()
                      }}
                    >
                      Ganti Favicon
                    </Button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'favicon')}
                    className="block"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="info@lpmaarifnu.or.id"
                className="mt-2"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+62 21 1234567"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...register('whatsapp')}
                placeholder="+62 812 3456 7890"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <textarea
                id="address"
                {...register('address')}
                placeholder="Alamat lengkap"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input
                id="facebook_url"
                {...register('facebook_url')}
                placeholder="https://facebook.com/lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter/X URL</Label>
              <Input
                id="twitter_url"
                {...register('twitter_url')}
                placeholder="https://twitter.com/lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                {...register('instagram_url')}
                placeholder="https://instagram.com/lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input
                id="youtube_url"
                {...register('youtube_url')}
                placeholder="https://youtube.com/@lpmaarifnu"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/company/lpmaarifnu"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
