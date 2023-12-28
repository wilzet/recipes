import prisma from "@/lib/prisma";
import { UserWithPosts } from "@/types/user";

export async function calculateScore(user: UserWithPosts) {
    const score = user.posts.map(async post => {
        // Score is currently being calculated using posts from the last month back only
        if (post.date <= getOneMonthBack()) return 0;

        const comments = await prisma.comment.findMany({
            where: {
                postId: post.id,
                author: {
                    name: {
                        not: user.name,
                    },
                },
            },
            include: {
                post: true,
                author: true,
            },
        });

        const ratings = comments.filter(comment => comment.title === process.env.SECRET_RATING_ID)
            .map(comment => comment.rating ?? 0);

        const scoreFromPost = ratings.length > 0 ? ratings.reduce((sum, rating) => sum += rating) / (5 * ratings.length) : 0;
        const commentBonus = (comments.length - ratings.length) / 10;
        
        return (1 + scoreFromPost) / 2 + commentBonus;
    });

    return Math.round((await Promise.all(score)).reduce((sum, score) => sum += score) * 100);
}

function getOneMonthBack() {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    if (currentDate.getMonth() === lastMonth.getMonth()) lastMonth.setDate(0);

    return lastMonth;
}