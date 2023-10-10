import React from 'react';
import { PostUI } from '@/types/post';
import Button from './button';

interface PostDisplayComponentProps {
    key: string | number,
    selectedUser?: string,
    post: PostUI,
}

export default function PostDisplay(props: PostDisplayComponentProps) {
    return (
        <div className='containerV' style={{ overflow: 'hidden', marginBottom: '20px', textAlign: 'center', wordBreak: 'break-word' }}>
            {props.post.title && <h2 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px' }}>
                {props.post.title}
            </h2>}
            <h3 style={{ marginTop: '2px', paddingTop: '2px', marginBottom: '2px', paddingBottom: '2px' }}>
                <a href={props.post.url} target='_blank' style={{ color: 'var(--color-lightblue)' }}>
                    {props.post.url}
                </a>
            </h3>
            <div className='containerH' style={{ textAlign: 'left' }}>
                {props.selectedUser === props.post.authorName && <Button
                    value={'Edit'}
                    active={true}
                    class={''}
                    style={{
                        padding: '5px',
                        paddingRight: '25px',
                        paddingLeft: '5px',
                        minHeight: '0px',
                    }}
                    onClick={() => console.log("!")}
                >
                    <div className='edit-icon'/>
                </Button>}
                Created by {props.post.authorName}<br/>
                on {props.post.createDate.toDateString()}<br/>
                (Updated on {props.post.updateDate.toDateString()})
            </div>
        </div>
    );
}