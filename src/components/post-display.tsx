import React from 'react';
import { PostUI } from '@/types/post';

interface PostDisplayComponentProps {
    key: string | number,
    post: PostUI,
}

export default function PostDisplay(props: PostDisplayComponentProps) {
    return (
        <div className='containerV' style={{ overflow: 'hidden', marginBottom: '20px', textAlign: 'center', wordBreak: 'break-word' }}>
            {props.post.title && <h2 style={{ marginBottom: '2px', paddingBottom: '2px' }}>
                {props.post.title}
            </h2>}
            <h3 style={{ marginTop: '2px', paddingTop: '2px' }}><a href={props.post.url} target='_blank' style={{ color: 'var(--color-lightblue)' }}>{props.post.url}</a></h3>
            <div className='containerH' style={{ textAlign: 'left' }}>
                Created by {props.post.authorName}<br/>
                on {props.post.createDate.toDateString()}<br/>
                (Updated on {props.post.updateDate.toDateString()})
            </div>
        </div>
    );
}