import { UserUI } from '@/types/user';

export type LeaderboardRequest = {
    length?: number,
}

export type LeaderboardResponse = {
    leaderboard?: UserUI[],
    error?: string,
}