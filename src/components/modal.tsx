import React, { useEffect, PropsWithChildren } from 'react';
import ReactModal from 'react-modal';

interface ModalComponentProps {
    active: boolean,
    parent?: string,
}

export default function Modal(props: PropsWithChildren<ModalComponentProps>) {
    useEffect(() => {
        const element = props.parent ? document.getElementById(props.parent) ?? document.body : document.body;
        if (props.active) element.style.overflow = "hidden";
        return () => {
            element.style.overflow = "scroll";
        };
    }, [props.active]);

    return (
        <ReactModal
            appElement={document.querySelector('#main') as HTMLElement}
            isOpen={props.active}
            style={{ overlay: { backgroundColor: 'rgba(1, 1, 1, 0)', },
                     content: { backgroundColor: 'rgba(1, 1, 1, 0)', border: 'none', inset: '20px' } }}
            closeTimeoutMS={300}
        >
            {props.active && <div id='content'>
                {props.children}
            </div>}
        </ReactModal>
    )
}