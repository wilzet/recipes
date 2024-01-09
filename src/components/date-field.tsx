import React, { useEffect, useState } from 'react';
import { formatDate, isNumeric, isValidFormat } from '@/lib/helper';

interface DateFieldComponentProps {
    id: string,
    label: string,
    value: string,
    onChange: (e: string) => any,
}

export default function DateField(props: DateFieldComponentProps) {
    const [value, setValue] = useState<string>(props.value);

    useEffect(() => {
        const dateField = document.querySelector(`#${props.id}-datepicker`) as HTMLInputElement;
        
        dateField.addEventListener('click', (e) => {
            e.preventDefault();
        });
        dateField.addEventListener('focus', (e) => {
            e.preventDefault();
        });

        return () => {
            dateField.removeEventListener('click', (e) => {
                e.preventDefault();
            });
            dateField.removeEventListener('focus', (e) => {
                e.preventDefault();
            });
        }
    }, []);

    const handleInput = (e: string) => {
        let newValue = e;

        if (!isValidFormat(newValue)) {
            return;
        }

        if (newValue.length > value.length) {
            if (isNumeric(newValue[newValue.length - 1]) && (newValue.length === 4 || newValue.length === 7)) {
                newValue = newValue + '-';
            } else if (isNumeric(newValue[newValue.length - 1]) && (newValue.length === 5 || newValue.length === 8)) {
                newValue = newValue.slice(0, newValue.length - 1) + '-' + newValue[newValue.length - 1];
            } else if (!isNumeric(newValue[newValue.length - 1])) {
                return;
            }
        } else {
            if (newValue.length === 4 || newValue.length === 7) {
                newValue = newValue.slice(0, newValue.length - 1);
            }
        }

        setValue(newValue);
        props.onChange(e);
    }

    const showDatePicker = () => {
        const dateField = document.querySelector(`#${props.id}-datepicker`) as HTMLInputElement;
        dateField.showPicker();
    }

    return (
        <>
            {props.label && <h3 style={{marginBottom: '1px', color: 'var(--color-pink)'}}>{props.label}</h3>}
            <div style={{ position: 'relative' }}>
                <input
                    id={props.id + '-datepicker'}
                    type='date'
                    value={props.value}
                    onChange={(e) => handleInput(e.target.value)}
                    min='2023-01-01'
                    max={(() => {
                        const date = new Date();
                        date.setFullYear(date.getFullYear() + 1);
                        return formatDate(date);
                    })()}
                    tabIndex={-1}
                />
                <div
                    id={props.id + '-datepicker-area'}
                    className={'datepicker-area'}
                    onClick={showDatePicker}
                    tabIndex={-1}
                />
                <input
                    id={props.id}
                    type='text'
                    value={value}
                    maxLength={10}
                    placeholder='YYYY-MM-DD'
                    className={'datepicker-text'}
                    style={{ textAlign: 'left' }}
                    onChange={(e) => handleInput(e.target.value)}
                    autoComplete='off'
                />
            </div>
        </>
    );
}