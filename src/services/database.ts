import * as nano from 'nano';

interface ConnectionConfiguration {
    payload: {
        username: string;
        password: string;
        url: string;
    }
};

export class Database {
    private _connection: nano.ServerScope | undefined;

    public async up(config: ConnectionConfiguration, cookie?: string): Promise<nano.InfoResponse> {
        try {
            let connect: { url: string, cookie?: string } = { url: config.payload.url };

            if (cookie) {
                connect['cookie'] = cookie;
            }

            const database = nano(connect);

            const info = await database.info();

            this._connection = database;

            return Promise.resolve<nano.InfoResponse>(info);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async auth(config: ConnectionConfiguration, onSuccess: Function, onFailure: Function): Promise<void> {
        if (!this._connection) {
            return Promise.reject({ message: 'Connection not yet established.' });
        }

        this._connection.auth(config.payload.username, config.payload.password, (error, body, headers) => {
            if (error) {
                onFailure(error.message);

                return;
            }

            if (headers && headers['set-cookie'][0]) {
                onSuccess(headers['set-cookie'][0]);
            }
        });
    }

    public async session(url: string, cookie: string, onSuccess: Function, onFailure: Function): Promise<void> {
        if (!this._connection) {
            return Promise.reject({ message: 'Connection not yet established.' });
        }

        this._connection.session((error, session) => {
            if (error) {
                onFailure(error.message);

                return;
            }

            onSuccess(session);
        })
    }
}