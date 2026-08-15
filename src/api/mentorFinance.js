import api from './client'

export const getMentorEarnings = () =>
  api.get('/mentor-auth/earnings').then((r) => r.data.data)

export const getMentorOrders = () =>
  api.get('/mentor-auth/orders').then((r) => r.data.data.orders)

export const updateBankDetails = (data) =>
  api.put('/mentor-auth/bank-details', data).then((r) => r.data.data.mentor)

export const createPayoutRequest = (amount) =>
  api.post('/mentor-auth/payout-requests', { amount }).then((r) => r.data.data)

export const getMyPayoutRequests = () =>
  api.get('/mentor-auth/payout-requests').then((r) => r.data.data.payoutRequests)

export const createAdvanceRequest = (amount) =>
  api.post('/mentor-auth/advance-requests', { amount }).then((r) => r.data.data)

export const getMyAdvanceRequests = () =>
  api.get('/mentor-auth/advance-requests').then((r) => r.data.data.advanceRequests)

export const endActiveChat = () =>
  api.patch('/mentor-auth/end-chat').then((r) => r.data.data.mentor)
