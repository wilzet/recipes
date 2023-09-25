import React from 'react';

interface GridComponentProps<Type> {
    class: string,
    data: Type[],
    active: Boolean,
    element: (v: Type, i: number) => JSX.Element,
}

export default function Grid<Type>(props: GridComponentProps<Type>) {
    return (
        <div className={props.class}>
            {props.data.map((val, index) => (
                props.element(val, index)
            ))}
      </div>
    );
}