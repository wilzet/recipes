import React, { useState } from 'react';
import apiRequest from '@/lib/api-request';
import { PostUI } from '@/types/post';
import { RecipeSearchRequest, RecipeAllResponse } from '@/types/recipe-all';
import Button from '@/components/button';
import Modal from '@/components/modal';
import TextField from '@/components/text-field';
import PostDisplay from '@/components/post-display';

interface SearchButtonProps {
    useValue?: boolean,
}

export default function SearchButton(props: SearchButtonProps) {
    const [searchForm, setSearchForm] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [recipes, setRecipes] = useState<PostUI[]>();

    const searchRecipes = async () => {
        if (searchText === '') return;

        console.log('OK');
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

    const closeSearch = () => {
        setSearchForm(false);
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
                        <div className='form-container' style={{ width: 'fit-content' }}>
                            <h2 style={{ fontSize: '30px', color: 'inherit' }}>
                                Search Recipes
                            </h2>
                            <div className='containerH'>
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
                                        marginBottom: '10px',
                                        position: 'relative'
                                    }}
                                >
                                    <div className='search-icon' style={{ backgroundPosition: '50% 50%' }} />
                                </Button>
                            </div>
                            <PostDisplay
                                selectedUser={undefined}
                                title={false}
                                posts={recipes}
                                update={async () => { }}
                                callback={() => { }}
                                hideButtons={true}
                            />
                            <div className='containerH' style={{ marginTop: '20px' }}>
                                <Button
                                    value={'Close'}
                                    class={'buttonRed'}
                                    active={true}
                                    onClick={closeSearch}
                                />
                                {props.useValue && <Button
                                    value={'Use'}
                                    class={'buttonGreen'}
                                    active={true}
                                    onClick={() => { }}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}