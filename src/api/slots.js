import api from './client'

export const getSlots = (date, sessionId) =>
  api.get('/slots', { params: { date, sessionId } }).then(r => r.data.data.slots)