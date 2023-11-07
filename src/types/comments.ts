import { Post, User } from '@prisma/client';

type CommentWithPostAndAuthor = {
    id: number,
    title: string | null,
    content: string | null,
    rating: number | null,
    post: Post,
    author: User,
    created: Date,
    updated: Date,
}

export const toCommentUI = (comment: CommentWithPostAndAuthor) => {
    return {
        id: comment.id,
        postID: comment.post.id,
        title: comment.title,
        content: comment.content,
        rating: comment.rating,
        authorName: comment.author.name,
        createDate: comment.created,
        updateDate: comment.updated,
    } as CommentUI;
}

export interface CommentUI {
    id: number,
    postID: number,
    title?: string,
    content?: string,
    rating?: number,
    authorName: string,
    createDate: Date,
    updateDate: Date,
}

export type CommentRequest = {
    id?: number,
    postID: number,
    title?: string,
    content?: string,
    rating?: number,
    authorName: string,
}

export type CommentResponse = {
    error?: string,
}