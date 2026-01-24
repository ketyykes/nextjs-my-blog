'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PagerProps {
  currentPage: number
  totalPages: number
}

function PagerContent({ currentPage, totalPages }: PagerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return page === 1
      ? `/tech-page${queryString}`
      : `/tech-page/${page}${queryString}`
  }

  const handlePageChange = (page: number) => {
    router.push(getPageUrl(page))
  }

  // 計算要顯示的頁碼範圍
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    start = Math.max(1, end - maxVisible + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageUrl(Math.max(1, currentPage - 1))}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) handlePageChange(currentPage - 1)
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={getPageUrl(page)}
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(page)
              }}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={getPageUrl(Math.min(totalPages, currentPage + 1))}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) handlePageChange(currentPage + 1)
            }}
            className={
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function Pager({ currentPage, totalPages }: PagerProps) {
  return (
    <Suspense fallback={null}>
      <PagerContent currentPage={currentPage} totalPages={totalPages} />
    </Suspense>
  )
}
