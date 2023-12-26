import dynamic from 'neer/dynamic'
const DynamicComponent = dynamic(() => handleImport(import('./components/hello')), {
  loading: () => null,
  ssr: false,
});