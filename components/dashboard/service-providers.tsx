'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MapPin, 
  Search, 
  Star, 
  Phone, 
  Clock, 
  ExternalLink,
  Flower2,
  Scissors,
  TreePine,
  Shovel,
  Store
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceProvider {
  id: string
  name: string
  category: 'nursery' | 'landscaper' | 'garden_center' | 'arborist' | 'lawn_care'
  rating: number
  reviewCount: number
  phone: string
  address: string
  distance: string
  isOpen: boolean
  closingTime?: string
  priceLevel: number
  image?: string
  specialties: string[]
}

// Mock data styled like Yelp results
const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Green Valley Nursery',
    category: 'nursery',
    rating: 4.8,
    reviewCount: 342,
    phone: '(555) 123-4567',
    address: '1234 Garden Way',
    distance: '0.8 mi',
    isOpen: true,
    closingTime: '6:00 PM',
    priceLevel: 2,
    specialties: ['Native Plants', 'Organic', 'Expert Advice']
  },
  {
    id: '2',
    name: 'Evergreen Landscapes',
    category: 'landscaper',
    rating: 4.9,
    reviewCount: 189,
    phone: '(555) 234-5678',
    address: '567 Oak Street',
    distance: '1.2 mi',
    isOpen: true,
    closingTime: '5:00 PM',
    priceLevel: 3,
    specialties: ['Design', 'Installation', 'Maintenance']
  },
  {
    id: '3',
    name: 'The Garden Center',
    category: 'garden_center',
    rating: 4.5,
    reviewCount: 567,
    phone: '(555) 345-6789',
    address: '890 Bloom Boulevard',
    distance: '2.1 mi',
    isOpen: false,
    priceLevel: 1,
    specialties: ['Tools', 'Seeds', 'Pottery']
  },
  {
    id: '4',
    name: 'TreeCare Experts',
    category: 'arborist',
    rating: 4.7,
    reviewCount: 98,
    phone: '(555) 456-7890',
    address: '123 Maple Lane',
    distance: '3.5 mi',
    isOpen: true,
    closingTime: '4:00 PM',
    priceLevel: 3,
    specialties: ['Tree Trimming', 'Removal', 'Health Assessment']
  },
  {
    id: '5',
    name: 'Perfect Lawn Care',
    category: 'lawn_care',
    rating: 4.3,
    reviewCount: 234,
    phone: '(555) 567-8901',
    address: '456 Grass Street',
    distance: '1.8 mi',
    isOpen: true,
    closingTime: '7:00 PM',
    priceLevel: 2,
    specialties: ['Mowing', 'Fertilization', 'Aeration']
  }
]

const categoryConfig = {
  nursery: { icon: Flower2, label: 'Nursery', color: 'text-pink-500' },
  landscaper: { icon: TreePine, label: 'Landscaper', color: 'text-emerald-600' },
  garden_center: { icon: Store, label: 'Garden Center', color: 'text-amber-600' },
  arborist: { icon: TreePine, label: 'Arborist', color: 'text-green-700' },
  lawn_care: { icon: Scissors, label: 'Lawn Care', color: 'text-lime-600' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating 
              ? "fill-amber-400 text-amber-400" 
              : star - 0.5 <= rating 
                ? "fill-amber-400/50 text-amber-400" 
                : "text-gray-300"
          )}
        />
      ))}
    </div>
  )
}

function PriceLevel({ level }: { level: number }) {
  return (
    <span className="text-sm text-muted-foreground">
      {'$'.repeat(level)}
      <span className="text-muted-foreground/30">{'$'.repeat(4 - level)}</span>
    </span>
  )
}

export function ServiceProviders() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = !selectedCategory || provider.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Local Garden Pros
        </CardTitle>
        <div className="space-y-3 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nurseries, landscapers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                >
                  <Icon className={cn("h-4 w-4 mr-1", selectedCategory !== key && config.color)} />
                  {config.label}
                </Button>
              )
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No providers found</p>
              <p className="text-sm text-muted-foreground/80">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => {
                const config = categoryConfig[provider.category]
                const Icon = config.icon
                
                return (
                  <div
                    key={provider.id}
                    className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-accent/30 transition-colors"
                  >
                    {/* Image placeholder */}
                    <div className="hidden sm:flex h-24 w-24 rounded-lg bg-gradient-to-br from-emerald-100 to-amber-50 dark:from-emerald-900/30 dark:to-amber-900/30 items-center justify-center flex-shrink-0">
                      <Icon className={cn("h-10 w-10", config.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold truncate">{provider.name}</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <StarRating rating={provider.rating} />
                            <span className="text-muted-foreground">
                              {provider.rating} ({provider.reviewCount})
                            </span>
                          </div>
                        </div>
                        {provider.isOpen ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex-shrink-0">
                            <Clock className="h-3 w-3 mr-1" />
                            Open until {provider.closingTime}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex-shrink-0">
                            Closed
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Icon className={cn("h-3 w-3 mr-1", config.color)} />
                          {config.label}
                        </Badge>
                        <PriceLevel level={provider.priceLevel} />
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {provider.distance}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {provider.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <a 
                          href={`tel:${provider.phone}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Phone className="h-4 w-4" />
                          {provider.phone}
                        </a>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {provider.address}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Connect your Yelp API key to see real local providers
          </p>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            View on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
