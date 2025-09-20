import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export function setAuthToken(token) {
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
else delete axios.defaults.headers.common['Authorization']
}

export async function signup(userData) {
return axios.post(`${API_BASE}/auth/signup`, userData)
}

export async function login(email, password) {
const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password })
return data
}

export async function generateReport(sessionId) {
const { data } = await axios.get(`${API_BASE}/generate-report`, { params: { session_id: sessionId } })
return data
}
