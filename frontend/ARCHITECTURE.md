# Frontend Architecture — QA Tracker

## 1. AuthContext + AuthProvider — Why Context instead of props?

**File:** `src/context/AuthContext.jsx` + `src/context/AuthProvider.jsx`

Authentication state (`user`, `token`) is needed by **many** components at different levels:

- `Navbar` — to show the user avatar and name
- `Sidebar` — to show the user section and handle logout
- `ProtectedRoute` — to check if logged in
- `Login/Register` — to set the auth state after login
- `Profile` — to display user details

If you passed these via **props**, you'd have to thread them through every component in between ("prop drilling"). For example: `App → MainLayout → Navbar`, and every component in that chain would need to accept and forward `user` and `token` even if they don't use them. Context avoids this by making the values directly available to any component that calls `useContext(AuthContext)`.

### Why split AuthContext and AuthProvider into two files?

The **Context** file (`AuthContext.jsx`) just creates and exports the context object. The **Provider** file (`AuthProvider.jsx`) contains the logic (state, effects, functions) and renders the `<AuthContext.Provider>`.

This separation solves a **lint rule**: `react-refresh/only-export-components`. If both the context and the provider were in one file, the Fast Refresh (HMR) plugin would complain because a file should only export components. Separating them keeps Fast Refresh working.

### Why is the token stored in both useState AND localStorage?

- **`useState`** makes React reactive — when `token` changes, every component using `useContext(AuthContext)` re-renders. If you only stored it in `localStorage`, components wouldn't know it changed until they manually checked.
- **`localStorage`** persists the token across browser refreshes. When the user reloads the page, React state resets to `null`, but `localStorage.getItem('token')` on line 7 retrieves it.

### What happens when the page is refreshed? (Auth restoration)

1. `useState(localStorage.getItem('token'))` — the token is immediately initialized from localStorage (synchronous).
2. `useState(true)` for `loading` — starts as `true` so the whole app waits.
3. The `useEffect` runs once on mount (`[]` deps):
   - If `storedToken` and `storedUser` exist, it sets them into state and then calls `/auth/profile` to verify the token is still valid with the server.
   - If the API call fails (401, network error), `logout()` clears everything.
   - `setLoading(false)` — now the app knows auth is resolved.
4. `ProtectedRoute` checks `loading` first: if still loading, it shows a full-page spinner. This prevents a flash of the login page on refresh.

---

## 2. Why is Axios called from a service file instead of directly in components?

**Files:** `src/api/axios.js`, `src/services/authService.js`, `projectService.js`, `taskService.js`, `dashboardService.js`

### Axios instance (`api/axios.js`)

Creates a **centralized** axios instance with:

- `baseURL: 'http://localhost:5050/api'` — every request automatically prepends this
- **Request interceptor** (runs before every request): reads `token` from localStorage and attaches `Authorization: Bearer <token>` header. Without this, you'd have to manually add the header in every single API call.
- **Response interceptor** (runs on errors): if the server returns `401`, it automatically clears auth and redirects to `/login`. This handles expired tokens globally — no component needs to check for 401 individually.

### Service files (e.g., `projectService.js`)

```js
export const getProjects = (params) => api.get('/projects', { params });
```

This is a thin **abstraction layer**. Benefits:

1. **Single place to change** — if the API endpoint changes from `/projects` to `/v2/projects`, you change one file, not every page that fetches projects.
2. **No duplication** — every page that needs projects imports `getProjects` instead of repeating `api.get(...)` with the same URL.
3. **Cleaner components** — a page only deals with data, not URL construction.

---

## 3. main.jsx — Why wrap `<App />` in `<AuthProvider>`?

**File:** `src/main.jsx`

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

`AuthProvider` uses React Context, which requires the provider to be **above** (ancestor of) all components that consume the context. By wrapping the entire `<App />`, every component in the app tree can `useContext(AuthContext)`.

If you put `AuthProvider` inside a component that renders conditionally (like inside a route), parts of the app might not have access to auth state.

