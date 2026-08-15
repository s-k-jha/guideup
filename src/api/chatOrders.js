import api from './client'

export const getTalkMentors = () =>
  api.get('/mentors', { params: { type: 'talk' } }).then((r) => r.data.data.mentors)

export const getChatPricing = (mentorId) =>
  api.get(`/chat-orders/pricing/${mentorId}`).then((r) => r.data.data)

export const createChatOrder = (mentorId) =>
  api.post('/chat-orders', { mentorId }).then((r) => r.data.data)

export const verifyChatPayment = (data) =>
  api.post('/chat-orders/verify', data).then((r) => r.data.data)

export const getMyChatOrders = () =>
  api.get('/chat-orders/my').then((r) => r.data.data.orders)

export const getAdminChatOrders = () =>
  api.get('/admin/chat-orders').then((r) => r.data.data.orders)

export const getBusyMentors = () =>
  api.get('/admin/chat-orders/busy-mentors').then((r) => r.data.data.mentors)

export const refreshBusyMentor = (mentorId) =>
  api.post(`/admin/chat-orders/busy-mentors/${mentorId}/refresh`).then((r) => r.data.data)
