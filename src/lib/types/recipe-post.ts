import { UserUI } from '@/types/user';

export type RecipePostRequest = {
    title?: string,
    url: string,
    author: string,
    date: Date,
}

export type RecipePostResponse = {
    user?: UserUI,
    error?: string,
}