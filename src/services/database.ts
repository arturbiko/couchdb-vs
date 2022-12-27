import * as nano from 'nano';
import * as bluebird from 'bluebird';

interface ConnectionConfiguration {
    payload: {
        username: string;
        password: string;
        url: string;
    }
};

export class Database {
    private _connection: nano.ServerScope | undefined;

    public async up(config: ConnectionConfiguration): Promise<nano.InfoResponse> {
        try {
            const database = nano({url: config.payload.url});

            const info = await await database.info();

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
            }

            if (headers && headers['set-cookie'][0]) {
                onSuccess(headers['set-cookie'][0]);
            }
        });
    }
}