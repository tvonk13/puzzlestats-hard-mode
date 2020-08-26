import React, {useState, useEffect, Fragment, useContext} from "react";
import { makeStyles, Grid, TextField, Button, FormGroup, FormControlLabel, Checkbox, Collapse, Dialog, DialogContent, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { DatePicker, TimePicker } from '@material-ui/pickers'; 
import * as util from './util';
import * as amplify from './amplifyUtil';
import SyncContext from "../Contexts/SyncContext";

const useStyles = makeStyles(themeObject => ({
    input: {
        width: 200,
    },
    button: {
        marginTop: 20,
        marginBottom: 10,
        width: 85
    },
}));

function AddStatDialog({isOpen, closeDialogHandler, saveHandler}) {
    var moment = require('moment');

    const styles = useStyles();
    const [statList, setStatList] = useState([]);
    const [puzzleDate, setPuzzleDate] = useState(moment());
    const [firstSolved, setFirstSolved] = useState(moment());
    const [timeElapsed, setTimeElapsed] = useState(moment.utc(0));
    const [numLookups, setNumLookups] = useState(0);
    const [notes, setNotes] = useState();
    const [puzzleDateErrorProps, setPuzzleDateErrorProps] = useState({error: false});
    const [firstSolvedErrorProps, setFirstSolvedErrorProps] = useState({error: false});
    const [hasError, setHasError] = useState(false);
    const [solved, setSolved] = useState(true);
    const [sameDates, setSameDates] = useState(true);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState("success");
    const [snackBarMessage, setSnackBarMessage] = useState("Data saved!");
    const [{isSyncing, }, ] = useContext(SyncContext);

    useEffect(() => {
        amplify.getAllStats().then(stats => {
            setStatList(stats);
        });
    }, [isOpen]);

    useEffect(() => {
        setHasError(puzzleDateErrorProps.error || firstSolvedErrorProps.error)
    }, [puzzleDateErrorProps, firstSolvedErrorProps])

    useEffect(() => {
        setHasError(puzzleDateErrorProps.error || firstSolvedErrorProps.error)
    }, [puzzleDateErrorProps, firstSolvedErrorProps])

    useEffect(() => {
        //PUZZLE DATE
        if (util.puzzleDateExists(statList, puzzleDate)) {
            setPuzzleDateErrorProps({
                error: true,
                helperText: "An entry already exists for this date"
            });
            setHasError(true);
        } else {
            setPuzzleDateErrorProps({
                error: false
            })
            setHasError(false);
        }

        //DATE COMPLETED
        if (util.dateBefore(firstSolved, puzzleDate)) {
            setFirstSolvedErrorProps({
                error: true,
                helperText: "Date completed can't be before puzzle date"
            });
            setHasError(true);
        } else {
            setFirstSolvedErrorProps({
                error: false
            })
            setHasError(false);
        }
    }, [puzzleDate, firstSolved, statList])

    useEffect(() => {
        if (!solved && !puzzleDateErrorProps.error) {
            setHasError(false);
        }
    }, [solved, puzzleDateErrorProps])

    useEffect(() => {
        setFirstSolved(puzzleDate);
    }, [sameDates, puzzleDate]);

    function handleOpenSnackBar(severity, message, open) {
        setSnackBarMessage(message);
        setSnackBarSeverity(severity);
        setIsSnackbarOpen(open);
    }

    function handleCloseSnackBar(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
        setIsSnackbarOpen(false);
    };

    function handleSave() {
        const stat = { 
            puzzle_date: util.momentToUnix(puzzleDate),
            time_elapsed: util.getTotalSecondsFromMoment(timeElapsed),
            num_lookups: parseInt(numLookups),
            weekday: puzzleDate.day(),
            source: util.sourceTypeManual,
            solved: solved
        }
        if (solved && firstSolved !== null) {
            stat.first_solved = util.momentToUnix(firstSolved)
        }
        if (notes !== null && notes !== undefined) {
            stat.notes = notes
        }

        handleClose();

        amplify.createNewStat(stat).then(
            newStat => {
                handleOpenSnackBar("success", util.successMessage, true);
                console.log(newStat);
                saveHandler(newStat);
            },
            error => {
                console.log(error);
                handleOpenSnackBar("error", util.errorMessage, true);
            }
        )
    }

    function resetFields() {
        setPuzzleDate(moment());
        setSolved(true);
        setSameDates(true);
        setFirstSolved(moment());
        setTimeElapsed(moment.utc(0));
        setNumLookups(null);
        setNotes(null);
    }

    function handleClose() {
        closeDialogHandler();
        resetFields();
    }

    return (
        <Fragment>
            <Dialog open={isOpen} onClose={closeDialogHandler}>
                <DialogContent>
                    <form noValidate autoComplete="off" className={styles.form}>
                        <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                            <DatePicker
                                format={util.dateFormat}
                                margin="normal"
                                id="puzzleDate"
                                label="Puzzle Date"
                                disableFuture
                                autoOk
                                allowKeyboardControl
                                value={puzzleDate}
                                onChange={setPuzzleDate}
                                {...puzzleDateErrorProps}
                                className={styles.input}
                            />
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={solved} onChange={(event) => setSolved(event.target.checked)} color="primary"/>}
                                    label="Completed"
                                    style={{fontSize: 12}}
                                />
                            </FormGroup>
                            <Collapse in={solved}>
                                <Grid container direction="column">
                                    <DatePicker
                                        format={util.dateFormat}
                                        margin="normal"
                                        id="first_solved"
                                        label="Date Completed"
                                        disableFuture
                                        autoOk
                                        clearable
                                        allowKeyboardControl
                                        value={firstSolved}
                                        onChange={setFirstSolved}
                                        {...firstSolvedErrorProps}
                                        disabled={sameDates}
                                        className={styles.input}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={sameDates} onChange={(event) => setSameDates(event.target.checked)} color="primary"/>}
                                        label="Use puzzle date"
                                        style={{fontSize: 12}}
                                    />
                                </Grid>
                            </Collapse>
                            <TimePicker
                                ampm={false}
                                margin="normal"
                                id="time_elapsed"
                                openTo="minutes"
                                views={["hours", "minutes", "seconds"]}
                                format="HH:mm:ss"
                                label="Total Time"
                                value={timeElapsed}
                                onChange={setTimeElapsed}
                                className={styles.input}
                            />
                            <TextField id="numLookups" label="Num Lookups" type="number" InputLabelProps={{shrink: true}} margin="normal" defaultValue={0} onChange={(event) => setNumLookups(event.target.value)} className={styles.input}/>
                            <TextField id="notes" label="Notes" InputLabelProps={{shrink: true}}  margin="normal" onChange={(event) => setNotes(event.target.value)} className={styles.input}/>
                            <Grid container justify="space-around">
                                <Button variant="contained" color="secondary" className={styles.button} onClick={closeDialogHandler}>Cancel</Button>
                                <Button variant="contained" color="primary" className={styles.button} onClick={handleSave} disabled={hasError || isSyncing}>Save</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
            <Snackbar open={isSnackbarOpen} autoHideDuration={util.snackBarTimeout} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default AddStatDialog;