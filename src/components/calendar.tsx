import React, { useState, useMemo, useEffect } from 'react';
import { PostUI } from '@/lib/types/post';
import { RecipeAllRequest, RecipeAllResponse } from '@/lib/types/recipe-all';
import Grid from '@/components/grid';
import Button from '@/components/button';
import apiRequest from '@/lib/api-request';


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

        console.log(startdate, enddate)
        console.log(response?.posts);

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
        const dayRecipes = recipes ? recipes.filter(v => {
            const dayIndex = v.date.getDate() - 1;
            return dayIndex === index;
        }) : undefined;
        return (
            <div key={index} className='calendar-grid-item' style={{ justifyContent: 'normal', alignItems: 'normal', aspectRatio: '1', gridColumnStart: offset }}>
                <p style={{ padding: '1px 4px', margin: '0px', textAlign: 'left', verticalAlign: 'top', fontWeight: 400 }}>
                    {day}
                </p>
                {dayRecipes && <div className='containerV'>
                    {dayRecipes.map((val, index) => {
                        return (
                            <div key={index} style={{ width: '50%', height: '10%', backgroundColor: 'var(--color-pink)', borderRadius: 'var(--border-radius)', padding: '4px 4px 0px 4px', margin: '2px', textAlign: 'left'}}/>
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