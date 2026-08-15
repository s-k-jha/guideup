import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://guideup-api.onrender.com/api"
})

api.interceptors.request.use((config) => {

  const isAdminRoute = config.url?.includes("/admin")
  const token = isAdminRoute
    ? localStorage.getItem("admin_token")
    : localStorage.getItem("user_token") || localStorage.getItem("admin_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config

})

export default api
