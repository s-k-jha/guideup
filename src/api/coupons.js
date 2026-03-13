import api from './client'

export const validateCoupon = (data) =>
  api.post("/coupons/validate", data).then(res => res.data)
