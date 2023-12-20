import React from 'react';
import { PostUI } from '@/types/post';
import AppSettings from '@/lib/appsettings';

interface CalendarDayComponentProps {
    key: string | number,
    username?: string,
    day: number,
    month: number,
    year: number,
    weekend: boolean,
    offset: number | undefined,
    recipes: PostUI[] | undefined,
    callback: (data: PostUI[] | undefined, day: number) => any,
}

export default function CalendarDay(props: CalendarDayComponentProps) {
    const specialDay = () => {
        const specialDates = AppSettings.SPECIAL_DATES;
        const date = (props.month + 1).toString().padStart(2, "0") + props.day.toString().padStart(2, "0");
        return specialDates.includes(date);
    }

    const today = () => {
        const today = new Date();
        return today.getDate() === props.day && today.getMonth() === props.month && today.getFullYear() === props.year;
    }

    let backgroundColor = 'var(--color-white)';
    let color = 'var(--color-gray)';
    if (specialDay()) {
        backgroundColor = 'var(--color-pink)';
        color = 'var(--color-white)';
    } else if (props.weekend) {
        backgroundColor = 'var(--color-blue)';
        color = 'var(--color-white)';
    }

    return (
        <button style={{ aspectRatio: '1', gridColumnStart: props.offset }} onClick={() => props.callback(props.recipes, props.day)}>
            <div className='calendar-grid-item containerV' style={{ justifyContent: 'normal', alignItems: 'normal', aspectRatio: '1' }}>
                <div className='calendar-grid-item-daybox-number' style={{ color: color, backgroundColor: backgroundColor }}>
                    {props.day}
                </div>
                {props.recipes && props.recipes.length > 0 && <div className='containerV' style={{ width: '100%', display: 'inline-block', overflowY: 'auto', marginTop: '2px' }}>
                    <div className='calendar-grid-item-daybox' style={{ height: '0px' }}/>
                    {props.recipes.map((val, index) => {
                        return (
                            <div key={index} className='calendar-grid-item-daybox containerH' style={{ backgroundColor: val.authorName === props.username ? 'var(--color-lightblue)' : 'var(--color-pink)' }}>
                                {val.rating && `${val.rating}/5`}
                            </div>
                        );
                    })}
                </div>}
                {today() && <div style={{ position: 'absolute', top: '4px', right: '4px', width: '10px', height: '10px', backgroundColor: 'var(--color-red)', borderRadius: 'var(--border-radius)' }}/>}
            </div>
        </button>
    );
}