import { CommentUI } from '@/types/comments'

export type CommentsAllRequest = {
    postID: number,
    author?: string,
}

export type CommentsAllResponse = {
    comments?: CommentUI[],
    error?: string,
}