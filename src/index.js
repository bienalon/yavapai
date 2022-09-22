import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';

// import { WebMapView } from './components/WebMapView';
import { Frame } from './components/Frame';
//import { AppProvider } from './contexts/App';
import './css/main.css';

import registerServiceWorker from './registerServiceWorker';
import './esriWorkers';

ReactDOM.render(
    <CookiesProvider>
        <Frame />
    </CookiesProvider>,
    document.getElementById('root'),
);
registerServiceWorker();