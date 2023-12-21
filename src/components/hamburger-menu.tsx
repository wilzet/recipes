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
            <div style={{ position: 'absolute', right: props.width < props.triggerWidth ? '60px' : '5px', marginBottom: '0px' }}>
                {props.children}
            </div>
        );
    }

    return (
        <h3 ref={ref} className='containerV' style={{ paddingBottom: '15px' }}>
            {props.centerText}
            {props.width < props.triggerWidth ? <>
                {showMenu && renderChildren()}
                <div ref={ref} style={{ position: 'absolute', right: '5px' }}>
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
      </h3>
    );
}