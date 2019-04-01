export interface User {
    id: string;
    name: string;
    photo: string;
    email: string;
    voted?: boolean;
    vote?: number;
}
