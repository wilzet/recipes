import { User, Link } from '@prisma/client';

type PostWithLinkAndAuthor = {
    id: number,
    date: Date,
    title: string | null,
    url: Link,
    author: User,
    created: Date,
    updated: Date,
}

export const toPostUI = (post: PostWithLinkAndAuthor) => {
    return {
        id: post.id,
        date: post.date,
        title: post.title,
        url: post.url.url,
        authorName: post.author.name,
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
    createDate: Date,
    updateDate: Date,
}