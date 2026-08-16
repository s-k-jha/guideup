import api from './client'

export const submitReview = (data) =>
  api.post('/reviews', data).then((r) => r.data.data)

export const submitPlatformReview = (data) =>
  api.post('/reviews/platform', data).then((r) => r.data.data)

export const getAdminReviews = (type) =>
  api.get('/admin/reviews', { params: type ? { type } : {} }).then((r) => r.data.data)
