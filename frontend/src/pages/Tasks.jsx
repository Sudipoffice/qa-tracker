import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { getTasks } from '../services/taskService'
import StatusBadge from '../components/ui/StatusBadge'
import PriorityBadge from '../components/ui/PriorityBadge'
import Avatar from '../components/ui/Avatar'
import Select from '../components/ui/Select'
import { FiSearch, FiSliders, FiX, FiChevronDown, FiMoreHorizontal, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'Todo', label: 'Todo' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'QA', label: 'QA' },
  { value: 'Done', label: 'Done' },
]

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
]

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
  { value: '-priority', label: 'Priority (High-Low)' },
  { value: 'priority', label: 'Priority (Low-High)' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function PriorityLabel({ value }) {
  const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
  const dots = value ? 4 - order[value] : 0
  return (
    <span className="text-xs text-gray-400 tabular-nums">{value}</span>
  )
}

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10, sort }
      if (statusFilter) params.status = statusFilter
      if (priorityFilter) params.priority = priorityFilter
      if (search.trim()) params.search = search.trim()
      const res = await getTasks(params)
      setTasks(res.data.tasks)
      setPagination(res.data.pagination)
    } catch {
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [page, sort, statusFilter, priorityFilter, search])

  useEffect(() => {
    const timer = setTimeout(() => fetchTasks(), 300)
    return () => clearTimeout(timer)
  }, [fetchTasks])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, priorityFilter, sort])

  const chips = []
  if (statusFilter) chips.push({ key: 'status', label: `Status: ${statusFilter}` })
  if (priorityFilter) chips.push({ key: 'priority', label: `Priority: ${priorityFilter}` })

  const clearChip = (key) => {
    if (key === 'status') setStatusFilter('')
    if (key === 'priority') setPriorityFilter('')
  }

  const clearAll = () => {
    setStatusFilter('')
    setPriorityFilter('')
    setSearch('')
  }

  const from = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const to = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-gray-400 font-medium">Track and manage all tasks</p>
          <h1 className="text-2xl font-bold text-gray-900 -mt-0.5">Tasks</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-gray-50 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 border border-gray-200"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FiX size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-36">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="w-full sm:w-36">
                <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  {priorityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="hidden sm:block w-32">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {chips.map(chip => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
                >
                  {chip.label}
                  <button onClick={() => clearChip(chip.key)} className="hover:text-indigo-900 ml-0.5">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 ml-1 font-medium">
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="skeleton" style={{ width: '35%', height: '14px' }} />
                <div className="skeleton" style={{ width: '12%', height: '14px' }} />
                <div className="skeleton" style={{ width: '12%', height: '14px' }} />
                <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                <div className="skeleton" style={{ width: '10%', height: '14px' }} />
              </div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-gray-200">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Assignee</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map(task => {
                  const menuOpen = openMenuId === task._id
                  return (
                    <tr
                      key={task._id}
                      className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/projects/${task.project?._id || task.project}`)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{task.title}</p>
                            {task.project?.name && (
                              <p className="text-[11px] text-gray-400 mt-0.5">{task.project.name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3.5">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={task.assignedTo.name} size="sm" />
                            <span className="text-sm text-gray-600 truncate max-w-[100px]">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-500 tabular-nums">{formatDate(task.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3.5 relative">
                        <button
                          onClick={e => { e.stopPropagation(); setOpenMenuId(menuOpen ? null : task._id) }}
                          className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <FiMoreHorizontal size={14} />
                        </button>
                        {menuOpen && (
                          <div className="absolute right-2 top-full mt-0.5 w-36 bg-white rounded-lg shadow-lg z-20 py-1 border border-gray-200 animate-slide-down">
                            <button
                              onClick={e => { e.stopPropagation(); navigate(`/projects/${task.project?._id || task.project}`) }}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              View details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <FiSliders className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400">No tasks found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 tabular-nums">
              Showing {from}–{to} of {pagination.total}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={15} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}