import api from './client'

export const getWalletBalance = () =>
  api.get('/wallet/balance').then((r) => r.data.data.walletBalance)

export const getMinRecharge = (mentorId) =>
  api.get(`/wallet/min-recharge/${mentorId}`).then((r) => r.data.data)

export const createRechargeOrder = (amount) =>
  api.post('/wallet/recharge', { amount }).then((r) => r.data.data)

export const verifyRecharge = (data) =>
  api.post('/wallet/recharge/verify', data).then((r) => r.data.data)

export const getMyWalletTransactions = () =>
  api.get('/wallet/transactions').then((r) => r.data.data.transactions)
