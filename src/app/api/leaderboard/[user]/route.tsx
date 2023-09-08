import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { User } from '@/types/user';
const dataPath = './data/users.json';

function compareUsers(userA: User, userB: User) {
    if (userA.score > userB.score) return -1;
    else if (userA.score < userB.score) return 1; 

    return userA.id < userB.id ? -1 : 1;
}

export async function POST(request: Request, { params }: { params: { user: string } }) {
    const data = await request.json();
    console.log(`${params.user} wants to change their score by: ${data.score}`);
    
    try {
        let leaderboard: User[] = await JSON.parse(readFileSync(dataPath, 'utf-8', ));
        leaderboard.forEach((element) => {
            element.name === params.user ? element.score + data.score >= 0 ? element.score += data.score : 1 : 1;
        });
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));
        writeFileSync(dataPath, JSON.stringify(leaderboard));

        return NextResponse.json(leaderboard.map(({id, ...keepAttrs}) => keepAttrs));
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json('[]');
}