export const dayNames = (() => {
    const weekdays: string[] = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(2023, 0, i + 1); // Using January 1, 2023, as an example date
      const weekdayName = date.toLocaleString('default', { weekday: 'short' });
      weekdays.push(weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1));
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