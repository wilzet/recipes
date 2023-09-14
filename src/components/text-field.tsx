import React from 'react';

export default function TextField(props: any) {
    return (
        <label>
            {props.label && <h3 style={{marginBottom: '1px', color: 'var(--color-pink)'}}>{props.label}</h3>}
            <input
                id={props.id}
                type='text'
                autoComplete='off'
                value={props.value}
                placeholder={props.placeholder}
                className={props.class}
                maxLength={props.length}
                style={{width: props.width}}
                onChange={(e) => props.onChange(e.target.value)}
            >
            </input>
        </label>
    );
}