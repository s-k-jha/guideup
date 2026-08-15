import { useState } from 'react'
import { Tag, CheckCircle2, XCircle, Loader2, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Label from '../ui/Label'

export default function CouponInput({ onApply, onRemove, coupon, error, loading }) {
  const [code, setCode] = useState('')

  const handleApply = () => {
    if (!code.trim() || loading) return
    onApply(code.trim().toUpperCase())
  }

  if (coupon) {
    return (
      <div>
        <Label>Coupon</Label>
        <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-success/30 bg-success/5 px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-sm font-medium text-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {coupon.code} applied — ₹{coupon.discount} off
          </span>
          <button
            type="button"
            onClick={() => { onRemove(); setCode('') }}
            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Label htmlFor="coupon">
        Coupon code <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>
      <div className="mt-1.5 flex gap-2">
        <Input
          id="coupon"
          icon={Tag}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApply())}
          placeholder="FIRST100"
          error={!!error}
          className="flex-1"
        />
        <Button type="button" variant="secondary" onClick={handleApply} disabled={loading || !code}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
        </Button>
      </div>
      {error && (
        <div className={cn('flex items-center gap-1.5 mt-1.5 text-destructive text-xs')}>
          <XCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  )
}
