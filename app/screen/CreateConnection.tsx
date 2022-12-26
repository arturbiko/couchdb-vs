import React, { useState } from 'react';

import Button from '../components/Button';
import { Value } from '../components/Select';

const AuthenticationOptions: Value[] = [
    {id: 0, value: 'jwt', label: 'JWT'}
];

const isValid = (username: string, password: string, url: string): boolean =>
    !!username && !!password && !!url;

const CreateConnection: React.FC<{ onConnect: Function, loading: boolean }> = ({ onConnect, loading }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setURL] = useState('');

    return (
        <div className="sidebar-provider">
            <p>
                Open a connection to a CouchDB instance. Please provide a suitable username and password combination
                along the defined HTTP interface and authentication method configured in your CouchDB instance.
            </p>

            <input
                disabled={loading}
                type="text" 
                name="username" 
                placeholder="Username" 
                onChange={(e) => setUsername(e.target.value)} 
            />

            <input 
                disabled={loading}
                type="password" 
                name="password" 
                placeholder="Password" onChange={(e) => setPassword(e.target.value)} 
            />

            <input 
                disabled={loading}
                type="text" 
                name="url" 
                placeholder="URL e.g. http://localhost:5984" onChange={(e) => setURL(e.target.value)} 
            />

            <Button 
                disabled={!isValid(username, password, url) || loading}
                onClick={() => {
                    onConnect({
                        username,
                        password,
                        url,
                    })
                }}
            >
                Authenticate
            </Button>
        </div>
    )
}

export default CreateConnection;