import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://guideup-api.onrender.com/api"
})

api.interceptors.request.use((config) => {

  // A caller that already set its own Authorization header (e.g. a mentor
  // explicitly hitting a shared /chat-orders/* route) knows better than the
  // URL-based heuristic below — leave it alone.
  if (config.headers?.Authorization) return config

  const isAdminRoute = config.url?.includes("/admin")
  const isMentorAuthRoute = config.url?.includes("/mentor-auth")

  const token = isAdminRoute
    ? localStorage.getItem("admin_token")
    : isMentorAuthRoute
    ? localStorage.getItem("mentor_token")
    : localStorage.getItem("user_token") || localStorage.getItem("admin_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config

})

export default api
