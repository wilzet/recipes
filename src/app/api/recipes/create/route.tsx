import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'
import compareUsers from '@/lib/leaderboard';

export async function POST(request: Request) {
    const data = await request.json();
    console.log(`${data.name} wants to change their score by: ${data.score}`);
    try {
        const updateUser = await prisma.user.update({
            where: {
                name: data.name,
                score: {
                    gte: -data.score,
                },
            },
            data: {
                score: {
                    increment: data.score,
                },
            },
            select: {
                name: true,
                score: true,
            },
        });
        let leaderboard: User[] = await prisma.user.findMany();
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));

        return NextResponse.json({user: updateUser, leaderboard: leaderboard.map(({id, ...keepAttrs}) => keepAttrs)});
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

/*curl -v -X POST http://localhost:3000/api/leaderboard/Erika -H "Content-Type: application/json" -d "{\"score\":1000000}"*/