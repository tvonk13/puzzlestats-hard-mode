import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, IconButton, TextField, makeStyles } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/CloseRounded';
import DoneIcon from '@material-ui/icons/DoneRounded';
import DatePickerTextField from '../Utils/DatePickerTextField';
import CustomDatePicker from '../Utils/CustomDatePicker';
import * as util from '../Utils/util';
import * as amplify from '../Utils/amplifyUtil';

const useStyles = makeStyles((theme) => ({
    notes: {
        width: 200
    },
    datePicker: {
        width: 100
    },
    numLookups: {
        width: 65,
    },
    timeElapsed: {
        width: 90,
    },
    inputFont: {
        fontSize: 14
    },
    disabled: {
        color: theme.palette.secondary.light,
    }
}))

export default function EditableTableRow({row, labelId, closeEditModeHandler, saveEditedStatHandler, statList}) {
    const styles = useStyles();
    const moment = require('moment');
    const fromSourceNyt = util.fromSourceNyt(row.source);

    const [puzzleDate, setPuzzleDate] = useState(util.unixToMoment(row.puzzle_date));
    const [firstSolved, setFirstSolved] = useState(row.first_solved === null ? null : util.unixToMoment(row.first_solved));
    const [timeElapsed, setTimeElapsed] = useState(util.secondsToMoment(row.time_elapsed));
    const [notes, setNotes] = useState(row.notes === null ? '' : row.notes);
    const [numLookups, setNumLookups] = useState(row.num_lookups === null ? 0 : row.num_lookups);
    const [weekday, setWeekday] = useState(row.weekday);
    const [puzzleDateErrorProps, setPuzzleDateErrorProps] = useState({error: false});
    const [firstSolvedErrorProps, setFirstSolvedErrorProps] = useState({error: false});
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        var calculatedWeekday = util.weekdays[util.unixToMoment(puzzleDate).day()];
        setWeekday(calculatedWeekday);
    }, [puzzleDate])

    useEffect(() => {
        setHasError(puzzleDateErrorProps.error || firstSolvedErrorProps.error)
    }, [puzzleDateErrorProps, firstSolvedErrorProps])

    useEffect(() => {
        //PUZZLE DATE
        // Don't show error if the input date is the same as the stat's current date
        if (util.puzzleDateExists(statList, puzzleDate) && !util.momentDatesEqual(puzzleDate, util.unixToMoment(row.puzzle_date))) {
            setPuzzleDateErrorProps({
                error: true,
                helperText: "Date exists"
            });
        } else {
            setPuzzleDateErrorProps({
                error: false
            })
        }

        //DATE COMPLETED
        if (firstSolved !== null && util.dateBefore(firstSolved, puzzleDate)) {
            setFirstSolvedErrorProps({
                error: true,
                helperText: "Can't be before puzzle date"
            });
        } else {
            setFirstSolvedErrorProps({
                error: false
            })
        }
    }, [puzzleDate, firstSolved])

    function handleSave(statId) {
        const stat = { 
            id: statId,
            weekday: moment(puzzleDate).day()
        }

        if (!fromSourceNyt) {
            stat.puzzle_date = util.momentToUnix(puzzleDate);
            stat.time_elapsed = util.getTotalSecondsFromMoment(timeElapsed);
            stat.first_solved = null;
            if (firstSolved !== null && !Number.isNaN(firstSolved._i)) {
                stat.first_solved = util.momentToUnix(firstSolved)
            }
        }

        if (notes !== null && notes !== "") {
            stat.notes = notes
        }
        if (numLookups !== null && numLookups !== "") {
            stat.num_lookups = parseInt(numLookups)
        }

        closeEditModeHandler();

        amplify.updateStat(stat).then(
            updatedStat => {
                console.log(updatedStat);
                saveEditedStatHandler(stat, null);
            },
            error => {
                console.log(error);
                saveEditedStatHandler(null, error);
            }
        )
    }

    return (
        <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.id}
        >
            <TableCell padding="checkbox"></TableCell>
            {
                fromSourceNyt
                ? 
                <>
                <TableCell id={labelId} scope="row">{util.unixToFormattedDate(row.puzzle_date)}</TableCell>
                <TableCell align="left">{util.unixToFormattedDate(row.first_solved)}</TableCell>
                <TableCell align="left">{util.secondsToFormattedTime(row.time_elapsed)}</TableCell>
                </>
                :
                <>
                <TableCell id={labelId} scope="row">
                    <CustomDatePicker 
                        dateValue={puzzleDate}
                        changeHandler={setPuzzleDate}
                        clearable={false}
                        errorProps={puzzleDateErrorProps}
                    />
                </TableCell>
                <TableCell align="left">
                    <CustomDatePicker 
                        dateValue={firstSolved}
                        changeHandler={setFirstSolved}
                        clearable={true}
                        errorProps={firstSolvedErrorProps}
                    /> 
                </TableCell>
                <TableCell align="left">
                    <TimePicker
                        ampm={false}
                        margin="dense"
                        openTo="minutes"
                        views={["hours", "minutes", "seconds"]}
                        format="HH:mm:ss"
                        TextFieldComponent={({onClick, value}) =>
                            <DatePickerTextField onClick={onClick} value={value} className={styles.timeElapsed} />
                        }
                        value={timeElapsed}
                        onChange={setTimeElapsed}
                    />
                </TableCell>
                </>
            }
            <TableCell align="left">
                <TextField
                    id="outlined-number"
                    type="number"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    value={numLookups}
                    onChange={(event) => setNumLookups(event.target.value)}
                    className={styles.numLookups}
                />
            </TableCell>
            <TableCell align="left">{util.weekdays[row.weekday]}</TableCell>
            <TableCell align="left">
                <TextField
                    multiline
                    rowsMax="4"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    variant="outlined"
                    margin="dense"
                    className={styles.notes}
                    InputProps={{
                        classes: {
                            input: styles.inputFont
                        }
                    }}
                />
            </TableCell>
            <TableCell align="left">{util.typeToString(row.source)}</TableCell>
            <TableCell align="right">
                <IconButton 
                    size="small" 
                    onClick={closeEditModeHandler}
                >
                    <CloseIcon fontSize="small" color="secondary"/>
                </IconButton>
                <IconButton 
                    size="small"
                    onClick={() => handleSave(row.id)}
                >
                    <DoneIcon fontSize="small" color="secondary"/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}