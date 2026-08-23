import { FileText, Briefcase, Laptop, Users, Code2, Rocket, Monitor, Target, MessageSquare } from 'lucide-react'

// Sessions are free-form admin-entered content with no category field, so
// the icon/color is inferred from the title text. Order matters — more
// specific patterns (e.g. "system design") must be checked before generic
// ones (e.g. "design") would otherwise win.
const RULES = [
  { test: /resume/i, icon: FileText, bg: 'bg-primary-50', text: 'text-primary-600' },
  { test: /system design/i, icon: Monitor, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { test: /job|off-campus|career/i, icon: Briefcase, bg: 'bg-blue-50', text: 'text-blue-600' },
  { test: /node|course|practical/i, icon: Laptop, bg: 'bg-purple-50', text: 'text-purple-600' },
  { test: /linkedin|referral|network/i, icon: Users, bg: 'bg-green-50', text: 'text-green-600' },
  { test: /coding|kickstart|beginner|dsa|algorithm/i, icon: Code2, bg: 'bg-amber-50', text: 'text-amber-600' },
  { test: /project|build/i, icon: Rocket, bg: 'bg-red-50', text: 'text-red-600' },
  { test: /placement|roadmap|prep/i, icon: Target, bg: 'bg-teal-50', text: 'text-teal-600' },
]

const FALLBACK_PALETTE = [
  { bg: 'bg-primary-50', text: 'text-primary-600' },
  { bg: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-purple-50', text: 'text-purple-600' },
  { bg: 'bg-teal-50', text: 'text-teal-600' },
]

export function getSessionVisual(title = '', index = 0) {
  const match = RULES.find((r) => r.test.test(title))
  if (match) return match
  return { icon: MessageSquare, ...FALLBACK_PALETTE[index % FALLBACK_PALETTE.length] }
}
