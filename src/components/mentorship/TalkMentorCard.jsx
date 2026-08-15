import { Briefcase, IndianRupee, Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function TalkMentorCard({ mentor, pricing, onConnect, connecting }) {
  const hasFirstFree = mentor.offers?.firstFree
  const hasDiscount = mentor.offers?.secondDiscount

  // `pricing` is this specific student's real tier with this mentor (fetched
  // only once signed in). Until we know that, fall back to the mentor's
  // general offer flags as a marketing default — a signed-out visitor or a
  // brand-new student is assumed to be eligible for the first-free offer.
  const tier = pricing?.tier ?? (hasFirstFree ? 'free' : hasDiscount ? 'discount' : 'paid')
  const isFree = tier === 'free'
  const isDiscount = tier === 'discount'
  const isPaid = tier === 'paid'
  const displayPrice = pricing?.effectivePrice ?? (isDiscount ? mentor.discountPrice : mentor.chatPrice)

  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.photoUrl} alt={mentor.name} />
            <AvatarFallback>{mentor.name?.[0]}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" title="Online now" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground text-sm truncate">{mentor.name}</span>
          </div>
          {(mentor.role || mentor.experienceYears != null) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Briefcase className="w-3 h-3 shrink-0" />
              {mentor.role || `${mentor.experienceYears}+ yrs experience`}
            </div>
          )}
        </div>
      </div>

      {mentor.bio && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{mentor.bio}</p>}

      {mentor.domains?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.domains.slice(0, 2).map((d) => <Badge key={d} size="sm">{d}</Badge>)}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-border">
        {(isFree || isDiscount) && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-success mb-2">
            <Sparkles className="w-3 h-3" /> {isFree ? 'Your chat is free' : 'Your chat is ₹' + displayPrice}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            {!isPaid && (
              <span className="text-xs text-muted-foreground line-through flex items-center">
                <IndianRupee className="w-3 h-3" />{mentor.chatPrice}
              </span>
            )}
            <span className="text-sm font-bold text-foreground flex items-center">
              {isFree ? 'FREE' : <><IndianRupee className="w-3.5 h-3.5" />{displayPrice}</>}
            </span>
            <span className="text-[11px] text-muted-foreground">/ 2 min</span>
          </div>
          <Button size="sm" onClick={() => onConnect(mentor)} loading={connecting}>
            Connect
          </Button>
        </div>
      </div>
    </Card>
  )
}
