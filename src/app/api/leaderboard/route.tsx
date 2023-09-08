import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { User } from '@/types/user';
const dataPath = './data/users.json';

export async function GET() {
    console.log('Leaderboard request');
    try {
        const users: User[] = await JSON.parse(readFileSync(dataPath, 'utf-8'));
        var leaderboard = users.map(({id: _, ...keepAttrs}) => keepAttrs);
        
        return NextResponse.json(leaderboard);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json('[]');
}

/*curl -v -X POST http://localhost:3000/api/leaderboard/Erika -H "Content-Type: application/json" -d "{\"score\":1000000}"*/