import api from './client'

// Student-facing — sign-in required (enforced by the backend too)
export const getMyNotes = () =>
  api.get('/notes').then(r => r.data.data.notes)

// Admin CMS
export const getAdminNotes = () =>
  api.get('/admin/notes').then(r => r.data.data.notes)

export const createNote = (formData) =>
  api.post('/admin/notes', formData).then(r => r.data.data.note)

export const updateNote = (id, formData) =>
  api.put(`/admin/notes/${id}`, formData).then(r => r.data.data.note)

export const deleteNote = (id) =>
  api.delete(`/admin/notes/${id}`).then(r => r.data)
