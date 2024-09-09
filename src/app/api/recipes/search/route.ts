import { NextResponse } from 'next/server';
import { RecipeSearchRequest, RecipeAllResponse } from '@/types/recipe-all';
import { toPostUI, removeDuplicatePost } from '@/types/post';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: RecipeSearchRequest = await request.json();

    try {
        const posts = await prisma.post.findMany({
            where: {
                OR: [{
                    title: {
                        contains: data.searchWord
                    }
                }, {
                    url: {
                        url: {
                            contains: data.searchWord
                        }
                    }
                }]
            },
            include: {
                url: true,
                author: true,
                comments: true,
            }
        });

        const postsUI = removeDuplicatePost(posts.map(post => toPostUI(post)));

        return NextResponse.json({ posts: postsUI } as RecipeAllResponse);
    } catch (err: any) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as RecipeAllResponse, { status: 500 });
}