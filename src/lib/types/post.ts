import { UserUI } from '@/types/user';

export type PostRequest = {
    title?: string,
    url: string,
    author: string,
    date: Date,
}

export type PostResponse = {
    user?: UserUI,
    error?: string,
}