import { User } from '../auth/user.model';
export interface Voting {
    id: string;
    name: string;
    count: number;
    date?: any;
    users?: User[];
    votingFinished?: boolean;
    totalVote?: number;
    createdBy: string;
}
