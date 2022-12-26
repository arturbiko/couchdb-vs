import React, { useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import Button from '../components/Button';
import Select from '../components/Select';

const CreateConnection: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setURL] = useState('');
    const [authentication, setAuthentication] = useState('');

    const setAuthenticationMethod = (value: string): void => {
        setAuthentication(value);
    } 

    return (
        <div className="sidebar-provider">
            <p>
                Open a connection to a CouchDB instance. Please provide a suitable username and password combination
                along the defined HTTP interface and authentication method configured in your CouchDB instance.
            </p>

            <input type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />

            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <input type="text" name="url" placeholder="URL e.g. http://localhost:5984" onChange={(e) => setURL(e.target.value)} />

            <div className="input-group">
                <Select 
                    options={[{id: 0, value: 'jwt', label: 'JWT'}]} 
                    onSelect={(value: string) => { setAuthenticationMethod(value) }} 
                    config={{disabled: true}} 
                />

                <HelpOutlineIcon />
            </div>

            <Button>
                Connect
            </Button>
        </div>
    )
}

export default CreateConnection;