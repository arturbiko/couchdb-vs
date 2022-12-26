import { Message } from "./message.model";

export type VSCode = {
    postMessage<T extends Message = Message>(message: T): void;
    getState(): any;
    setState(state: any): void;
};