import api from './client'

export const getPublicMentors = () =>
  api.get('/mentors').then(r => r.data.data.mentors)

export const getPublicMentorBySlug = (slug) =>
  api.get(`/mentors/${slug}`).then(r => r.data.data.mentor)

export const submitMentorApplication = (data) =>
  api.post('/mentor-applications', data).then(r => r.data)

// Admin mentor CRUD (existing /api/admin/mentors endpoints)
export const createMentorAdmin = (data) =>
  api.post('/admin/mentors', data).then(r => r.data.data.mentor)

export const updateMentorAdmin = (id, data) =>
  api.put(`/admin/mentors/${id}`, data).then(r => r.data.data.mentor)

export const getMentorApplications = (status) =>
  api.get('/mentor-applications', { params: status ? { status } : {} }).then(r => r.data.data.applications)

export const updateMentorApplicationStatus = (id, status) =>
  api.patch(`/mentor-applications/${id}/status`, { status }).then(r => r.data)
