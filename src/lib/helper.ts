export function isNumeric(str: string) {
    return /^\d+$/.test(str);
}

export function formatDate(date: Date) {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return year+'-'+month+'-'+day;
}

export function isValidFormat(date: string) {
    // Check ISO date
    return /^(\d|$)(\d|$)(\d|$)(\d|$)(-|$)((0|$)([1-9]|$)|(1|$)([0-2]|$))(-|$)((0|$)([1-9]|$)|([12]|$)(\d|$)|(3|$)([01]|$))$/.test(date);
}

export function isFormatted(date: string) {
    return date === formatDate(new Date(date));
}