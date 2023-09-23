import { UserUI } from '@/types/user';

// Doesn't expect request body

export type LeaderboardResponse = {
    leaderboard?: UserUI[],
    error?: string,
}