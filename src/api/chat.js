import api from './client'

const mentorHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('mentor_token')}` },
})

export const getChatOrderAsUser = (id) =>
  api.get(`/chat-orders/${id}`).then((r) => r.data.data.chatOrder)

export const getChatOrderAsMentor = (id) =>
  api.get(`/chat-orders/${id}`, mentorHeaders()).then((r) => r.data.data.chatOrder)

export const getChatMessagesAsUser = (id) =>
  api.get(`/chat-orders/${id}/messages`).then((r) => r.data.data.messages)

export const getChatMessagesAsMentor = (id) =>
  api.get(`/chat-orders/${id}/messages`, mentorHeaders()).then((r) => r.data.data.messages)
