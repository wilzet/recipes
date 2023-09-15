'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import TextField from '@/components/text-field';

export default function Page() {
    const [username, setUsername] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string | null>();
    const { push } = useRouter();

    const createUser = async () => {
        if (username === '') return;

        const options = {
            method: 'POST'
        };
        const response = await fetch(`api/users/${username}`, options)
            .then(res => res.json())
            .catch(e => console.log(e));
    
        if (!response.error) {
            push(`/?user=${response.user.name}`);
        } else {
            setStatusMessage('Error. Perhaps choose another username...')
        }
    }

    return (
        <div className='main'>
            {statusMessage && <h2>{statusMessage}</h2>}
            <div className='containerH'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--default-foreground-color)'}}>Create a new user</h2>
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
                    <br/>
                    <br/>
                    <div className='containerH'>
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