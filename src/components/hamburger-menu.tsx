import React, { useState, useEffect, useRef, PropsWithChildren } from 'react';
import Button from '@/components/button';

interface HamburgerMenuComponentProps {
    centerText?: string,
    width: number,
    triggerWidth: number,
}

export default function HamburgerMenu(props: PropsWithChildren<HamburgerMenuComponentProps>) {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const ref = useRef<any>();

    useEffect(() => {
        if (props.width >= props.triggerWidth) {
            setShowMenu(false);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, [props.width]);

    const renderChildren = () => {
        return (
            <div className='hamburger-container' style={{ right: props.width < props.triggerWidth ? '70px' : '15px' }}>
                {props.children}
            </div>
        );
    }

    return (
        <>
            {props.width < props.triggerWidth ? <>
                {showMenu && renderChildren()}
                <div ref={ref} style={{ position: 'absolute', right: '15px' }}>
                    <Button
                        value={''}
                        active={true}
                        style={{  aspectRatio: '1' }}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <div className='hamburger-icon'/>
                    </Button>
                </div>
            </> : renderChildren()}
        </>
    );
}