var moment = require('moment');

export var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export var sources = ["NYT", "Manual"];
export var errorMessage = "Oops! There was an error. Data not saved.";
export var successMessage = "Data saved!";
export var dateFormat = "MM/DD/YYYY";
export var snackBarTimeout = 3000;
export var sourceTypeNYT = 0;
export var sourceTypeManual = 1;
export var firstNytDate = "1993-11-21";
export const nytDateFormat = "YYYY-MM-DD";
const baseUrl = 'https://w0dlzf1cqk.execute-api.us-west-2.amazonaws.com/develop';

export function getWeekdayToday() {
    return weekdays[moment().day()];
}

export function now() {
    return moment();
}

export function nowUnix() {
    return momentToUnix(now());
}

export function todayUnix() {
    return moment().hour(0).minute(0).second(0).unix();
}

export function getUnixStart(unix) {
    return moment.unix(unix).hours(0).minutes(0).seconds(0).unix();
}

export function getUnixEnd(unix) {
    return moment.unix(unix).hours(23).minutes(59).seconds(59).unix();
}

export function getTodaysUnixStart() {
    return getUnixStart(nowUnix());
}

export function getTodaysUnixEnd() {
    return getUnixEnd(nowUnix());
}


export function secondsToFormattedTime(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var remainingSeconds = totalSeconds - hours * 3600;
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds - minutes * 60;

    return paddedTime(hours, minutes, seconds);
}

export function secondsToMoment(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var remainingSeconds = totalSeconds - hours * 3600;
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds - minutes * 60;

    return moment.utc(0).hours(hours).minutes(minutes).seconds(seconds);
}

export function unixToFormattedDate(unixTimestamp) {
    return moment.unix(unixTimestamp).format(dateFormat);
}

export function unixToFormattedDateWithFormat(unixTimestamp, format) {
    return moment.unix(unixTimestamp).format(format);
}

export function momentToUnix(momentDate) {
    if (momentDate === null) return null;
    return momentDate.unix();
}

export function unixToMoment(unixTimestamp) {
    return moment.unix(unixTimestamp);
}

export function getWeekdayFromUnix(unixTimestamp) {
    return moment.unix(unixTimestamp).weekday()
}

export function formatMomentToDateString(date) {
    return date.format(dateFormat);
}

export function formattedDateStringToMoment(dateString, format) {
    return moment(dateString, format);
}

export function formatMomentToDateStringWithFormat(date, format) {
    return date.format(format);
}

export function puzzleDateExists(stats, date) {
    return stats.some((stat) => {
        var statDate = unixToMoment(stat.puzzle_date);
        return momentDatesEqual(statDate, date);
    })
}

export function getTodaysStat(stats) {
    return stats.find((stat) => {
        var puzzleDate = moment(stat.puzzle_date);
        return momentDatesEqual(puzzleDate, moment());
    });
}

export function getTotalSecondsFromMoment(momentTime) {
    var hours = momentTime.hours() * 3600;
    var minutes = momentTime.minutes() * 60;
    var seconds = momentTime.seconds();

    return hours + minutes + seconds;
}

export function dateBefore(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isBefore(moment(date2), 'day');
}

export function dateSameOrBefore(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isSameOrBefore(moment(date2), 'day');
}

export function dateAfter(date1, date2) {
    if (date1 === null) return false;
    if (date2 === null) return true;
    return moment(date1).isAfter(moment(date2), 'day');
}

export function isFutureDate(date) {
    return date.isAfter(moment(), 'day');
}

export function addDays(date, numDays) {
    return date.add(numDays, 'days')
}

export function isBlankOrNull(value) {
    return value === '' || value === null;
}

export function compareStatsByPuzzleDate(a, b) {
    if (a.puzzle_date < b.puzzle_date) return 1;
    if (a.puzzle_date > b.puzzle_date) return -1;
    return 0;
}

export function compareStatsByPuzzleDateAsc(a, b) {
    if (a.puzzle_date < b.puzzle_date) return -1;
    if (a.puzzle_date > b.puzzle_date) return 1;
    return 0;
}

// Link to daily puzzle
export function getNYTLink() {
    var date = now();
    return "https://www.nytimes.com/crosswords/game/daily/" + date.year() + "/" + (date.month() + 1) + "/" + date.date();
}

export function typeToString(type) {
    if (fromSourceNyt(type)) return "NYT";
    return "Manual";
}

export function fromSourceNyt(type) {
    return (type === sourceTypeNYT);
}

export function momentDatesEqual(date1, date2) {
    if (date1 === null || date2 === null) return false;
    return moment(date1).isSame(date2, 'day');
    //return date1.year().valueOf() === date2.year().valueOf() && date1.month().valueOf() === date2.month().valueOf() && date1.date().valueOf() === date2.date().valueOf()
}

export function unixDatesEqual(date1, date2) {
    if (date1 === null || date2 === null) return false;
    date1 = unixToMoment(date1);
    date2 = unixToMoment(date2);
    return momentDatesEqual(date1, date2);
}

export function formattedDateToUnix(date) {
    return moment(date).unix();
}

export function getDaysDiff(date1, date2) {
    return date1.diff(date2, 'days');
}

/*---------- NYT SYNCING ----------*/

function createLoginString(nytEmail, nytPassword) {
    var base = baseUrl;
    var fetchString = base + '?' + 'username=' + nytEmail;
    fetchString += '&' + 'password=' + nytPassword;
    return fetchString
}

export async function nytLogin(nytEmail, nytPassword) {
    return await fetch(createLoginString(nytEmail, nytPassword), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(result => result.jwt)
        .catch(err => console.log(err));
}

export async function nytFetchData(jwt, date) {
    return await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'jwt': jwt,
            'date': date
        })
    })
        .then(res => res.json())
        .then(result => result.data)
        .catch(err => console.log(err));
}

export async function getDataForDate(date, nytEmail, nytPassword) {
    return await nytLogin(nytEmail, nytPassword)
        .then(jwt => nytFetchData(jwt, date))
        .catch(err => console.log(err));
}

/*---------- HELPER METHODS ----------*/

function pad(num) {
    var numString = num + "";
    if (numString.length < 2) numString = "0" + numString;
    return numString;
}

function paddedTime(hours, minutes, seconds) {
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); 
}