import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { user: string } }) {
    console.log(`${params.user} wants to log in`);
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                name: params.user,
            },
            select: {
                name: true,
                score: true,
            },
        });
        
        return NextResponse.json({ user: user });
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function POST(request: Request, { params }: { params: { user: string } }) {
    console.log(`User: ${params.user}, wants to be created`);

    try {
        if (!params.user.match(/^[0-9A-Za-z]+$/) || params.user.length > 12) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

        const user = await prisma.user.upsert({
            where: {
                name: params.user,
            },
            update: {
            },
            create: {
                name: params.user,
            },
            select: {
                name: true,
            },
        });

        return NextResponse.json({ user: user });
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}