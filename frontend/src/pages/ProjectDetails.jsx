import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import MainLayout from '../layouts/MainLayout'
import { getProjectById } from '../services/projectService'
import { getTaskByProject, createTask, updateTask, deleteTask } from '../services/taskService'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import SlideOver from '../components/ui/SlideOver'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import StatusBadge from '../components/ui/StatusBadge'
import PriorityBadge from '../components/ui/PriorityBadge'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import {
  FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiGrid, FiList,
  FiCalendar, FiUser, FiClock, FiCheckCircle
} from 'react-icons/fi'

const statuses = ['Todo', 'In Progress', 'QA', 'Done']

const statusDot = {
  'Todo': 'bg-slate-500',
  'In Progress': 'bg-blue-500',
  'QA': 'bg-violet-500',
  'Done': 'bg-emerald-500',
}

const statusText = {
  'Todo': 'text-slate-700',
  'In Progress': 'text-blue-700',
  'QA': 'text-violet-700',
  'Done': 'text-emerald-700',
}

const statusBg = {
  'Todo': 'bg-slate-50',
  'In Progress': 'bg-blue-50',
  'QA': 'bg-violet-50',
  'Done': 'bg-emerald-50',
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

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TaskCard({ task, onEdit, onDelete }) {
  const [dragging, setDragging] = useState(false)

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id || task.id)
    e.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  const handleDragEnd = () => {
    setDragging(false)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:border-gray-300 hover:shadow-sm group ${
        dragging ? 'opacity-50 shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{task.title}</h4>
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
            className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <FiEdit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task) }}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mb-2.5">
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between">
        {task.assignedTo ? (
          <Avatar name={task.assignedTo.name} size="sm" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
            <FiUser className="w-2.5 h-2.5 text-gray-400" />
          </div>
        )}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          {task.createdAt && (
            <span className="flex items-center gap-1">
              <FiCalendar className="w-2.5 h-2.5" />
              {formatDate(task.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DropColumn({ status, tasks, onEdit, onDelete, onDrop }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onDrop(taskId, status)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border transition-all duration-150 ${
        dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
      }`}
    >
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-b border-gray-200 ${statusBg[status]}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
          <span className={`text-sm font-semibold ${statusText[status]}`}>{status}</span>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded-md">
          {tasks.length}
        </span>
      </div>
      <div className={`px-3 pb-3 pt-3 space-y-2.5 min-h-[120px] ${statusBg[status]}`}>
        {tasks.map(task => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-xs text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}

function TaskDetailPanel({ task, onClose, onEdit, onDelete }) {
  if (!task) return null

  return (
    <SlideOver isOpen={!!task} onClose={onClose} title="Task Details">
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned to</p>
                <p className="text-sm font-medium text-gray-900">{task.assignedTo?.name || 'Unassigned'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(task.createdAt) || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiClock className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Updated</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(task.updatedAt) || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <Button variant="secondary" size="sm" onClick={() => { onEdit(task); onClose() }}>
            <FiEdit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => { onDelete(task); onClose() }}>
            <FiTrash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </SlideOver>
  )
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
  const [selectedTask, setSelectedTask] = useState(null)

  const loadData = useCallback(async () => {
    const [projectRes, taskRes] = await Promise.all([
      getProjectById(id),
      getTaskByProject(id),
    ])
    setProject(projectRes.data || projectRes || projectRes.project)
    setTasks(taskRes.data || taskRes || taskRes.tasks || [])
  }, [id])

  useEffect(() => {
    setLoading(true)
    loadData().catch(() => toast.error('Failed to load project details')).finally(() => setLoading(false))
  }, [loadData])

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
      loadData()
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
      setSelectedTask(null)
      loadData()
    } catch {
      toast.error('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  const handleDrop = useCallback(async (taskId, newStatus) => {
    const task = tasks.find(t => (t._id || t.id) === taskId)
    if (!task || task.status === newStatus) return

    setTasks(prev => prev.map(t =>
      (t._id || t.id) === taskId ? { ...t, status: newStatus } : t
    ))

    try {
      await updateTask(taskId, { ...task, status: newStatus, project: id })
      toast.success(`Moved to ${newStatus}`)
    } catch {
      toast.error('Failed to update task status')
      loadData()
    }
  }, [tasks, id, loadData])

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
        <div className="space-y-5">
          <div className="skeleton" style={{ width: 160, height: 20 }} />
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="skeleton" style={{ width: '60%', height: 24 }} />
            <div className="skeleton" style={{ width: '40%', height: 14 }} />
            <div className="flex gap-6 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ width: 60, height: 40 }} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="skeleton" style={{ width: 80, height: 20 }} />
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="skeleton" style={{ width: '100%', height: 80 }} />
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
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Project not found</h3>
          <p className="text-sm text-gray-500">The project you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5"
      >
        <FiChevronLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <h1 className="text-lg font-bold text-gray-900">{project.name}</h1>
              <StatusBadge status={project.status === 'active' ? 'In Progress' : project.status === 'completed' ? 'Done' : project.status === 'on hold' ? 'Todo' : project.status} />
            </div>
            <p className="text-sm text-gray-500 mb-3">{project.description || 'No description'}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {project.createdBy?.name && (
                <>
                  <Avatar name={project.createdBy.name} size="sm" />
                  <span className="text-gray-500">{project.createdBy.name}</span>
                  <span>·</span>
                </>
              )}
              {project.createdAt && <span>Created {formatDate(project.createdAt)}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 mt-4 border-t border-gray-200">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Todo', value: stats.todo },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'QA', value: stats.qa },
            { label: 'Done', value: stats.done },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-gray-900 tabular-nums">{stat.value}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <Button onClick={openCreate} size="sm">
          <FiPlus className="w-3.5 h-3.5" />
          Add Task
        </Button>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setView('kanban')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiGrid className="w-3.5 h-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiList className="w-3.5 h-3.5" />
            Table
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={FiCheckCircle}
          title="No tasks yet"
          description="Add your first task to get started."
          action={<Button onClick={openCreate}><FiPlus className="w-4 h-4" />Add Task</Button>}
        />
      ) : view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((status, idx) => {
            const columnTasks = getTasksByStatus(status)
            return (
              <div key={status} className="animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <DropColumn
                  status={status}
                  tasks={columnTasks}
                  onEdit={openEdit}
                  onDelete={confirmDelete}
                  onDrop={handleDrop}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr
                  key={task._id || task.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 py-3">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignedTo.name} size="sm" />
                        <span className="text-sm text-gray-500">{task.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(task.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(task) }}
                        className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); confirmDelete(task) }}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </Modal>

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={openEdit}
        onDelete={confirmDelete}
      />

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
    </MainLayout>
  )
}
