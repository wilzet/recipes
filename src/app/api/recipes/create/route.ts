import { NextResponse } from 'next/server';
import { RecipePostRequest, RecipePostResponse } from '@/types/recipe-post';
import { toUserUI } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function POST(request: Request) {
    const data: RecipePostRequest = await request.json();

    if (data.title && data.title.length > AppSettings.POSTTITLE_MAX_LENGTH) {
        return NextResponse.json({ error: 'Title bad' } as RecipePostResponse, { status: 400 });
    }

    const oneYearForward = new Date();
    oneYearForward.setFullYear(oneYearForward.getFullYear() + 1);
    if (new Date(data.date) > oneYearForward) {
        return NextResponse.json({ error: 'Post is too far in the future' } as RecipePostResponse, { status: 400 });
    }

    try {
        const post = await prisma.post.create({
            data: {
                title: data.title,
                author: {
                    connect: {
                        name: data.author,
                    },
                },
                url: {
                    connectOrCreate: {
                        where: {
                            url: data.url,
                        },
                        create: {
                            url: data.url,
                        },
                    },
                },
                date: data.date,
            },
            include: {
                author: {
                    include: {
                        posts: true,
                    },
                },
            },
        });

        return NextResponse.json({ user: await toUserUI(post.author) } as RecipePostResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No author found' } as RecipePostResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as RecipePostResponse, { status: 500 });
}

/*curl -v -X POST http://localhost:3000/api/recipes/create -H "Content-Type: application/json" -d "{\"url\":\"0.0.0.0\",\"author\":\"aaaaa\"}"*/