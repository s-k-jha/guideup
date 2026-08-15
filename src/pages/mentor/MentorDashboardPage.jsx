import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Circle, Loader2 } from 'lucide-react'
import { useMentorAuth } from '../../context/MentorAuthContext'
import { updateMentorMe, updateMentorStatus } from '../../api/mentorAuth'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import { Container, Section } from '../../components/layout/PageContainer'
import Logo from '../../components/layout/Logo'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Textarea from '../../components/ui/Textarea'
import { cn } from '../../lib/utils'

const STATUS_OPTIONS = [
  { value: 0, label: 'Offline', dot: 'bg-muted-foreground', active: 'border-foreground/30 bg-secondary text-foreground' },
  { value: 1, label: 'Online', dot: 'bg-success', active: 'border-success bg-success/10 text-success' },
  { value: 2, label: 'Busy', dot: 'bg-amber-500', active: 'border-amber-400 bg-amber-50 text-amber-700' },
]

export default function MentorDashboardPage() {
  const navigate = useNavigate()
  const { mentor, setMentor, logout } = useMentorAuth()
  const { toast } = useToast()
  const [statusSaving, setStatusSaving] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!mentor) return
    setForm({
      role: mentor.role || '', company: mentor.company || '', experienceYears: mentor.experienceYears ?? '',
      bio: mentor.bio || '', photoUrl: mentor.photoUrl || '', linkedinUrl: mentor.linkedinUrl || '',
      domains: (mentor.domains || []).join(', '), skills: (mentor.skills || []).join(', '),
    })
  }, [mentor])

  const handleStatusChange = async (value) => {
    if (value === mentor.availabilityStatus) return
    setStatusSaving(true)
    try {
      const updated = await updateMentorStatus(value)
      setMentor(updated)
      toast({ title: `You're now ${STATUS_OPTIONS.find((s) => s.value === value).label.toLowerCase()}`, variant: 'success' })
    } catch {
      toast({ title: 'Could not update status', variant: 'destructive' })
    }
    setStatusSaving(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        experienceYears: form.experienceYears === '' ? undefined : Number(form.experienceYears),
        domains: form.domains.split(',').map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      }
      const updated = await updateMentorMe(payload)
      setMentor(updated)
      toast({ title: 'Profile updated', variant: 'success' })
    } catch {
      toast({ title: 'Could not update profile', variant: 'destructive' })
    }
    setSaving(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/mentor/login')
  }

  if (!mentor || !form) return null

  return (
    <>
      <Seo title="Mentor Dashboard" path="/mentor/dashboard" noindex />
      <div className="min-h-screen bg-secondary/30">
        <header className="bg-card border-b border-border">
          <Container className="h-16 flex items-center justify-between">
            <Logo />
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </Container>
        </header>

        <Section className="py-8 sm:py-10">
          <Container className="max-w-2xl">
            <h1 className="text-h2 font-display text-foreground mb-1">Welcome, {mentor.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground mb-8">Manage your availability and public profile.</p>

            <Card className="p-5 sm:p-6 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-1">Availability</h3>
              <p className="text-xs text-muted-foreground mb-4">
                You only appear on the "Talk to a Mentor" page while you're Online.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = mentor.availabilityStatus === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(opt.value)}
                      disabled={statusSaving}
                      className={cn(
                        'flex items-center justify-center gap-2 h-11 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60',
                        isActive ? opt.active : 'border-border text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      {statusSaving && isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Circle className={cn('w-2.5 h-2.5 rounded-full', opt.dot)} fill="currentColor" />}
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card className="p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Your Profile</h3>

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
                <Textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Short intro shown on your public profile" />
              </div>

              <div className="space-y-1.5">
                <Label>Domains (comma separated)</Label>
                <Input value={form.domains} onChange={(e) => setForm((f) => ({ ...f, domains: e.target.value }))} placeholder="DSA, Resume Review" />
              </div>

              <div className="space-y-1.5">
                <Label>Skills (comma separated)</Label>
                <Input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
              </div>

              <p className="text-xs text-muted-foreground">
                Pricing and offer settings are managed by GuideUp admin — contact us to change your rates.
              </p>

              <Button onClick={handleSave} loading={saving} className="w-full h-11">Save Profile</Button>
            </Card>
          </Container>
        </Section>
      </div>
    </>
  )
}
