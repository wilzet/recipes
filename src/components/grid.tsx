import React from 'react';

interface GridComponentProps<Type> {
    class: string,
    data: Type[],
    style?: React.CSSProperties,
    element: (v: Type, i: number) => JSX.Element,
}

export default function Grid<Type>(props: GridComponentProps<Type>) {
    return (
        <div className={props.class} style={props.style}>
            {props.data.map((val, index) => (
                props.element(val, index)
            ))}
        </div>
    );
}