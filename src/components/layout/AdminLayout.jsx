import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, BookOpen, Users, Newspaper, LogOut, Menu, MessageCircle, Star, FileText, BarChart3,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Sheet, SheetContent } from '../ui/Sheet'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: CalendarCheck, label: 'Bookings', href: '/admin/bookings' },
  { icon: BookOpen, label: 'Sessions', href: '/admin/sessions' },
  { icon: Users, label: 'Mentors', href: '/admin/mentors' },
  { icon: MessageCircle, label: 'Chat Orders', href: '/admin/chat-orders' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
  { icon: Newspaper, label: 'Blog', href: '/admin/blog' },
  { icon: FileText, label: 'Notes', href: '/admin/notes' },
]

function NavList({ onNavigate }) {
  const location = useLocation()
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
              active ? 'bg-primary-50 text-primary-700' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminLayout({ children, title, actions }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">G</span>
          <span className="font-display font-bold text-foreground">GuideUp</span>
          <span className="text-xs text-muted-foreground ml-auto">Admin</span>
        </div>
        <NavList />
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-display font-bold text-lg text-foreground truncate">{title}</h1>
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>
        </header>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-72">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">G</span>
              <span className="font-display font-bold text-foreground">GuideUp Admin</span>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={logout}
              className="mt-auto flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </SheetContent>
        </Sheet>

        <main className="p-4 sm:p-6 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}
