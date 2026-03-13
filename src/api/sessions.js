import api from './client'

// export const getSessions = () => api.get('/sessions').then(r => r.data)
export const getSessions = () =>
  api.get('/sessions').then(r => r.data.data.sessions)
export const createSession = (data) => api.post('/admin/sessions', data).then(r => r.data)
export const updateSession = (id, data) => api.put(`/admin/sessions/${id}`, data).then(r => r.data)
export const deleteSession = (id) => api.delete(`/admin/sessions/${id}`).then(r => r.data)
