import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserUI } from '@/types/user'
import { compareUsers } from '@/lib/leaderboard';

export async function GET() {
    try {
        let leaderboard = await prisma.user.findMany({
            include: {
                posts: true,
            },
        });
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));
        
        return NextResponse.json({ leaderboard: leaderboard.map((user) => {
            return {
                name: user.name,
                score: user.posts.length,
            } as UserUI;
        }) });
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}