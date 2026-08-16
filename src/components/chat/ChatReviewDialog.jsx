import { useState } from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { submitReview } from '../../api/reviews'
import { useToast } from '../../hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'
import StarRating from '../ui/StarRating'

/**
 * Post-chat feedback dialog offered to the student once a chat ends. Shows
 * a mentor rating block and/or a platform rating block depending on which
 * ones this chat order hasn't already collected (mentorReviewed /
 * platformReviewed) — a chat that's already fully reviewed never opens this
 * at all (the caller checks before rendering).
 */
export default function ChatReviewDialog({ open, onOpenChange, chatOrder, onDone }) {
  const { toast } = useToast()
  const [mentorRating, setMentorRating] = useState(0)
  const [mentorComment, setMentorComment] = useState('')
  const [platformRating, setPlatformRating] = useState(0)
  const [platformComment, setPlatformComment] = useState('')
  const [step, setStep] = useState('form')
  const [submitting, setSubmitting] = useState(false)

  const mentor = chatOrder?.mentorId
  const showMentorBlock = chatOrder && !chatOrder.mentorReviewed
  const showPlatformBlock = chatOrder && !chatOrder.platformReviewed
  const canSubmit = (showMentorBlock && mentorRating > 0) || (showPlatformBlock && platformRating > 0)

  const reset = () => {
    setMentorRating(0)
    setMentorComment('')
    setPlatformRating(0)
    setPlatformComment('')
    setStep('form')
  }

  const close = () => {
    onOpenChange(false)
    onDone?.()
    // Reset after the close animation finishes so the form doesn't visibly
    // flash back to blank while the dialog is still fading out.
    setTimeout(reset, 200)
  }

  const handleSubmit = async () => {
    if (!canSubmit || !chatOrder) return
    setSubmitting(true)
    try {
      await submitReview({
        chatOrderId: chatOrder._id,
        ...(showMentorBlock && mentorRating > 0 ? { mentorRating, mentorComment } : {}),
        ...(showPlatformBlock && platformRating > 0 ? { platformRating, platformComment } : {}),
      })
      setStep('success')
    } catch {
      toast({ title: 'Could not submit your review. Please try again.', variant: 'destructive' })
    }
    setSubmitting(false)
  }

  if (!chatOrder) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-md">
        {step === 'success' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <DialogTitle className="mb-2">Thanks for your feedback!</DialogTitle>
            <DialogDescription>It helps us keep the panel sharp and the platform improving.</DialogDescription>
            <Button className="w-full h-11 mt-6" onClick={close}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-primary-500" /> How was your chat?
              </DialogTitle>
              <DialogDescription>Your feedback is quick, optional, and helps other students too.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {showMentorBlock && (
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mentor?.photoUrl} alt={mentor?.name} />
                      <AvatarFallback className="text-xs">{mentor?.name?.[0] || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-foreground">
                      Rate {mentor?.name || 'your mentor'}
                    </div>
                  </div>
                  <StarRating value={mentorRating} onChange={setMentorRating} size="lg" />
                  {mentorRating > 0 && (
                    <Textarea
                      value={mentorComment}
                      onChange={(e) => setMentorComment(e.target.value)}
                      placeholder="Anything specific you'd like to add? (optional)"
                      className="mt-3 min-h-[70px] text-sm"
                      maxLength={1000}
                    />
                  )}
                </div>
              )}

              {showPlatformBlock && (
                <div className="rounded-xl border border-border p-4">
                  <div className="text-sm font-medium text-foreground mb-3">Rate the GuideUp platform</div>
                  <StarRating value={platformRating} onChange={setPlatformRating} size="lg" />
                  {platformRating > 0 && (
                    <Textarea
                      value={platformComment}
                      onChange={(e) => setPlatformComment(e.target.value)}
                      placeholder="What worked, or what could be better? (optional)"
                      className="mt-3 min-h-[70px] text-sm"
                      maxLength={1000}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <Button variant="ghost" className="h-11" onClick={close}>
                Maybe later
              </Button>
              <Button className="h-11 sm:min-w-[140px]" onClick={handleSubmit} loading={submitting} disabled={!canSubmit}>
                Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
