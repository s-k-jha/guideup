import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export default function PageWrapper({ children, maxWidth = 'max-w-lg' }) {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <header className="border-b border-border bg-background">
        <div className={`${maxWidth} mx-auto px-4 h-14 flex items-center justify-between`}>
          <Link to="/" className="font-display font-bold text-foreground text-base tracking-tight">
            GuideUp
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Secure booking
          </span>
        </div>
      </header>
      <div className={`${maxWidth} mx-auto w-full flex-1`}>{children}</div>
    </div>
  )
}
