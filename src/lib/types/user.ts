export interface UserUI {
    name: string;
    score: number;
}

export type UserResponse = {
    user?: UserUI,
    error?: string,
}