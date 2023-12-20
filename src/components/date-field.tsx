import React from 'react';

interface DateFieldComponentProps {
    id: string,
    label: string,
    value: string,
    class?: string,
    onChange: (e: string) => any,
}

export default function DateField(props: DateFieldComponentProps) {
    return (
        <div>
            {props.label && <h3 style={{marginBottom: '1px', color: 'var(--color-pink)'}}>{props.label}</h3>}
            <input
                id={props.id}
                type='date'
                value={props.value}
                className={props.class}
                style={{ textAlign: 'left' }}
                onChange={(e) => props.onChange(e.target.value)}
            >
            </input>
        </div>
    );
}