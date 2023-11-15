import { User, Link, Comment } from '@prisma/client';

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
    return {
        id: post.id,
        date: post.date,
        title: post.title,
        url: post.url.url,
        authorName: post.author.name,
        comments: post.comments.length,
        createDate: post.created,
        updateDate: post.updated,
    } as PostUI;
}

export interface PostUI {
    id: number,
    date: Date,
    title?: string,
    url: string,
    authorName: string,
    comments: number,
    createDate: Date,
    updateDate: Date,
}