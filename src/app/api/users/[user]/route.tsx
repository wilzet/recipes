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