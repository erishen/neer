/**
 * @jest-environment jsdom
 */
import React from 'react'
import { act, render } from '@testing-library/react'
import dynamic from 'neer/dynamic'

describe('neer/dynamic', () => {
  it('test dynamic with jest', () => {
    const App = dynamic(() => import('./fixtures/stub-components/hello'))
    act(() => {
      const { unmount } = render(<App />)
      unmount()
    })
  })
})
