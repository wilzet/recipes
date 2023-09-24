'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserResponse } from '@/lib/types/user';
import AppSettings from '@/lib/appsettings';
import apiRequest from '@/lib/api-request';
import Button from '@/components/button';
import TextField from '@/components/text-field';

export default function Page() {
    const [username, setUsername] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string | null>();
    const { push } = useRouter();

    const createUser = async () => {
        if (username === '') {
            setStatusMessage('Type a username...')
            return;
        }

        const options = {
            method: 'POST'
        };
        const response = await apiRequest<UserResponse>(`/api/users/${username}`, options)
            .catch(e => console.log(e));
    
        if (response && !response.error) {
            push(`/?user=${response.user?.name}`);
        } else {
            setStatusMessage('Error. Perhaps choose another username...')
        }
    }

    return (
        <div className='main'>
            <div className='containerH'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--color-gray)'}}>Create a new user</h2>
                    <TextField
                        id={'username'}
                        label={'Username'}
                        value={username}
                        placeholder={'User'}
                        class={''}
                        length={AppSettings.USERNAME_MAX_LENGTH}
                        width={'200px'}
                        onChange={(e) => setUsername(e)}
                    />
                    <div className='containerH' style={{marginTop: '20px'}}>
                        <Button
                            value={'Back'}
                            class={'buttonBlue'}
                            active={true}
                            onClick={() => push('/')}
                        />
                        <Button
                            value={'Submit'}
                            class={'buttonGreen'}
                            active={true}
                            onClick={() => createUser()}
                        />
                    </div>
                </div>
            </div>
            {statusMessage && <h2>{statusMessage}</h2>}
        </div>
    );
}