'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'

export function PlantsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      const queryString = createQueryString({ [key]: value })
      router.push(`/plants${queryString ? `?${queryString}` : ''}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const queryString = createQueryString({ search })
      router.push(`/plants${queryString ? `?${queryString}` : ''}`)
    })
  }

  const clearFilters = () => {
    setSearch('')
    startTransition(() => {
      router.push('/plants')
    })
  }

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={searchParams.get('category') || 'all'}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="vegetable">Vegetable</SelectItem>
            <SelectItem value="fruit">Fruit</SelectItem>
            <SelectItem value="herb">Herb</SelectItem>
            <SelectItem value="flower">Flower</SelectItem>
            <SelectItem value="shrub">Shrub</SelectItem>
            <SelectItem value="tree">Tree</SelectItem>
            <SelectItem value="succulent">Succulent</SelectItem>
            <SelectItem value="indoor">Indoor</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('difficulty') || 'all'}
          onValueChange={(value) => handleFilterChange('difficulty', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('sunlight') || 'all'}
          onValueChange={(value) => handleFilterChange('sunlight', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sunlight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sunlight</SelectItem>
            <SelectItem value="full_sun">Full Sun</SelectItem>
            <SelectItem value="partial_sun">Partial Sun</SelectItem>
            <SelectItem value="shade">Shade</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('water') || 'all'}
          onValueChange={(value) => handleFilterChange('water', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Water" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Water Needs</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
