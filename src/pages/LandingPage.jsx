import { useNavigate } from 'react-router-dom'
import { Rocket, MapPin, Users, FileText, GitBranch, Star, ArrowRight, CheckCircle2 } from 'lucide-react'
import PrimaryButton from '../components/PrimaryButton'

const FEATURES = [
  { icon: MapPin,       text: 'On-campus placement strategy' },
  { icon: GitBranch,    text: 'Off-campus roadmap' },
  { icon: FileText,     text: 'Resume review' },
  { icon: Users,        text: 'Referral guidance' },
]

const TESTIMONIALS = [
  { name: 'Priya M.', company: 'Google', text: 'Got my dream offer after just 2 sessions. Life-changing!' },
  { name: 'Arjun K.', company: 'Microsoft', text: 'The referral strategy actually works. Highly recommend.' },
  { name: 'Sneha R.', company: 'Amazon', text: 'Resume went from ignored to shortlisted in 1 week.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-primary-600 text-lg tracking-tight">Guideup</span>
          <button
            onClick={() => navigate('/sessions')}
            className="text-sm font-semibold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all"
          >
            Book Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4">
        {/* Hero */}
        <section className="pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-primary-500" />
            500+ students placed successfully
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Get Placed in{' '}
            <span className="text-primary-500">Top Companies</span>{' '}
            <span>🚀</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            1:1 placement mentorship sessions with industry experts who've been there.
          </p>
          <PrimaryButton onClick={() => navigate('/sessions')} className="max-w-xs mx-auto text-base">
            Book a Session
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
          <p className="mt-3 text-xs text-gray-400">No commitment • Cancel anytime</p>
        </section>

        {/* Social proof stats */}
        <section className="grid grid-cols-3 gap-3 mb-10">
          {[
            { value: '500+', label: 'Students' },
            { value: '4.9★', label: 'Rating' },
            { value: '30min', label: 'Sessions' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-primary-600">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What's covered</h2>
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-card">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary-500" />
                </div>
                <span className="text-gray-700 font-medium text-sm">{text}</span>
                <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Student stories</h2>
          <div className="space-y-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-card">
                <p className="text-gray-600 text-sm italic mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-primary-500">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-12">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-center text-white">
            <Rocket className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Ready to get placed?</h3>
            <p className="text-primary-100 text-sm mb-5">Book your session now. Mentor assigned within 24 hours.</p>
            <button
              onClick={() => navigate('/sessions')}
              className="bg-white text-primary-600 font-bold px-6 h-12 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
            >
              Book a Session <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
