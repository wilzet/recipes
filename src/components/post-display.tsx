import React, { useState } from 'react';
import { PostUI } from '@/types/post';
import { UserUI } from '@/types/user';
import Button from '@/components/button';
import Modal from '@/components/modal';
import PostForm from '@/components/post-form';

interface PostDisplayComponentProps {
    selectedUser?: string,
    date?: Date,
    title: boolean,
    posts: PostUI[] | undefined,
    update: () => any,
    callback: () => any,
}

export default function PostDisplay(props: PostDisplayComponentProps) {
    const [postForm, setPostForm] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<boolean>(false);
    const [postIndex, setPostIndex] = useState<number>(0);

    const renderPostDisplay = (key: number, post: PostUI) => {
        return (
            <div key={key} className='containerV' style={{ overflow: 'hidden', marginBottom: '20px', textAlign: 'center', wordBreak: 'break-word' }}>
                {post.title && <h2 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px', color: 'inherit' }}>
                    {post.title}
                </h2>}
                <h3 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px' }}>
                    {post.url.includes('://') ? <a href={post.url} target='_blank' style={{ color: 'var(--color-lightblue)' }}>
                        {post.url}
                    </a> : <p style={{ margin: '0px', padding: '0px', color: 'var(--color-lightgray)' }}>
                        {post.url}
                    </p>}
                </h3>
                <div className='containerH' style={{ textAlign: 'left' }}>
                    {props.selectedUser === post.authorName && <Button
                        value={'Edit'}
                        active={true}
                        class={''}
                        style={{
                            padding: '5px',
                            paddingRight: '25px',
                            paddingLeft: '5px',
                            marginRight: '20px',
                            minHeight: '0px',
                            position: 'relative',
                        }}
                        onClick={() => openEditForm(key)}
                    >
                        <div className='edit-icon'/>
                    </Button>}
                    Created by {post.authorName}<br/>
                    on {post.createDate.toDateString()}<br/>
                    (Updated on {post.updateDate.toDateString()})
                </div>
            </div>
        );
    }

    const openEditForm = (index: number) => {
        setEditForm(true);
        setPostIndex(index);
    }

    const closePostForm = async () => {
        setPostForm(false);
        await props.update();
    }

    const closeEditForm = async () => {
        setEditForm(false);
        await props.update();
    }

    return (
        <div id='posts-display'>
            <div className='containerV' style={{ position: 'fixed', bottom: 'min(10vh, 25vw)', right: 'min(10vh, 10vw)', zIndex: 100 }}>
                {props.selectedUser && <Button
                    value={'Make post'}
                    class={'buttonBlue'}
                    active={true}
                    onClick={() => setPostForm(true)}
                />}
                <Button
                    value={'Close'}
                    active={true}
                    class={'buttonRed'}
                    onClick={props.callback}
                />
            </div>
            {props.title && <h2 style={{ fontSize: '2rem' }}>{(props.date ?? (props.posts ? props.posts[0].date : new Date())).toDateString().slice(0, -5)}</h2>}

            {props.posts?.map((val, index) => {
                return renderPostDisplay(index, val);
            })}

            {props.posts && props.posts.length > 0 && <div style={{ height: '150px' }}/>}

            <Modal active={postForm} parent='posts-display'>
                <PostForm
                    user={{ name: props.selectedUser, score: 0} as UserUI}
                    date={props.date ?? (props.posts ? props.posts[0].date : new Date())}
                    callback={closePostForm}
                />
            </Modal>

            <Modal active={editForm} parent='posts-display'>
                <PostForm
                    user={{ name: props.selectedUser, score: 0} as UserUI}
                    post={props.posts ? props.posts[postIndex] : undefined}
                    edit={true}
                    callback={closeEditForm}
                />
            </Modal>
        </div>
    );
}