---

## 4. ProtectedRoute — Why check `loading` first?

**File:** `src/routes/ProtectedRoute.jsx`

```jsx
if (loading) return <Loader fullPage />
if (!token) return <Navigate to="/login" replace />
return children
```

Without the `loading` check, on page refresh:

1. `token` starts as `null` (before `useState` picks up localStorage)
2. `ProtectedRoute` sees `!token` → immediately redirects to `/login`
3. Then AuthProvider resolves and sets the token
4. User is stuck at login even though they're authenticated

The `loading` state prevents this: the page shows a spinner until AuthProvider finishes checking localStorage and the server. Only then does `ProtectedRoute` decide to render or redirect.

### Why `replace` on Navigate?

`replace` replaces the current history entry instead of adding a new one. This prevents the user from pressing "Back" and landing on a page that immediately redirects them again — cleaner UX.

---

## 5. Why is state split into multiple useState calls?

**File:** `src/pages/Projects.jsx`

```jsx
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
```

Each state variable has a **different update frequency** and **different purpose**:

| State | Changes When | Reason for separate |
|---|---|---|
| `projects` | Fetch completes | The core data — needs its own setter |
| `loading` | Start/end of fetch | Controls loading UI — needs to update independently of data |
| `search`, `sort`, `page` | User interaction | Each triggers a re-fetch, but independently |
| `modalOpen` | User clicks create/edit/cancel | UI state, no relation to data |
| `editing` | User clicks edit | Determines if modal is create or edit mode |
| `form` | User types in fields | Changes on every keystroke — merging with other state would cause unnecessary re-renders |
| `formErrors` | Validation | Updates independently of form values |
| `saving` | Save request in-flight | Button loading state, unrelated to data |
| `deleteTarget` | User clicks delete | Controls ConfirmDialog visibility |
| `deleting` | Delete request in-flight | Button loading state |

If you grouped unrelated state into one object (e.g., `useState({ projects: [], loading: true, search: '' })`), updating `search` would cause a re-render for the entire object even though only the search input changed. Separate states let each piece change independently.

---

## 6. useEffect — Why is it needed for data fetching?

**File:** `src/pages/Dashboard.jsx`

```jsx
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
```

React components **render** (run the function body), then React commits the DOM, then **effects run**. You cannot `await` inside the component body because rendering must be synchronous and pure — no side effects.

- If you called `getDashboardStats()` directly in the component body, it would fire on every render, creating infinite loops.
- `useEffect` with `[]` (empty deps) ensures it runs **once after the first render** — the mount. This is the standard place for API calls.
- For `Projects.jsx`, the effect depends on `[page, search, sort]` — when the user changes the page, types a search, or changes sort order, the effect re-runs and fetches fresh data.

---

## 7. What happens when "Sign in" button is clicked?

**File:** `src/pages/Login.jsx`

1. `handleSubmit` is called (form `onSubmit`)
2. `e.preventDefault()` — prevents the browser from reloading the page (default form behavior)
3. `validate()` runs:
   - Checks `form.email` is not empty and matches email regex
   - Checks `form.password` is not empty and ≥ 6 chars
   - Sets `errors` state — if any errors exist, returns `false` and the form shows inline error messages
4. `setLoading(true)` — button shows spinner + "Signing in..."
5. `await loginAPI({ email, password })` — calls the service which posts to `/api/auth/login`
6. On success:
   - `login(res.data.user, res.data.token)` — AuthProvider stores user+token in state AND localStorage
   - `toast.success('Welcome back!')` — green toast popup
   - `navigate('/dashboard')` — React Router navigates to dashboard
7. On failure (wrong password, network error):
   - `toast.error(err.response?.data?.message || 'Invalid email or password...')` — shows the server's error message, or a fallback if no response
8. `finally { setLoading(false) }` — re-enables the button regardless of outcome

---

## 8. MainLayout — Why `min-h-[calc(100vh-4rem)]` on `<main>`?

