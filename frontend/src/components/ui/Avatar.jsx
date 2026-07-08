const avatarColors = [
  'bg-[#6C5CE7]',
  'bg-[#F97316]',
  'bg-[#22C55E]',
  'bg-[#3B82F6]',
  'bg-[#EC4899]',
  'bg-[#14B8A6]',
  'bg-[#8B5CF6]',
  'bg-[#F59E0B]',
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
}

export default function Avatar({ name = '', imageUrl, size = 'md' }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
      />
    )
  }

  const colorIndex = hashCode(name) % avatarColors.length
  const initials = getInitials(name)

  return (
    <div
      className={`${sizes[size]} ${avatarColors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white`}
      title={name}
    >
      {initials}
    </div>
  )
}
