import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional')
    expect(result).toBe('base conditional')
  })

  it('should filter out falsy values', () => {
    const result = cn('base', false && 'hidden', null, undefined, 'visible')
    expect(result).toBe('base visible')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle object syntax', () => {
    const result = cn({ 'text-red-500': true, 'text-blue-500': false })
    expect(result).toBe('text-red-500')
  })

  it('should handle array syntax', () => {
    const result = cn(['foo', 'bar'], 'baz')
    expect(result).toBe('foo bar baz')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle conflicting tailwind modifiers', () => {
    const result = cn('hover:bg-red-500', 'hover:bg-blue-500')
    expect(result).toBe('hover:bg-blue-500')
  })

  it('should preserve non-conflicting classes', () => {
    const result = cn('text-sm font-bold', 'text-center')
    expect(result).toBe('text-sm font-bold text-center')
  })

  it('should handle responsive modifiers', () => {
    const result = cn('sm:px-2', 'md:px-4', 'lg:px-6')
    expect(result).toBe('sm:px-2 md:px-4 lg:px-6')
  })
})
