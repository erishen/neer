import dynamic from 'neer/dynamic';
const DynamicComponent = dynamic(()=>import('../components/hello')
, {
    loadableGenerated: {
        webpack: ()=>[
                require.resolveWeak("../components/hello")
            ]
    }
});
