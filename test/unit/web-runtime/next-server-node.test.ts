import 'neer/dist/server/node-polyfill-fetch'

it('should be able to require next/server outside edge', () => {
  require('neer/server')
})
