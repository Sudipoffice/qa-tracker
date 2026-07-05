/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import MainLayout from '../layouts/MainLayout'
import { getProjectById } from '../services/projectService'
import { getTaskByProject, createTask, updateTask, deleteTask } from '../services/taskService'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import PriorityBadge from '../components/ui/PriorityBadge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiGrid, FiList } from 'react-icons/fi'

const statuses = ['Todo', 'In Progress', 'QA', 'Done']
const columnBg = {
  'Todo': 'bg-gray-50/50',
  'In Progress': 'bg-indigo-50/30',
  'QA': 'bg-amber-50/30',
  'Done': 'bg-emerald-50/30',
}

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
]

const statusOptions = [
  { value: 'Todo', label: 'Todo' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'QA', label: 'QA' },
  { value: 'Done', label: 'Done' },
]

const initialTaskForm = { title: '', description: '', priority: 'Medium', status: 'Todo' }

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('kanban')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(initialTaskForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [projectRes, taskRes] = await Promise.all([
        getProjectById(id),
        getTaskByProject(id),
      ])
      setProject(projectRes.data || projectRes || projectRes.project)
      setTasks(taskRes.data || taskRes || taskRes.tasks || [])
    } catch {
      toast.error('Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const validate = () => {
    const errors = {}
    if (!form.title.trim()) errors.title = 'Task title is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const openCreate = () => {
    setEditingTask(null)
    setForm(initialTaskForm)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      status: task.status || 'Todo',
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, project: id }
      if (editingTask) {
        await updateTask(editingTask._id || editingTask.id, payload)
        toast.success('Task updated')
      } else {
        await createTask(payload)
        toast.success('Task created')
      }
      setModalOpen(false)
      fetchData()
    } catch {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (task) => {
    setDeleteTarget(task)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteTask(deleteTarget._id || deleteTarget.id)
      toast.success('Task deleted')
      setDeleteTarget(null)
      fetchData()
    } catch {
      toast.error('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  const getTasksByStatus = (status) => tasks.filter(t => (t.status || 'Todo') === status)

  const stats = {
    total: tasks.length,
    todo: getTasksByStatus('Todo').length,
    inProgress: getTasksByStatus('In Progress').length,
    qa: getTasksByStatus('QA').length,
    done: getTasksByStatus('Done').length,
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <div className="h-7 w-2/3 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="flex gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-50/50 rounded-xl p-4 space-y-3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState title="Project not found" description="The project you're looking for doesn't exist." />
        </div>
      </MainLayout>
    )
  }

  const ownerName = project.creator?.name || project.owner?.name || 'Unknown'

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <FiChevronLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {project.description || 'No description'}
          </p>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              {getInitials(ownerName)}
            </div>
            <span className="text-sm text-gray-600">{ownerName}</span>
            {project.createdAt && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-400">Created {formatDate(project.createdAt)}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: 'Total Tasks', value: stats.total, color: 'text-gray-900' },
              { label: 'Todo', value: stats.todo, color: 'text-gray-600' },
              { label: 'In Progress', value: stats.inProgress, color: 'text-indigo-600' },
              { label: 'QA', value: stats.qa, color: 'text-amber-600' },
              { label: 'Done', value: stats.done, color: 'text-emerald-600' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Button onClick={openCreate}>
            <FiPlus className="w-4 h-4 mr-1.5" />
            Add Task
          </Button>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiGrid className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiList className="w-4 h-4" />
              Table
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Add your first task to get started."
            action={{ label: 'Add Task', onClick: openCreate }}
          />
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map(status => {
              const columnTasks = getTasksByStatus(status)
              return (
                <div key={status} className={`rounded-xl p-4 ${columnBg[status]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {status}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  {columnTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No tasks</p>
                  ) : (
                    <div className="space-y-2">
                      {columnTasks.map(task => (
                        <div
                          key={task._id || task.id}
                          className="bg-white rounded-lg border shadow-sm p-3 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-medium text-sm text-gray-900 mb-2">{task.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <StatusBadge status={task.status || 'Todo'} />
                            <PriorityBadge priority={task.priority || 'Medium'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold">
                              {getInitials(task.assignedTo?.name || task.assignee?.name || '')}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => openEdit(task)}
                                className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => confirmDelete(task)}
                                className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id || task.id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                    <td className="px-4 py-3"><StatusBadge status={task.status || 'Todo'} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={task.priority || 'Medium'} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{task.assignedTo?.name || task.assignee?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(task.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(task)}
                          className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(task)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create Task'} size="md">
          <div className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={formErrors.title}
              placeholder="Enter task title"
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter task description (optional)"
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={form.priority}
              onChange={(val) => setForm({ ...form, priority: val })}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>
                {editingTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          loading={deleting}
        />
      </div>
    </MainLayout>
  )
}
