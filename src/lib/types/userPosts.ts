import { Post } from '@prisma/client';

export type UserWithPosts = {
    id: number,
    created: Date,
    name: string,
    posts: Post[],
}