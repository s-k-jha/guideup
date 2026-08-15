import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Clock, IndianRupee, Sparkles } from 'lucide-react'
import { getSessions, createSession, updateSession, deleteSession } from '../../api/sessions'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Checkbox from '../../components/ui/Checkbox'
import Textarea from '../../components/ui/Textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../../components/ui/Sheet'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '../../components/ui/AlertDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const EMPTY_FORM = { title: '', description: '', durationMinutes: 30, price: 399, isPromo: false }

export default function AdminSessions() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => {
    setLoading(true)
    getSessions().then(setSessions).catch(() => setSessions([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setSheetOpen(true) }
  const openEdit = (s) => {
    setEditing(s)
    setForm({ title: s.title, description: s.description || '', durationMinutes: s.durationMinutes, price: s.price, isPromo: !!s.isPromo })
    setSheetOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateSession(editing._id, form)
        toast({ title: 'Session updated', variant: 'success' })
      } else {
        await createSession(form)
        toast({ title: 'Session created', variant: 'success' })
      }
      setSheetOpen(false)
      load()
    } catch {
      toast({ title: 'Could not save session', description: 'Please try again.', variant: 'destructive' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteSession(deleteTarget._id)
      toast({ title: 'Session removed', variant: 'success' })
      load()
    } catch {
      toast({ title: 'Could not remove session', variant: 'destructive' })
    }
    setDeleteTarget(null)
  }

  return (
    <>
      <Seo title="Manage Sessions" path="/admin/sessions" noindex />
      <AdminLayout
        title="Sessions"
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Session
          </Button>
        }
      >
        {loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <EmptyState title="No sessions yet" description="Create your first mock interview session type to start accepting bookings." action={<Button onClick={openCreate}>Add Session</Button>} />
        )}

        {!loading && sessions.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <Card key={s._id} className="p-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-foreground text-sm truncate">{s.title}</div>
                    {s.isPromo && <Sparkles className="w-3.5 h-3.5 text-primary-500 shrink-0" />}
                  </div>
                  {s.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{s.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.durationMinutes} min</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{s.price}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)} aria-label="Edit">
                    <Pencil className="w-4 h-4 text-primary-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(s)} aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-destructive/80" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editing ? 'Edit Session' : 'New Session'}</SheetTitle>
            </SheetHeader>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <Label required>Title</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. DSA Mock Interview" />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What the student can expect from this session" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label required>Duration (min)</Label>
                  <Input type="number" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label required>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={form.isPromo} onCheckedChange={(v) => setForm((f) => ({ ...f, isPromo: !!v }))} />
                <span className="text-sm text-foreground">Mark as popular / promoted</span>
              </label>
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>Save Session</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this session?</AlertDialogTitle>
              <AlertDialogDescription>
                "{deleteTarget?.title}" will be removed from the public booking flow. This can't be undone.
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
