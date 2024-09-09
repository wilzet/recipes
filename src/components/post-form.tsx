import React, { useState, useEffect } from 'react';
import { UserUI } from '@/types/user';
import { PostUI } from '@/types/post';
import { RecipePostRequest, RecipePostResponse } from '@/types/recipe-post';
import AppSettings from '@/lib/appsettings';
import apiRequest from '@/lib/api-request';
import { formatDate, isFormatted } from '@/lib/helper';
import Form from '@/components/form';
import TextField from '@/components/text-field';
import DateField from '@/components/date-field';
import Button from '@/components/button';
import Modal from '@/components/modal';
import SearchButton from '@/components/search-button';

interface PostFormComponentProps {
    user: UserUI | null,
    date?: Date,
    post?: PostUI,
    edit?: boolean,
    callback: () => any,
}

export default function PostForm(props: PostFormComponentProps) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>();
    const [url, setUrl] = useState<string>('');
    const [date, setDate] = useState<string>(formatDate(props.date ?? props.post?.date ?? new Date()));
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

    useEffect(() => {
        if (props.post) {
            setTitle(props.post.title);
            setUrl(props.post.url);
            setDate(formatDate(props.post.date));
        }
    }, [props.post])

    const reset = () => {
        setStatusMessage(null);
        setTitle('');
        setUrl('');
        setDate(formatDate(props.date ?? props.post?.date ?? new Date()));
    }

    const createPost = async () => {
        if (!props.user) {
            setStatusMessage('No author detected...');
            return;
        }
        
        if (url === '') {
            setStatusMessage('No URL...');
            return;
        }

        if (!isFormatted(date)) {
            setStatusMessage('Invalid date...');
            return;
        }
        
        let body: RecipePostRequest = {
          url: url,
          author: props.user.name,
          date: new Date(date),
        }

        if (title !== '') {
            body = { title: title, ...body };
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<RecipePostResponse>('/api/recipes/create', options);

        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error while posting...');
        }
    }

    const updatePost = async () => {
        if (!props.user) {
            setStatusMessage('No author detected...');
            return;
        }

        if (url === '') {
            setStatusMessage('No URL...');
            return;
        }

        if (!isFormatted(date)) {
            setStatusMessage('Invalid date...');
            return;
        }
        
        let body: RecipePostRequest = {
            id: props.post?.id,
            url: url,
            author: props.user.name,
            date: new Date(date),
        }

        if (title !== '') {
            body = { title: title, ...body };
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<RecipePostResponse>('/api/recipes/update', options);

        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error while updating...');
        }
    }

    const removePost = async () => {
        if (!props.user) {
            setStatusMessage('No author detected...');
            return;
        }
        
        let body: RecipePostRequest = {
            id: props.post?.id,
            url: url,
            author: props.user.name,
            date: new Date(date),
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<RecipePostResponse>('/api/recipes/delete', options);

        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error while deleting...');
        }
    }

    const setFieldsFromPost = (post: PostUI) => {
        setUrl(post.url)
        setTitle(post.title)
    }

    const close = () => {
        reset();
        props.callback();
    }

    return (
        <Form
            id={'post-form-id'}
            title={'Post a new recipe'}
            statusMessage={statusMessage}
            submit={props.edit ? updatePost : createPost}
            callback={close}
        >
            <div className='containerH'>
                <TextField
                    id={'url'}
                    label={'URL'}
                    value={url}
                    placeholder={'https://...'}
                    width={'calc(min(1000px, 62vw) - 100px)'}
                    onChange={(e) => setUrl(e)}
                />
                <SearchButton
                    user={props.user}
                    hideInteractions={true}
                    callback={setFieldsFromPost}
                    style={{ marginBottom: '10px' }}
                />
            </div>
            <TextField
                id={'title'}
                label={'Title'}
                value={title ?? ''}
                placeholder={'Optional'}
                length={AppSettings.POSTTITLE_MAX_LENGTH}
                width={'min(1000px, 62vw)'}
                onChange={(e) => setTitle(e)}
            />
            <DateField
                id={'date'}
                label={'Date'}
                value={date}
                onChange={(e) =>  setDate(e)}
            />
            {props.edit && <div className='containerH left' style={{ marginRight: '10%' }}>
                <Button
                    value={'Delete'}
                    active={true}
                    class={'buttonRed'}
                    onClick={() => setShowConfirmDialog(true)}
                />
                <Modal active={showConfirmDialog} parent={'post-form-id'}>
                    <div className='containerV form-container' style={{ width: 'fit-content' }}>
                        <div className='containerH'>
                            Do you want to remove this post?
                        </div>
                        <div className='containerH'>
                            <Button
                                value={'No'}
                                class={'buttonBlue'}
                                active={true}
                                onClick={() => setShowConfirmDialog(false)}
                            />
                            <Button
                                value={'Yes'}
                                class={'buttonRed'}
                                active={true}
                                onClick={async () => {setShowConfirmDialog(false); await removePost()}}
                            />
                        </div>
                    </div>
                </Modal>
            </div>}
        </Form>
    );
}