'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const departmentSchema = z.object({
  name: z.string().min(1, 'Nama departemen harus diisi'),
  description: z.string().optional(),
  order_number: z.number().int().min(0),
  is_active: z.boolean(),
})

export function DepartmentForm({ department, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: department
      ? {
          name: department.name || '',
          description: department.description || '',
          order_number: department.order_number ?? 0,
          is_active: department.is_active ?? true,
        }
      : {
          name: '',
          description: '',
          order_number: 0,
          is_active: true,
        },
  })

  const isActive = watch('is_active')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Departemen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Departemen *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g. Bidang Pendidikan Dasar"
              className="mt-2"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Deskripsi singkat departemen"
              className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <Label htmlFor="order_number">Urutan</Label>
            <Input
              id="order_number"
              type="number"
              {...register('order_number', { valueAsNumber: true })}
              min={0}
              className="mt-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setValue('is_active', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active">Status aktif</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : department ? 'Update' : 'Tambah Departemen'}
        </Button>
      </div>
    </form>
  )
}
