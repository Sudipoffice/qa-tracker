import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getDashboardStats } from '../services/dashboardService'
import StatCard from '../components/ui/StatCard'
import {
  FiFolder, FiCheckCircle, FiClock, FiBarChart2, FiTarget, FiAlertTriangle, FiList,
  FiPlus, FiArrowRight
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const statCardsMeta = [
  { label: 'Total Projects', key: 'totalProjects', icon: FiFolder, color: 'indigo' },
  { label: 'Total Tasks', key: 'totalTasks', icon: FiCheckCircle, color: 'blue' },
  { label: 'To Do', key: 'todoTasks', icon: FiClock, color: 'orange' },
  { label: 'In Progress', key: 'inProgressTasks', icon: FiBarChart2, color: 'yellow' },
  { label: 'QA', key: 'qaTasks', icon: FiTarget, color: 'purple' },
  { label: 'Done', key: 'doneTasks', icon: FiCheckCircle, color: 'green' },
  { label: 'High Priority', key: 'highPriority', icon: FiAlertTriangle, color: 'amber' },
  { label: 'Critical', key: 'criticalPriority', icon: FiAlertTriangle, color: 'red' },
]

const barConfig = {
  Todo: { color: 'bg-[#F97316]', bg: 'bg-orange-100' },
  'In Progress': { color: 'bg-[#F59E0B]', bg: 'bg-amber-100' },
  QA: { color: 'bg-[#6C5CE7]', bg: 'bg-purple-100' },
  Done: { color: 'bg-[#22C55E]', bg: 'bg-emerald-100' },
}

const priorityConfig = {
  Low: { color: 'bg-gray-300', bg: 'bg-gray-100' },
  Medium: { color: 'bg-[#F59E0B]', bg: 'bg-amber-100' },
  High: { color: 'bg-[#F97316]', bg: 'bg-orange-100' },
  Critical: { color: 'bg-[#EF4444]', bg: 'bg-red-100' },
}

const statusStyles = {
  Todo: 'text-[#F97316] bg-orange-50',
  'In Progress': 'text-[#B45309] bg-amber-50',
  QA: 'text-[#6C5CE7] bg-purple-50',
  Done: 'text-[#22C55E] bg-emerald-50',
}

function SkeletonLine({ width = '100%', height = '14px' }) {
  return <div className="skeleton" style={{ width, height }} />
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats()
        setStats(res.data)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statValue = (key) => stats?.[key] ?? 0

  const taskDistItems = [
    { label: 'Todo', value: statValue('todoTasks'), config: barConfig.Todo },
    { label: 'In Progress', value: statValue('inProgressTasks'), config: barConfig['In Progress'] },
    { label: 'QA', value: statValue('qaTasks'), config: barConfig.QA },
    { label: 'Done', value: statValue('doneTasks'), config: barConfig.Done },
  ]
  const taskDistMax = Math.max(...taskDistItems.map(i => i.value), 1)

  const priorityDistItems = [
    { label: 'Low', value: statValue('lowPriority'), config: priorityConfig.Low },
    { label: 'Medium', value: statValue('mediumPriority'), config: priorityConfig.Medium },
    { label: 'High', value: statValue('highPriority'), config: priorityConfig.High },
    { label: 'Critical', value: statValue('criticalPriority'), config: priorityConfig.Critical },
  ]
  const priorityDistMax = Math.max(...priorityDistItems.map(i => i.value), 1)

  const recentTasks = stats?.recentTasks ?? []
  const totalTasks = statValue('totalTasks')
  const doneTasks = statValue('doneTasks')
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, here&apos;s your overview</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6C5CE7] text-white text-sm font-medium rounded-lg hover:bg-[#5A4BD1] transition-colors shadow-sm shadow-[#6C5CE7]/20"
        >
          <FiPlus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#EDEDF0] p-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg skeleton" />
                <div className="space-y-1.5 flex-1">
                  <div className="skeleton" style={{ width: '60%', height: '10px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '18px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCardsMeta.map((card, idx) => (
            <div
              key={card.label}
              className="animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <StatCard
                icon={card.icon}
                label={card.label}
                value={statValue(card.key)}
                color={card.color}
              />
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Task Distribution */}
        <div className="bg-white rounded-xl border border-[#EDEDF0] p-5 animate-slide-up" style={{ animationDelay: '350ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Task Distribution</h3>
          <div className="space-y-3">
            {taskDistItems.map(item => {
              const pct = Math.round((item.value / taskDistMax) * 100)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">{item.label}</span>
                    <span className="text-xs font-semibold text-gray-700">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${item.config.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-xl border border-[#EDEDF0] p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {priorityDistItems.map(item => {
              const pct = Math.round((item.value / priorityDistMax) * 100)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">{item.label}</span>
                    <span className="text-xs font-semibold text-gray-700">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${item.config.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl border border-[#EDEDF0] p-5 animate-slide-up" style={{ animationDelay: '450ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Completion Rate</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none" stroke="#F1F5F9" strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none" stroke="#22C55E" strokeWidth="3"
                  strokeDasharray={`${completionPct} ${100 - completionPct}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
                {completionPct}%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{doneTasks}</span> of <span className="font-semibold text-gray-700">{totalTasks}</span> tasks done
            </p>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl border border-[#EDEDF0] animate-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEDF0]">
          <div className="flex items-center gap-2">
            <FiList className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-medium text-[#6C5CE7] hover:text-[#5A4BD1] transition-colors inline-flex items-center gap-1"
          >
            View all
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
        {loading ? (
          <div className="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <SkeletonLine width="60%" height="12px" />
                  <SkeletonLine width="30%" height="10px" />
                </div>
                <SkeletonLine width="60px" height="22px" />
              </div>
            ))}
          </div>
        ) : recentTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#EDEDF0]">
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Task</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Project</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id} className="border-b border-[#EDEDF0] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-900 font-medium">{task.title}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[task.status] || 'bg-gray-100 text-gray-700'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{task.project?.name ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FiList className="w-8 h-8 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400">No recent tasks</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
