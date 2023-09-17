import React, { useEffect, useState } from "react";

interface AnimateHeightComponentProps {
    class: string,
    duration: number,
    hide?: Boolean,
    heightHook: () => string,
    children: string | JSX.Element | JSX.Element[],
}

export default function AnimateHeight(props: AnimateHeightComponentProps) {
    const [visibilityType, setVisibilityType] = useState<string>('visible');

    useEffect(() => {
        const element = document.getElementById(props.class);

        if (element) {
            setVisibilityType(element.style.visibility);
            console.log(visibilityType);

            element.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'max-height') {
                    const style = window.getComputedStyle(element);
                    const targetHeight = style.getPropertyValue('max-height');
                    if (targetHeight === '0px') {
                        element.style.visibility = 'hidden';
                    }
                }
            });

            element.addEventListener('transitionstart', (e) => {
                if (e.propertyName === 'max-height') {
                    element.style.visibility = visibilityType;
                }
            });
        }
    }, []);

    return (
        <div id={props.class} className={props.class} style={{maxHeight: props.heightHook(), transition: `max-height ${props.duration}ms`}}>
            {props.children}
        </div>
    );
}