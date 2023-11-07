import { NextResponse } from 'next/server';
import { CommentRequest, CommentResponse } from '@/types/comments';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function POST(request: Request) {
    const data: CommentRequest = await request.json();

    try {
        if (data.title) {
            if (!data.title.match(/^[0-9A-Za-z ]+$/) || data.title.length > AppSettings.POSTTITLE_MAX_LENGTH) {
                return NextResponse.json({ error: 'Title bad' } as CommentResponse, { status: 400 });
            }
        }

        await prisma.comment.create({
            data: {
                title: data.title,
                content: data.content,
                rating: data.rating,
                post: {
                    connect: {
                        id: data.postID,
                    },
                },
                author: {
                    connect: {
                        name: data.authorName,
                    },
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