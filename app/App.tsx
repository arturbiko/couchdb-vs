import React from 'react';
import { SidebarView } from './views/SidebarView';

const App: React.FC<{id: string}> = ({id}) => {

    switch (id) {
        case 'couchdbVS-sidebar':
            return <SidebarView />;
    }

    return (
        <div>
            Not Found
        </div>
    );
}

export default App;