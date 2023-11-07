import { NextResponse } from 'next/server';
import { CommentRequest, CommentResponse } from '@/types/comments';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: CommentRequest = await request.json();

    if (!data.id) return NextResponse.json({ error: 'No comment found' } as CommentResponse, { status: 400 });

    try {
        await prisma.comment.delete({
            where: {
                id: data.id,
                author: {
                    name: data.authorName,
                },
            },
        });

        return NextResponse.json({} as CommentResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No author found' } as CommentResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as CommentResponse, { status: 500 });
}