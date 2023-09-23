import { UserUI } from '@/types/user';

export type PostRequest = {
    title?: string,
    url: string,
    author: string,
}

export type PostResponse = {
    user?: UserUI,
    leaderboard?: UserUI[],
    error?: string,
}