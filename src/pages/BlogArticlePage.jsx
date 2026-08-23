import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Clock, Calendar, ArrowRight } from 'lucide-react'
import { getArticleBySlug } from '../api/articles'
import Seo, { absoluteUrl } from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'
import Badge from '../components/ui/Badge'
import { Avatar, AvatarFallback } from '../components/ui/Avatar'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Separator from '../components/ui/Separator'
import { LoadingState, ErrorState } from '../components/ui/States'

export default function BlogArticlePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getArticleBySlug(slug)
      .then(setData)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <Container className="py-20">
        <LoadingState label="Loading article…" />
      </Container>
    )
  }

  if (notFound || !data?.article) {
    return (
      <Container className="py-20">
        <ErrorState title="Article not found" description="This article may have been unpublished or the link is incorrect." onRetry={() => navigate('/blog')} />
      </Container>
    )
  }

  const { article, relatedArticles = [] } = data
  const url = `/blog/${article.slug}`
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.seoDescription || article.excerpt,
      image: article.coverImageUrl || undefined,
      author: { '@type': 'Person', name: article.authorName },
      datePublished: article.publishedAt || undefined,
      dateModified: article.updatedAt || article.publishedAt || undefined,
      mainEntityOfPage: absoluteUrl(url),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Resources', item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 2, name: article.title, item: absoluteUrl(url) },
      ],
    },
  ]

  return (
    <>
      <Seo
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        path={article.canonicalUrl || url}
        image={article.coverImageUrl}
        type="article"
        jsonLd={jsonLd}
      />

      <Section className="pt-8 sm:pt-12 pb-0">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Resources', href: '/blog' }, { label: article.title }]} className="mb-6" />

          {article.categoryId?.name && <Badge className="mb-4">{article.categoryId.name}</Badge>}
          <h1 className="text-h1 font-display text-foreground text-balance mb-4">{article.title}</h1>
          {article.excerpt && <p className="text-body-lg text-muted-foreground mb-6 text-balance">{article.excerpt}</p>}

          <div className="flex items-center gap-3 pb-6 mb-8 border-b border-border">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{article.authorName?.[0] || 'G'}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-foreground">{article.authorName}</div>
              <div className="text-muted-foreground flex items-center gap-3 text-xs mt-0.5">
                {publishedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {publishedDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readingTimeMinutes || 3} min read
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {article.coverImageUrl && (
        <Container className="max-w-4xl mb-10">
          <img src={article.coverImageUrl} alt={article.title} className="w-full rounded-2xl border border-border" />
        </Container>
      )}

      <Section className="pt-0">
        <Container className="max-w-3xl">
          {/* Content is authored exclusively by authenticated admins via the CMS — not user-generated. */}
          <div
            className="prose-content text-foreground/90 leading-relaxed [&_h2]:text-h3 [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_a]:text-primary-600 [&_a]:underline [&_img]:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border">
              {article.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>
          )}

          <Card className="mt-10 p-6 flex flex-col sm:flex-row items-center gap-4 bg-primary-50 border-primary-100">
            <p className="text-sm text-primary-900 flex-1 text-center sm:text-left">
              Ready to put this into practice? Book a mock interview with your personalized mentor.
            </p>
            <Button asChild>
              <Link to="/sessions">Book a Mock Interview <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </Card>

          {relatedArticles.length > 0 && (
            <div className="mt-14">
              <Separator className="mb-8" />
              <h2 className="text-h3 text-foreground mb-5">Related articles</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {relatedArticles.map((a) => (
                  <Link key={a.slug} to={`/blog/${a.slug}`} className="group">
                    <Card hover className="overflow-hidden h-full">
                      {a.coverImageUrl && (
                        <div className="aspect-[16/9] bg-secondary overflow-hidden">
                          <img src={a.coverImageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-sm text-foreground leading-snug group-hover:text-primary-600 transition-colors">{a.title}</h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
