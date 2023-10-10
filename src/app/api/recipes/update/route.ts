import { NextResponse } from 'next/server';
import { RecipePostRequest, RecipePostResponse } from '@/types/recipe-post';
import prisma from '@/lib/prisma';
import AppSettings from '@/lib/appsettings';

export async function POST(request: Request) {
    const data: RecipePostRequest = await request.json();

    if (!data.id) return NextResponse.json({ error: 'No post found' } as RecipePostResponse, { status: 400 });

    try {
        if (data.title) {
            if (!data.title.match(/^[0-9A-Za-z ]+$/) || data.title.length > AppSettings.POSTTITLE_MAX_LENGTH) {
                return NextResponse.json({ error: 'Title bad' } as RecipePostResponse, { status: 400 });
            }
        }

        await prisma.post.update({
            where: {
                id: data.id,
                author: {
                    name: data.author,
                },
            },
            data: {
                title: data.title,
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
                updated: new Date(),
            },
        });

        return NextResponse.json({});
    } catch (err: any) {
        console.error(err);
        if (err.code === 'P2025') {
            return NextResponse.json({ error: 'No author found' } as RecipePostResponse, { status: 400 });
        }
    }

    return NextResponse.json({ error: 'Internal Server Error' } as RecipePostResponse, { status: 500 });
}