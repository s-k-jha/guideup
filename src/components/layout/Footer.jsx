import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Linkedin, Instagram, ShieldCheck, Star } from 'lucide-react'
import { useAuthDialog } from '../../context/AuthDialogContext'
import PlatformRatingDialog from '../marketing/PlatformRatingDialog'
import Logo from './Logo'
import { Container } from './PageContainer'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Mock Interview Sessions', href: '/sessions' },
      { label: 'Our Mentors', href: '/mentors' },
      { label: 'Talk to a Mentor', href: '/talk-to-mentor' },
      { label: 'Resources', href: '/blog' },
      { label: 'Become a Mentor', href: '/become-a-mentor' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Placement Preparation', href: '/blog?category=placements' },
      { label: 'Interview Preparation', href: '/blog?category=interviews' },
      { label: 'DSA Guides', href: '/blog?category=dsa' },
      { label: 'Resume Reviews', href: '/blog?category=resume' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact Us', href: 'mailto:support@guideup.in', external: true },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Rate the Platform', action: 'rate-platform' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
]

export default function Footer() {
  const { requireAuth } = useAuthDialog()
  const [rateOpen, setRateOpen] = useState(false)

  const handleRatePlatform = () => requireAuth(() => setRateOpen(true))

  return (
    <footer className="border-t border-border bg-secondary/40">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Real technical mock interviews with working engineers, so placements
              feel familiar instead of frightening.
            </p>
            <a
              href="mailto:support@guideup.in"
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              support@guideup.in
            </a>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary-200 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary-200 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-1.5 mt-5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" />
              Payments secured by Razorpay
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-foreground mb-4">{col.title}</div>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.action === 'rate-platform' ? (
                      <button
                        type="button"
                        onClick={handleRatePlatform}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Star className="h-3.5 w-3.5" />
                        {link.label}
                      </button>
                    ) : link.external ? (
                      <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <span>© {new Date().getFullYear()} GuideUp. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>Made for Indian college students preparing for placements.</span>
            <Link to="/mentor/login" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
              Mentor Login
            </Link>
          </div>
        </div>
      </Container>

      <PlatformRatingDialog open={rateOpen} onOpenChange={setRateOpen} />
    </footer>
  )
}
