import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function getPageNumbers(page, pages) {
  const delta = 1
  const range = []
  const rangeWithDots = []

  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
      range.push(i)
    }
  }

  let prev = 0
  for (const i of range) {
    if (prev) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1)
      } else if (i - prev !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    prev = i
  }

  return rangeWithDots
}

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  const pagesList = getPageNumbers(page, pages)

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>
      {pagesList.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2.5 py-1 text-sm rounded-lg transition-colors ${
              p === page
                ? 'bg-[#6C5CE7] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
