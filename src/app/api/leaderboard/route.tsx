import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import compareUsers from '@/lib/leaderboard';

export async function GET() {
    console.log('Leaderboard request');
    try {
        let leaderboard: User[] = await prisma.user.findMany();
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));
        
        return NextResponse.json({ leaderboard: leaderboard.map(({id, ...keepAttrs}) => keepAttrs) });
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}