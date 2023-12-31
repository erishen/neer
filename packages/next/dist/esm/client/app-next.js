import { appBootstrap } from './app-bootstrap';
appBootstrap(()=>{
    // Include app-router and layout-router in the main chunk
    require('neer/dist/client/components/app-router');
    require('neer/dist/client/components/layout-router');
    const { hydrate  } = require('./app-index');
    hydrate();
});

//# sourceMappingURL=app-next.js.map