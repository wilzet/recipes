import { UserWithPosts } from '@/types/userPosts';
import { UserUI } from './types/user';

export function compareUsers(userA: UserWithPosts, userB: UserWithPosts) {

    if (userA.posts.length > userB.posts.length) return -1;
    else if (userA.posts.length < userB.posts.length) return 1; 

    return userA.id < userB.id ? -1 : 1;
}

export function toUserUI(user: UserWithPosts) {
    return {
        name: user.name,
        score: user.posts.length,
    } as UserUI;
}