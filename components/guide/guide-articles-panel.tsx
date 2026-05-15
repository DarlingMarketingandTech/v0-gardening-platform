'use client'

import { guideArticles, type GuideArticleId } from '@/lib/guide-content/articles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export function GuideArticlesPanel() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground px-0.5">
        Short reads for when you want the why — not a lecture.
      </p>
      {guideArticles.map((article) => (
        <ArticleCard key={article.id} articleId={article.id} />
      ))}
    </div>
  )
}

function ArticleCard({ articleId }: { articleId: GuideArticleId }) {
  const article = guideArticles.find((a) => a.id === articleId)!
  return (
    <details className="rounded-xl border bg-background">
      <summary className="cursor-pointer px-4 py-3 font-semibold flex items-center gap-2 list-none [&::-webkit-details-marker]:hidden">
        <BookOpen className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm">{article.title}</span>
      </summary>
      <Card className="border-0 shadow-none rounded-none rounded-b-xl">
        <CardHeader className="pt-0 pb-2 px-4">
          <CardTitle className="text-sm font-normal text-muted-foreground">{article.summary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 pt-0">
          {article.sections.map((section) => (
            <div key={section.heading}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.heading}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </details>
  )
}
