interface DateFormat {
    [key: string]: RegExp;
}

const formats: DateFormat = {
    "dd/mm/yyyy": /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    "yyyy-mm-dd": /^\d{4}-\d{2}-\d{2}$/,
    "mm/dd/yyyy": /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    "mm.dd.yyyy": /^\d{1,2}\.\d{1,2}\.\d{4}$/,
    "yyyy/mm/dd": /^\d{4}\/\d{1,2}\/\d{1,2}$/,
    "yyyy.mm.dd": /^\d{4}\.\d{1,2}\.\d{1,2}$/,
    "time": /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, // 12-hour format
    "24-hour": /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, // 24-hour format
    "month": /^(0?[1-9]|1[0-2])$/, // Month only
    "day": /^(0?[1-9]|[1-2][0-9]|3[0-1])$/, // Day only
    // Add more formats as needed
};

const isDate = (value: string, format: string = "dd/mm/yyyy"): boolean => {
    const regex = formats[format.toLowerCase()];
    if (!regex) {
        console.error(`Invalid date format: ${format}`);
        return false;
    }

    return regex.test(value);
};

// Example usage
// console.log(isDate("31/12/2022", "dd/mm/yyyy")); // true
// console.log(isDate("12/31/2022", "mm/dd/yyyy")); // true
// console.log(isDate("2022-12-31", "yyyy-mm-dd")); // true
// console.log(isDate("12.31.2022", "mm.dd.yyyy")); // true
// console.log(isDate("2022/12/31", "yyyy/mm/dd")); // true
// console.log(isDate("2022.12.31", "yyyy.mm.dd")); // true
// console.log(isDate("12:30 PM", "time")); // true
// console.log(isDate("23:45", "24-hour")); // true
// console.log(isDate("5", "month")); // true
// console.log(isDate("15", "day")); // true


export default isDate;
