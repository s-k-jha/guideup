import api from './client'

export const getAnalytics = (days = 30) =>
  api.get(`/admin/analytics?days=${days}`).then((r) => r.data)
