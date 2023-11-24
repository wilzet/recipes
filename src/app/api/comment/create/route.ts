import { NextResponse } from 'next/server';
import { CommentRequest, CommentResponse } from '@/types/comments';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function POST(request: Request) {
    const data: CommentRequest = await request.json();

    if (data.title && data.title.length > AppSettings.POSTTITLE_MAX_LENGTH) {
        return NextResponse.json({ error: 'Title bad' } as CommentResponse, { status: 400 });
    }

    try {
        if (data.rating || data.rating === 0) {
            await prisma.comment.upsert({
                where: {
                    id: data.id || -1,
                },
                update: {
                    rating: data.rating,
                },
                create: {
                    title: process.env.SECRET_RATING_ID,
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
        } else { 
            await prisma.comment.create({
                data: {
                    title: data.title,
                    content: data.content,
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
        }

        return NextResponse.json({} as CommentResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No author found' } as CommentResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as CommentResponse, { status: 500 });
}