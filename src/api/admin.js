import api from './client'

export const adminLogin = (credentials) =>
  api.post('/admin/login', credentials).then(r => r.data)

export const getBookings = () =>
  api.get('/admin/bookings').then(r => r.data)

export const assignMentor = (bookingId, mentorName) =>
  api.patch(`/admin/bookings/${bookingId}/assign-mentor`, { mentorName }).then(r => r.data)
