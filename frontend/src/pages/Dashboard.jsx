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
  FiPlus, FiArrowRight, FiLayers, FiChevronRight
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

const barColors = {
  Todo: 'bg-slate-500',
  'In Progress': 'bg-blue-500',
  'QA': 'bg-violet-500',
  'Done': 'bg-emerald-500',
}

const barBgs = {
  Todo: 'bg-slate-100',
  'In Progress': 'bg-blue-100',
  'QA': 'bg-violet-100',
  'Done': 'bg-emerald-100',
}

const priorityBarColors = {
  Low: 'bg-gray-400',
  Medium: 'bg-amber-500',
  High: 'bg-orange-500',
  Critical: 'bg-red-500',
}

const priorityBarBgs = {
  Low: 'bg-gray-100',
  Medium: 'bg-amber-100',
  High: 'bg-orange-100',
  Critical: 'bg-red-100',
}

const taskColors = {
  Todo: 'border-l-slate-400 bg-slate-50/60',
  'In Progress': 'border-l-blue-400 bg-blue-50/60',
  'QA': 'border-l-violet-400 bg-violet-50/60',
  'Done': 'border-l-emerald-400 bg-emerald-50/60',
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

function DonutSegment({ pct, color, label, count, totalColor }) {
  if (totalColor === undefined) totalColor = color
  const circumference = 2 * Math.PI * 15.5
  const offset = circumference - (pct / 100) * circumference

  return (
    <circle
      cx="18" cy="18" r="15.5"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeDasharray={`${pct} ${100 - pct}`}
      strokeDashoffset={0}
      strokeLinecap="butt"
      className="transition-all duration-700 ease-out"
      style={{ stroke: color }}
    />
  )
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

  const donutColors = ['#6366F1', '#3B82F6', '#8B5CF6', '#22C55E']

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 font-medium">Manage and track your projects</p>
          <h1 className="text-2xl font-bold text-gray-900 -mt-0.5">Dashboard</h1>
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
            <div key={card.label} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <StatCard icon={card.icon} label={card.label} value={statValue(card.key)} color={card.color} />
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
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{item.value}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 h-3 ${barBgs[item.label]} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[item.label]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums w-8 text-right">{pct}%</span>
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
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{item.value}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 h-3 ${priorityBarBgs[item.label]} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${priorityBarColors[item.label]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums w-8 text-right">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-slide-up" style={{ animationDelay: '450ms' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Completion Rate</h3>
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none" stroke="#6366F1" strokeWidth="3"
                  strokeDasharray={`${completionPct} ${100 - completionPct}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{ stroke: '#6366F1' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 tabular-nums">
                {completionPct}%
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs mt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Done: {doneTasks}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                In Progress: {statValue('inProgressTasks')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Todo: {statValue('todoTasks')}
              </span>
            </div>
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
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full"
          >
            View all
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton" style={{ width: '60%', height: '12px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '10px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : recentTasks.length > 0 ? (
          <div className="p-4 space-y-2.5">
            {recentTasks.map((task) => {
              const cardStyle = taskColors[task.status] || 'border-l-gray-300 bg-white'
              return (
                <div
                  key={task._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-gray-100 border-l-4 cursor-pointer transition-all duration-150 hover:shadow-sm hover:-translate-y-px ${cardStyle}`}
                  onClick={() => navigate(`/projects/${task.project?._id || task.project}`)}
                >
                  {task.assignedTo ? (
                    <Avatar name={task.assignedTo.name} size="md" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <FiList className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                      <span className="text-xs text-gray-400">{task.project?.name ?? ''}</span>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              )
            })}
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
