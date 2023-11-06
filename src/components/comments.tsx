import React, { useState, useEffect } from 'react';
import { PostUI } from '@/types/post';
import { CommentUI } from '@/types/comments';
import { CommentsAllRequest, CommentsAllResponse } from '@/types/comments-all';
import apiRequest from '@/lib/api-request';
import Button from '@/components/button';
import Modal from '@/components/modal';

interface CommentsComponentProps {
    selectedUser?: string,
    post?: PostUI,
    callback: () => any,
}

export default function Comments(props: CommentsComponentProps) {
    if (!props.post) {
        props.callback();
        return <></>;
    }

    const [commentForm, setCommentForm] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentUI[]>();

    useEffect(() => {
        const asyncCall = async () => {
            await getComments();
        }

        asyncCall();
    }, []);

    const getComments = async () => {
        if (!props.post) return;

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
        const response = await apiRequest<CommentsAllResponse>('/api/recipes/comment/all', options);

        if (response && !response.error) {
            const commentsWithDates = response.comments?.map(val => {
                val.createDate = new Date(val.createDate);
                val.updateDate = new Date(val.updateDate);
                return val;
            });
            setComments(commentsWithDates);
        }
    }

    const renderComment = (key: number, comment: CommentUI) => {
        return (
            <div key={key} className='comment-container containerV'>
                {comment.title && <h2 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px', color: 'inherit' }}>
                    {comment.title}
                </h2>}
                {comment.content && <p>
                    {comment.content}    
                </p>}
                Created by {comment.authorName}<br/>
                on {comment.createDate.toDateString()}<br/>
                (Updated on {comment.updateDate.toDateString()})
            </div>
        );
    }

    const closeCommentForm = () => {
        setCommentForm(false);
    }

    return (
        <div id='comments'>
            <div className='containerV' style={{ position: 'fixed', bottom: 'min(10vh, 25vw)', right: 'min(10vh, 20vw)', zIndex: 100 }}>
                {props.selectedUser && <Button
                    value={'Comment'}
                    class={'buttonBlue'}
                    active={true}
                    onClick={() => setCommentForm(true)}
                />}
                <Button
                    value={'Close'}
                    active={true}
                    class={'buttonRed'}
                    onClick={props.callback}
                />
            </div>

            {props.post.title && <h2 style={{ fontSize: '2rem', marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px', color: 'inherit' }}>
                {props.post.title}
            </h2>}
            <h3 style={{ fontSize: '1.5rem', marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px' }}>
                {props.post.url.includes('://') ? <a href={props.post.url} target='_blank' style={{ color: 'var(--color-lightblue)' }}>
                    {props.post.url}
                </a> : <p style={{ margin: '0px', padding: '0px', color: 'var(--color-lightgray)' }}>
                    {props.post.url}
                </p>}
            </h3>

            {comments?.map((val, index) => {
                return renderComment(index, val);
            })}

            <Modal active={commentForm} parent='comments'>
                <div className='containerV' style={{ position: 'fixed', bottom: 'min(10vh, 25vw)', right: 'min(10vh, 20vw)', zIndex: 100 }}>
                    <Button
                        value={'Close'}
                        active={true}
                        class={'buttonRed'}
                        onClick={closeCommentForm}
                    />
                </div>
            </Modal>
        </div>
    );
}