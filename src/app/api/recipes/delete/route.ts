import { NextResponse } from 'next/server';
import { RecipePostRequest, RecipePostResponse } from '@/types/recipe-post';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: RecipePostRequest = await request.json();

    if (!data.id) return NextResponse.json({ error: 'No post found' } as RecipePostResponse, { status: 400 });

    try {
        const post = await prisma.post.delete({
            where: {
                id: data.id,
                author: {
                    name: data.author,
                },
            },
        });

        try {
            await prisma.link.deleteMany({
                where: {
                    id: post?.urlId,
                    posts: {
                        none: {},
                    },
                },
            });

            await prisma.comment.deleteMany({
                where: {
                    postId: post?.id,
                }
            });
        } catch (err: any) {
            console.error(err);
        }

        return NextResponse.json({} as RecipePostResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No author found' } as RecipePostResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as RecipePostResponse, { status: 500 });
}