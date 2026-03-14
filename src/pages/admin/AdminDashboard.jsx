import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, BookOpen, LogOut } from 'lucide-react'

const CARDS = [
  { icon: CalendarCheck, label: 'Manage Bookings', desc: 'View and assign mentors', href: '/admin/bookings', color: 'bg-blue-50 text-blue-500' },
  { icon: BookOpen,      label: 'Manage Sessions', desc: 'Add, edit, delete session types', href: '/admin/sessions', color: 'bg-primary-50 text-primary-500' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('admin_token'); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">GuideUp</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="space-y-3">
          {CARDS.map(card => (
            <button
              key={card.label}
              onClick={() => navigate(card.href)}
              className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{card.label}</div>
                  <div className="text-sm text-gray-400">{card.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
