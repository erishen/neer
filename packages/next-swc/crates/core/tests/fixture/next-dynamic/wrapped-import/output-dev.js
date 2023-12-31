import dynamic from 'neer/dynamic';
const DynamicComponent = dynamic(()=>handleImport(import('./components/hello'))
, {
    loadableGenerated: {
        modules: [
            "some-file.js -> " + "./components/hello"
        ]
    },
    loading: ()=>null
    ,
    ssr: false
});
