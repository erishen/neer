/* eslint-env jest */
import { addBasePath } from 'neer/dist/client/add-base-path'

describe('router addBasePath', () => {
  it('should add basePath correctly when no basePath', () => {
    const result = addBasePath('/hello')
    expect(result).toBe('/hello')
  })
})
