import nano from 'nano';
import React, { useState } from 'react';
import { vscode } from '..';
import { ConnectionConfiguration } from '../api/connection.model';
import MetaInfo from '../elements/MetaInfo';
import CreateConnection from '../screen/CreateConnection';

interface IProps {
    loading: boolean; 
    connected: boolean;
    meta: nano.InfoResponse | null
}

export const SidebarView: React.FC<IProps> = ({ loading, connected, meta }) => {

    const openConnection = (config: ConnectionConfiguration) => {
        vscode.postMessage<{type: 'CONNECT', payload: ConnectionConfiguration}>({
            type: 'CONNECT',
            payload: config,
        });
    }

    return (
        <>
            <CreateConnection 
                loading={loading}
                connected={connected}
                onConnect={(config: ConnectionConfiguration) => openConnection(config)} 
            />
            { meta && <MetaInfo meta={meta} /> }
        </>
    )
}