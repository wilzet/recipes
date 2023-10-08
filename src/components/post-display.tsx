import React from 'react';
import { PostUI } from '@/types/post';

interface PostDisplayComponentProps {
    key: string | number,
    post: PostUI,
}

export default function PostDisplay(props: PostDisplayComponentProps) {
    return (
        <div className='containerV' style={{ marginBottom: '20px' }}>
            {props.post.title && <h2 style={{ marginBottom: '2px', paddingBottom: '2px' }}>
                {props.post.title}
            </h2>}
            <div className='containerH'>
                <h3 style={{ marginTop: '2px', paddingTop: '2px' }}>URL:</h3>
                <h3 style={{ marginTop: '2px', paddingTop: '2px' }}>{props.post.url}</h3>
            </div>
            <div className='containerH'>
                Created by {props.post.authorName}<br/>
                on {props.post.createDate.toDateString()}<br/>
                (Updated on {props.post.updateDate.toDateString()})
            </div>
        </div>
    );
}