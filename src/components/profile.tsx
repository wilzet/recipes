import React from 'react';
import { UserUI } from '@/types/user';
import Button from '@/components/button';

interface ProfileComponentProps {
    user: UserUI | null,
    callback: () => any,
}

export default function Profile(props: ProfileComponentProps) {
    if (!props.user) {
        props.callback();
        return <></>;
    }

    return (
        <div className='containerV'>
            <div className='containerV' style={{ position: 'fixed', bottom: 'min(10vh, 25vw)', right: 'min(10vh, 10vw)', zIndex: 100 }}>
                <Button
                    value={'Close'}
                    active={true}
                    class={'buttonRed'}
                    onClick={props.callback}
                />
            </div>

            <h1>{props.user.name}</h1>
            <h2>Score: {props.user.score}</h2>
        </div>
    );
}