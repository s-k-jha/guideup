import api from './client'

export const getArticles = (params = {}) =>
  api.get('/articles', { params }).then(r => r.data.data)

export const getArticleBySlug = (slug) =>
  api.get(`/articles/${slug}`).then(r => r.data.data)

export const getCategories = () =>
  api.get('/categories').then(r => r.data.data.categories)

// Admin
export const getAdminArticles = (status) =>
  api.get('/admin/articles', { params: status ? { status } : {} }).then(r => r.data.data.articles)

export const getAdminArticleById = (id) =>
  api.get(`/admin/articles/${id}`).then(r => r.data.data.article)

export const createArticle = (data) =>
  api.post('/admin/articles', data).then(r => r.data.data.article)

export const updateArticle = (id, data) =>
  api.put(`/admin/articles/${id}`, data).then(r => r.data.data.article)

export const deleteArticle = (id) =>
  api.delete(`/admin/articles/${id}`).then(r => r.data)

export const publishArticle = (id) =>
  api.patch(`/admin/articles/${id}/publish`).then(r => r.data.data.article)

export const unpublishArticle = (id) =>
  api.patch(`/admin/articles/${id}/unpublish`).then(r => r.data.data.article)

export const createCategory = (data) =>
  api.post('/admin/categories', data).then(r => r.data.data.category)
