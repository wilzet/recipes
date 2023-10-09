import { NextResponse } from 'next/server';
import { UserResponse } from '@/types/user'
import { toUserUI } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function GET(request: Request, { params }: { params: { user: string } }) {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                name: params.user,
            },
            include: {
                posts: true,
            },
        });

        return NextResponse.json({ user: toUserUI(user) } as UserResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            console.error('Cannot find user: ' + params.user)
            return NextResponse.json({ error: 'No user found' } as UserResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as UserResponse, { status: 500 });
}

export async function POST(request: Request, { params }: { params: { user: string } }) {
    try {
        if (!params.user.match(/^[0-9A-Za-z]+$/) || params.user.length > AppSettings.USERNAME_MAX_LENGTH) return NextResponse.json({ error: 'Invalid name' } as UserResponse, { status: 400 });

        const user = await prisma.user.upsert({
            where: {
                name: params.user,
            },
            update: {},
            create: {
                name: params.user,
            },
            include: {
                posts: true,
            },
        });

        return NextResponse.json({ user: toUserUI(user) } as UserResponse);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as UserResponse, { status: 500 });
}