'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, History, Briefcase, ChevronRight } from 'lucide-react'

export default function PagesPage() {
  const router = useRouter()

  const staticPages = [
    {
      title: 'Visi & Misi',
      description: 'Kelola konten halaman visi dan misi organisasi',
      icon: Target,
      path: '/pages/visi-misi',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Sejarah',
      description: 'Kelola konten halaman sejarah organisasi',
      icon: History,
      path: '/pages/sejarah',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Program Strategis',
      description: 'Kelola konten halaman program strategis',
      icon: Briefcase,
      path: '/pages/program-strategis',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Pages Management</h1>
        <p className="text-neutral-500 mt-1">Kelola halaman statis website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticPages.map((page) => (
          <Card key={page.path} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className={`${page.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <page.icon className={`h-6 w-6 ${page.color}`} />
              </div>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => router.push(page.path)}
              >
                Edit Halaman
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
