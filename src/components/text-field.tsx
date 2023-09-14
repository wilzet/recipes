import React from 'react';

export default function TextField(props: any) {
    return (
        <label>
            {props.label && <h3 style={{marginBottom: '1px', color: 'var(--color-pink)'}}>{props.label}</h3>}
            <input
                id={props.id}
                type='text'
                autoComplete='off'
                name={props.default}
                placeholder={props.placeholder}
                className={props.class}
                style={{width: props.width}}
            >
            </input>
        </label>
    );
}