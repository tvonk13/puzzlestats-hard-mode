import API, { graphqlOperation } from '@aws-amplify/api'
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'

import awsconfig from '../aws-exports';
import * as util from './util';

API.configure(awsconfig);

export async function getAllStats() {
    return await API.graphql(graphqlOperation(queries.listStats)).then(function (result) {
        return result.data.listStats.items;
    });
}

export async function getStatsByWeekday(weekdayValue) {
    return await API.graphql(graphqlOperation(queries.listStats, {filter: {weekday: {eq: weekdayValue}}})).then(function (result) {
        return result.data.listStats.items;
    });
}

export async function getStatsByPuzzleDate(unixDate) {
    return await API.graphql(graphqlOperation(queries.listStats, {filter: {puzzle_date: {ge: util.getUnixStart(unixDate)}, and: {puzzle_date: {le: util.getUnixEnd(unixDate)}}}})).then(function (result) {
        return result.data.listStats.items;
    });
}

export async function getTodaysStatsByPuzzleDate() {
    return await API.graphql(graphqlOperation(queries.listStats, {filter: {puzzle_date: {ge: util.getTodaysUnixStart()}, and: {puzzle_date: {le: util.getTodaysUnixEnd()}}}})).then(function (result) {
        return result.data.listStats.items;
    });
}

export async function getStatsWithFilter(graphQLFilter) {
    return await API.graphql(graphqlOperation(queries.listStats, {filter: graphQLFilter})).then(function (result) {
        if (result.data === null) return [];
        return result.data.listStats.items;
    });
}

export async function deleteStatsById(ids) {
    var promises = [];
    ids.forEach((id) => {
        var promise =  API.graphql(graphqlOperation(mutations.deleteStat, {input: {id: id}})).then((result) => {
            return result.data.deleteStat;
        });
        promises.push(promise);
    });
    return Promise.all(promises).then((values) => {
        return values;
    });
}

export async function createNewStat(stat) {
    return API.graphql(graphqlOperation(mutations.createStat, { input: stat })).then((result) => {
        return result.data.createStat;
    });
}

export async function updateStat(stat) {
    return API.graphql(graphqlOperation(mutations.updateStat, { input: stat })).then((result) => {
        return result.data.updateStat;
    });
}

export async function createNewStatUser(statUser) {
    return API.graphql(graphqlOperation(mutations.createStatUser, { input: statUser })).then(result => {
        return result.data.updateStatUser;
    })
}

export async function getCurrentStatUser() {
    return await API.graphql(graphqlOperation(queries.listStatUsers)).then(function (result) {
        return result.data.listStatUsers.items[0];
    });
}

export async function updateStatUser(statUser) {
    return API.graphql(graphqlOperation(mutations.updateStatUser, { input: statUser })).then((result) => {
        return result.data.updateStatUser;
    });
}

export async function createStatFromNytData(nytData) {
        var puzzleDateUnix = util.formattedDateToUnix(nytData.puzzleDate)
        var stat = {
            puzzle_date: puzzleDateUnix,
            eligible: nytData.eligible,
            epoch: nytData.epoch,
            first_checked: nytData.firstChecked !== undefined ? nytData.firstChecked : null,
            first_cleared: nytData.firstCleared !== undefined ? nytData.firstCleared : null,
            first_opened: nytData.firstOpened !== undefined ? nytData.firstOpened : null,
            first_solved: nytData.firstSolved !== undefined ? nytData.firstSolved : null,
            puzzle_id: nytData.id,
            last_update_time: nytData.lastUpdateTime !== undefined ? nytData.lastUpdateTime : null,
            last_sync_time: util.nowUnix(),
            solved: nytData.solved,
            time_elapsed: nytData.timeElapsed,
            board: nytData.board,
            weekday: util.getWeekdayFromUnix(puzzleDateUnix),
            num_lookups: 0,
            source: util.sourceTypeNYT,
            notes: null
        }

        return await getStatsByPuzzleDate(stat.puzzle_date)
            .then(result => {
                if (result.length === 0) { // If entry does not exist, create a new one
                    return createNewStat(stat);
                } else if (
                    // If entry exists but is manual or is nyt update it
                    result[0].source === util.sourceTypeManual
                    || (result[0].source === util.sourceTypeNYT)
                ) {
                    // If entry is solved, just update last sync time
                    if (result[0].solved) {
                        stat = {
                            id: result[0].id,
                            last_sync_time: util.nowUnix()
                        }
                        return updateStat(stat);
                    } else {
                        stat['id'] = result[0].id;
                        return updateStat(stat);
                    }
                }
            })
            .catch(err => console.log(err));
}

export async function syncData(nytEmail, nytPassword, startDateString, endDateString, onlySyncCompleted, onComplete) {
    if (startDateString == null) return;
    if (endDateString == null) endDateString = util.formatMomentToDateStringWithFormat(util.now(), util.nytDateFormat);

    return await util.nytLogin(nytEmail, nytPassword)
        .then(jwt => {
            var startDate = util.formattedDateStringToMoment(startDateString, util.nytDateFormat);
            var endDate = util.formattedDateStringToMoment(endDateString, util.nytDateFormat);
            var date = startDate;
            var promises = []

            while (util.dateSameOrBefore(date, endDate)) {
                var dateString = util.formatMomentToDateStringWithFormat(date, util.nytDateFormat)
                //console.log('Getting data for ' + dateString)
                var promise = util.nytFetchData(jwt, dateString)
                    .then(result => {
                        if (onlySyncCompleted && !result.completed) {
                            onComplete();
                        }
                        return createStatFromNytData(result)
                    })
                    .then(onComplete)

                if (promise != null) {
                    promises.push(promise);
                }

                date = util.addDays(date, 1);
            }

            return Promise.all(promises).then((values) => {
                return values;
            });
        })
        .catch(err => console.log(err));
}