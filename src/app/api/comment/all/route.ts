import { NextResponse } from 'next/server';
import { CommentsAllRequest, CommentsAllResponse } from '@/types/comments-all';
import { toCommentUI } from '@/types/comments';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: CommentsAllRequest = await request.json();

    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId: data.postID,
                author: {
                    name: data.author,
                },
            },
            include: {
                post: true,
                author: true,
            }
        });

        const commentsUI = comments.map(comment => toCommentUI(comment));

        return NextResponse.json({ comments: commentsUI } as CommentsAllResponse);
    } catch (err: any) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as CommentsAllResponse, { status: 500 });
}