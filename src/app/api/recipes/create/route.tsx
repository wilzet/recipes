import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { UserUI } from '@/types/user';
import { PostReq, PostRes } from '@/lib/types/post-types';
import { compareUsers } from '@/lib/leaderboard';

export async function POST(request: Request) {
    const data: PostReq = await request.json();
    console.log(data);
    try {
        // const author = await prisma.user.findUnique({
        //     where: {
        //         name: data.author,
        //     }
        // });
        // if (!author) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

        // const createPost: Prisma.PostCreateInput = {
        //     title: data.title ?? data.url,
        //     author: {
        //         connect: {
        //             id: author.id,
        //         }
        //     },
        //     url: {
        //         connectOrCreate: {
        //             where: {
        //                 url: data.url,
        //             },
        //             create: {
        //                 url: data.url
        //             }
        //         }
        //     }
        // }

        const updateUser: UserUI = await prisma.user.update({
            where: {
                name: data.author,
            },
            data: {
                posts: {
                    
                }
            },
            select: {
                name: true,
                score: true,
            },
        });
        let leaderboard = await prisma.user.findMany({
            include: {
                posts: true,
            },
        });
        leaderboard = leaderboard.sort((a, b) => compareUsers(a, b));

        return NextResponse.json({ user: updateUser, leaderboard: leaderboard.map((user) => {
            return {
                name: user.name,
                score: user.posts.length,
            } as UserUI;
        }) } as PostRes);
    } catch (err) {
        console.error(err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

/*curl -v -X POST http://localhost:3000/api/leaderboard/Erika -H "Content-Type: application/json" -d "{\"score\":1000000}"*/