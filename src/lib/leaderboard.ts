import prisma from '@/lib/prisma';
import { calculateScore } from '@/lib/score';
import { UserWithPosts } from '@/types/user';
import { UserUI } from '@/types/user';

function compareUsers(userA: UserWithPosts, userB: UserWithPosts) {
    if (userA.posts.length > userB.posts.length) return -1;
    else if (userA.posts.length < userB.posts.length) return 1; 

    return userA.id < userB.id ? -1 : 1;
}

export async function toUserUI(user: UserWithPosts) {
    const score = await calculateScore(user);
    return {
        name: user.name,
        score: score,
    } as UserUI;
}

async function getFullLeaderboard() {
    const leaderboard = await prisma.user.findMany({
        include: {
            posts: true,
        },
    });

    return leaderboard.sort((a, b) => compareUsers(a, b));
}

export async function getUserUILeaderboard() {
    const leaderboard = await getFullLeaderboard();
    return leaderboard.map(async u => await toUserUI(u));
}
