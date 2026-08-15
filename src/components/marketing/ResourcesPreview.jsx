import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { getArticles } from '../../api/articles'
import { Section, Container, SectionHeading } from '../layout/PageContainer'
import { Card } from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function ResourcesPreview() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArticles({ limit: 3 })
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && articles.length === 0) return null

  return (
    <Section className="bg-secondary/30">
      <Container>
        <SectionHeading
          eyebrow="Resources"
          title="Guides on placements, DSA, and interviews"
          description="Straightforward guidance written for Indian college students."
        />

        <div className="grid md:grid-cols-3 gap-6">
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

        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/blog">
              Browse all resources
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
