import React, { useEffect, useState } from "react";
import { PostUI } from "@/types/post";
import { CommentUI } from "@/types/comments";
import { CommentsAllRequest, CommentsAllResponse } from "@/types/comments-all";
import { CommentRequest, CommentResponse } from "@/types/comments";
import apiRequest from "@/lib/api-request";
import Form from "@/components/form";
import TextField from "@/components/text-field";
import Button from "./button";

interface RateFormComponentProps {
    selectedUser?: string,
    post?: PostUI,
    callback: () => any,
}

export default function RateForm(props: RateFormComponentProps) {
    const [id, setId] = useState<number>();
    const [rating, setRating] = useState<number>();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const reset = () => {
        setStatusMessage(null);
        setRating(undefined);
    }

    useEffect(() => {
        const asyncCall = async () => {
            await getComments();
        };

        asyncCall();
    }, []);

    const getComments = async () => {
        if (!props.post) {
            return;
        }

        let body: CommentsAllRequest = {
            postID: props.post.id,
        }

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        const response = await apiRequest<CommentsAllResponse>('/api/comment/all', options);

        if (response && !response.error) {
            const ratingsWithAuthor = response.comments?.filter(val => {
                if (val.authorName !== props.selectedUser) return false;
                return val.rating || val.rating === 0;
            });

            if (ratingsWithAuthor?.length === 1) {
                setId(ratingsWithAuthor[0].id);
                setRating(ratingsWithAuthor[0].rating);
            }
        }
    }

    const upsertRating = async () => {
        if (!props.selectedUser || !props.post) {
            setStatusMessage('No author detected...');
            return;
        }

        if (rating === undefined) {
            setStatusMessage('Give a rating!');
            return;
        }

        if (rating < 0 || rating > 5) {
            setStatusMessage('Give a rating 0-5...');
            return;
        }

        let body: CommentRequest = {
            id: id,
            postID: props.post.id,
            rating: rating,
            authorName: props.selectedUser,
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<CommentResponse>('/api/comment/create', options);
    
        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error...')
        }
    }

    const clearRating = async () => {
        if (!id || !props.selectedUser) {
            setStatusMessage('Error when deleting...');
            return;
        }

        let body: CommentRequest = {
            id: id,
            postID: 0,
            authorName: props.selectedUser,
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<CommentResponse>('/api/comment/delete', options);

        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error while deleting...');
        }
    }

    const giveRating = (r: number) => {
        setRating(r);
    } 

    const close = async () => {
        reset();
        await props.callback();
    }

    return (
        <Form
            title={'Rate the post!'}
            statusMessage={statusMessage}
            submit={upsertRating}
            callback={close}
        >
            <div className='containerH'>
                {[0, 1, 2, 3, 4, 5].map(val => {
                    return(
                        <div key={val}>
                            <Button
                                value={`${val}`}
                                class={val % 3 === 0 ? 'buttonBlue' : val % 2 === 0 ? 'buttonRed' : 'buttonGreen'}
                                active={rating !== val}
                                onClick={() => giveRating(val)}
                            />
                        </div>
                    );
                })}
            </div>
            {id && <Button
                value={'Clear'}
                class={'buttonRed'}
                active={true}
                onClick={clearRating}
            />}
        </Form>
    );
}