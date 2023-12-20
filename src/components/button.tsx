import React, { PropsWithChildren } from 'react';

interface ButtonComponentProps {
    value: string,
    active: Boolean,
    class?: string,
    style?: React.CSSProperties,
    onClick: () => void,
}

export default function Button(props: PropsWithChildren<ButtonComponentProps>) {
    return (
        <button
            disabled={!props.active}
            className={props.class}
            onClick={props.onClick}
            style={props.style}
        >
            {props.value}
            {props.children}
        </button>
    );
}