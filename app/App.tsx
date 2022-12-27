import React, { useEffect, useState } from 'react';
import { VSCode } from './api/vscode.model';
import { SidebarView } from './views/SidebarView';

const App: React.FC<{id: string}> = ({ id }) => {
    const [meta, setMeta] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.addEventListener('message', event => {
            console.log(event);

            switch (event.data.type) {
                case 'LOADING':
                    setLoading(event.data.payload.started);
                    break;
                case 'CONNECT':
                    setConnected(event.data.payload.connected);
                    setMeta(event.data.payload.info);
                    break;
            }
        });
    }, []);

    switch (id) {
        case 'couchdbVS-sidebar':
            return <SidebarView loading={loading} connected={connected} meta={meta} />;
    }

    return (
        <div>
            Not Found
        </div>
    );
}

export default App;