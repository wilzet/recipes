import React, { useState, useEffect } from "react";
import { UserUI } from "@/types/user";
import { RecipePostRequest, RecipePostResponse } from "@/types/recipe-post";
import AppSettings from "@/lib/appsettings";
import apiRequest from "@/lib/api-request";
import Form from "@/components/form";
import TextField from "@/components/text-field";
import DateField from "@/components/date-field";
import { PostUI } from "@/types/post";
import Button from "@/components/button";

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
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        setDate(props.date ?? new Date());

        if (props.post) {
            setTitle(props.post.title);
            setUrl(props.post.url);
            setDate(props.post.date);
        }
    }, [props.date, props.post])

    const reset = () => {
        setStatusMessage(null);
        setTitle('');
        setUrl('');
        setDate(props.date ?? new Date());
    }

    const createPost = async () => {
        if (!props.user) {
            setStatusMessage('No author detected...');
            return;
        }

        if (url === '' || !date) {
            setStatusMessage('Empty fields...');
            return;
        }
        
        let body: RecipePostRequest = {
          url: url,
          author: props.user.name,
          date: date,
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
        const response = await apiRequest<RecipePostResponse>('/api/recipes/create', options)
          .catch(e => console.log(e));

        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error while posting...')
        }
    }

    const updatePost = async () => {
        return;
    }

    const removePost = async () => {
        return;
    }

    const formatDate = (date: Date) => {
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return year+'-'+month+'-'+day;
    }

    const close = () => {
        reset();
        props.callback();
    }

    return (
        <Form
            title={'Post a new recipe'}
            statusMessage={statusMessage}
            submit={props.edit ? updatePost : createPost}
            callback={close}
        >
            <TextField
                id={'url'}
                label={'URL'}
                value={url}
                placeholder={'https://...'}
                class={''}
                width={'min(1000px, 60vw)'}
                onChange={(e) => setUrl(e)}
            />
            <TextField
                id={'title'}
                label={'Title'}
                value={title ?? ''}
                placeholder={'Optional'}
                class={''}
                length={AppSettings.POSTTITLE_MAX_LENGTH}
                width={'min(1000px, 60vw)'}
                onChange={(e) => setTitle(e)}
            />
            <DateField
                id={'date'}
                label={'Date'}
                value={formatDate(date)}
                class={''}
                onChange={(e) => {const date = new Date(e); date.setUTCHours(0, 0, 0, 0); setDate(new Date(e))}}
            />
            {props.edit && <div className='containerH left' style={{ marginRight: '10%' }}>
                <Button
                    value={'Delete'}
                    active={true}
                    class={'buttonRed'}
                    onClick={removePost}
                />
            </div>}
        </Form>
    );
}