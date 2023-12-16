import { NextResponse } from 'next/server';
import { LeaderboardRequest, LeaderboardResponse } from '@/types/leaderboard';
import { getUserUILeaderboard } from '@/lib/leaderboard';

export async function POST(request: Request) {
    const data: LeaderboardRequest = await request.json();

    try {
        let leaderboard = await getUserUILeaderboard();
        
        if (data.length && data.length > 0) {
            const length = Math.min(data.length, leaderboard.length);
            leaderboard = leaderboard.slice(0, length);
        }

        return NextResponse.json({ leaderboard: leaderboard } as LeaderboardResponse);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as LeaderboardResponse, { status: 500 });
}