import api from './client'

export const getSettings = () =>
  api.get('/admin/settings').then((r) => r.data.data)

export const updateSettings = (payload) =>
  api.patch('/admin/settings', payload).then((r) => r.data.data)
