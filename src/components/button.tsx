import React from 'react';

export default function Button(props: any) {
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