import React, { useState, useMemo, useEffect } from 'react';
import { PostUI } from '@/lib/types/post';
import { RecipeAllRequest, RecipeAllResponse } from '@/lib/types/recipe-all';
import Grid from '@/components/grid';
import Button from '@/components/button';
import apiRequest from '@/lib/api-request';
import AppSettings from '@/lib/appsettings';


interface CalendarComponentProps {
    selectedUsername: string,
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
    const [recipes, setRecipes] = useState<PostUI[]>();
    
    const days = useMemo(() => {
        return Array.from({length: daysInMonth(month)}, (_, i) => i + 1)
    }, [month]);

    const firstDayOffset = useMemo(() => {
        return (month.getDay() + 6) % 7 + 1;
    }, [month]);

    useEffect(() => {
        const asyncCall = async () => {
            await getRecipes();
        }

        asyncCall();
    }, [month]);

    const specialDay = (day: number) => {
        const specialDates = AppSettings.SPECIAL_DATES;
        const date = (month.getMonth() + 1).toString().padStart(2, "0") + day.toString().padStart(2, "0");
        return specialDates.includes(date);
    }

    const getRecipes = async () => {
        const year = month.getFullYear();
        const startdate = new Date(year, month.getMonth(), 1);
        const enddate = new Date(year, month.getMonth() + 1, 1);

        let body: RecipeAllRequest = {
            startdate: startdate,
            enddate: enddate,
        }

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        const response = await apiRequest<RecipeAllResponse>('/api/recipes/interval', options)
            .catch(e => console.log(e));

        if (response && !response.error) {
            const postsWithDates = response.posts?.map(val => {
                val.date = new Date(val.date);
                return val;
            });
            setRecipes(postsWithDates);
        }
    }

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
        const backColor = index > 4 ? 'var(--color-blue)' : 'var(--color-white)';
        const color = index > 4 ? 'var(--color-white)' : 'var(--color-gray)';
        return (
          <div key={index} className='calendar-grid-item' style={{ color: color, backgroundColor: backColor }}>
            <p style={{ fontWeight: 700,  margin: '0 auto', padding: '5px', }}>
                {name}
            </p>
          </div>
        );
    }

    const renderDay = (day: number, index: number) => {
        let backColor = 'var(--color-white)';
        let color = 'var(--color-gray)';
        if (specialDay(day)) {
            backColor = 'var(--color-pink)';
            color = 'var(--color-white)';
        } else if ((index + firstDayOffset - 1) % 7 > 4) {
            backColor = 'var(--color-blue)';
            color = 'var(--color-white)';
        }
        
        const offset = index == 0 ? firstDayOffset : undefined;
        const dayRecipes = recipes ? recipes.filter(v => {
            const dayIndex = v.date.getDate() - 1;
            return dayIndex === index;
        }) : undefined;
        return (
            <div key={index} className='calendar-grid-item containerV' style={{ justifyContent: 'normal', alignItems: 'normal', aspectRatio: '1', gridColumnStart: offset }}>
                <div className='calendar-grid-item-daybox-number' style={{ color: color, backgroundColor: backColor }}>
                    {day}
                </div>
                {dayRecipes && <div className='containerV' style={{ width: '100%', display: 'inline-block', overflowY: 'auto', marginTop: '2px' }}>
                    <div className='calendar-grid-item-daybox' style={{ height: '0px' }}/>
                    {dayRecipes.map((val, index) => {
                        return (
                            <div key={index} className='calendar-grid-item-daybox' style={{ backgroundColor: val.authorName === props.selectedUsername ? 'var(--color-lightblue)' : 'var(--color-pink)' }}/>
                        );
                    })}
                </div>}
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