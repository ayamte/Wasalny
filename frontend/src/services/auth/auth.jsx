import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone } from 'lucide-react'
import * as authService from './authService'
import './auth.css'

export default function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUser()
      console.log('User already authenticated:', user)
      const redirectPath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/trajet/recherche'
      console.log('Redirecting authenticated user to:', redirectPath)
      navigate(redirectPath, { replace: true })
    }
  }, [navigate])

  const showToast = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleToggle = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      phone: '',
    })
    setErrors({})
    setToastMessage('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.username) newErrors.username = 'Username is required'
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.phone) newErrors.phone = 'Phone is required'
    }

    return newErrors
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    if (!verificationCode || verificationCode.length !== 6) {
      showToast('Please enter a valid 6-digit code', 'error')
      return
    }

    setLoading(true)

    try {
      await authService.verifyEmail(verificationEmail, verificationCode)
      showToast('Account verified successfully! You can now login.', 'success')

      setTimeout(() => {
        setShowVerification(false)
        setIsLogin(true)
        setVerificationCode('')
        setFormData({
          email: verificationEmail,
          password: '',
          username: '',
          firstName: '',
          lastName: '',
          phone: '',
        })
      }, 1500)
    } catch (error) {
      const errorMessage = error.response?.data || error.message
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)

    try {
      await authService.resendVerificationCode(verificationEmail)
      showToast('Verification code resent! Check your email.', 'success')
    } catch (error) {
      const errorMessage = error.response?.data || error.message
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
        })
        
        console.log('Login Response:', response)
        
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify({
          id: response.userId,
          email: response.email,
          username: response.username,
          role: response.role,
        }))

        console.log('User stored:', {
          id: response.userId,
          email: response.email,
          username: response.username,
          role: response.role,
        })

        showToast('Login successful!', 'success')

        // Redirect based on role
        const redirectPath = response.role === 'ADMIN' ? '/admin/dashboard' : '/trajet/recherche'
        console.log('Redirecting to:', redirectPath, 'Role:', response.role)
        setTimeout(() => navigate(redirectPath), 1500)
      } else {
        // Signup
        await authService.signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'CLIENT',
          nom: formData.lastName,
          prenom: formData.firstName,
          telephone: formData.phone,
        })

        setVerificationEmail(formData.email)
        setShowVerification(true)
        showToast('Signup successful! Please enter the verification code sent to your email.', 'success')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      showToast(errorMessage, 'error')
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`auth-toast auth-toast-${toastType}`}>
          {toastMessage}
        </div>
      )}

      <div className="auth-wrapper">
        {/* Auth Card */}
        <div className="auth-card">
          <div className="auth-content-grid">
            {/* Form Section */}
            <div className="auth-form-section">
              <div className="auth-form-container">
                {/* Verification Form */}
                {showVerification ? (
                  <>
                    <div className="auth-header verification">
                      <h2 className="auth-title">Verify Your Email</h2>
                      <p className="auth-description">
                        Enter the 6-digit code sent to {verificationEmail}
                      </p>
                    </div>

                    <form onSubmit={handleVerifyCode} className="auth-form">
                      <div className="auth-form-group">
                        <label className="auth-label">Verification Code</label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="000000"
                          maxLength={6}
                          className="auth-input"
                          style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="auth-submit-btn"
                      >
                        {loading ? 'Verifying...' : 'Verify Email'}
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={loading}
                          className="auth-toggle-link"
                          style={{ fontSize: '0.9rem' }}
                        >
                          Resend Code
                        </button>
                      </div>

                      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowVerification(false)
                            setVerificationCode('')
                            setIsLogin(false)
                          }}
                          className="auth-toggle-link"
                          style={{ fontSize: '0.9rem', color: '#666' }}
                        >
                          Back to Signup
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Header */}
                    <div className={`auth-header ${isLogin ? 'login' : 'signup'}`}>
                      <h2 className="auth-title">
                        {isLogin ? 'Welcome back' : 'Create account'}
                      </h2>
                      <p className="auth-description">
                        {isLogin
                          ? 'Login to your Wasalny account'
                          : 'Join Wasalny today'}
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                  {/* Login Form */}
                  {isLogin && (
                    <>
                      {/* Email */}
                      <div className="auth-form-group">
                        <label className="auth-label">Email</label>
                        <div className="auth-input-wrapper">
                          <Mail size={18} className="auth-icon" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="m@example.com"
                            className={`auth-input ${errors.email ? 'error' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <span className="auth-error">{errors.email}</span>
                        )}
                      </div>

                      {/* Password */}
                      <div className="auth-form-group">
                        <div className="auth-password-header">
                          <label className="auth-label">Password</label>
                          <a href="#" className="auth-forgot-link">
                            Forgot?
                          </a>
                        </div>
                        <div className="auth-input-wrapper">
                          <Lock size={18} className="auth-icon" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`auth-input ${errors.password ? 'error' : ''}`}
                          />
                        </div>
                        {errors.password && (
                          <span className="auth-error">{errors.password}</span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Signup Form */}
                  {!isLogin && (
                    <>
                      {/* Username */}
                      <div className="auth-form-group">
                        <label className="auth-label">Username</label>
                        <div className="auth-input-wrapper">
                          <User size={18} className="auth-icon" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="your_username"
                            className={`auth-input ${errors.username ? 'error' : ''}`}
                          />
                        </div>
                        {errors.username && (
                          <span className="auth-error">{errors.username}</span>
                        )}
                      </div>

                      {/* First Name & Last Name */}
                      <div className="auth-form-row">
                        <div className="auth-form-group">
                          <label className="auth-label">First name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className={`auth-input ${errors.firstName ? 'error' : ''}`}
                          />
                          {errors.firstName && (
                            <span className="auth-error">{errors.firstName}</span>
                          )}
                        </div>
                        <div className="auth-form-group">
                          <label className="auth-label">Last name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className={`auth-input ${errors.lastName ? 'error' : ''}`}
                          />
                          {errors.lastName && (
                            <span className="auth-error">{errors.lastName}</span>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="auth-form-group">
                        <label className="auth-label">Email</label>
                        <div className="auth-input-wrapper">
                          <Mail size={18} className="auth-icon" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="m@example.com"
                            className={`auth-input ${errors.email ? 'error' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <span className="auth-error">{errors.email}</span>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="auth-form-group">
                        <label className="auth-label">Phone</label>
                        <div className="auth-input-wrapper">
                          <Phone size={18} className="auth-icon" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+212 6 00 00 00 00"
                            className={`auth-input ${errors.phone ? 'error' : ''}`}
                          />
                        </div>
                        {errors.phone && (
                          <span className="auth-error">{errors.phone}</span>
                        )}
                      </div>

                      {/* Password */}
                      <div className="auth-form-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                          <Lock size={18} className="auth-icon" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`auth-input ${errors.password ? 'error' : ''}`}
                          />
                        </div>
                        {errors.password && (
                          <span className="auth-error">{errors.password}</span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="auth-error-box">{errors.submit}</div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign up'}
                  </button>
                </form>

                {/* Toggle Link */}
                <div className="auth-toggle">
                  <p>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="auth-toggle-link"
                    >
                      {isLogin ? 'Sign up' : 'Login'}
                    </button>
                  </p>
                </div>
                  </>
                )}
              </div>
            </div>

            {/* Image Section */}
            <div className="auth-image-section">
              <img
                src="/images/login_image.png"
                alt="Wasalny Login"
                className="auth-login-image"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
