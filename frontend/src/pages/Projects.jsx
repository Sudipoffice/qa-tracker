/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import MainLayout from '../layouts/MainLayout'
import { getProjects, deleteProject, createProject, updateProject } from '../services/projectService'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import SearchBar from '../components/ui/SearchBar'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { FiPlus, FiEdit2, FiTrash2, FiFolder } from 'react-icons/fi'

const statusColors = {
  'active': 'bg-indigo-500',
  'completed': 'bg-emerald-500',
  'on hold': 'bg-amber-500',
}

const statusBadgeColors = {
  'active': 'bg-indigo-100 text-indigo-700',
  'completed': 'bg-emerald-100 text-emerald-700',
  'on hold': 'bg-amber-100 text-amber-700',
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
]

const initialForm = { name: '', description: '', status: 'active' }

export default function Projects() {
  const navigate = useNavigate()
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

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12, sort }
      if (search.trim()) params.search = search.trim()
      const res = await getProjects(params)
      setProjects(res.data || res.projects || [])
      setTotalPages(res.totalPages || res.pages || 1)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sort])

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  const handleSort = (e) => {
    setSort(e.target.value)
    setPage(1)
  }

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

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="h-1.5 w-full bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              {projects.length}
            </span>
          </div>
          <Button onClick={openCreate}>
            <FiPlus className="w-4 h-4 mr-1.5" />
            New Project
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search projects..."
            />
          </div>
          <select
            value={sort}
            onChange={handleSort}
            className="w-full sm:w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={FiFolder}
            title="No projects found"
            description={search ? 'Try adjusting your search query.' : 'Get started by creating your first project.'}
            action={search ? null : { label: 'Create Project', onClick: openCreate }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map(project => {
                const accentColor = statusColors[project.status] || 'bg-gray-400'
                const badgeColor = statusBadgeColors[project.status] || 'bg-gray-100 text-gray-700'
                const creatorName = project.creator?.name || project.owner?.name || 'Unknown'
                return (
                  <div
                    key={project._id || project.id}
                    onClick={() => navigate(`/projects/${project._id || project.id}`)}
                    className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
                  >
                    <div className={`h-1.5 w-full rounded-t-xl ${accentColor}`} />
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {project.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex-shrink-0">
                          {getInitials(creatorName)}
                        </div>
                        <span className="text-xs text-gray-500 truncate">{creatorName}</span>
                        {project.createdAt && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400">{formatDate(project.createdAt)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                          {project.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => openEdit(e, project)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(e, project)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination page={page} pages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on hold">On Hold</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>
                {editing ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </div>
        </Modal>

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
      </div>
    </MainLayout>
  )
}
