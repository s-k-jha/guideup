import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { getAdminArticles, deleteArticle, publishArticle, unpublishArticle } from '../../api/articles'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '../../components/ui/AlertDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const STATUS_VARIANT = { published: 'success', draft: 'secondary', scheduled: 'warning' }

export default function AdminBlog() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => {
    setLoading(true)
    getAdminArticles().then(setArticles).catch(() => setArticles([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (article) => {
    try {
      if (article.status === 'published') {
        await unpublishArticle(article._id)
        toast({ title: 'Unpublished', variant: 'success' })
      } else {
        await publishArticle(article._id)
        toast({ title: 'Published', variant: 'success' })
      }
      load()
    } catch {
      toast({ title: 'Could not update status', variant: 'destructive' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteArticle(deleteTarget._id)
      toast({ title: 'Article deleted', variant: 'success' })
      load()
    } catch {
      toast({ title: 'Could not delete article', variant: 'destructive' })
    }
    setDeleteTarget(null)
  }

  return (
    <>
      <Seo title="Manage Blog" path="/admin/blog" noindex />
      <AdminLayout
        title="Blog"
        actions={<Button size="sm" onClick={() => navigate('/admin/blog/new')}><Plus className="w-4 h-4" /> New Article</Button>}
      >
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <EmptyState
            title="No articles yet"
            description="Publish your first guide to start building organic traffic."
            action={<Button onClick={() => navigate('/admin/blog/new')}>Write an Article</Button>}
          />
        )}

        {!loading && articles.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>
                    <Link to={`/admin/blog/${a._id}`} className="font-medium text-foreground text-sm hover:text-primary-600">
                      {a.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.categoryId?.name || '—'}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(a.updatedAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleStatus(a)} aria-label="Toggle publish">
                        {a.status === 'published' ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-success" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog/${a._id}`)} aria-label="Edit">
                        <Pencil className="w-4 h-4 text-primary-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(a)} aria-label="Delete">
                        <Trash2 className="w-4 h-4 text-destructive/80" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this article?</AlertDialogTitle>
              <AlertDialogDescription>
                "{deleteTarget?.title}" will be permanently removed. This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </>
  )
}
