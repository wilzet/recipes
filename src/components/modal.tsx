import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
ReactModal.setAppElement('#main');

interface ModalComponentProps {
    active: boolean,
    children: string | JSX.Element | JSX.Element[],
}

export default function Modal(props: ModalComponentProps) {
    useEffect(() => {
        if (props.active) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "scroll"
        };
    }, [props.active]);

    return (
        <ReactModal
            isOpen={props.active}
            style={{ overlay: { backgroundColor: 'rgba(1, 1, 1, 0)', },
                     content: { backgroundColor: 'rgba(1, 1, 1, 0)', border: 'none' }}}
            closeTimeoutMS={300}
        >
            {props.active && <div id='content'>
                {props.children}
            </div>}
        </ReactModal>
    )
}