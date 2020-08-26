import React, {useContext, useEffect, useState} from "react";
import { Button, Collapse, FormControl, makeStyles, MenuItem, Select, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import CustomDatePicker from "../Utils/CustomDatePicker";
import * as util from "../Utils/util";
import * as amplify from "../Utils/amplifyUtil";
import SyncContext from "../Contexts/SyncContext";

const useStyles = makeStyles(theme => ({
    nytSync: {
        display: 'flex',
        flexDirection: 'column',
    },
    nytSyncSectionTitle: {
        marginBottom: theme.spacing(2),
    },
    nytSyncForm: {
        width: 150,
        marginTop: theme.spacing(1),
    },
    customDates: {
        marginBottom: theme.spacing(2),
    },
    checkboxForm: {
        marginBottom: theme.spacing(2),
        marginRight: 0,
    },
    button: {
        width: 'fit-content',
    }
}))

export default function SyncNytData({nytEmail, nytPassword, closeHandler}) {
    const classes = useStyles();

    const [syncStartDate, setSyncStartDate] = useState(util.now());
    const [syncEndDate, setSyncEndDate] = useState(util.now());
    const [syncRange, setSyncRange] = useState("Today");
    const [showCustomDates, setShowCustomDates] = useState(false);
    const [syncDisabled, setSyncDisabled] = useState(false);
    const [startDateErrors, setStartDateErrors] = useState({error: false})
    const [showErrorText, setShowErrorText] = useState(false);
    const [onlySyncCompleted, setOnlySyncCompleted] = useState(false);
    const [total, setTotal] = useState(0);
    const [{isSyncing, progress}, {setIsSyncing, setProgress}] = useContext(SyncContext);

    useEffect(() => {
        setSyncEndDate(util.now());
        setSyncDisabled(false);
        setShowCustomDates(false);

        switch(syncRange) {
            case "Today":
                setSyncStartDate(util.now());
                return;
            case "Week":
                setSyncStartDate(util.now().startOf('week'));
                return;
            case "Month":
                setSyncStartDate(util.now().startOf('month'));
                return;
            case "Year":
                setSyncStartDate(util.now().startOf('year'));
                return;
            case "Custom":
                setShowCustomDates(true);
                setSyncDisabled(true);
                setSyncStartDate(null);
                return;
        }

    }, [syncRange])

    useEffect(() => {
        if (syncStartDate == null) {
            setSyncDisabled(true);
            setStartDateErrors({
                error: true,
                helperText: "Start date required"
            })
        } else {
            if (syncStartDate !== null && syncEndDate !== null && Math.abs(util.getDaysDiff(syncStartDate, syncEndDate)) > 365) {
                setShowErrorText(true);
                setSyncDisabled(true);
            } else {
                setShowErrorText(false);
                setSyncDisabled(false);

                setTotal(util.getDaysDiff(syncEndDate, syncStartDate) + 1);
            }

            setStartDateErrors({error: false})
        }
    }, [syncStartDate, syncEndDate]);

    useEffect(() => {
        if (!isSyncing) {
            setProgress(0);
        }
    }, [isSyncing]);

    function handleSyncFormChange(event) {
        setSyncRange(event.target.value);
    }

    function handleClose() {
        if (closeHandler !== undefined) closeHandler();
    }

    const handleChangeOnlySyncCompleted = (event) => {
        setOnlySyncCompleted(event.target.checked);
    };

    function syncData() {
        handleClose()

        var startString = null;
        var endString = null;

        if (syncStartDate == null) {
            return;
        } else {
            startString = util.formatMomentToDateStringWithFormat(syncStartDate, util.nytDateFormat);
        }

        if (syncEndDate == null) {
            endString = util.formatMomentToDateStringWithFormat(util.now(), util.nytDateFormat);
        } else {
            endString = util.formatMomentToDateStringWithFormat(syncEndDate, util.nytDateFormat);
        }

        setIsSyncing(true);

        // Reset form fields to defaults
        setSyncRange("Today");
        setSyncStartDate(util.now());
        setSyncEndDate(util.now());
        setSyncDisabled(syncRange === "Custom" ? true : false);

        amplify.syncData(nytEmail, nytPassword, startString, endString, onlySyncCompleted, onComplete)
            .then(() => {
                console.log("done");
                setIsSyncing(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onComplete = () => {
        setProgress(progress => progress + 100/total);
    }

    return(
        <div className={classes.nytSync}>
            <Typography variant="h6" className={classes.nytSyncSectionTitle}>Sync NYT Data</Typography>
            <Typography variant="body1">Choose a range:</Typography>
            <FormControl className={classes.nytSyncForm} variant="outlined" margin="dense">
                <Select
                    id="sync-data-range"
                    value={syncRange}
                    onChange={handleSyncFormChange}
                >
                    <MenuItem value="Today">Today</MenuItem>
                    <MenuItem value="Week">This Week</MenuItem>
                    <MenuItem value="Month">This Month</MenuItem>
                    <MenuItem value="Year">This Year</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                </Select>
            </FormControl>
            <Collapse in={showCustomDates}>
                <div className={classes.customDates}>
                    <CustomDatePicker dateValue={syncStartDate} changeHandler={setSyncStartDate} label="Start Date" clearable={true} errorProps={startDateErrors}/>
                    <CustomDatePicker dateValue={syncEndDate} changeHandler={setSyncEndDate} label="End Date" clearable={true}/>
                </div>
            </Collapse>
            <Collapse in={showErrorText}>
                <Typography variant="body2" color='error' style={{marginBottom: '22px'}}>The maximum number of days you can sync at a time is 365</Typography>
            </Collapse>
            <FormControlLabel
                className={classes.checkboxForm}
                control={
                    <Checkbox checked={onlySyncCompleted} onChange={handleChangeOnlySyncCompleted} name="onlySyncCompleted" />
                }
                label="Only sync completed puzzles"
            />
            <Button variant="contained" color="secondary" onClick={syncData} className={classes.button} disabled={syncDisabled || isSyncing}>Sync Data</Button>
        </div>
    )
}
