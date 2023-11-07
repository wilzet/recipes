import React, { useState, useEffect } from 'react';
import { PostUI } from '@/types/post';
import { CommentUI } from '@/types/comments';
import { CommentsAllRequest, CommentsAllResponse } from '@/types/comments-all';
import apiRequest from '@/lib/api-request';
import Button from '@/components/button';
import Modal from '@/components/modal';
import CommentForm from '@/components/comment-form';

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
    const [editForm, setEditForm] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentUI[]>();
    const [commentIndex, setCommentIndex] = useState<number>(0);

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
        const response = await apiRequest<CommentsAllResponse>('/api/comment/all', options);

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
            <div key={key} className='comment-container containerV' style={{ maxWidth: 'min(50vw, 1200px)', width: 'fit-content' }}>
                {comment.title && <h2 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px', color: 'inherit' }}>
                    {comment.title}
                </h2>}
                {comment.content && <p>
                    {comment.content}    
                </p>}
                <div className='containerH' style={{ textAlign: 'left' }}>
                    {props.selectedUser === comment.authorName && <Button
                        value={'Edit'}
                        active={true}
                        class={''}
                        style={{
                            padding: '5px',
                            paddingRight: '27px',
                            paddingLeft: '5px',
                            marginRight: '20px',
                            minHeight: '0px',
                            position: 'relative',
                        }}
                        onClick={() => openEditForm(key)}
                    >
                        <div className='edit-icon'/>
                    </Button>}
                    Posted by {comment.authorName}<br/>
                    on {comment.createDate.toDateString()}<br/>
                    (Updated on {comment.updateDate.toDateString()})
                </div>
            </div>
        );
    }

    const openEditForm = (index: number) => {
        setEditForm(true);
        setCommentIndex(index);
    }

    const closeEditForm = async () => {
        setEditForm(false);
        await getComments();
    }

    const closeCommentForm = async () => {
        setCommentForm(false);
        await getComments();
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
                <CommentForm
                    comment={{ id: 0, postID: props.post.id, authorName: props.selectedUser ?? '', createDate: new Date(), updateDate: new Date()}}
                    callback={closeCommentForm}
                />
            </Modal>

            <Modal active={editForm} parent='comments'>
                <CommentForm
                    comment={comments ? comments[commentIndex] : { id: 0, postID: props.post.id, authorName: props.selectedUser ?? '', createDate: new Date(), updateDate: new Date()}}
                    edit={true}
                    callback={closeEditForm}
                />
            </Modal>
        </div>
    );
}