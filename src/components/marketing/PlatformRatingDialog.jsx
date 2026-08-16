import { useState } from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { submitPlatformReview } from '../../api/reviews'
import { useToast } from '../../hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'
import StarRating from '../ui/StarRating'

/**
 * Standalone "rate the platform" dialog, reachable any time from the footer
 * — not tied to a specific chat, unlike the post-chat half of
 * ChatReviewDialog. A student can open this and submit again whenever they
 * want, since it's general sentiment rather than a one-off session review.
 */
export default function PlatformRatingDialog({ open, onOpenChange }) {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [step, setStep] = useState('form')
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setRating(0)
    setComment('')
    setStep('form')
  }

  const close = () => {
    onOpenChange(false)
    setTimeout(reset, 200)
  }

  const handleSubmit = async () => {
    if (rating === 0) return
    setSubmitting(true)
    try {
      await submitPlatformReview({ rating, comment })
      setStep('success')
    } catch {
      toast({ title: 'Could not submit your rating. Please try again.', variant: 'destructive' })
    }
    setSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-md">
        {step === 'success' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <DialogTitle className="mb-2">Thanks for your feedback!</DialogTitle>
            <DialogDescription>We read every rating — it directly shapes what we build next.</DialogDescription>
            <Button className="w-full h-11 mt-6" onClick={close}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-primary-500" /> Rate GuideUp
              </DialogTitle>
              <DialogDescription>How's your experience with the platform been so far?</DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-border p-4">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What worked, or what could be better? (optional)"
                  className="mt-3 min-h-[70px] text-sm"
                  maxLength={1000}
                />
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <Button variant="ghost" className="h-11" onClick={close}>
                Cancel
              </Button>
              <Button className="h-11 sm:min-w-[140px]" onClick={handleSubmit} loading={submitting} disabled={rating === 0}>
                Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
