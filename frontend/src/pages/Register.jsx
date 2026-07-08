import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiClipboard } from 'react-icons/fi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { register } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!form.email) err.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Please enter a valid email address'
    if (!form.password) err.password = 'Password is required'
    else if (form.password.length < 6) err.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) err.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) err.confirmPassword = 'Passwords do not match'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Registration successful! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%),
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%),
            linear-gradient(60deg, rgba(255,255,255,0.1) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.1) 75.5%)
          `,
          backgroundSize: '80px 140px, 80px 140px, 80px 140px, 80px 140px, 60px 60px',
          backgroundPosition: '0 0, 40px 70px, 40px 70px, 80px 140px, 0 0'
        }} />
        <div className="relative z-10 max-w-lg px-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 ring-1 ring-white/20">
            <FiClipboard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Start building quality products</h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Join teams that ship with confidence. Create your account and take control of your QA workflow today.
          </p>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Get started fast</p>
                <p className="text-indigo-300 text-sm">Set up your workspace in minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Enterprise-grade security</p>
                <p className="text-indigo-300 text-sm">Your data is always protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl shadow-indigo-200/40 p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#6C5CE7] to-[#5A4BD1] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#6C5CE7]/30">
                <FiClipboard className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
              <p className="text-sm text-gray-500 mt-1">Join QA Tracker today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <Button type="submit" className="w-full" loading={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6C5CE7] font-semibold hover:text-[#5A4BD1] transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
