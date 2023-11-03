import { PostUI } from '@/types/post';

export type RecipeAllRequest = {
    startdate: Date,
    enddate: Date,
    author?: string,
}

export type RecipeAllResponse = {
    posts?: PostUI[],
    error?: string,
}