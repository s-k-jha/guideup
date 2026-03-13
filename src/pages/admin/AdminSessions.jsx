import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, Clock, IndianRupee, X, Check } from 'lucide-react'
import { getSessions, createSession, updateSession, deleteSession } from '../../api/sessions'
import LoadingSpinner from '../../components/LoadingSpinner'
import PrimaryButton from '../../components/PrimaryButton'

const EMPTY_FORM = { title: '', durationMinutes: 30, price: 399 }

export default function AdminSessions() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null) // session object or null
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getSessions().then(setSessions).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true) }
  const openEdit = (s) => { setEditing(s); setForm({ title: s.title, durationMinutes: s.durationMinutes, price: s.price }); setShowForm(true) }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateSession(editing._id, form)
      } else {
        await createSession(form)
      }
      setShowForm(false)
      load()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this session type?')) return
    await deleteSession(id)
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-900">Sessions</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-primary-500 text-white text-sm font-semibold px-3 h-9 rounded-lg hover:bg-primary-600 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Inline form */}
        {showForm && (
          <div className="bg-white border border-primary-200 rounded-2xl p-5 shadow-card-hover mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">{editing ? 'Edit Session' : 'New Session'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="e.g. DSA Strategy Session"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Duration (min)</label>
                  <input
                    type="number"
                    value={form.durationMinutes}
                    onChange={e => setForm(f => ({ ...f, durationMinutes: Number(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-10 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setShowForm(false)} className="h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <LoadingSpinner />}

        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-card flex items-start justify-between">
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{s.title}</div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.durationMinutes} min</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{s.price}</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(s)} className="p-2 hover:bg-primary-50 rounded-lg transition text-primary-500">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
