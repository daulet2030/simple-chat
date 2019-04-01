import { Message } from './message.model';
export interface Chat {
    id: string;
    name: string;
    count: number;
    date?: any;
    messages?: Message[];
}
