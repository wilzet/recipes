'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Redirect() {
    const { push } = useRouter();

    useEffect(() => {
        push('/');
    }, []);

    return <p>Not implemented</p>
}