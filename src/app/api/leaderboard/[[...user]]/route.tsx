import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { User } from '@/types/user';
const dataPath = process.env.DATA_USERS_PATH as string;

function compareUsers(userA: User, userB: User) {
    if (userA.score > userB.score) return -1;
    else if (userA.score < userB.score) return 1; 

    return userA.id < userB.id ? -1 : 1;
}

export async function POST(request: Request, { params }: { params: { user: string[] } }) {
    if (!params.user || params.user.length !== 1) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

    const data = await request.json();
    console.log(`${params.user} wants to change their score by: ${data.score}`);
    
    try {
        let leaderboard: User[] = await JSON.parse(readFileSync(dataPath, 'utf-8', ));
        leaderboard.forEach((element) => {
            element.name === params.user[0] ? element.score + data.score >= 0 ? element.score += data.score : 1 : 1;
        });
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));
        writeFileSync(dataPath, JSON.stringify(leaderboard));

        return NextResponse.json(leaderboard.map(({id, ...keepAttrs}) => keepAttrs));
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function GET(request: Request, { params }: { params: { user: string[] } }) {
    if (params.user) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

    console.log('Leaderboard request');
    try {
        const users: User[] = await JSON.parse(readFileSync(dataPath, 'utf-8'));
        var leaderboard = users.map(({id: _, ...keepAttrs}) => keepAttrs);
        
        return NextResponse.json(leaderboard);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

/*curl -v -X POST http://localhost:3000/api/leaderboard/Erika -H "Content-Type: application/json" -d "{\"score\":1000000}"*/