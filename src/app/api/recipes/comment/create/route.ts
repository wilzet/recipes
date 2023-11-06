import { NextResponse } from 'next/server';
import { CommentRequest, CommentResponse } from '@/types/comments';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function POST(request: Request) {
    const data: CommentRequest = await request.json();

    try {
        if (data.comment.title) {
            if (!data.comment.title.match(/^[0-9A-Za-z ]+$/) || data.comment.title.length > AppSettings.POSTTITLE_MAX_LENGTH) {
                return NextResponse.json({ error: 'Title bad' } as CommentResponse, { status: 400 });
            }
        }

        const comment = await prisma.comment.create({
            data: {
                title: data.comment.title,
                content: data.comment.content,
                rating: data.comment.rating,
                post: {
                    connect: {
                        id: data.comment.postID,
                    },
                },
                author: {
                    connect: {
                        name: data.comment.authorName,
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

/*curl -v -X POST http://localhost:3000/api/recipes/create -H "Content-Type: application/json" -d "{\"url\":\"0.0.0.0\",\"author\":\"aaaaa\"}"*/