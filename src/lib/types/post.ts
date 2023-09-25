import { User, Link } from '@prisma/client';

export type PostWithLinkAndAuthor = {
    date: Date,
    title: string | null,
    url: Link,
    author: User,
}

export interface PostUI {
    date: Date,
    title?: string,
    url: string,
    authorName: string,
}