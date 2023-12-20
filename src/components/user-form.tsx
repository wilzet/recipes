import React, { useState } from 'react';
import { UserResponse, UserUI } from '@/types/user';
import AppSettings from '@/lib/appsettings';
import apiRequest from '@/lib/api-request';
import Form from '@/components/form';
import TextField from '@/components/text-field';

interface UserFormComponentProps {
    callback: (user: UserUI | undefined) => any,
}

export default function UserForm(props: UserFormComponentProps) {
    const [username, setUsername] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const reset = () => {
        setStatusMessage(null);
        setUsername('');
    }

    const createUser = async () => {
        if (username === '') {
            setStatusMessage('Type a username...')
            return;
        }

        const options = {
            method: 'POST'
        };
        const response = await apiRequest<UserResponse>(`/api/users/${username}`, options);
    
        if (response && response.user && !response.error) {
            close(response.user);
        } else {
            setStatusMessage('Error. Perhaps choose another username...')
        }
    }

    const close = (user: UserUI | undefined) => {
        reset();
        props.callback(user);
    }

    return (
        <Form
            title={'Create a new user'}
            statusMessage={statusMessage}
            submit={createUser}
            callback={() => close(undefined)}
        >
            <TextField
                id={'username'}
                label={'Username'}
                value={username}
                placeholder={'User'}
                length={AppSettings.USERNAME_MAX_LENGTH}
                width={'200px'}
                onChange={(e) => setUsername(e)}
            />
        </Form>
    );
}