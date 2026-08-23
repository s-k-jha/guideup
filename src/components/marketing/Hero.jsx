import { ShieldCheck, Users, BarChart3, Sparkle, Star, Briefcase, CheckCircle2 } from 'lucide-react'
import { Container } from '../layout/PageContainer'
import HeroFlowPreview from './HeroFlowPreview'
import heroStudentsImg from '../../assets/images/hero-students.jpg'

function DotGrid({ className, id }) {
  return (
    <svg className={className} width="90" height="90" fill="none" aria-hidden="true">
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Illustrated placeholder avatars (DiceBear "avataaars", seeded — free,
// no key, not real people). TODO: swap for real, consented student photos
// and testimonial quotes before this ships.
function FloatingAvatar({ className, seed }) {
  return (
    <div className={className}>
      <div className="w-14 h-14 rounded-full bg-primary-50 border-2 border-card shadow-popover overflow-hidden ring-1 ring-border">
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=ffedd5,fff7ed`}
          alt=""
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroStudentsImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.55] grayscale-[15%] sepia-[0.12] saturate-[0.85] [mask-image:radial-gradient(ellipse_42%_42%_at_50%_20%,transparent_25%,black_95%)] [-webkit-mask-image:radial-gradient(ellipse_42%_42%_at_50%_20%,transparent_25%,black_95%)] pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/20 via-background/45 to-background" />
      <div className="absolute -top-24 left-[8%] w-72 h-72 bg-primary-200/40 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-10 right-[6%] w-96 h-96 bg-primary-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[28rem] h-40 bg-primary-50/60 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative corner accents — desktop only, kept out of the mobile layout */}
      <DotGrid id="hero-dot-grid-tl" className="hidden xl:block absolute top-6 left-6 text-primary-300/50 pointer-events-none" />
      <DotGrid id="hero-dot-grid-br" className="hidden xl:block absolute bottom-10 right-6 text-primary-300/50 pointer-events-none" />
      <Sparkle className="hidden xl:block absolute left-[14%] top-[42%] w-4 h-4 text-primary-300 pointer-events-none" />

      {/* Floating testimonial accents */}
      <div className="hidden xl:block absolute left-[3%] top-[16%]">
        <FloatingAvatar seed="Aarav-guideup" />
        <div className="mt-2 ml-2 bg-card border border-border rounded-xl shadow-popover px-3.5 py-2.5 w-44">
          <p className="text-xs font-medium text-foreground leading-snug">Helped me crack</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Briefcase className="w-3.5 h-3.5 text-primary-600" />
            <span className="text-xs font-semibold text-foreground">a product company</span>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute right-[4%] top-[12%]">
        <FloatingAvatar seed="Ishita-guideup" />
        <div className="mt-2 mr-2 bg-card border border-border rounded-xl shadow-popover px-3.5 py-2.5 w-48 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-foreground leading-snug">Finally knew what to expect</p>
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
        </div>
      </div>

      <FloatingAvatar seed="Karan-guideup" className="hidden xl:block absolute right-[8%] top-[38%]" />

      <Container className="relative py-14 sm:py-20 lg:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-3 mb-6">
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
              ))}
            </div>
            <span className="text-sm text-foreground/80 text-center max-w-[280px] sm:max-w-none">
              Built from the pain of <span className="font-semibold text-foreground">50K+ students</span>
              {' '}— so you don't have to feel this alone.
            </span>
          </div>

          <h1 className="relative text-h1 lg:text-display font-display text-foreground text-balance mb-5">
            IIT kids rehearse with seniors.{' '}
            <span className="relative inline-block text-primary-600">
              Now you can too.
              <svg
                className="absolute left-0 -bottom-1.5 w-full h-2.5 text-primary-300"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 8C40 2 100 2 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            <Sparkle className="hidden sm:block absolute -right-3 -top-2 w-6 h-6 text-primary-300" />
          </h1>

          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-8 text-balance">
            No senior. No placement cell. No clue what recruiters ask.{' '}
            <span className="text-foreground font-medium">One mock interview with your personalized mentor fixes that.</span>
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 bg-card border border-border rounded-2xl px-6 py-3.5 shadow-xs">
            <span className="flex items-center gap-2 text-sm text-foreground/80">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" /> 1:1 &amp; Confidential
            </span>
            <span className="w-px h-4 bg-border hidden sm:block" />
            <span className="flex items-center gap-2 text-sm text-foreground/80">
              <Users className="w-4 h-4 text-success shrink-0" /> Personalized mentors, not scripts
            </span>
            <span className="w-px h-4 bg-border hidden sm:block" />
            <span className="flex items-center gap-2 text-sm text-foreground/80">
              <BarChart3 className="w-4 h-4 text-success shrink-0" /> Detailed feedback
            </span>
          </div>
        </div>

        <HeroFlowPreview />
      </Container>

      <div className="sr-only">
        GuideUp is a platform where Indian college students practice real technical mock
        interviews with experienced engineers, preparing for software engineering placements,
        internships, and coding interviews through realistic interview simulations and detailed feedback.
      </div>
    </section>
  )
}
