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
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiChevronRight, FiSliders } from 'react-icons/fi'

const statusStyles = {
  'active': 'bg-emerald-100 text-emerald-700',
  'completed': 'bg-blue-100 text-blue-700',
  'on hold': 'bg-amber-100 text-amber-700',
}

const statusBarColors = {
  'active': 'bg-emerald-500',
  'completed': 'bg-blue-500',
  'on hold': 'bg-amber-500',
}

const initialForm = { name: '', description: '', status: 'active' }

function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate()
  const badgeColor = statusStyles[project.status] || 'bg-gray-100 text-gray-700'
  const taskCount = project.taskCount ?? project.tasks?.length
  const doneCount = project.doneCount ?? 0

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-150 hover:border-gray-300 hover:shadow-md hover:-translate-y-px animate-slide-up group"
      onClick={() => navigate(`/projects/${project._id || project.id}`)}
    >
      <div className={`h-1 ${statusBarColors[project.status] || 'bg-gray-200'}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-2 h-2 rounded-full shrink-0 ${statusBarColors[project.status] || 'bg-gray-200'}`} />
            <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">{project.name}</h3>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(e, project) }}
              className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            ><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(e, project) }}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            ><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed pl-4.5">
          {project.description || 'No description'}
        </p>

        {taskCount > 0 && (
          <div className="mb-3 pl-4.5">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{doneCount}/{taskCount} tasks done</span>
              <span className="tabular-nums">{taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${taskCount > 0 ? (doneCount / taskCount) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badgeColor}`}>{project.status}</span>
            {project.createdBy?.name && <Avatar name={project.createdBy.name} size="sm" />}
          </div>
          <FiChevronRight className="w-3.5 h-3.5 text-gray-300" />
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

  const openCreate = () => { setEditing(null); setForm(initialForm); setFormErrors({}); setModalOpen(true) }

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
      if (editing) { await updateProject(editing._id || editing.id, form); toast.success('Project updated') }
      else { await createProject(form); toast.success('Project created') }
      setModalOpen(false)
      fetchProjects()
    } catch { toast.error(editing ? 'Failed to update project' : 'Failed to create project') }
    finally { setSaving(false) }
  }

  const confirmDelete = (e, project) => { e.stopPropagation(); setDeleteTarget(project) }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await deleteProject(deleteTarget._id || deleteTarget.id); toast.success('Project deleted'); setDeleteTarget(null); fetchProjects() }
    catch { toast.error('Failed to delete project') }
    finally { setDeleting(false) }
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' },
    { value: 'name', label: 'Name A-Z' }, { value: 'name_desc', label: 'Name Z-A' },
  ]

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 font-medium">Manage and organize your projects</p>
          <h1 className="text-2xl font-bold text-gray-900 -mt-0.5">Projects</h1>
        </div>
        <Button onClick={openCreate}><FiPlus className="w-4 h-4" />New Project</Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="w-full sm:w-64">
          <SearchBar value={search} onChange={handleSearch} placeholder="Search projects..." />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiSliders className="text-gray-400 w-4 h-4 shrink-0" />
          <select value={sort} onChange={handleSort} className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-1 skeleton" />
              <div className="p-4 space-y-3">
                <div className="skeleton" style={{ width: '75%', height: '16px' }} />
                <div className="skeleton" style={{ width: '100%', height: '12px' }} />
                <div className="skeleton" style={{ width: '50%', height: '12px' }} />
                <div className="flex justify-between pt-1"><div className="skeleton" style={{ width: '60px', height: '22px' }} /></div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FiFolder}
          title={search ? 'No projects found' : 'No projects yet'}
          description={search ? 'Try adjusting your search query.' : 'Get started by creating your first project.'}
          action={!search && <Button onClick={openCreate}><FiPlus className="w-4 h-4" />Create Project</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project, idx) => (
              <ProjectCard key={project._id || project.id} project={project} onEdit={openEdit} onDelete={confirmDelete} idx={idx} />
            ))}
          </div>
          {totalPages > 1 && <div className="mt-8"><Pagination page={page} pages={totalPages} onPageChange={setPage} /></div>}
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Create Project'} size="md">
        <div className="space-y-4">
          <Input label="Project Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={formErrors.name} placeholder="Enter project name" />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter project description (optional)" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Save Changes' : 'Create Project'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Project" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete" cancelText="Cancel" loading={deleting}
      />
    </MainLayout>
  )
}
