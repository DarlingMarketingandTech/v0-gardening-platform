'use client'

import { knowledgeSnippets } from '@/lib/knowledge/snippets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Library } from 'lucide-react'

export function KnowledgeSnippetsPanel() {
  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Library className="h-4 w-4 text-primary" />
          Symptom Check
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Short guidance with sources — calm follow-up when something looks off.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {knowledgeSnippets.map((snippet) => (
          <article
            key={snippet.id}
            className="rounded-xl border border-border/70 bg-muted/20 px-3 py-3"
          >
            <h3 className="text-sm font-semibold">{snippet.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{snippet.summary}</p>
            <p className="mt-2 text-sm leading-relaxed">{snippet.action}</p>
            <a
              href={snippet.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Source <ExternalLink className="h-3 w-3" />
            </a>
          </article>
        ))}
      </CardContent>
    </Card>
  )
}
