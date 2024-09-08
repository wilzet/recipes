import { User, Link, Comment } from '@prisma/client';
import { removeNull } from '@/types/generic-helper';

type PostWithLinkAndAuthorAndComments = {
    id: number,
    date: Date,
    title: string | null,
    url: Link,
    author: User,
    comments: Comment[],
    created: Date,
    updated: Date,
}

export const toPostUI = (post: PostWithLinkAndAuthorAndComments) => {
    let summedRating = 0;
    const ratings = post.comments.filter((c: Comment) => c.title === process.env.SECRET_RATING_ID);
    ratings.map((c: Comment) => summedRating += (c.rating ?? 0));
    const rating = ratings.length > 0 ? summedRating / ratings.length : null;

    const postUI = {
        id: post.id,
        date: post.date,
        title: post.title,
        url: post.url.url,
        authorName: post.author.name,
        rating: rating,
        comments: post.comments.length - ratings.length,
        createDate: post.created,
        updateDate: post.updated,
    } as PostUI;

    return removeNull(postUI) as PostUI;
}

export const removeDuplicatePost = (posts: PostUI[]) => {
    const seen = new Set<string>();

    return posts.filter(post => {
        const key = post.url + '|' + post.title + '|' + post.rating;
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    })
}

export interface PostUI {
    id: number,
    date: Date,
    title?: string,
    url: string,
    authorName: string,
    rating?: number,
    comments: number,
    createDate: Date,
    updateDate: Date,
}