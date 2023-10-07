import React from 'react';
import Button from '@/components/button';

interface FormComponentProps {
    title: string,
    statusMessage: string | null
    active: boolean,
    submit: () => any,
    callback: () => any,
    children: string | JSX.Element | JSX.Element[],
}

export default function Form(props: FormComponentProps) {
    return props.active ? (
        <div className='main'>
            <div className='containerH'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--color-gray)'}}>{props.title}</h2>
                    {props.statusMessage && <h2>{props.statusMessage}</h2>}
                    {props.children}
                    <div className='containerH' style={{marginTop: '20px'}}>
                        <Button
                            value={'Back'}
                            class={'buttonBlue'}
                            active={true}
                            onClick={props.callback}
                        />
                        <Button
                            value={'Submit'}
                            class={'buttonGreen'}
                            active={true}
                            onClick={props.submit}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : "";
}