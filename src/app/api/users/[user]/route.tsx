import { NextResponse } from 'next/server';
import { UserUI } from '@/types/user'
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { user: string } }) {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                name: params.user,
            },
            select: {
                name: true,
                posts: true,
            },
        });
        
        const retUser: UserUI = {
            name: user.name,
            score: user.posts.length,
        };

        return NextResponse.json({ user: retUser });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No user found' }, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function POST(request: Request, { params }: { params: { user: string } }) {
    try {
        if (!params.user.match(/^[0-9A-Za-z]+$/) || params.user.length > 10) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

        const user = await prisma.user.upsert({
            where: {
                name: params.user,
            },
            update: {},
            create: {
                name: params.user,
            },
            select: {
                name: true,
            },
        });

        return NextResponse.json({ username: user.name });
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}