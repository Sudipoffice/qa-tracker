const avatarColors = [
  'bg-indigo-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-violet-500',
  'bg-amber-500',
]

function hashCode(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const sizes = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-20 h-20 text-2xl',
}

export default function Avatar({ name = '', imageUrl, size = 'md' }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shrink-0`}
      />
    )
  }
  const colorIndex = hashCode(name) % avatarColors.length
  const initials = getInitials(name)
  return (
    <div
      className={`${sizes[size]} ${avatarColors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white shrink-0`}
      title={name}
    >
      {initials}
    </div>
  )
}
