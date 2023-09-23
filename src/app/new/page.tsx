'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import TextField from '@/components/text-field';
import apiRequest from '@/lib/api-request';
import { UserResponse } from '@/lib/types/user';

export default function Page() {
    const [username, setUsername] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string | null>();
    const { push } = useRouter();

    const createUser = async () => {
        if (username === '') return;

        const options = {
            method: 'POST'
        };
        const response = await apiRequest<UserResponse>(`api/users/${username}`, options)
            .catch(e => console.log(e));
    
        if (response && !response.error) {
            push(`/?user=${response.user?.name}`);
        } else {
            setStatusMessage('Error. Perhaps choose another username...')
        }
    }

    return (
        <div className='main'>
            {statusMessage && <h2>{statusMessage}</h2>}
            <div className='containerH'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--color-gray)'}}>Create a new user</h2>
                    <TextField
                        id={'username'}
                        label={'Username'}
                        value={username}
                        placeholder={'User'}
                        class={''}
                        length={10}
                        width={'200px'}
                        onChange={setUsername}
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
        </div>
    );
}