import api from './client'

export const createOrder = (data) =>
  api.post('/payment/create-order', data).then(r => r.data)

export const verifyPayment = (data) =>
  api.post('/payment/verify', data).then(r => r.data)
