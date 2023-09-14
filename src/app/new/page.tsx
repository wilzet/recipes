'use client'
import { useRouter } from 'next/navigation';
import { UserUI } from '@/types/user';
import Button from '@/components/button';
import TextField from '@/components/text-field';

export default function Page() {
    const { push } = useRouter();

    const createUser = async () => {
        alert('User');
    }

    return (
        <div className='main'>
            <div className='containerH'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--default-foreground-color)'}}>Create a new user</h2>
                    <TextField
                        id={'username'}
                        label={'Username'}
                        name={'User'}
                        placeholder={'User'}
                        className={''}
                        width={'200px'}
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