import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PostRequest, PostResponse } from '@/lib/types/post';
import { getUserUILeaderboard, toUserUI } from '@/lib/leaderboard';

export async function POST(request: Request) {
    const data: PostRequest = await request.json();
    console.log(data);
    try {
        const post = await prisma.post.create({
            data: {
                title: data.title ?? data.url,
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
            },
            include: {
                author: {
                    include: {
                        posts: true,
                    },
                },
            },
        });

        const user = toUserUI(post.author);
        const leaderboard = await getUserUILeaderboard();

        return NextResponse.json({ user: user, leaderboard: leaderboard } as PostResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No user found' } as PostResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as PostResponse, { status: 500 });
}

/*curl -v -X POST http://localhost:3000/api/recipes/create -H "Content-Type: application/json" -d "{\"url\":\"0.0.0.0\",\"author\":\"aaaaa\"}"*/