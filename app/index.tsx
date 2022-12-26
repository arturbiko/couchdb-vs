import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const element = document.getElementById("root");

if (element) {
    const id = element.dataset.id;

    const root = ReactDOM.createRoot(element);
    root.render(<App id={id || 'undefined'} />);
}