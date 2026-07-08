import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getDashboardStats } from '../services/dashboardService'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import PriorityBadge from '../components/ui/PriorityBadge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import {
  FiFolder, FiCheckCircle, FiClock, FiBarChart2, FiTarget, FiAlertTriangle, FiList,
  FiPlus, FiArrowRight, FiLayers
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const statCardsMeta = [
  { label: 'Total Projects', key: 'totalProjects', icon: FiFolder, color: 'indigo' },
  { label: 'Total Tasks', key: 'totalTasks', icon: FiLayers, color: 'blue' },
  { label: 'To Do', key: 'todoTasks', icon: FiClock, color: 'slate' },
  { label: 'In Progress', key: 'inProgressTasks', icon: FiBarChart2, color: 'blue' },
  { label: 'QA', key: 'qaTasks', icon: FiTarget, color: 'purple' },
  { label: 'Done', key: 'doneTasks', icon: FiCheckCircle, color: 'green' },
  { label: 'High Priority', key: 'highPriority', icon: FiAlertTriangle, color: 'orange' },
  { label: 'Critical', key: 'criticalPriority', icon: FiAlertTriangle, color: 'red' },
]

const barColorMap = {
  'Todo': 'bg-slate-500',
  'In Progress': 'bg-blue-500',
  'QA': 'bg-violet-500',
  'Done': 'bg-emerald-500',
}

const priorityBarColorMap = {
  'Low': 'bg-gray-300',
  'Medium': 'bg-amber-500',
  'High': 'bg-orange-500',
  'Critical': 'bg-red-500',
}

const statusBarBg = {
  'Todo': 'bg-slate-100',
  'In Progress': 'bg-blue-100',
  'QA': 'bg-violet-100',
  'Done': 'bg-emerald-100',
}

const priorityBarBg = {
  'Low': 'bg-gray-100',
  'Medium': 'bg-amber-100',
  'High': 'bg-orange-100',
  'Critical': 'bg-red-100',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
    { label: 'Todo', value: statValue('todoTasks') },
    { label: 'In Progress', value: statValue('inProgressTasks') },
    { label: 'QA', value: statValue('qaTasks') },
    { label: 'Done', value: statValue('doneTasks') },
  ]
  const taskDistTotal = taskDistItems.reduce((s, i) => s + i.value, 0) || 1

  const priorityDistItems = [
    { label: 'Low', value: statValue('lowPriority') },
    { label: 'Medium', value: statValue('mediumPriority') },
    { label: 'High', value: statValue('highPriority') },
    { label: 'Critical', value: statValue('criticalPriority') },
  ]
  const priorityDistTotal = priorityDistItems.reduce((s, i) => s + i.value, 0) || 1

  const recentTasks = stats?.recentTasks ?? []
  const totalTasks = statValue('totalTasks')
  const doneTasks = statValue('doneTasks')
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, here&apos;s your overview</p>
        </div>
        <Button onClick={() => navigate('/projects')}>
          <FiPlus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-slide-up" style={{ animationDelay: '350ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Task Distribution</h3>
          <div className="space-y-3">
            {taskDistItems.map(item => {
              const pct = Math.round((item.value / taskDistTotal) * 100)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{item.value} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className={`h-2 ${statusBarBg[item.label]} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${barColorMap[item.label]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {priorityDistItems.map(item => {
              const pct = Math.round((item.value / priorityDistTotal) * 100)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{item.value} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className={`h-2 ${priorityBarBg[item.label]} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${priorityBarColorMap[item.label]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-slide-up" style={{ animationDelay: '450ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Completion Rate</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none" stroke="#F1F5F9" strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none" stroke="#6366F1" strokeWidth="3"
                  strokeDasharray={`${completionPct} ${100 - completionPct}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 tabular-nums">
                {completionPct}%
              </span>
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700 tabular-nums">{doneTasks}</span> of <span className="font-semibold text-gray-700 tabular-nums">{totalTasks}</span> tasks done
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiList className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
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
                  <div className="skeleton" style={{ width: '60%', height: '12px' }} />
                  <div className="skeleton" style={{ width: '30%', height: '10px' }} />
                </div>
                <div className="skeleton" style={{ width: '60px', height: '22px' }} />
              </div>
            ))}
          </div>
        ) : recentTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Task</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 text-gray-900 font-medium">{task.title}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{task.project?.name ?? '-'}</td>
                    <td className="px-5 py-3.5">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignedTo.name} size="sm" />
                          <span className="text-gray-600 text-xs">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
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
