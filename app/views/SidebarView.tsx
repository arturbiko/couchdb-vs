import React, { useState } from 'react';
import { ConnectionConfiguration } from '../api/connection.model';
import { VSCode } from '../api/vscode.model';
import CreateConnection from '../screen/CreateConnection';

export const SidebarView: React.FC<{ vscode: VSCode }> = ({ vscode }) => {

    const [connected, setConnected] = useState(false);

    const openConnection = (config: ConnectionConfiguration) => {
        vscode.postMessage<{type: 'CONNECT', payload: ConnectionConfiguration}>({
            type: 'CONNECT',
            payload: config,
        });
    }

    if (!connected) {
        return <CreateConnection 
                    loading={false}
                    onConnect={(config: ConnectionConfiguration) => openConnection(config)} 
                />;
    }

    return (
        <>
            Undefined State
        </>
    )
}