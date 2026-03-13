import api from "./client"

// export const joinMeeting = (bookingId) =>
//   api.get(`/meeting/${bookingId}/join`).then(res => res.data)

export const getMeetingInfo = (bookingId) =>
  api.get(`/meeting/${bookingId}/join`).then(res => res.data)