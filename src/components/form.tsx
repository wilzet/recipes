import React, { PropsWithChildren } from 'react';
import Button from '@/components/button';

interface FormComponentProps {
    id?: string,
    title: string,
    statusMessage: string | null
    submit: () => any,
    callback: () => any,
}

export default function Form(props: PropsWithChildren<FormComponentProps>) {
    return (
        <div className='overlay-form' id={props.id}>
            <div className='overlay-form-inner'>
                <div className='form-container' style={{width: 'fit-content'}}>
                    <h2 style={{fontSize: '30px', color: 'var(--color-gray)'}}>
                        {props.title}
                    </h2>
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
                {props.statusMessage && <h2 style={{color: 'var(--color-red)', paddingBottom: '0px'}}>
                    {props.statusMessage}
                </h2>}
            </div>
        </div>
    );
}