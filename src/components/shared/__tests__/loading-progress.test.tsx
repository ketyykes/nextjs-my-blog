import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingProgress } from '../loading-progress'

describe('LoadingProgress', () => {
  it('should render the progress component', () => {
    render(<LoadingProgress value={50} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should display the correct percentage', () => {
    render(<LoadingProgress value={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should round the percentage', () => {
    render(<LoadingProgress value={33.7} />)
    expect(screen.getByText('34%')).toBeInTheDocument()
  })

  it('should clamp value to minimum 0', () => {
    render(<LoadingProgress value={-10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('should clamp value to maximum 100', () => {
    render(<LoadingProgress value={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should display loading text', () => {
    render(<LoadingProgress value={50} />)
    expect(screen.getByText('載入圖片中...')).toBeInTheDocument()
  })

  it('should render SVG circles', () => {
    const { container } = render(<LoadingProgress value={50} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(2)
  })

  it('should apply correct strokeDasharray', () => {
    const { container } = render(<LoadingProgress value={50} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    expect(progressCircle).toHaveAttribute('stroke-dasharray', '251.2')
  })

  it('should calculate correct strokeDashoffset for 0%', () => {
    const { container } = render(<LoadingProgress value={0} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    // 251.2 - (251.2 * 0 / 100) = 251.2
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', '251.2')
  })

  it('should calculate correct strokeDashoffset for 100%', () => {
    const { container } = render(<LoadingProgress value={100} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    // 251.2 - (251.2 * 100 / 100) = 0
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', '0')
  })

  it('should calculate correct strokeDashoffset for 50%', () => {
    const { container } = render(<LoadingProgress value={50} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    // 251.2 - (251.2 * 50 / 100) = 125.6
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', '125.6')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <LoadingProgress value={50} className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should have correct base classes', () => {
    const { container } = render(<LoadingProgress value={50} />)
    expect(container.firstChild).toHaveClass('flex')
    expect(container.firstChild).toHaveClass('flex-col')
    expect(container.firstChild).toHaveClass('items-center')
  })

  it('should have correct SVG dimensions', () => {
    const { container } = render(<LoadingProgress value={50} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('h-24')
    expect(svg).toHaveClass('w-24')
  })

  it('should have transition class on progress circle', () => {
    const { container } = render(<LoadingProgress value={50} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    expect(progressCircle).toHaveClass('transition-all')
  })
})
