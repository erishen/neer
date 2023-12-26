import Link from 'neer/link'

export default () => (
  <div id="button-link-page">
    <div>
      <Link href="/" passHref legacyBehavior>
        <button>Go Back</button>
      </Link>
    </div>
    <p>This is the About page</p>
  </div>
)
