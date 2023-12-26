import { webpack } from 'neer/dist/compiled/webpack/webpack'

const NoopLoader: webpack.LoaderDefinitionFunction = (source) => source
export default NoopLoader
