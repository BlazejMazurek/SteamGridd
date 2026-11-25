import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// po każdym teście sprzątamy wyrenderowane komponenty i localStorage
afterEach(() => {
  cleanup()
  localStorage.clear()
})
