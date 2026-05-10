'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Bug, AlertTriangle, ExternalLink, Leaf, X } from 'lucide-react'

interface SearchResult {
  title: string
  snippet: string
  url: string
  icon?: string
}

// Common garden pests/problems for quick access
const commonProblems = [
  { name: 'Aphids', icon: Bug },
  { name: 'Tomato Blight', icon: AlertTriangle },
  { name: 'Powdery Mildew', icon: Leaf },
  { name: 'Slugs', icon: Bug },
  { name: 'Spider Mites', icon: Bug },
  { name: 'Yellow Leaves', icon: AlertTriangle },
]

export function PestLookup() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchPest = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setHasSearched(true)
    
    try {
      // Use DuckDuckGo Instant Answer API
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery + ' garden pest control')}&format=json&no_html=1&skip_disambig=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        const searchResults: SearchResult[] = []
        
        // Abstract (main answer)
        if (data.Abstract) {
          searchResults.push({
            title: data.Heading || searchQuery,
            snippet: data.Abstract,
            url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`,
          })
        }
        
        // Related topics
        if (data.RelatedTopics) {
          data.RelatedTopics.slice(0, 4).forEach((topic: { Text?: string; FirstURL?: string; Name?: string; Topics?: Array<{ Text?: string; FirstURL?: string }> }) => {
            if (topic.Text && topic.FirstURL) {
              searchResults.push({
                title: topic.Text.split(' - ')[0] || 'Related',
                snippet: topic.Text,
                url: topic.FirstURL,
              })
            } else if (topic.Topics) {
              // Nested topics
              topic.Topics.slice(0, 2).forEach((subtopic) => {
                if (subtopic.Text && subtopic.FirstURL) {
                  searchResults.push({
                    title: subtopic.Text.split(' - ')[0] || 'Related',
                    snippet: subtopic.Text,
                    url: subtopic.FirstURL,
                  })
                }
              })
            }
          })
        }
        
        // If no results, try Wikipedia fallback
        if (searchResults.length === 0) {
          const wikiResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`
          )
          if (wikiResponse.ok) {
            const wikiData = await wikiResponse.json()
            if (wikiData.extract) {
              searchResults.push({
                title: wikiData.title,
                snippet: wikiData.extract,
                url: wikiData.content_urls?.desktop?.page || '#',
              })
            }
          }
        }
        
        // Add helpful gardening resources
        searchResults.push({
          title: 'Search for more solutions',
          snippet: `Find detailed guides and organic solutions for "${searchQuery}" on gardening websites.`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery + ' organic garden treatment')}`,
        })
        
        setResults(searchResults)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([{
        title: 'Search Online',
        snippet: `We couldn't fetch results directly. Click to search for "${searchQuery}" solutions.`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery + ' garden pest control organic')}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSearch = (problem: string) => {
    setQuery(problem)
    searchPest(problem)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  return (
    <Card className="border-orange-200/50 dark:border-orange-800/30 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Bug className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <h3 className="font-semibold text-foreground">Troubleshoot a Problem</h3>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pests, diseases, or problems..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPest(query)}
              className="pl-10 pr-10 bg-background"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={() => searchPest(query)} disabled={!query.trim() || loading}>
            Search
          </Button>
        </div>
        
        {/* Quick Search Tags */}
        {!hasSearched && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Common problems:</p>
            <div className="flex flex-wrap gap-2">
              {commonProblems.map((problem) => (
                <Badge
                  key={problem.name}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors flex items-center gap-1"
                  onClick={() => handleQuickSearch(problem.name)}
                >
                  <problem.icon className="h-3 w-3" />
                  {problem.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Results */}
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        
        {!loading && hasSearched && results.length > 0 && (
          <ScrollArea className="h-[250px]">
            <div className="space-y-3">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-background border hover:border-primary/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-primary group-hover:underline line-clamp-1">
                      {result.title}
                    </h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                    {result.snippet}
                  </p>
                </a>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Bug className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found for &quot;{query}&quot;</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
