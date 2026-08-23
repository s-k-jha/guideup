import { useEffect, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, FileText, Upload, Eye, EyeOff } from 'lucide-react'
import { getAdminNotes, createNote, updateNote, deleteNote } from '../../api/notes'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Textarea from '../../components/ui/Textarea'
import Badge from '../../components/ui/Badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../../components/ui/Sheet'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '../../components/ui/AlertDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const EMPTY_FORM = { title: '', description: '', isActive: true }

function formatBytes(bytes) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export default function AdminNotes() {
  const { toast } = useToast()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const fileInputRef = useRef(null)

  const load = () => {
    setLoading(true)
    getAdminNotes().then(setNotes).catch(() => setNotes([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFile(null)
    setSheetOpen(true)
  }

  const openEdit = (note) => {
    setEditing(note)
    setForm({ title: note.title, description: note.description || '', isActive: note.isActive })
    setFile(null)
    setSheetOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    if (!editing && !file) {
      toast({ title: 'Please choose a file to upload', variant: 'destructive' })
      return
    }

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    if (editing) formData.append('isActive', String(form.isActive))
    if (file) formData.append('file', file)

    setSaving(true)
    try {
      if (editing) {
        await updateNote(editing._id, formData)
        toast({ title: 'Note updated', variant: 'success' })
      } else {
        await createNote(formData)
        toast({ title: 'Note uploaded', variant: 'success' })
      }
      setSheetOpen(false)
      load()
    } catch (err) {
      toast({
        title: 'Could not save note',
        description: err?.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteNote(deleteTarget._id)
      toast({ title: 'Note removed', variant: 'success' })
      load()
    } catch {
      toast({ title: 'Could not remove note', variant: 'destructive' })
    }
    setDeleteTarget(null)
  }

  return (
    <>
      <Seo title="Manage Notes" path="/admin/notes" noindex />
      <AdminLayout
        title="Notes"
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Upload Note
          </Button>
        }
      >
        {loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        )}

        {!loading && notes.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description="Upload a PDF, doc, or slide deck to make it available to signed-in students."
            action={<Button onClick={openCreate}>Upload Note</Button>}
          />
        )}

        {!loading && notes.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {notes.map((n) => (
              <Card key={n._id} className="p-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-foreground text-sm truncate">{n.title}</div>
                    {!n.isActive && <Badge variant="secondary" size="sm">Hidden</Badge>}
                  </div>
                  {n.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{n.description}</p>}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span className="uppercase">{n.fileType}</span>
                    {n.fileSize && <span>&middot; {formatBytes(n.fileSize)}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(n)} aria-label="Edit">
                    <Pencil className="w-4 h-4 text-primary-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(n)} aria-label="Delete">
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
              <SheetTitle>{editing ? 'Edit Note' : 'Upload Note'}</SheetTitle>
            </SheetHeader>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <Label required>Title</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. DSA Cheat Sheet" />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What's in this note?" />
              </div>

              <div className="space-y-1.5">
                <Label required={!editing}>File {editing && <span className="text-muted-foreground font-normal">(leave empty to keep current file)</span>}</Label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2.5 border border-dashed border-input rounded-lg px-3.5 py-3 text-sm text-left hover:border-primary-300 hover:bg-secondary/50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate text-foreground/80">
                    {file ? file.name : editing ? `Current: ${editing.fileName}` : 'Choose a file (PDF, Word, PPT, Excel, image)'}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              {editing && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground transition-colors"
                >
                  {form.isActive ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  {form.isActive ? 'Visible to students' : 'Hidden from students'}
                </button>
              )}
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>Save Note</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this note?</AlertDialogTitle>
              <AlertDialogDescription>
                "{deleteTarget?.title}" will be removed for all students. This can't be undone.
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
