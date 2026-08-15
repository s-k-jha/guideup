import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  getAdminArticleById, createArticle, updateArticle, publishArticle,
  getCategories, createCategory,
} from '../../api/articles'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Textarea from '../../components/ui/Textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'

const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', coverImageUrl: '', content: '', categoryId: '',
  tags: '', authorName: 'GuideUp Team', authorTitle: '', status: 'draft',
  seoTitle: '', seoDescription: '', canonicalUrl: '',
}

export default function AdminBlogEditor() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { toast } = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (isNew) return
    getAdminArticleById(id).then((article) => {
      setForm({
        title: article.title || '', slug: article.slug || '', excerpt: article.excerpt || '',
        coverImageUrl: article.coverImageUrl || '', content: article.content || '',
        categoryId: article.categoryId?._id || article.categoryId || '',
        tags: (article.tags || []).join(', '), authorName: article.authorName || 'GuideUp Team',
        authorTitle: article.authorTitle || '', status: article.status || 'draft',
        seoTitle: article.seoTitle || '', seoDescription: article.seoDescription || '',
        canonicalUrl: article.canonicalUrl || '',
      })
    }).catch(() => toast({ title: 'Could not load article', variant: 'destructive' })).finally(() => setLoading(false))
  }, [id, isNew])

  const handleQuickCategory = async () => {
    const name = window.prompt('New category name')
    if (!name?.trim()) return
    try {
      const category = await createCategory({ name: name.trim() })
      setCategories((prev) => [...prev, category])
      setForm((f) => ({ ...f, categoryId: category._id }))
    } catch {
      toast({ title: 'Could not create category', variant: 'destructive' })
    }
  }

  const buildPayload = () => ({
    ...form,
    categoryId: form.categoryId || undefined,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
  })

  const handleSave = async (publishNow = false) => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: 'Title and content are required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload()
      let saved
      if (isNew) {
        saved = await createArticle(payload)
      } else {
        saved = await updateArticle(id, payload)
      }
      if (publishNow && saved.status !== 'published') {
        await publishArticle(saved._id)
      }
      toast({ title: 'Article saved', variant: 'success' })
      navigate('/admin/blog')
    } catch {
      toast({ title: 'Could not save article', variant: 'destructive' })
    }
    setSaving(false)
  }

  return (
    <>
      <Seo title={isNew ? 'New Article' : 'Edit Article'} path="/admin/blog" noindex />
      <AdminLayout
        title={isNew ? 'New Article' : 'Edit Article'}
        actions={
          <button onClick={() => navigate('/admin/blog')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        }
      >
        {loading ? (
          <Skeleton className="h-96 rounded-xl" />
        ) : (
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 max-w-5xl">
            <div className="space-y-5">
              <Card className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label required>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="How to prepare for campus placements" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug <span className="text-muted-foreground font-normal">(auto-generated if left blank)</span></Label>
                  <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="how-to-prepare-for-campus-placements" />
                </div>
                <div className="space-y-1.5">
                  <Label>Excerpt</Label>
                  <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="One or two sentences shown in article previews" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cover Image URL</Label>
                  <Input value={form.coverImageUrl} onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label required>Content</Label>
                  <Textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Write in HTML or plain paragraphs — rendered as-is on the article page."
                    className="min-h-[360px] font-mono text-xs leading-relaxed"
                  />
                </div>
              </Card>

              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">SEO</h3>
                <div className="space-y-1.5">
                  <Label>SEO Title <span className="text-muted-foreground font-normal">(max 70 chars)</span></Label>
                  <Input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} maxLength={70} />
                </div>
                <div className="space-y-1.5">
                  <Label>SEO Description <span className="text-muted-foreground font-normal">(max 160 chars)</span></Label>
                  <Textarea value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} maxLength={160} />
                </div>
                <div className="space-y-1.5">
                  <Label>Canonical URL</Label>
                  <Input value={form.canonicalUrl} onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))} placeholder="https://guideup.in/blog/..." />
                </div>
              </Card>
            </div>

            <div className="space-y-5">
              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Publishing</h3>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button onClick={() => handleSave(true)} loading={saving}>Publish</Button>
                  <Button variant="outline" onClick={() => handleSave(false)} loading={saving}>Save Draft</Button>
                </div>
              </Card>

              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Organize</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Category</Label>
                    <button type="button" onClick={handleQuickCategory} className="text-xs font-medium text-primary-600 hover:underline">
                      + New
                    </button>
                  </div>
                  <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Uncategorized" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tags (comma separated)</Label>
                  <Input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="placements, dsa" />
                </div>
              </Card>

              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Author</h3>
                <div className="space-y-1.5">
                  <Label>Author Name</Label>
                  <Input value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Author Title</Label>
                  <Input value={form.authorTitle} onChange={(e) => setForm((f) => ({ ...f, authorTitle: e.target.value }))} placeholder="Founder, GuideUp" />
                </div>
              </Card>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
