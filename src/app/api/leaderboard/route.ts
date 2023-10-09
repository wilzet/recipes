import { NextResponse } from 'next/server';
import { LeaderboardResponse } from '@/lib/types/leaderboard';
import { getUserUILeaderboard } from '@/lib/leaderboard';

export async function GET() {
    try {
        const leaderboard = await getUserUILeaderboard();

        return NextResponse.json({ leaderboard: leaderboard } as LeaderboardResponse);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as LeaderboardResponse, { status: 500 });
}