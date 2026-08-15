import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Briefcase, ExternalLink, Check, X, Zap } from 'lucide-react'
import { getMentors } from '../../api/admin'
import { createMentorAdmin, updateMentorAdmin, getMentorApplications, updateMentorApplicationStatus } from '../../api/mentors'
import { useToast } from '../../hooks/use-toast'
import { cn } from '../../lib/utils'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Textarea from '../../components/ui/Textarea'
import Checkbox from '../../components/ui/Checkbox'
import Badge from '../../components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../../components/ui/Sheet'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const EMPTY_FORM = {
  name: '', email: '', role: '', company: '', experienceYears: '', bio: '',
  photoUrl: '', linkedinUrl: '', domains: '', skills: '', isPubliclyListed: false, isActive: true,
  mentorType: 'interview_panel', chatPrice: 199, discountPrice: 5, dailyFreeQuota: 20,
  offerFirstFree: true, offerSecondDiscount: true,
}

export default function AdminMentors() {
  const { toast } = useToast()
  const [mentors, setMentors] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('talk')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.allSettled([getMentors(), getMentorApplications()]).then(([mentorsRes, appsRes]) => {
      if (mentorsRes.status === 'fulfilled') setMentors(mentorsRes.value.data?.mentors || [])
      if (appsRes.status === 'fulfilled') setApplications(appsRes.value)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setSheetOpen(true) }
  const openEdit = (m) => {
    setEditing(m)
    setForm({
      name: m.name || '', email: m.email || '', role: m.role || '', company: m.company || '',
      experienceYears: m.experienceYears ?? '', bio: m.bio || '', photoUrl: m.photoUrl || '',
      linkedinUrl: m.linkedinUrl || '', domains: (m.domains || []).join(', '), skills: (m.skills || []).join(', '),
      isPubliclyListed: !!m.isPubliclyListed, isActive: m.isActive !== false,
      mentorType: m.mentorType || 'interview_panel',
      chatPrice: m.chatPrice ?? 199, discountPrice: m.discountPrice ?? 5, dailyFreeQuota: m.dailyFreeQuota ?? 20,
      offerFirstFree: m.offers?.firstFree !== false, offerSecondDiscount: m.offers?.secondDiscount !== false,
    })
    setSheetOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      experienceYears: form.experienceYears === '' ? undefined : Number(form.experienceYears),
      chatPrice: Number(form.chatPrice) || 0,
      discountPrice: Number(form.discountPrice) || 0,
      dailyFreeQuota: Number(form.dailyFreeQuota) || 0,
      domains: form.domains.split(',').map((s) => s.trim()).filter(Boolean),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      offers: { firstFree: form.offerFirstFree, secondDiscount: form.offerSecondDiscount },
    }
    delete payload.offerFirstFree
    delete payload.offerSecondDiscount
    try {
      if (editing) await updateMentorAdmin(editing._id, payload)
      else await createMentorAdmin(payload)
      toast({ title: editing ? 'Mentor updated' : 'Mentor added', variant: 'success' })
      setSheetOpen(false)
      load()
    } catch {
      toast({ title: 'Could not save mentor', variant: 'destructive' })
    }
    setSaving(false)
  }

  const handleApplicationStatus = async (id, status) => {
    try {
      await updateMentorApplicationStatus(id, status)
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)))
      toast({ title: status === 'approved' ? 'Application approved' : 'Application rejected', variant: 'success' })
    } catch {
      toast({ title: 'Could not update application', variant: 'destructive' })
    }
  }

  const pendingApps = applications.filter((a) => a.status === 'pending')
  const talkCount = mentors.filter((m) => (m.mentorType || 'interview_panel') === 'talk').length
  const panelCount = mentors.length - talkCount
  const filteredMentors = useMemo(
    () => mentors.filter((m) => (m.mentorType || 'interview_panel') === typeFilter),
    [mentors, typeFilter]
  )

  return (
    <>
      <Seo title="Manage Mentors" path="/admin/mentors" noindex />
      <AdminLayout
        title="Mentors"
        actions={<Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Add Mentor</Button>}
      >
        <Tabs defaultValue="mentors">
          <TabsList className="mb-5">
            <TabsTrigger value="mentors">Panel</TabsTrigger>
            <TabsTrigger value="applications">
              Applications {pendingApps.length > 0 && <Badge size="sm" className="ml-1.5">{pendingApps.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentors">
            <div className="flex items-center gap-2 mb-5">
              {[
                { value: 'talk', label: `Talk to Mentor (${talkCount})` },
                { value: 'interview_panel', label: `Interview Panel (${panelCount})` },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
                    typeFilter === opt.value ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
              </div>
            )}
            {!loading && filteredMentors.length === 0 && (
              <EmptyState title="No mentors here yet" description="Add a mentor to get started." action={<Button onClick={openCreate}>Add Mentor</Button>} />
            )}
            {!loading && filteredMentors.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredMentors.map((m) => (
                  <Card key={m._id} className="p-5 flex items-start gap-3">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarImage src={m.photoUrl} alt={m.name} />
                      <AvatarFallback>{m.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-foreground text-sm truncate">{m.name}</div>
                        {m.isPubliclyListed && <Badge variant="success" size="sm">Public</Badge>}
                      </div>
                      {(m.role || m.company) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Briefcase className="w-3 h-3" /> {[m.role, m.company].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1 truncate">{m.email}</div>
                      {m.mentorType === 'talk' && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                          <Zap className="w-3 h-3 text-primary-500" />
                          ₹{m.chatPrice} chat · {m.freeOrdersUsedToday || 0}/{m.dailyFreeQuota || 20} free today
                          {(m.freeOrdersUsedToday || 0) < (m.dailyFreeQuota || 20) && (
                            <Badge variant="warning" size="sm">behind quota</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)} aria-label="Edit">
                      <Pencil className="w-4 h-4 text-primary-600" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications">
            {loading && <Skeleton className="h-40 rounded-xl" />}
            {!loading && applications.length === 0 && (
              <EmptyState title="No applications yet" description="Mentor applications submitted from the public site will appear here." />
            )}
            {!loading && applications.length > 0 && (
              <div className="space-y-3">
                {applications.map((a) => (
                  <Card key={a._id} className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-foreground text-sm">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.email} · {a.phone}</div>
                      </div>
                      <Badge variant={a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'destructive' : 'warning'}>
                        {a.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-foreground/80 mb-2">
                      {[a.currentRole, a.company].filter(Boolean).join(' at ')} {a.experienceYears ? `· ${a.experienceYears} yrs exp` : ''}
                    </div>
                    {a.domain && <div className="text-xs text-muted-foreground mb-2">Domain: {a.domain}</div>}
                    {a.introduction && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{a.introduction}</p>}
                    <div className="flex items-center gap-2">
                      {a.linkedinUrl && (
                        <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
                          LinkedIn <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {a.status === 'pending' && (
                        <div className="flex gap-2 ml-auto">
                          <Button size="sm" variant="outline" onClick={() => handleApplicationStatus(a._id, 'rejected')}>
                            <X className="w-3.5 h-3.5" /> Reject
                          </Button>
                          <Button size="sm" onClick={() => handleApplicationStatus(a._id, 'approved')}>
                            <Check className="w-3.5 h-3.5" /> Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editing ? 'Edit Mentor' : 'New Mentor'}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <Label required>Mentor Type</Label>
                <Select value={form.mentorType} onValueChange={(v) => setForm((f) => ({ ...f, mentorType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview_panel">Interview Panel (assigned post-booking)</SelectItem>
                    <SelectItem value="talk">Talk to Mentor (instant paid chat)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label required>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label required>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="SDE-2" />
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Experience (years)</Label>
                <Input type="number" value={form.experienceYears} onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Photo URL</Label>
                <Input value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>LinkedIn URL</Label>
                <Input value={form.linkedinUrl} onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Short intro shown on the public profile" />
              </div>
              <div className="space-y-1.5">
                <Label>Domains (comma separated)</Label>
                <Input value={form.domains} onChange={(e) => setForm((f) => ({ ...f, domains: e.target.value }))} placeholder="DSA, System Design" />
              </div>
              <div className="space-y-1.5">
                <Label>Skills (comma separated)</Label>
                <Input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js" />
              </div>

              {form.mentorType === 'talk' && (
                <div className="space-y-4 rounded-xl border border-primary-100 bg-primary-50/50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary-700">Talk-to-Mentor pricing &amp; offers</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label required>Full Chat Price (₹)</Label>
                      <Input type="number" value={form.chatPrice} onChange={(e) => setForm((f) => ({ ...f, chatPrice: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>2nd Chat Price (₹)</Label>
                      <Input type="number" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Daily Free/Discount Quota</Label>
                    <Input type="number" value={form.dailyFreeQuota} onChange={(e) => setForm((f) => ({ ...f, dailyFreeQuota: e.target.value }))} />
                    <p className="text-xs text-muted-foreground">Minimum free+discounted chats expected per day. Not a hard cap.</p>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <Checkbox checked={form.offerFirstFree} onCheckedChange={(v) => setForm((f) => ({ ...f, offerFirstFree: !!v }))} />
                    <span className="text-sm text-foreground">Enable first-chat-free offer</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <Checkbox checked={form.offerSecondDiscount} onCheckedChange={(v) => setForm((f) => ({ ...f, offerSecondDiscount: !!v }))} />
                    <span className="text-sm text-foreground">Enable ₹{form.discountPrice || 5} second-chat offer</span>
                  </label>
                </div>
              )}

              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={form.isPubliclyListed} onCheckedChange={(v) => setForm((f) => ({ ...f, isPubliclyListed: !!v }))} />
                <span className="text-sm text-foreground">List publicly</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: !!v }))} />
                <span className="text-sm text-foreground">Active</span>
              </label>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>Save Mentor</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </AdminLayout>
    </>
  )
}
