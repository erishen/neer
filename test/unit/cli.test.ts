import { nextStart } from 'neer/dist/cli/next-start'
import httpMock, { Server } from 'http'

// Prevents bin from running
jest.mock('neer/dist/bin/next', () => ({}))
jest.mock('neer/dist/lib/get-project-dir', () => ({
  getProjectDir: () => '',
}))

jest.mock('http')

describe('start', () => {
  test('--keepAliveTimeout changes server.keepAliveTimeout when passed', () => {
    const server = {
      on: () => {},
      listen: () => {},
    } as any as Server
    ;(httpMock as any).createServer.mockReturnValue(server)

    expect(server.keepAliveTimeout).toBe(undefined)
    nextStart(['--keepAliveTimeout', '1234'])
    expect(server.keepAliveTimeout).toBe(1234)
  })

  test("--keepAliveTimeout doesn't change server.keepAliveTimeout when not passed", () => {
    const server = {
      on: () => {},
      listen: () => {},
    } as any as Server
    ;(httpMock as any).createServer.mockReturnValue(server)

    expect(server.keepAliveTimeout).toBe(undefined)
    nextStart([])
    expect(server.keepAliveTimeout).toBe(undefined)
  })
})
