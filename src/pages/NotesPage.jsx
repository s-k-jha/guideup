import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Clock } from 'lucide-react'
import { getMyNotes } from '../api/notes'
import { useAuth } from '../context/AuthContext'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/States'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/'); return }
    getMyNotes().then(setNotes).catch(() => setNotes([])).finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  return (
    <>
      <Seo title="Notes" path="/notes" noindex />
      <Section className="pt-10 sm:pt-14">
        <Container className="max-w-3xl">
          <SectionHeading
            align="left"
            title="Notes"
            description="Cheat sheets, guides, and resources shared by the GuideUp team."
            className="mb-8"
          />

          {(loading || authLoading) && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          )}

          {!loading && !authLoading && notes.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No notes yet"
              description="Check back soon — we're adding placement prep resources here."
            />
          )}

          {!loading && notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((n) => (
                <Card key={n._id} className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground text-sm truncate">{n.title}</div>
                    {n.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1.5">
                      <span className="uppercase font-medium">{n.fileType}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <a href={n.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-3.5 h-3.5" /> Get
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
