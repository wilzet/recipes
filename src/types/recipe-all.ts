import { PostUI } from '@/types/post';

export type RecipeAllRequest = {
    startdate: Date,
    enddate: Date,
    author?: string,
}

export type RecipeSearchRequest = {
    searchWord: string,
}

export type RecipeAllResponse = {
    posts?: PostUI[],
    error?: string,
}