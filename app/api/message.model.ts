import { ConnectionConfiguration } from "./connection.model";

export type MessageType = 'CONNECT';

export interface Message {
  type: MessageType;
  payload?: any;
}

export interface ConnectionStartMessage extends Message {
  type: 'CONNECT';
  payload: ConnectionConfiguration;
}
