import React from 'react';

interface ButtonComponentProps {
    value: string,
    active: Boolean,
    class: string,
    onClick: () => void,
}

export default function Button(props: ButtonComponentProps) {
    return (
        <button
            disabled={!props.active}
            className={props.class}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}