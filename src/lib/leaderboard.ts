import prisma from '@/lib/prisma';
import { calculateScore } from '@/lib/score';
import { UserWithPosts } from '@/types/user';
import { UserUI } from '@/types/user';

function compareUsers(userA: UserUI, userB: UserUI) {
    if (userA.score > userB.score) return -1;
    else if (userA.score < userB.score) return 1; 

    return 0;
}

export async function toUserUI(user: UserWithPosts) {
    const score = await calculateScore(user);
    return {
        name: user.name,
        score: score,
    } as UserUI;
}

async function getUsersasUserUI() {
    const leaderboard = await prisma.user.findMany({
        include: {
            posts: true,
        },
    });

    return leaderboard.map(async u => await toUserUI(u));
}

export async function getFullLeaderboard() {
    const leaderboard = await Promise.all(await getUsersasUserUI());
    return leaderboard.sort((a, b) => compareUsers(a, b));
}
