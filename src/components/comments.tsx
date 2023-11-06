import React, { useState } from 'react';
import { PostUI } from '@/types/post';
import { UserUI } from '@/types/user';
import Button from '@/components/button';
import Modal from '@/components/modal';
import PostForm from '@/components/post-form';

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

            {props.post.title && <h2 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px', color: 'inherit' }}>
                {props.post.title}
            </h2>}
            <h3 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px' }}>
                {props.post.url.includes('://') ? <a href={props.post.url} target='_blank' style={{ color: 'var(--color-lightblue)' }}>
                    {props.post.url}
                </a> : <p style={{ margin: '0px', padding: '0px', color: 'var(--color-lightgray)' }}>
                    {props.post.url}
                </p>}
            </h3>

            <Modal active={commentForm} parent='comments'>
                <Button
                    value={'Close'}
                    active={true}
                    class={'buttonRed'}
                    onClick={closeCommentForm}
                />
            </Modal>
        </div>
    );
}