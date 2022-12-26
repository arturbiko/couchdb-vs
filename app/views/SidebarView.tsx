import React, { useState } from 'react';
import Button from '../components/Button';
import CreateConnection from '../screen/CreateConnection';

export const SidebarView: React.FC = () => {

    const [connected, setConnected] = useState(false);

    const openConnection = () => {
        setConnected(true);
    }

    if (!connected) {
        return <CreateConnection />;
    }

    return (
        <>
            Undefined State
        </>
    )
}