import React from 'react';

interface TextAreaComponentProps {
    id: string,
    label: string,
    value: string,
    placeholder: string,
    rows: number,
    columns: number,
    class?: string,
    length?: number,
    width: string,
    onChange: (e: string) => any,
}

export default function TextArea(props: TextAreaComponentProps) {
    return (
        <div>
            {props.label && <h3 style={{paddingTop: '6px', marginBottom: '2px', color: 'var(--color-pink)'}}>{props.label}</h3>}
            <textarea
                id={props.id}
                autoComplete='off'
                value={props.value}
                placeholder={props.placeholder}
                className={props.class}
                maxLength={props.length ?? -1}
                rows={props.rows}
                cols={props.columns}
                style={{ maxWidth: props.width }}
                onChange={(e) => props.onChange(e.target.value)}
            >
            </textarea>
        </div>
    );
}