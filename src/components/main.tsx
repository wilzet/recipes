import React, { PropsWithChildren } from "react";

export default function Main(props: PropsWithChildren) {
    return (
        <div className='main' id='main'>
            {props.children}
        </div>
    );
}