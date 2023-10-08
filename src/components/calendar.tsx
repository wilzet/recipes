import React, { useState, useMemo, useEffect } from 'react';
import { PostUI } from '@/types/post';
import { RecipeAllRequest, RecipeAllResponse } from '@/types/recipe-all';
import apiRequest from '@/lib/api-request';
import Grid from '@/components/grid';
import Button from '@/components/button';
import CalendarDay from '@/components/calendar-day';
import Modal from '@/components/modal';
import PostDisplay from '@/components/post-display';

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
    const [dayRecipes, setDayRecipes] = useState<PostUI[]>();
    const [showRecipes, setShowRecipes] = useState<boolean>(false);
    
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

        if (response && !response.error) {
            const postsWithDates = response.posts?.map(val => {
                val.date = new Date(val.date);
                val.createDate = new Date(val.createDate);
                val.updateDate = new Date(val.updateDate);
                return val;
            });
            setRecipes(postsWithDates);
        }
    }

    const changeMonth = (change: number) => {
        setRecipes(undefined);
        const date = new Date(month);
        date.setUTCMonth(date.getMonth() + change);
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
        let dayRecipes = recipes?.filter(val => {
            return val.date.getDate() === day;
        });
        dayRecipes = dayRecipes ? dayRecipes.length > 0 ? dayRecipes : undefined : dayRecipes;
        return (
            <CalendarDay
                key={index}
                username={props.selectedUsername}
                day={day}
                month={month.getMonth()}
                year={month.getFullYear()}
                weekend={(index + firstDayOffset - 1) % 7 > 4}
                offset={index == 0 ? firstDayOffset : undefined}
                recipes={dayRecipes}
                callback={showDayRecipes}
            />
        );
    }

    const showDayRecipes = (data: PostUI[] | undefined) => {
        if (!data) return;

        setShowRecipes(true);
        setDayRecipes(data);
    }

    return (
        <div className='containerV'>
            <div className='containerH calendar-container' style={{padding: '0px 6px'}}>
                <Button
                    value={'Previous'}
                    active={true}
                    class={'buttonBlue containerH'}
                    onClick={() => changeMonth(-1)}
                />
                <h2>{getNameOfMonth(month)}｜{month.getFullYear()}</h2>
                <Button
                    value={'Next'}
                    active={true}
                    class={'buttonBlue containerH'}
                    onClick={() => changeMonth(1)}
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

            <Modal active={showRecipes}>
                <Button
                    value={'Close'}
                    active={true}
                    class={'buttonRed'}
                    onClick={() => setShowRecipes(false)}
                />

                {dayRecipes?.map((val, index) => {
                    return <PostDisplay key={index} post={val}/>;
                })}
            </Modal>
        </div>
    );
}