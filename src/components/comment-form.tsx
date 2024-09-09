import React, { useState, useEffect } from 'react';
import { CommentUI } from '@/types/comments';
import { CommentRequest, CommentResponse } from '@/types/comments';
import AppSettings from '@/lib/appsettings';
import apiRequest from '@/lib/api-request';
import Form from '@/components/form';
import TextField from '@/components/text-field';
import Button from '@/components/button';
import Modal from '@/components/modal';
import TextArea from '@/components/text-area';

interface CommentFormComponentProps {
    comment: CommentUI,
    edit?: boolean,
    callback: () => any,
}

export default function CommentForm(props: CommentFormComponentProps) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>();
    const [content, setContent] = useState<string>('');
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

    useEffect(() => {
        if (props.comment) {
            setTitle(props.comment.title);
            setContent(props.comment.content ?? '');
        }
    }, [props.comment])

    const reset = () => {
        setStatusMessage(null);
        setTitle(undefined);
        setContent('');
    }

    const createComment = async () => {
        if (props.comment.authorName === '') {
            setStatusMessage('No author detected...');
            return;
        }

        if (content === '') {
            setStatusMessage('Empty comment...');
            return;
        }
        
        let body: CommentRequest = {
            postID: props.comment.postID,
            title: title,
            content: content,
            authorName: props.comment.authorName,
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
            setStatusMessage('Error while commenting...');
        }
    }

    const updateComment = async () => {
        if (props.comment.authorName === '') {
            setStatusMessage('No author detected...');
            return;
        }

        if (content === '') {
            setStatusMessage('Empty comment...');
            return;
        }
        
        let body: CommentRequest = {
            id: props.comment.id,
            postID: props.comment.postID,
            title: title,
            content: content,
            authorName: props.comment.authorName,
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<CommentResponse>('/api/comment/update', options);

        if (response && !response.error) {
            close();
        } else {
            setStatusMessage('Error while updating...');
        }
    }

    const removeComment = async () => {
        if (props.comment.authorName === '') {
            setStatusMessage('No author detected...');
            return;
        }
        
        let body: CommentRequest = {
            id: props.comment.id,
            postID: props.comment.postID,
            authorName: props.comment.authorName,
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

    const close = () => {
        reset();
        props.callback();
    }

    return (
        <Form
            id={'comment-form-id'}
            title={'Comment'}
            statusMessage={statusMessage}
            submit={props.edit ? updateComment : createComment}
            callback={close}
        >
            <TextField
                id={'comment-title'}
                label={'Title'}
                value={title ?? ''}
                placeholder={'Optional'}
                length={AppSettings.POSTTITLE_MAX_LENGTH}
                width={'min(1000px, 62vw)'}
                onChange={(e) => setTitle(e)}
            />
            <TextArea
                id={'comment-content'}
                label={'Text'}
                value={content}
                placeholder={'...'}
                rows={5}
                columns={80}
                width={'min(1000px, 62vw)'}
                onChange={(e) => setContent(e)}
            />
            {props.edit && <div className='containerH left' style={{ marginRight: '10%' }}>
                <Button
                    value={'Delete'}
                    active={true}
                    class={'buttonRed'}
                    onClick={() => setShowConfirmDialog(true)}
                />
                <Modal active={showConfirmDialog} parent={'comment-form-id'}>
                    <div className='containerV form-container' style={{ width: 'fit-content' }}>
                        <div className='containerH'>
                            Do you want to remove this comment?
                        </div>
                        <div className='containerH'>
                            <Button
                                value={'No'}
                                class={'buttonBlue'}
                                active={true}
                                onClick={() => setShowConfirmDialog(false)}
                            />
                            <Button
                                value={'Yes'}
                                class={'buttonRed'}
                                active={true}
                                onClick={async () => {setShowConfirmDialog(false); await removeComment()}}
                            />
                        </div>
                    </div>
                </Modal>
            </div>}
        </Form>
    );
}