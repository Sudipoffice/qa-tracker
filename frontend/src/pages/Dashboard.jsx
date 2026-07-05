import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getDashboardStats } from '../services/dashboardService'
import StatCard from '../components/ui/StatCard'
import {
  FiFolder, FiCheckCircle, FiClock, FiBarChart2, FiTarget, FiAlertTriangle, FiList
} from 'react-icons/fi'

const barColors = {
  Todo: 'bg-slate-400',
  'In Progress': 'bg-sky-400',
  QA: 'bg-purple-400',
  Done: 'bg-emerald-400',
}

const statusStyles = {
  Todo: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-sky-100 text-sky-700',
  QA: 'bg-purple-100 text-purple-700',
  Done: 'bg-emerald-100 text-emerald-700',
}

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-rose-100 text-rose-700',
}

const barPriorityColors = {
  Low: 'bg-slate-400',
  Medium: 'bg-amber-400',
  High: 'bg-orange-400',
  Critical: 'bg-rose-400',
}

const statCardsMeta = [
  { label: 'Total Projects', key: 'totalProjects', icon: FiFolder, color: 'indigo' },
  { label: 'Total Tasks', key: 'totalTasks', icon: FiCheckCircle, color: 'blue' },
  { label: 'To Do', key: 'todoTasks', icon: FiClock, color: 'indigo' },
  { label: 'In Progress', key: 'inProgressTasks', icon: FiBarChart2, color: 'blue' },
  { label: 'QA', key: 'qaTasks', icon: FiTarget, color: 'purple' },
  { label: 'Done', key: 'doneTasks', icon: FiCheckCircle, color: 'green' },
  { label: 'High Priority', key: 'highPriority', icon: FiAlertTriangle, color: 'yellow' },
  { label: 'Critical', key: 'criticalPriority', icon: FiAlertTriangle, color: 'red' },
]

const accentColors = {
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-rose-500',
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-lg bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  )
}

function SkeletonBar() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded flex-shrink-0" />
      <div className="h-4 flex-1 bg-gray-100 rounded-full" />
      <div className="h-3 w-8 bg-gray-200 rounded flex-shrink-0" />
    </div>
  )
}

function SkeletonTableRow() {
  return (
    <tr className="animate-pulse border-b last:border-0">
      <td className="py-3.5"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
      <td className="py-3.5"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
      <td className="py-3.5"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
      <td className="py-3.5"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
    </tr>
  )
}

function BarChart({ title, items }) {
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map(item => {
          const pct = Math.round((item.value / max) * 100)
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.barColor} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-8 text-right flex-shrink-0">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
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

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <div className="space-y-6">
          <div className="animate-pulse space-y-2">
            <div className="h-7 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-100 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonBar key={i} />)}
            </div>
            <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonBar key={i} />)}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-5 space-y-1">
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-4" />
            <table className="w-full">
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </MainLayout>
    )
  }

  const hasStats = stats && stats.totalProjects !== undefined
  const statValue = (key) => stats?.[key] ?? 0

  const taskDistItems = [
    { label: 'Todo', value: statValue('todoTasks'), barColor: barColors.Todo },
    { label: 'In Progress', value: statValue('inProgressTasks'), barColor: barColors['In Progress'] },
    { label: 'QA', value: statValue('qaTasks'), barColor: barColors.QA },
    { label: 'Done', value: statValue('doneTasks'), barColor: barColors.Done },
  ]

  const priorityDistItems = [
    { label: 'Low', value: statValue('lowPriority'), barColor: barPriorityColors.Low },
    { label: 'Medium', value: statValue('mediumPriority'), barColor: barPriorityColors.Medium },
    { label: 'High', value: statValue('highPriority'), barColor: barPriorityColors.High },
    { label: 'Critical', value: statValue('criticalPriority'), barColor: barPriorityColors.Critical },
  ]

  const recentTasks = stats?.recentTasks ?? []

  return (
    <MainLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, here&apos;s your overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCardsMeta.map((card, idx) => (
          <div
            key={card.label}
            className="relative stat-card-enter"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${accentColors[card.color] || 'bg-indigo-500'}`} />
            <StatCard
              icon={card.icon}
              label={card.label}
              value={statValue(card.key)}
              color={card.color}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow p-5 animate-fade-in">
          <BarChart title="Task Distribution" items={taskDistItems} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow p-5 animate-fade-in">
          <BarChart title="Priority Distribution" items={priorityDistItems} />
        </div>
      </div>

      {recentTasks.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <FiList className="h-5 w-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 pr-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Task</th>
                  <th className="pb-3 pr-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-3 pr-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Priority</th>
                  <th className="pb-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Project</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 pr-4 text-gray-900 font-medium">{task.title}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status] || 'bg-gray-100 text-gray-700'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-600">{task.project?.name ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        hasStats && (
          <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-10 text-center animate-fade-in">
            <FiList className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No recent tasks yet</p>
            <p className="text-xs text-gray-400 mt-1">Tasks will appear here as they are created.</p>
          </div>
        )
      )}
    </MainLayout>
  )
}
