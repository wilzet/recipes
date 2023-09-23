import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeaderboardResponse } from '@/lib/types/leaderboard';
import { compareUsers, toUserUI } from '@/lib/leaderboard';

export async function GET() {
    try {
        let leaderboard = await prisma.user.findMany({
            include: {
                posts: true,
            },
        });
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));

        return NextResponse.json({ leaderboard: leaderboard.map(u => toUserUI(u)) } as LeaderboardResponse);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as LeaderboardResponse, { status: 500 });
}