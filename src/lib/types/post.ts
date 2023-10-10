import { User, Link } from '@prisma/client';

export type PostWithLinkAndAuthor = {
    id: number,
    date: Date,
    title: string | null,
    url: Link,
    author: User,
    created: Date,
    updated: Date,
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