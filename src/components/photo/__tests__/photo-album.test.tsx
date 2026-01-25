import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import * as React from 'react'

// Store callbacks for manual triggering
let onLoadCallbacks: Array<() => void> = []

// Mock next/image to capture onLoad callbacks
vi.mock('next/image', () => ({
  default: function Image({
    src,
    alt,
    width,
    height,
    className,
    onLoad,
    unoptimized,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className?: string
    onLoad?: () => void
    unoptimized?: boolean
  }) {
    // Store the onLoad callback
    if (onLoad) {
      onLoadCallbacks.push(onLoad)
    }
    return React.createElement('img', {
      src,
      alt,
      width,
      height,
      className,
      'data-unoptimized': unoptimized ? 'true' : undefined,
    })
  },
}))

// Mock LoadingProgress
vi.mock('@/components/shared', () => ({
  LoadingProgress: function LoadingProgress({ value }: { value: number }) {
    return (
      <div data-testid="loading-progress" data-value={value}>
        Loading: {value}%
      </div>
    )
  },
}))

import { PhotoAlbum } from '../photo-album'

describe('PhotoAlbum', () => {
  beforeEach(() => {
    onLoadCallbacks = []
  })

  it('should render the component', () => {
    render(<PhotoAlbum />)
    expect(screen.getByTestId('loading-progress')).toBeInTheDocument()
  })

  it('should show loading progress initially', () => {
    render(<PhotoAlbum />)
    const progress = screen.getByTestId('loading-progress')
    expect(progress).toHaveAttribute('data-value', '0')
  })

  it('should render 97 images', () => {
    render(<PhotoAlbum />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(97)
  })

  it('should have correct image src pattern', () => {
    render(<PhotoAlbum />)
    const firstImage = screen.getAllByRole('img')[0]
    expect(firstImage).toHaveAttribute(
      'src',
      expect.stringContaining('cloudinary.com')
    )
    expect(firstImage).toHaveAttribute('src', expect.stringContaining('igpo-1.jpg'))
  })

  it('should have correct alt text for images', () => {
    render(<PhotoAlbum />)
    const firstImage = screen.getAllByRole('img')[0]
    expect(firstImage).toHaveAttribute('alt', 'Instagram post 1')
  })

  it('should initially show loading state', () => {
    render(<PhotoAlbum />)
    expect(screen.getByTestId('loading-progress')).toBeInTheDocument()
  })

  it('should initially hide images container', () => {
    const { container } = render(<PhotoAlbum />)
    const imageContainer = container.querySelector('.columns-1')
    expect(imageContainer).toHaveClass('invisible')
    expect(imageContainer).toHaveClass('h-0')
  })

  it('should have masonry grid layout', () => {
    const { container } = render(<PhotoAlbum />)
    const grid = container.querySelector('.columns-1')
    expect(grid).toHaveClass('sm:columns-2')
    expect(grid).toHaveClass('lg:columns-3')
    expect(grid).toHaveClass('xl:columns-4')
  })

  it('should have rounded corners on images', () => {
    render(<PhotoAlbum />)
    const firstImage = screen.getAllByRole('img')[0]
    expect(firstImage).toHaveClass('rounded-2xl')
  })

  it('should have gap styling for grid', () => {
    const { container } = render(<PhotoAlbum />)
    const grid = container.querySelector('.columns-1')
    expect(grid).toHaveClass('gap-4')
  })

  it('should wrap each image in a break-inside-avoid container', () => {
    const { container } = render(<PhotoAlbum />)
    const imageContainers = container.querySelectorAll('.break-inside-avoid')
    expect(imageContainers.length).toBe(97)
  })

  it('should have correct image dimensions', () => {
    render(<PhotoAlbum />)
    const firstImage = screen.getAllByRole('img')[0]
    expect(firstImage).toHaveAttribute('width', '400')
    expect(firstImage).toHaveAttribute('height', '500')
  })

  it('should use unoptimized images', () => {
    render(<PhotoAlbum />)
    const firstImage = screen.getAllByRole('img')[0]
    expect(firstImage).toHaveAttribute('data-unoptimized', 'true')
  })

  it('should have container styling', () => {
    const { container } = render(<PhotoAlbum />)
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('container')
    expect(mainContainer).toHaveClass('mx-auto')
    expect(mainContainer).toHaveClass('px-4')
    expect(mainContainer).toHaveClass('py-8')
  })

  it('should update progress when an image loads', async () => {
    render(<PhotoAlbum />)

    // Trigger first image load
    await act(async () => {
      onLoadCallbacks[0]()
    })

    const progress = screen.getByTestId('loading-progress')
    const value = parseFloat(progress.getAttribute('data-value') || '0')
    expect(value).toBeCloseTo((1 / 97) * 100, 1)
  })

  it('should hide loading and show images when all images load', async () => {
    const { container } = render(<PhotoAlbum />)

    // Trigger all image loads
    await act(async () => {
      onLoadCallbacks.forEach((callback) => callback())
    })

    // Loading should be hidden
    expect(screen.queryByTestId('loading-progress')).not.toBeInTheDocument()

    // Images container should be visible
    const imageContainer = container.querySelector('.columns-1')
    expect(imageContainer).not.toHaveClass('invisible')
  })

  it('should calculate progress correctly for partial loads', async () => {
    render(<PhotoAlbum />)

    // Load 10 images
    await act(async () => {
      for (let i = 0; i < 10; i++) {
        onLoadCallbacks[i]()
      }
    })

    const progress = screen.getByTestId('loading-progress')
    const value = parseFloat(progress.getAttribute('data-value') || '0')
    expect(value).toBeCloseTo((10 / 97) * 100, 1)
  })

  it('should reach 100% progress when all images load', async () => {
    render(<PhotoAlbum />)

    // Load all 97 images - this will trigger setLoading(false)
    await act(async () => {
      onLoadCallbacks.forEach((callback) => callback())
    })

    // After all images load, loading should be hidden
    expect(screen.queryByTestId('loading-progress')).not.toBeInTheDocument()
  })

  it('should increment loaded count for each image load', async () => {
    render(<PhotoAlbum />)

    // Load first 5 images
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        onLoadCallbacks[i]()
      }
    })

    const progress = screen.getByTestId('loading-progress')
    const value = parseFloat(progress.getAttribute('data-value') || '0')
    expect(value).toBeCloseTo((5 / 97) * 100, 1)
  })

  it('should show images container after loading completes', async () => {
    const { container } = render(<PhotoAlbum />)

    // Initially hidden
    const imageContainer = container.querySelector('.columns-1')
    expect(imageContainer).toHaveClass('invisible')

    // Load all images
    await act(async () => {
      onLoadCallbacks.forEach((callback) => callback())
    })

    // Now visible
    expect(imageContainer).not.toHaveClass('invisible')
  })
})
