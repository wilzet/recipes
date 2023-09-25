import React, { useState, useMemo } from 'react';
import Grid from '@/components/grid';
import Button from '@/components/button';

interface CalendarComponentProps {

}

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

const dayNames = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
];

const getNameOfMonth = (date: Date) => {
    return monthNames[date.getMonth()]
}

const getCurrentMonth = () => {
    const date = new Date();
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
}

export default function Calendar(props: CalendarComponentProps) {
    const [month, setMonth] = useState<Date>(getCurrentMonth());
    
    const days = useMemo(() => {
        return Array.from({length: daysInMonth(month)}, (_, i) => i + 1)
    }, [month])

    const firstDayOffset = useMemo(() => {
        return (month.getDay() + 6) % 7 + 1;
    }, [month]);

    const prevMonth = () => {
        const date = new Date(month);
        date.setUTCMonth(date.getMonth() - 1);
        setMonth(date);
    }

    const nextMonth = () => {
        const date = new Date(month);
        date.setUTCMonth(date.getMonth() + 1);
        setMonth(date);
    }

    const renderDayName = (name: string, index: number) => {
        return (
          <div key={index} className='calendar-grid-item'>
            <p style={{ fontWeight: 700 }}>
                {name}
            </p>
          </div>
        );
    }

    const renderDay = (day: number, index: number) => {
        const offset = index == 0 ? firstDayOffset : undefined;
        return (
            <div key={index} className='calendar-grid-item' style={{ justifyContent: 'normal', alignItems: 'normal', aspectRatio: '1', gridColumnStart: offset }}>
                <p style={{ padding: '1px 4px', margin: '0px', textAlign: 'left', verticalAlign: 'top', fontWeight: 400 }}>
                    {day}
                </p>
            </div>
        );
    }

    return (
        <div className='containerV'>
            <div className='containerH calendar-container' style={{padding: '0px 6px'}}>
                <Button
                    value={'Previous'}
                    active={true}
                    class={'buttonBlue containerH'}
                    onClick={prevMonth}
                />
                <h2>{getNameOfMonth(month)}｜{month.getFullYear()}</h2>
                <Button
                    value={'Next'}
                    active={true}
                    class={'buttonBlue containerH'}
                    onClick={nextMonth}
                />
            </div>

            <Grid<string>
                class={'calendar-grid-container'}
                data={dayNames}
                element={renderDayName}
            />
            
            <Grid<number>
                class={'calendar-grid-container'}
                data={days}
                element={renderDay}
            />
        </div>
    );
}