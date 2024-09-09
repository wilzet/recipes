import React, { useState } from 'react';
import { UserUI } from '@/types/user';
import { PostUI } from '@/types/post';
import { RecipeSearchRequest, RecipeAllResponse } from '@/types/recipe-all';
import apiRequest from '@/lib/api-request';
import Button from '@/components/button';
import Modal from '@/components/modal';
import TextField from '@/components/text-field';
import PostDisplay from '@/components/post-display';

interface SearchButtonProps {
    user: UserUI | null,
    useValue?: boolean,
    hideInteractions?: boolean,
    callback: (post: PostUI) => any
}

export default function SearchButton(props: SearchButtonProps) {
    const [searchForm, setSearchForm] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [recipes, setRecipes] = useState<PostUI[]>();

    const searchRecipes = async () => {
        if (searchText === '') return;

        let body: RecipeSearchRequest = {
            searchWord: searchText
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        const response = await apiRequest<RecipeAllResponse>('/api/recipes/search', options);

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

    const useSearch = (post: PostUI) => {
        props.callback(post);
        closeSearch();
    }

    const closeSearch = () => {
        setSearchText('');
        setSearchForm(false);
    }

    const postButton = (post: PostUI) => {
        return (
            <Button
                value={'Use'}
                active={true}
                onClick={() => useSearch(post)}
                style={{ margin: '5px', marginBottom: '25px', marginRight: '20px', float: 'right' }}
            />
        );
    }

    return (
        <div id='search' style={{ alignSelf: 'end' }}>
            <Button
                value={'Search'}
                active={true}
                class='buttonBlue'
                onClick={() => setSearchForm(true)}
                style={{
                    marginBottom: '10px',
                    padding: '5px',
                    paddingLeft: '27px',
                    position: 'relative'
                }}
            >
                <div className='search-icon' />
            </Button>

            <Modal active={searchForm} parent='search'>
                <div className='overlay-form'>
                    <div className='overlay-form-inner'>
                        <div className='form-container' style={{ width: 'min(62vw, 1200px)'  }}>
                            <h2 style={{ fontSize: '30px', color: 'inherit' }}>
                                Search Recipes
                            </h2>
                            <div className='containerH' style={{ marginBottom: '20px' }}>
                                <TextField
                                    id={'search-text'}
                                    label={''}
                                    value={searchText}
                                    placeholder={'Search for a recipe...'}
                                    width={'calc(min(1000px, 62vw) - 100px)'}
                                    onChange={(e) => setSearchText(e)}
                                />
                                <Button
                                    value={''}
                                    active={true}
                                    class='buttonBlue'
                                    onClick={searchRecipes}
                                    style={{
                                        alignSelf: 'end',
                                        marginBottom: '8px',
                                        padding: '25px',
                                        position: 'relative'
                                    }}
                                >
                                    <div className='search-icon' style={{ backgroundPosition: '50% 50%' }} />
                                </Button>
                            </div>
                            <PostDisplay
                                selectedUser={props.user?.name}
                                title={false}
                                posts={recipes}
                                update={async () => { }}
                                callback={() => { }}
                                hideButtons={true}
                                hideInteractions={props.hideInteractions}
                                postButton={props.useValue ? postButton : undefined}
                                useSubtitleColor={true}
                            />
                            <div className='containerH' style={{ marginTop: '20px' }}>
                                <Button
                                    value={'Close'}
                                    class={'buttonRed'}
                                    active={true}
                                    onClick={closeSearch}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}