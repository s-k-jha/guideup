import api from './client'

export const adminLogin = (credentials) =>
  api.post('/admin/login', credentials).then(r => r.data)

export const getBookings = () =>
  api.get('/admin/bookings').then(r => r.data)

export const assignMentor = (bookingId, mentorId) =>
  api.patch(`/admin/bookings/${bookingId}/assign-mentor`, { mentorId }).then(r => r.data)

export const getMentors = () =>
  api.get('/admin/mentors').then(r => r.data)
