import React, { useEffect } from 'react';
import { VSCode } from './api/vscode.model';
import { SidebarView } from './views/SidebarView';

const App: React.FC<{id: string}> = ({id}) => {

    const vscode: VSCode = window.acquireVsCodeApi();

    useEffect(() => {
        window.addEventListener('message', event => {
            console.log('Hello back!');
        });
    }, []);

    switch (id) {
        case 'couchdbVS-sidebar':
            return <SidebarView vscode={vscode} />;
    }

    return (
        <div>
            Not Found
        </div>
    );
}

export default App;