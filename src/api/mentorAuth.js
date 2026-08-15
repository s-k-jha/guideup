import api from './client'

export const loginMentor = (data) =>
  api.post('/mentor-auth/login', data).then((r) => r.data.data)

export const getMentorMe = () =>
  api.get('/mentor-auth/me').then((r) => r.data.data.mentor)

export const updateMentorMe = (data) =>
  api.put('/mentor-auth/me', data).then((r) => r.data.data.mentor)

export const updateMentorStatus = (availabilityStatus) =>
  api.patch('/mentor-auth/status', { availabilityStatus }).then((r) => r.data.data.mentor)
