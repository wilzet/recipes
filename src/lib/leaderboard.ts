import { UserWithPosts } from '@/types/userPosts';
import { User } from '@prisma/client';

export function compareUsers(userA: UserWithPosts, userB: UserWithPosts) {

    if (userA.posts.length > userB.posts.length) return -1;
    else if (userA.posts.length < userB.posts.length) return 1; 

    return userA.id < userB.id ? -1 : 1;
}