import dynamic from 'neer/dynamic';
const DynamicComponent = dynamic(()=>import('../components/hello')
, {
    loadableGenerated: {
        modules: [
            "some-file.js -> " + "../components/hello"
        ]
    }
});
