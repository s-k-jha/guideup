import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import { getArticles, getCategories } from '../api/articles'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/States'

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const page = Number(searchParams.get('page') || 1)

  const [articles, setArticles] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    getArticles({ category: category || undefined, search: search || undefined, page, limit: 9 })
      .then((data) => {
        setArticles(data.articles || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [category, page, search])

  const setCategory = (slug) => setSearchParams(slug ? { category: slug } : {})
  const goToPage = (p) => setSearchParams({ ...(category ? { category } : {}), page: String(p) })

  return (
    <>
      <Seo
        title="Resources for Indian College Students"
        description="Guides on placements, DSA, interview preparation, and career decisions for Indian college students — written by GuideUp."
        path="/blog"
      />
      <Section className="pt-10 sm:pt-14">
        <Container>
          <SectionHeading align="left" eyebrow="Resources" title="Guides for placements, DSA & interviews" className="mb-8" />

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Input
              icon={Search}
              placeholder="Search articles…"
              defaultValue={search}
              onKeyDown={(e) => e.key === 'Enter' && setSearch(e.currentTarget.value)}
              onBlur={(e) => setSearch(e.currentTarget.value)}
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${!category ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-border text-muted-foreground hover:bg-secondary'}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === c.slug ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && articles.length === 0 && (
            <EmptyState title="No articles found" description="Try a different search term or category." />
          )}

          {!loading && articles.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <Link key={a.slug} to={`/blog/${a.slug}`}>
                    <Card hover className="overflow-hidden h-full flex flex-col">
                      {a.coverImageUrl && (
                        <div className="aspect-[16/9] bg-secondary overflow-hidden">
                          <img src={a.coverImageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        {a.categoryId?.name && <Badge className="mb-3 w-fit">{a.categoryId.name}</Badge>}
                        <h3 className="font-semibold text-foreground leading-snug mb-2">{a.title}</h3>
                        {a.excerpt && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{a.excerpt}</p>}
                        <span className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" /> {a.readingTimeMinutes || 3} min read
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
