import React, { useState, useEffect } from 'react';
import { UserUI } from '@/types/user';
import { PostUI } from '@/types/post';
import { RecipeAllRequest, RecipeAllResponse } from '@/types/recipe-all';
import { getNameOfMonth, getCurrentMonth,  } from '@/lib/calendar';
import useWindowDimensions from '@/lib/window';
import apiRequest from '@/lib/api-request';
import PostDisplay from '@/components/post-display';
import Button from '@/components/button';

interface ProfileComponentProps {
    user: UserUI | null,
    update: () => any,
    callback: () => any,
}

export default function Profile(props: ProfileComponentProps) {    
    const { width } = useWindowDimensions();
    const [month, setMonth] = useState<Date>(getCurrentMonth());
    const [recipes, setRecipes] = useState<PostUI[]>();

    useEffect(() => {
        const asyncCall = async () => {
            await getRecipes();
        }

        asyncCall();
    }, [month]);

    if (!props.user) {
        props.callback();
        return <></>;
    }

    const getRecipes = async () => {
        const year = month.getFullYear();
        const startdate = new Date(year, month.getMonth(), 1);
        const enddate = new Date(year, month.getMonth() + 1, 1);

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

    const changeMonth = (change: number) => {
        setRecipes(undefined);
        const date = new Date(month);
        date.setUTCMonth(date.getMonth() + change);
        setMonth(date);
    }

    const update = async () => {
        await getRecipes();
        await props.update();
    }

    return (
        <div className='containerV'>
            <h1>{props.user.name}</h1>
            <h2 style={{ color: 'var(--foreground-default-color)' }}>Score: {props.user.score}</h2>
            {width > 423 ? <div className='containerH calendar-header-container' style={{ padding: '0px 6px', marginBottom: '20px', borderColor: 'var(--color-white)' }}>
                <Button
                    value={'Previous'}
                    active={true}
                    class={'buttonBlue containerH'}
                    onClick={() => changeMonth(-1)}
                />
                <h2 style={{ color: 'var(--foreground-default-color)' }}>{getNameOfMonth(month)}｜{month.getFullYear()}</h2>
                <Button
                    value={'Next'}
                    active={true}
                    class={'buttonBlue containerH'}
                    onClick={() => changeMonth(1)}
                />
            </div> : <div className='calendar-header-container' style={{ padding: '0px 6px', marginBottom: '20px', borderColor: 'var(--color-white)' }}>
                <h2 style={{ color: 'var(--foreground-default-color)', paddingTop: 0, paddingBottom: 0, marginBottom: 0, marginTop: 0 }}>{getNameOfMonth(month)}｜{month.getFullYear()}</h2>
                <div className='containerH'>
                    <Button
                        value={'Previous'}
                        active={true}
                        class={'buttonBlue containerH'}
                        onClick={() => changeMonth(-1)}
                    />
                    <Button
                        value={'Next'}
                        active={true}
                        class={'buttonBlue containerH'}
                        onClick={() => changeMonth(1)}
                    />
                </div>
            </div>}

            <PostDisplay
                selectedUser={props.user.name}
                title={false}
                posts={recipes}
                update={update}
                callback={props.callback}
            />
        </div>
    );
}