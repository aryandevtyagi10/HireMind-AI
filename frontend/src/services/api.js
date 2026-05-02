import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const register    = (data) => api.post('/api/auth/register', data)
export const login       = (data) => api.post('/api/auth/login', data)
export const logout      = ()     => api.get('/api/auth/logout')
export const getMe       = ()     => api.get('/api/auth/get-me')

// ── INTERVIEW PLAN ────────────────────────────────────────────────────────────
export const generatePlan    = (fd)  => api.post('/api/interview/', fd)
export const getAllPlans      = ()    => api.get('/api/interview/')
export const getPlanById      = (id)  => api.get(`/api/interview/report/${id}`)
export const downloadResumePdf = (id) => api.post(`/api/interview/resume/pdf/${id}`, null, { responseType: 'blob' })

// ── AI SESSION ────────────────────────────────────────────────────────────────
export const startSession    = (fd)       => api.post('/api/session/', fd)
export const getAllSessions   = ()         => api.get('/api/session/')
export const getSession      = (id)       => api.get(`/api/session/${id}`)
export const submitAnswer    = (id, data) => api.post(`/api/session/${id}/answer`, data)
export const completeSession = (id)       => api.post(`/api/session/${id}/complete`)
export const downloadSessionPdf = (id)   => api.get(`/api/session/${id}/pdf`, { responseType: 'blob' })

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
export const createOrder   = (plan) => api.post('/api/payment/create-order', { plan })
export const verifyPayment = (data) => api.post('/api/payment/verify-payment', data)
