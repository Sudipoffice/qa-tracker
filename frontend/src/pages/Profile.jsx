import { useContext, useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import api from '../api/axios'
import { FiMail, FiCalendar, FiShield, FiUser, FiCheckCircle, FiLayers } from 'react-icons/fi'

const roleStyles = {
  admin: 'bg-indigo-100 text-indigo-700',
  tester: 'bg-violet-100 text-violet-700',
  developer: 'bg-blue-100 text-blue-700',
}

export default function Profile() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile')
        setProfile(res.data.user)
      } catch {
        setProfile(user)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const data = profile ?? user

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
            <span>Profile</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600">Account</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 rounded-full skeleton mx-auto mb-4" />
            <div className="skeleton" style={{ width: '40%', height: '20px', margin: '0 auto 8px' }} />
            <div className="skeleton" style={{ width: '30%', height: '14px', margin: '0 auto' }} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="skeleton" style={{ width: '30%', height: '18px', marginBottom: '16px' }} />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg skeleton" />
                  <div className="flex-1 space-y-1">
                    <div className="skeleton" style={{ width: '20%', height: '10px' }} />
                    <div className="skeleton" style={{ width: '40%', height: '14px' }} />
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
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
          <span>Profile</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600">Account</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar name={data?.name} size="xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl font-bold text-gray-900">{data?.name ?? 'Unknown'}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{data?.email ?? ''}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium capitalize ${roleStyles[data?.role] ?? 'bg-gray-100 text-gray-700'}`}>
                  {data?.role ?? 'user'}
                </span>
                {data?.createdAt && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5" />
                    Member since {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 animate-slide-up">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Name</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{data?.name ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-gray-900 truncate break-all">{data?.email ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <FiShield className="w-4 h-4 text-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Role</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{data?.role ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-4 h-4 text-amber-600" />
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

          <div className="bg-white rounded-xl border border-gray-200 p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <FiLayers className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tasks Created</p>
                    <p className="text-xs text-gray-500">Total tasks you've created</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 tabular-nums">—</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tasks Completed</p>
                    <p className="text-xs text-gray-500">Tasks marked as done</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 tabular-nums">—</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
