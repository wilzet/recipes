import React from 'react';

/*
    Made with help from this resource: https://jhey.dev/cheep/circular-text-with-css/
    This .tsx file is closely linked with the text-ring css file
*/

interface TextRingComponentProps {
    text: string,
    fontSize: number,
    characterWidth: number,
    offsetAngle: number,
    style?: React.CSSProperties,
    blankEnd?: number,
}

export default function TextRing(props: TextRingComponentProps) {
    let text = props.text;
    if (props.blankEnd && props.blankEnd > 0) {
        text += " ".repeat(props.blankEnd);
    }

    const chars = text.split('');
    const innerAngle = chars.length > 0 ? 360 / chars.length : 360;
    const radius = 1 / Math.sin(innerAngle * Math.PI / 180);
    const style = { '--total': chars.length, '--radius': radius, '--font-size': props.fontSize, '--character-width': props.characterWidth, '--size': (radius * props.characterWidth + 1) * 2 } as React.CSSProperties;
    const charStyle = (index: number) => ({ '--index': index, '--offset-angle': props.offsetAngle } as React.CSSProperties);

    const renderChar = (char: string, index: number) => {
        if (index >= props.text.length) {
            return (
                <></>
            );
        }

        return (
            <span key={index} style={charStyle(index)}>
                {char}
            </span>
        );
    }

    return (
        <span
            className={'text-ring'}
            style={{ ...props.style, ...style }}
        >
            {chars.map((char, index) => renderChar(char, index))}
        </span>
    );
}