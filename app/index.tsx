import React from 'react';
import ReactDOM from 'react-dom/client';
import { VSCode } from './api/vscode.model';

import App from './App';

export const vscode: VSCode = window.acquireVsCodeApi();

const element = document.getElementById("root");

if (element) {
    const id = element.dataset.id;

    const root = ReactDOM.createRoot(element);
    root.render(<App id={id || 'undefined'} />);
}