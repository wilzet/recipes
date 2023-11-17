import React, { useState } from 'react';
import { PostUI } from '@/types/post';
import { UserUI } from '@/types/user';
import Button from '@/components/button';
import Modal from '@/components/modal';
import PostForm from '@/components/post-form';
import Comments from '@/components/comments';
import RateForm from './rate-form';

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
    const [comments, setComments] = useState<boolean>(false);
    const [rating, setRating] = useState<boolean>(false);
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
                {post.rating && <h3 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px', color: 'var(--color-pink)' }}>
                    {`${post.rating}/5`}
                </h3>}
                <div className='containerH'>
                    <Button
                        value={post.comments > 0 ? post.comments > 1 ? post.comments > 5 ? '(5+) Comments' : `(${post.comments}) Comments` : '(1) Comment' : 'Comment!' }
                        active={props.selectedUser ? true : post.comments > 0}
                        class={'buttonBlue'}
                        style={{
                            padding: '5px',
                            paddingRight: '30px',
                            paddingLeft: '5px',
                            marginLeft: '20px',
                            position: 'relative',
                        }}
                        onClick={() => openComments(key)}
                    >
                        <div className='comment-icon'/>
                    </Button>
                    <Button
                        value={'Rate!'}
                        active={props.selectedUser ? true : false}
                        class={'buttonGreen'}
                        onClick={() => openRating(key)}
                    />
                </div>
                <div className='containerH' style={{ textAlign: 'left' }}>
                    {props.selectedUser === post.authorName && <Button
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
                    Posted by {post.authorName}<br/>
                    on {post.createDate.toDateString()}<br/>
                    (Updated on {post.updateDate.toDateString()})
                </div>
            </div>
        );
    }

    const openComments = (index: number) => {
        setComments(true);
        setPostIndex(index);
    }

    const openEditForm = (index: number) => {
        setEditForm(true);
        setPostIndex(index);
    }

    const openRating = (index: number) => {
        setRating(true);
        setPostIndex(index);
    }

    const closeForm = async () => {
        setEditForm(false);
        setPostForm(false);
        setComments(false);
        setRating(false);
        await props.update();
    }

    return (
        <div id='posts-display'>
            <div className='containerV' style={{ position: 'fixed', bottom: 'min(10vh, 25vw)', right: 'min(10vh, 20vw)', zIndex: 100 }}>
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

            {props.title && <h2 style={{ fontSize: '2rem', color: 'var(--foreground-default-color)' }}>{(props.date ?? new Date()).toDateString().slice(0, -5)}</h2>}
            {props.posts?.map((val, index) => {
                return renderPostDisplay(index, val);
            })}
            {props.posts && props.posts.length > 0 && <div style={{ height: '200px' }}/>}
            
            <Modal active={postForm} parent='posts-display'>
                <PostForm
                    user={{ name: props.selectedUser, score: 0} as UserUI}
                    date={props.date ?? new Date()}
                    callback={closeForm}
                />
            </Modal>

            <Modal active={editForm} parent='posts-display'>
                <PostForm
                    user={{ name: props.selectedUser, score: 0} as UserUI}
                    post={props.posts ? props.posts[postIndex] : undefined}
                    edit={true}
                    callback={closeForm}
                />
            </Modal>

            <Modal active={comments} parent='posts-display'>
                <Comments
                    selectedUser={props.selectedUser}
                    post={props.posts ? props.posts[postIndex] : undefined}
                    callback={closeForm}
                />
            </Modal>

            <Modal active={rating} parent='posts-display'>
                <RateForm
                    selectedUser={props.selectedUser}
                    post={props.posts ? props.posts[postIndex] : undefined}
                    callback={closeForm}
                />
            </Modal>
        </div>
    );
}