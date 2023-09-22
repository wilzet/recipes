import { UserUI } from '@/types/user';

export type PostReq = {
    title?: string,
    url: string,
    author: string,
}

export type PostRes = {
    user?: UserUI,
    leaderboard?: UserUI[],
    error?: string,
}