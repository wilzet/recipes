import { NextResponse } from 'next/server';
import { RecipeAllRequest, RecipeAllResponse } from '@/lib/types/recipe-all';
import { PostWithLinkAndAuthor, PostUI } from '@/types/post';
import prisma from '@/lib/prisma';

const toPostUI = (post: PostWithLinkAndAuthor) => {
    return {
        date: post.date,
        title: post.title,
        url: post.url.url,
        authorName: post.author.name,
        createDate: post.created,
        updateDate: post.updated,
    } as PostUI;
}

export async function POST(request: Request) {
    const data: RecipeAllRequest = await request.json();

    try {
        const posts = await prisma.post.findMany({
            where: {
                date: {
                    gte: data.startdate,
                    lte: data.enddate,
                },
            },
            include: {
                url: true,
                author: true,
            }
        });

        const postsUI = posts.map(post => toPostUI(post));

        return NextResponse.json({ posts: postsUI } as RecipeAllResponse);
    } catch (err: any) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' } as RecipeAllResponse, { status: 500 });
}