import axios from 'axios'

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - ajouter le token JWT
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - gérer les erreurs
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré - déconnecter
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} JWT token and user data
 */
export const login = async (credentials) => {
  try {
    const response = await authApi.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Signup new user
 * @param {Object} userData - { username, email, password, role }
 * @returns {Promise} Signup confirmation
 */
export const signup = async (userData) => {
  try {
    const response = await authApi.post('/api/auth/signup', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'CLIENT',
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Verify email with code
 * @param {Object} data - { email, code }
 * @returns {Promise} Verification confirmation
 */
export const verifyEmail = async (email, code) => {
  try {
    const response = await authApi.post('/api/auth/verify', {
      email,
      verificationCode: code,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Resend verification code
 * @param {string} email - User email
 * @returns {Promise} Resend confirmation
 */
export const resendVerificationCode = async (email) => {
  try {
    const response = await authApi.post('/api/auth/resend', null, {
      params: { email },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/auth'
}

/**
 * Get current user profile
 * @returns {Promise} User profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await authApi.get('/api/auth/me')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get auth token from storage
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * Get user from storage
 * @returns {Object|null} User data
 */
export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has token
 */
export const isAuthenticated = () => {
  return !!getToken()
}
