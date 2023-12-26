import dynamic from 'neer/dynamic';
const DynamicComponentWithCustomLoading = dynamic(()=>import('../components/hello')
, {
    loadableGenerated: {
        webpack: ()=>[
                require.resolveWeak("../components/hello")
            ]
    },
    loading: ()=><p >...</p>
});
const DynamicClientOnlyComponent = dynamic(()=>import('../components/hello')
, {
    loadableGenerated: {
        webpack: ()=>[
                require.resolveWeak("../components/hello")
            ]
    },
    ssr: false
});
const DynamicClientOnlyComponentWithSuspense = dynamic(()=>import('../components/hello')
, {
    loadableGenerated: {
        webpack: ()=>[
                require.resolveWeak("../components/hello")
            ]
    },
    ssr: false,
    suspense: true
});
