'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Globe, Palette, ChevronRight } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  const settingsCategories = [
    {
      title: 'General Settings',
      description: 'Pengaturan umum website seperti nama, logo, dan kontak',
      icon: Settings,
      path: '/settings/general',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'SEO Settings',
      description: 'Konfigurasi SEO, meta tags, dan analytics',
      icon: Globe,
      path: '/settings/seo',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Kelola pengaturan website dan aplikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Card key={category.path} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className={`${category.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => router.push(category.path)}
              >
                Buka Pengaturan
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
