import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import MainLayout from '../layouts/MainLayout'
import { getProjects, deleteProject, createProject, updateProject } from '../services/projectService'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import SearchBar from '../components/ui/SearchBar'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiChevronRight } from 'react-icons/fi'

const statusColors = {
  'active': 'bg-emerald-50 text-[#22C55E]',
  'completed': 'bg-blue-50 text-[#3B82F6]',
  'on hold': 'bg-amber-50 text-[#D97706]',
}

const statusBarColors = {
  'active': 'bg-[#22C55E]',
  'completed': 'bg-[#3B82F6]',
  'on hold': 'bg-[#F59E0B]',
}

const initialForm = { name: '', description: '', status: 'active' }

function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate()
  const badgeColor = statusColors[project.status] || 'bg-gray-100 text-gray-700'

  return (
    <div
      className="bg-white rounded-xl border border-[#EDEDF0] overflow-hidden cursor-pointer transition-all duration-150 hover:border-gray-200 hover:shadow-sm animate-slide-up"
      onClick={() => navigate(`/projects/${project._id || project.id}`)}
    >
      <div className={`h-1 ${statusBarColors[project.status] || 'bg-gray-200'}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{project.name}</h3>
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(e, project) }}
              className="p-1.5 rounded-md text-gray-400 hover:text-[#6C5CE7] hover:bg-[#F3EEFF] transition-colors"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(e, project) }}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {project.description || 'No description'}
        </p>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badgeColor}`}>
            {project.status}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FiChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = useCallback(async () => {
    const params = { page, limit: 12, sort }
    if (search.trim()) params.search = search.trim()
    const res = await getProjects(params)
    setProjects(res.data || res.projects || [])
    setTotalPages(res.totalPages || res.pages || 1)
  }, [page, search, sort])

  useEffect(() => {
    setLoading(true)
    fetchProjects().catch(() => toast.error('Failed to load projects')).finally(() => setLoading(false))
  }, [fetchProjects])

  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleSort = (e) => { setSort(e.target.value); setPage(1) }

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Project name is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const openCreate = () => {
    setEditing(null)
    setForm(initialForm)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (e, project) => {
    e.stopPropagation()
    setEditing(project)
    setForm({ name: project.name, description: project.description || '', status: project.status || 'active' })
    setFormErrors({})
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        await updateProject(editing._id || editing.id, form)
        toast.success('Project updated')
      } else {
        await createProject(form)
        toast.success('Project created')
      }
      setModalOpen(false)
      fetchProjects()
    } catch {
      toast.error(editing ? 'Failed to update project' : 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (e, project) => {
    e.stopPropagation()
    setDeleteTarget(project)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProject(deleteTarget._id || deleteTarget.id)
      toast.success('Project deleted')
      setDeleteTarget(null)
      fetchProjects()
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
  ]

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and organize your projects</p>
        </div>
        <Button onClick={openCreate}>
          <FiPlus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="w-full sm:w-64">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search projects..."
          />
        </div>
        <select
          value={sort}
          onChange={handleSort}
          className="w-full sm:w-auto px-3 py-2 text-sm border border-[#EDEDF0] rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#EDEDF0] overflow-hidden">
              <div className="h-1 skeleton" />
              <div className="p-4 space-y-3">
                <div className="skeleton" style={{ width: '75%', height: '16px' }} />
                <div className="skeleton" style={{ width: '100%', height: '12px' }} />
                <div className="skeleton" style={{ width: '50%', height: '12px' }} />
                <div className="flex justify-between pt-1">
                  <div className="skeleton" style={{ width: '60px', height: '22px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <FiFolder className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {search ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {search ? 'Try adjusting your search query.' : 'Get started by creating your first project.'}
          </p>
          {!search && (
            <Button onClick={openCreate}>
              <FiPlus className="w-4 h-4" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project._id || project.id}
                project={project}
                onEdit={openEdit}
                onDelete={confirmDelete}
                idx={idx}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-[#EDEDF0] text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-[#EDEDF0] text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Create Project'} size="md">
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
            placeholder="Enter project name"
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter project description (optional)"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-[#EDEDF0] rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
      />
    </MainLayout>
  )
}
