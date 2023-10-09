import React from 'react';

interface TextFieldComponentProps {
    id: string,
    label: string,
    value: string,
    placeholder: string,
    class: string,
    length?: number,
    width: string,
    onChange: (e: string) => any,
}

export default function TextField(props: TextFieldComponentProps) {
    return (
        <div>
            {props.label && <h3 style={{paddingTop: '6px', marginBottom: '2px', color: 'var(--color-pink)'}}>{props.label}</h3>}
            <input
                id={props.id}
                type='text'
                autoComplete='off'
                value={props.value}
                placeholder={props.placeholder}
                className={props.class}
                maxLength={props.length ?? -1}
                style={{width: props.width}}
                onChange={(e) => props.onChange(e.target.value)}
            >
            </input>
        </div>
    );
}