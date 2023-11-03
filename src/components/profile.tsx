import React, { useState, useEffect } from 'react';
import { UserUI } from '@/types/user';
import { PostUI } from '@/types/post';
import { RecipeAllRequest, RecipeAllResponse } from '@/types/recipe-all';
import apiRequest from '@/lib/api-request';
import PostDisplay from './post-display';

interface ProfileComponentProps {
    user: UserUI | null,
    callback: () => any,
}

export default function Profile(props: ProfileComponentProps) {
    const [recipes, setRecipes] = useState<PostUI[]>();
    if (!props.user) {
        props.callback();
        return <></>;
    }

    useEffect(() => {
        const asyncCall = async () => {
            await getRecipes();
        }

        asyncCall();
    }, []);

    const getRecipes = async () => {
        const year = new Date().getFullYear();
        const startdate = new Date(0, 0, 1);
        const enddate = new Date(year + 1, 0, 1);

        let body: RecipeAllRequest = {
            startdate: startdate,
            enddate: enddate,
            author: props.user?.name,
        }

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        const response = await apiRequest<RecipeAllResponse>('/api/recipes/interval', options);

        if (response && !response.error) {
            const postsWithDates = response.posts?.map(val => {
                val.date = new Date(val.date);
                val.createDate = new Date(val.createDate);
                val.updateDate = new Date(val.updateDate);
                return val;
            });
            const postsSorted = postsWithDates?.sort((a, b) => {
                return b.date.getTime() - a.date.getTime();
            })

            setRecipes(postsSorted);
        }
    }

    return (
        <div className='containerV'>
            <h1>{props.user.name}</h1>
            <h2>Score: {props.user.score}</h2>

            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <PostDisplay
                    selectedUser={props.user.name}
                    title={false}
                    posts={recipes}
                    update={getRecipes}
                    callback={() => props.callback()}
                />
            </div>
        </div>
    );
}