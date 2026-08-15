import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowRight, Menu, MessageCircle, User, LogOut, History, Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import { useAuthDialog } from '../../context/AuthDialogContext'
import Button from '../ui/Button'
import { Sheet, SheetClose, SheetContent } from '../ui/Sheet'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '../ui/DropdownMenu'
import Logo from './Logo'

const LINKS = [
  { label: 'Sessions', href: '/sessions' },
  { label: 'Mentors', href: '/mentors' },
  { label: 'Talk to a Mentor', href: '/talk-to-mentor' },
  { label: 'Resources', href: '/blog' },
  { label: 'Become a Mentor', href: '/become-a-mentor' },
]

function UserMenu() {
  const { user, logout } = useAuth()
  const { openAuthDialog } = useAuthDialog()
  const navigate = useNavigate()

  if (!user) {
    return (
      <Button variant="ghost" size="sm" onClick={openAuthDialog}>
        Sign In
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/wallet')}>
          <Wallet className="w-4 h-4" /> My Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/my-chats')}>
          <History className="w-4 h-4" /> My Chats
        </DropdownMenuItem>
        <DropdownMenuItem destructive onClick={logout}>
          <LogOut className="w-4 h-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { openAuthDialog } = useAuthDialog()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        scrolled ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-xs' : 'bg-background/0 border-b border-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                  isActive ? 'text-primary-600 bg-primary-50' : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                )
              }
            >
              {link.href === '/talk-to-mentor' && <MessageCircle className="w-3.5 h-3.5" />}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <UserMenu />
          <Button size="sm" onClick={() => navigate('/sessions')}>
            Book a Session
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -mr-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5.5 w-5.5 h-[22px] w-[22px]" />
          </button>
          <SheetContent side="right" className="w-[85vw] max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <Logo />
            </div>
            <nav className="flex flex-col gap-1 mt-4">
              {LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    to={link.href}
                    className="px-3.5 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    {link.href === '/talk-to-mentor' && <MessageCircle className="w-4 h-4" />}
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              {user && (
                <>
                  <SheetClose asChild>
                    <Link to="/wallet" className="px-3.5 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> My Wallet
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/my-chats" className="px-3.5 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                      <History className="w-4 h-4" /> My Chats
                    </Link>
                  </SheetClose>
                </>
              )}
            </nav>
            <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-border">
              {user ? (
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-8 w-8"><AvatarFallback>{user.name?.[0]}</AvatarFallback></Avatar>
                    <span className="text-sm font-medium truncate">{user.name}</span>
                  </div>
                  <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <SheetClose asChild>
                  <Button variant="outline" onClick={openAuthDialog}>
                    <User className="w-4 h-4" /> Sign In
                  </Button>
                </SheetClose>
              )}
              <SheetClose asChild>
                <Button onClick={() => navigate('/sessions')}>
                  Book a Session
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
