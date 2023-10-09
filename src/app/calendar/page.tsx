'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Calendar from '@/components/calendar';
import Button from '@/components/button';

export default function Page() {
    const [selectedUser, setSelectedUser] = useState<string>();

    const searchUser = useSearchParams().get('user');
    const { push, replace } = useRouter();

    useEffect(() => {
        if (searchUser) {
            setSelectedUser(searchUser);
            replace('/calendar');
        }
    }, [searchUser]);

    return (
        <div className='main' id='main'>
            <div className='containerH left'>
                <Button
                    value={'Home'}
                    class={'buttonGreen'}
                    active={true}
                    onClick={() => push(selectedUser ? `/?user=${selectedUser}` : '/')}
                />
            </div>
            <Calendar
                selectedUsername={selectedUser}
            />
        </div>
    );
}