import { User } from '../auth/user.model';
export interface Poker {
    id: string;
    name: string;
    count: number;
    date?: any;
    users?: User[];
    pokerFinished?: boolean;
    totalVote?: number;
    createdBy: string;
}
