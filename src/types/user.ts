import { Post } from '@prisma/client';

export type UserWithPosts = {
    id: number,
    created: Date,
    name: string,
    posts: Post[],
}

export interface UserUI {
    name: string;
    score: number;
}

export type UserResponse = {
    user?: UserUI,
    error?: string,
}