**File:** `src/layouts/MainLayout.jsx`

The navbar is `sticky top-0 z-30` with `h-16` (4rem). `sticky` keeps it in the document flow (unlike `fixed`), so it naturally takes 4rem of vertical space. Without `min-h-[calc(100vh-4rem)]`, the `<main>` content area shrinks to fit its content. If the page has little content, there's empty space below — the background color (`bg-gray-50`) shows, but the layout looks incomplete. This min-height ensures the content area always stretches to fill the remaining viewport height.

---

## 9. Sidebar — Why fixed positioning on desktop and overlay on mobile?

**File:** `src/components/layout/Sidebar.jsx`

- **Desktop** (`hidden lg:block fixed top-0 left-0 h-screen z-30`): The sidebar stays visible at all times. Fixed positioning keeps it in place while the content scrolls beneath it.
- **Mobile** (`lg:hidden ... translate-x-0 / -translate-x-full`): The sidebar slides in from the left as an overlay. This saves screen real estate — a 256px sidebar on a 375px phone would leave almost no room for content. The backdrop overlay (`bg-black/50`) darkens the content to focus attention on the sidebar.

---

## 10. Data flow for creating a project

**File:** `src/pages/Projects.jsx`

1. User clicks "New Project" → `openCreate()` resets `editing` to `null`, `form` to empty, `formErrors` to `{}`, opens modal
2. User types in the modal fields → `onChange` updates `form` state
3. User clicks "Create Project" → `handleSave()`:
   - `validate()` checks name is not empty → shows inline error if empty
   - `setSaving(true)` → button shows loading spinner
   - `await createProject(form)` → service calls `POST /api/projects`
   - On success: close modal, `toast.success('Project created')`, `fetchProjects()` refreshes the list
   - On failure: `toast.error(...)` with server message
4. `fetchProjects()` sets `loading(true)`, fetches `GET /api/projects`, updates `projects` and `totalPages`

---

## 11. Why is the `action` prop on EmptyState either an object or a ReactNode?

**File:** `src/components/ui/EmptyState.jsx`

```jsx
const renderAction = () => {
  if (!action) return null
  if (typeof action === 'object' && action.label && action.onClick) {
    return <Button onClick={action.onClick}>{action.label}</Button>
  }
  return <div>{action}</div>
}
```

This is a **convenience pattern**. Sometimes you want a simple button in the empty state (just pass `{ label, onClick }`), and sometimes you want something custom (pass a full React element). The component handles both.

---

## 12. Why separate StatusBadge and PriorityBadge components instead of inline spans?

**Files:** `src/components/ui/StatusBadge.jsx`, `PriorityBadge.jsx`

These badges are used in **multiple places**: Dashboard (recent tasks table), ProjectDetails (kanban cards + table), and potentially future pages. Extracting them into components means:

1. The color mapping for each status/priority is defined **once** — change a color in one file, and it updates everywhere.
2. The styling (rounded-full, font-medium, padding) is consistent across the app.
3. You can't accidentally use `bg-slate-100` for one Todo badge and `bg-gray-100` for another.

---

## Summary of Architectural Layers

```
main.jsx                  ← Entry point, wraps everything in AuthProvider
│
App.jsx                   ← Routes + Toaster (global toast container)
│
├── Login / Register      ← Public pages (no layout)
│
├── ProtectedRoute        ← Gate: redirects to /login if no token
│   │
│   └── MainLayout        ← Fixed sidebar + sticky navbar wrapper
│       │
│       ├── Sidebar       ← Navigation links + user section
│       ├── Navbar        ← Title, bell icon, user dropdown
│       │
│       └── Pages         ← Dashboard, Projects, ProjectDetails, Profile
│           │
│           └── Components ← Button, Input, Modal, etc.
│
├── services/             ← API call abstractions
│   └── api/axios.js      ← Centralized axios with interceptors
│
└── context/              ← Auth state (global, not prop-drilled)
```
