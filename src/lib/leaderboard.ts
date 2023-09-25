import prisma from '@/lib/prisma';
import { UserWithPosts } from '@/types/user';
import { UserUI } from '@/types/user';

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

export async function getFullLeaderboard() {
    const leaderboard = await prisma.user.findMany({
        include: {
            posts: true,
        },
    });

    return leaderboard.sort((a, b) => compareUsers(a, b));
}

export async function getUserUILeaderboard() {
    const leaderboard = await getFullLeaderboard();
    return leaderboard.map(u => toUserUI(u));
}