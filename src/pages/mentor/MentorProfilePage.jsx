import { useEffect, useState } from 'react'
import { useMentorAuth } from '../../context/MentorAuthContext'
import { updateMentorMe } from '../../api/mentorAuth'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import MentorLayout from '../../components/layout/MentorLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Textarea from '../../components/ui/Textarea'

export default function MentorProfilePage() {
  const { mentor, setMentor } = useMentorAuth()
  const { toast } = useToast()
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

  if (!mentor || !form) return null

  return (
    <>
      <Seo title="Mentor Profile" path="/mentor/profile" noindex />
      <MentorLayout title="Profile">
        <Card className="p-5 sm:p-6 space-y-4 max-w-xl">
          <h3 className="text-sm font-semibold text-foreground">Your Public Profile</h3>

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
      </MentorLayout>
    </>
  )
}
