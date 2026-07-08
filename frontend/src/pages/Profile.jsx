import { useContext, useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'
import { FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi'
import api from '../api/axios'

const roleStyles = {
  admin: 'bg-[#6C5CE7]/10 text-[#6C5CE7]',
  tester: 'bg-purple-50 text-[#8B5CF6]',
  developer: 'bg-blue-50 text-[#3B82F6]',
}

export default function Profile() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile')
        setProfile(res.data)
      } catch {
        setProfile(user)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const data = profile ?? user
  const initials = data?.name
    ? data.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto space-y-5">
          <div className="bg-white rounded-xl border border-[#EDEDF0] p-6 text-center">
            <div className="w-20 h-20 rounded-full skeleton mx-auto mb-4" />
            <div className="skeleton" style={{ width: '50%', height: '20px', margin: '0 auto 8px' }} />
            <div className="skeleton" style={{ width: '60%', height: '14px', margin: '0 auto' }} />
          </div>
          <div className="bg-white rounded-xl border border-[#EDEDF0] p-5">
            <div className="skeleton" style={{ width: '40%', height: '18px', marginBottom: '16px' }} />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg skeleton" />
                  <div className="flex-1 space-y-1">
                    <div className="skeleton" style={{ width: '30%', height: '10px' }} />
                    <div className="skeleton" style={{ width: '50%', height: '14px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto space-y-5">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-[#EDEDF0] p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-2xl font-bold flex items-center justify-center mx-auto mb-4 ring-2 ring-white shadow-sm">
            {initials}
          </div>
          <h1 className="text-lg font-bold text-gray-900">{data?.name ?? 'Unknown'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.email ?? ''}</p>
          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium mt-3 capitalize ${roleStyles[data?.role] ?? 'bg-gray-100 text-gray-700'}`}>
            {data?.role ?? 'user'}
          </span>
          {data?.createdAt && (
            <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5" />
              Member since {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border border-[#EDEDF0] p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiUser className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Name</p>
                <p className="text-sm font-medium text-gray-900 truncate">{data?.name ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiMail className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{data?.email ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiShield className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Role</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{data?.role ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Member Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
