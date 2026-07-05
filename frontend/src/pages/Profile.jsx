import { useContext, useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'
import { FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi'
import api from '../api/axios'

const roleStyles = {
  admin: 'bg-indigo-100 text-indigo-700',
  tester: 'bg-purple-100 text-purple-700',
  developer: 'bg-slate-100 text-slate-700',
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
      <MainLayout title="Profile">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-8 text-center animate-pulse">
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4" />
            <div className="h-7 bg-gray-200 rounded-lg w-48 mx-auto mb-2" />
            <div className="h-5 bg-gray-200 rounded-lg w-56 mx-auto mb-3" />
            <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded-lg w-44 mb-6" />
            <div className="space-y-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1.5" />
                    <div className="h-4 bg-gray-200 rounded w-36" />
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
    <MainLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 text-3xl font-bold flex items-center justify-center mx-auto mb-4">
            {initials}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data?.name ?? 'Unknown'}</h1>
          <p className="text-gray-500 mt-0.5">{data?.email ?? ''}</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 capitalize ${roleStyles[data?.role] ?? 'bg-gray-100 text-gray-700'}`}>
            {data?.role ?? 'user'}
          </span>
          {data?.createdAt && (
            <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5" />
              Member since {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiUser className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">{data?.name ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiMail className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{data?.email ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiShield className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{data?.role ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
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
