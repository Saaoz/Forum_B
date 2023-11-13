

export interface DecodedToken {
    id: number;
}

export interface UserData {
    username: string;
    password: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
}