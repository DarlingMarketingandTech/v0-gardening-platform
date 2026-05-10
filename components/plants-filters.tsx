'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface PlantsFiltersProps {
  onFilterChange?: (filters: {
    category?: string
    difficulty?: string
    sunlight?: string
    water?: string
    search?: string
  }) => void
}

export function PlantsFilters({ onFilterChange }: PlantsFiltersProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [sunlight, setSunlight] = useState('all')
  const [water, setWater] = useState('all')

  const applyFilters = () => {
    onFilterChange?.({
      category: category !== 'all' ? category : undefined,
      difficulty: difficulty !== 'all' ? difficulty : undefined,
      sunlight: sunlight !== 'all' ? sunlight : undefined,
      water: water !== 'all' ? water : undefined,
      search: search || undefined,
    })
  }

  const handleFilterChange = (type: string, value: string) => {
    const newFilters: any = {
      category,
      difficulty,
      sunlight,
      water,
      search,
    }
    newFilters[type] = value !== 'all' ? value : 'all'
    
    if (type === 'category') setCategory(value)
    if (type === 'difficulty') setDifficulty(value)
    if (type === 'sunlight') setSunlight(value)
    if (type === 'water') setWater(value)

    // Apply filters immediately for selects, after typing for search
    if (type !== 'search') {
      onFilterChange?.({
        category: newFilters.category !== 'all' ? newFilters.category : undefined,
        difficulty: newFilters.difficulty !== 'all' ? newFilters.difficulty : undefined,
        sunlight: newFilters.sunlight !== 'all' ? newFilters.sunlight : undefined,
        water: newFilters.water !== 'all' ? newFilters.water : undefined,
        search: newFilters.search || undefined,
      })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange?.({
      category: category !== 'all' ? category : undefined,
      difficulty: difficulty !== 'all' ? difficulty : undefined,
      sunlight: sunlight !== 'all' ? sunlight : undefined,
      water: water !== 'all' ? water : undefined,
      search: value || undefined,
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setDifficulty('all')
    setSunlight('all')
    setWater('all')
    onFilterChange?.({})
  }

  const hasFilters = search || category !== 'all' || difficulty !== 'all' || sunlight !== 'all' || water !== 'all'

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={category}
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
          value={difficulty}
          onValueChange={(value) => handleFilterChange('difficulty', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sunlight}
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
          value={water}
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
