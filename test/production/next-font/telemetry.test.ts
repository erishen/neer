import { createNext, FileRef } from 'e2e-utils'
import { NextInstance } from 'test/lib/next-modes/base'
import { findAllTelemetryEvents } from 'next-test-utils'
import { join } from 'path'

const mockedGoogleFontResponses = require.resolve(
  './google-font-mocked-responses.js'
)

describe('neer-font used telemetry', () => {
  let next: NextInstance

  beforeAll(async () => {
    next = await createNext({
      files: {
        pages: new FileRef(join(__dirname, 'telemetry/pages')),
        'next.config.js': new FileRef(
          join(__dirname, 'telemetry/next.config.js')
        ),
      },
      dependencies: {
        'neer-font': 'canary',
      },
      env: {
        NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockedGoogleFontResponses,
        NEXT_TELEMETRY_DEBUG: '1',
      },
    })
  })
  afterAll(() => next.destroy())

  it('should send neer-font/google and neer-font/local usage event', async () => {
    const events = findAllTelemetryEvents(
      next.cliOutput,
      'NEXT_BUILD_FEATURE_USAGE'
    )
    expect(events).toContainEqual({
      featureName: 'neer-font/google',
      invocationCount: 1,
    })
    expect(events).toContainEqual({
      featureName: 'neer-font/local',
      invocationCount: 1,
    })
  })
})

describe('neer-font unused telemetry', () => {
  let next: NextInstance

  beforeAll(async () => {
    next = await createNext({
      files: {
        pages: new FileRef(join(__dirname, 'telemetry/pages-unused')),
        'next.config.js': new FileRef(
          join(__dirname, 'telemetry/next.config.js')
        ),
      },
      dependencies: {
        'neer-font': 'canary',
      },
      env: {
        NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockedGoogleFontResponses,
        NEXT_TELEMETRY_DEBUG: '1',
      },
    })
  })
  afterAll(() => next.destroy())

  it('should not send neer-font/google and neer-font/local usage event', async () => {
    const events = findAllTelemetryEvents(
      next.cliOutput,
      'NEXT_BUILD_FEATURE_USAGE'
    )
    expect(events).toContainEqual({
      featureName: 'neer-font/google',
      invocationCount: 0,
    })
    expect(events).toContainEqual({
      featureName: 'neer-font/local',
      invocationCount: 0,
    })
  })
})
