import { useEffect, useState } from 'react'
import { useMentorAuth } from '../../context/MentorAuthContext'
import { updateBankDetails } from '../../api/mentorFinance'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import MentorLayout from '../../components/layout/MentorLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import { ShieldCheck } from 'lucide-react'

export default function MentorAccountPage() {
  const { mentor, setMentor } = useMentorAuth()
  const { toast } = useToast()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!mentor) return
    setForm({
      accountHolderName: mentor.bankDetails?.accountHolderName || '',
      accountNumber: mentor.bankDetails?.accountNumber || '',
      ifsc: mentor.bankDetails?.ifsc || '',
      upiId: mentor.bankDetails?.upiId || '',
    })
  }, [mentor])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateBankDetails(form)
      setMentor(updated)
      toast({ title: 'Bank details saved', variant: 'success' })
    } catch (err) {
      toast({ title: err?.response?.data?.message || 'Could not save bank details', variant: 'destructive' })
    }
    setSaving(false)
  }

  if (!mentor || !form) return null

  return (
    <>
      <Seo title="Bank Account" path="/mentor/account" noindex />
      <MentorLayout title="Bank Account">
        <Card className="p-5 sm:p-6 space-y-4 max-w-lg">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Payout Account Details</h3>
            <p className="text-xs text-muted-foreground">
              Required before you can request a payout or advance. Payouts are transferred manually by our team within 7 working days of approval.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label required>Account Holder Name</Label>
            <Input value={form.accountHolderName} onChange={(e) => setForm((f) => ({ ...f, accountHolderName: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label required>Account Number</Label>
            <Input value={form.accountNumber} onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label required>IFSC Code</Label>
            <Input value={form.ifsc} onChange={(e) => setForm((f) => ({ ...f, ifsc: e.target.value.toUpperCase() }))} placeholder="HDFC0001234" />
          </div>

          <div className="space-y-1.5">
            <Label>UPI ID <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input value={form.upiId} onChange={(e) => setForm((f) => ({ ...f, upiId: e.target.value }))} placeholder="you@upi" />
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
            <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
            Your account details are only visible to GuideUp admin for processing payouts.
          </div>

          <Button onClick={handleSave} loading={saving} className="w-full h-11">Save Bank Details</Button>
        </Card>
      </MentorLayout>
    </>
  )
}
