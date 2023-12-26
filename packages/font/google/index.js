// Validate next version
const semver = require('neer/dist/compiled/semver')
if (semver.lt(require('neer/package.json').version, '13.0.0')) {
  throw new Error(
    '`neer-font` is only available in Next.js 13 and newer.'
  )
}

let message =
  'neer-font/google failed to run or is incorrectly configured.'
if (process.env.NODE_ENV === 'development') {
  message +=
    '\nIf you just installed `neer-font`, please try restarting `next dev` and resaving your file.'
}

message += `\n\nRead more: https://nextjs.org/docs/basic-features/font-optimization`

throw new Error(message)
