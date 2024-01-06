function getWeekdayName(date: Date, format: 'long' | 'short' | 'narrow' = 'short') {
    const weekdayName = date.toLocaleString('default', { weekday: format });
    return weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1);
}

export const dayNames = (() => {
    const weekdays: string[] = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(2024, 0, i + 1); // Using January 1, 2024, as an example date
      weekdays.push(getWeekdayName(date));
    }
  
    return weekdays;
})();

export const getNameOfMonth = (date: Date) => {
    const month = date.toLocaleString('default', { month: 'short' });
    return month.charAt(0).toUpperCase() + month.slice(1);
}

export const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
}

export const getCurrentMonth = () => {
    const date = new Date();
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

export const toLocaleDate = (date: Date, format: 'long' | 'short' | 'narrow') => {
    const weekdayName = getWeekdayName(date, format);
    const day = date.getDate();
    const monthName = getNameOfMonth(date);
    const year = date.getFullYear();

    return weekdayName + ' ' + day + ' ' + monthName + ' ' + year;
}