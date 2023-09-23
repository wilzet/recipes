'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserResponse } from '@/lib/types/user';
import { PostRequest, PostResponse } from '@/types/post';
import { UserUI } from '@/lib/types/user';
import AppSettings from '@/lib/appsettings';
import apiRequest from '@/lib/api-request';
import Button from '@/components/button';
import TextField from '@/components/text-field';
import DateField from '@/components/date-field';

export default function Page() {
    const [selectedUser, setSelectedUser] = useState<UserUI>();
    const [statusMessage, setStatusMessage] = useState<string | null>();
    const [title, setTitle] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const searchUser = useSearchParams().get('user');
    const { push, replace } = useRouter();

    useEffect(() => {
        const asyncCall = async () => {
            if (searchUser) {
                await fetchUser(searchUser);
                replace('/new/recipe');
            } else if (!selectedUser) {
                push('/');
            }
        }

        asyncCall();
    }, []);

    const fetchUser = async (username: string) => {
        const response = await apiRequest<UserResponse>(`/api/users/${username}`)
            .catch(e => console.log(e));
    
        if (response && !response.error) setSelectedUser(response.user);
    }

    const createPost = async () => {
        if (!selectedUser || url === '' || !date) {
            setStatusMessage('Empty fields...');
            return;
        }

        let body: PostRequest = {
          url: url,
          author: selectedUser.name,
          date: date,
        }

        if (title !== '') {
            body = { title: title, ...body };
        }

        console.log(body);

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        const response = await apiRequest<PostResponse>('/api/recipes/create', options)
          .catch(e => console.log(e));

        if (response && !response.error) {
            push(`/?user=${selectedUser.name}`);
        } else {
            setStatusMessage('Error while posting...')
        }
    }

    const formatDate = (date: Date) => {
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return year+'-'+month+'-'+day;
    }

    return (
        <div className='main'>
            {statusMessage && <h2>{statusMessage}</h2>}
            <div className='containerH'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--color-gray)'}}>Post a new recipe</h2>
                    <TextField
                        id={'url'}
                        label={'URL'}
                        value={url}
                        placeholder={'https://...'}
                        class={''}
                        width={'60vw'}
                        onChange={(e) => setUrl(e)}
                    />
                    <TextField
                        id={'title'}
                        label={'Title'}
                        value={title}
                        placeholder={'Optional'}
                        class={''}
                        length={AppSettings.POSTTITLE_MAX_LENGTH}
                        width={'60vw'}
                        onChange={(e) => setTitle(e)}
                    />
                    <DateField
                        id={'date'}
                        label={'Date'}
                        value={formatDate(date)}
                        class={''}
                        onChange={(e) => setDate(new Date(e))}
                    />
                    <div className='containerH' style={{marginTop: '20px'}}>
                        <Button
                            value={'Back'}
                            class={'buttonBlue'}
                            active={true}
                            onClick={() => push(`/?user=${selectedUser?.name}`)}
                        />
                        <Button
                            value={'Submit'}
                            class={'buttonGreen'}
                            active={true}
                            onClick={() => createPost()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}