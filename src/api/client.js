import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api"
  // production ke time
  // baseURL: "https://guideup-api.onrender.com/api"
})

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("admin_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config

})

export default api
