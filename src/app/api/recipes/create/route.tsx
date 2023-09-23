import { NextResponse } from 'next/server';
import { PostRequest, PostResponse } from '@/lib/types/post';
import { toUserUI } from '@/lib/leaderboard';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function POST(request: Request) {
    const data: PostRequest = await request.json();

    if (data.title) {
        if (data.title.replace(/[^A-Za-z0-9 ]/, '') === '' || data.title.length -1 > AppSettings.POSTTITLE_MAX_LENGTH) {
            return NextResponse.json({ error: 'Title bad' } as PostResponse, { status: 400 });
        }
    }

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

        const user = toUserUI(post.author);

        return NextResponse.json({ user: user } as PostResponse);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No author found' } as PostResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as PostResponse, { status: 500 });
}

/*curl -v -X POST http://localhost:3000/api/recipes/create -H "Content-Type: application/json" -d "{\"url\":\"0.0.0.0\",\"author\":\"aaaaa\"}"*/