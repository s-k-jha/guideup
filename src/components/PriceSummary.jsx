import { IndianRupee, Tag } from 'lucide-react'
import Separator from './ui/Separator'

export default function PriceSummary({ session, coupon }) {
  if (!session) return null
  const original = session.price
  const discount = coupon?.discount || 0
  const final = Math.max(0, original - discount)

  return (
    <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
      <h4 className="font-semibold text-foreground text-sm">Price Summary</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{session.title}</span>
          <span className="font-medium flex items-center gap-0.5 text-foreground">
            <IndianRupee className="w-3 h-3" />{original}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success flex items-center gap-1">
              <Tag className="w-3 h-3" /> Coupon ({coupon.code})
            </span>
            <span className="text-success font-medium flex items-center gap-0.5">
              -<IndianRupee className="w-3 h-3" />{discount}
            </span>
          </div>
        )}
        <Separator className="my-1" />
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-lg text-primary-600 flex items-center gap-0.5">
            <IndianRupee className="w-4 h-4" />{final}
          </span>
        </div>
      </div>
    </div>
  )
}
