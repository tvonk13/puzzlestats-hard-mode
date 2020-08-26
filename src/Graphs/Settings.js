import React, { Fragment, useState, useEffect } from 'react';
import { Typography, Divider, RadioGroup, Radio, FormControlLabel, Checkbox, FormGroup, IconButton, Collapse } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from '../Utils/CustomDatePicker';
import * as util from '../Utils/util';

const useStyles = makeStyles(theme => ({
    settingSection: {
        marginBottom: theme.spacing(3),
    },
    sectionFormGroup: {
        marginTop: theme.spacing(1),
    },
    catAllGroup: {
        marginLeft: theme.spacing(2),
    },
    weekdaysDropdown: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateSection: {
        marginTop: theme.spacing(2),
    },
    dateDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
}));

function Settings({filterChangeHandler}) {
    const styles = useStyles();

    const [catValue, setCatValue] = useState('weekdays');
    const [catAllGroup, setCatAllGroup] = useState(false);
    const [calculation, setCalculation] = useState({
        average: true,
        best: false
    });
    const { average, best } = calculation;
    const [ showWeekdays, setShowWeekdays ] = useState(false);
    const [weekdays, setWeekdays] = useState(({
        Sunday: true,
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
    }));
    const [completedFilters, setCompletedFilters] = useState({
        completed: false,
        completedOnPuzzleDate: false
    });
    const { completed, completedOnPuzzleDate } = completedFilters;
    const [dateRanges, setDateRanges] = useState({
        puzzleDateFrom: null,
        puzzleDateTo: null,
        dateCompletedFrom: null,
        dateCompletedTo: null
    });
    const [sources, setSources] = useState(({
        NYT: true,
        Manual: true
    }))
    const [ showSources, setShowSources ] = useState(false);
    const { puzzleDateFrom, puzzleDateTo, dateCompletedFrom, dateCompletedTo } = dateRanges;
    const [consolidatedFilters, setConsolidatedFilters] = useState({});

    useEffect(() => {
        setConsolidatedFilters({
            categorization: 'weekdays',
            groupByWeekday: false,
            average: true,
            best: false,
            weekdays: [],
            completed: false,
            completedOnPuzzleDate: false,
            puzzleDateFrom: null,
            puzzleDateTo: null,
            dateCompletedFrom: null,
            dateCompletedTo: null,
            sources: [],
        })
    }, [])

    useEffect(() => {
        setConsolidatedFilters({
            categorization: catValue,
            groupByWeekday: catAllGroup,
            average: average,
            best: best,
            weekdays: dropdownMapToList(weekdays),
            completed: completed,
            completedOnPuzzleDate: completedOnPuzzleDate,
            puzzleDateFrom: util.momentToUnix(puzzleDateFrom),
            puzzleDateTo: util.momentToUnix(puzzleDateTo),
            dateCompletedFrom: util.momentToUnix(dateCompletedFrom),
            dateCompletedTo: util.momentToUnix(dateCompletedTo),
            sources: dropdownMapToList(sources),
        })
    }, [catValue, catAllGroup, calculation, weekdays, completedFilters, dateRanges, sources])

    useEffect(() => {
        filterChangeHandler(consolidatedFilters);
    }, [consolidatedFilters]);
    
    const dropdownMapToList = (map) => {
        return Object.entries(map).map((entry, index) => {
            if (entry[1]) return index;
        })
    }

    const handleChangeCat = (event) => {
        setCatValue(event.target.value);
    };

    const handleChangeCatAllGroup = (event) => {
        setCatAllGroup(event.target.checked);
    };

    const handleChangeCalculation = (event) => {
        setCalculation({ ...calculation, [event.target.name]: event.target.checked });
    };

    const handleChangeWeekdays = (event) => {
        setWeekdays({ ...weekdays, [event.target.name]: event.target.checked });
    };

    const handleShowWeekdays = () => {
        setShowWeekdays(!showWeekdays);
    }

    const handleChangeCompletedFilters = (event) => {
        var newFilters = { ...completedFilters, [event.target.name]: event.target.checked }
        if (!completed) newFilters.completedOnPuzzleDate = false;
        setCompletedFilters(newFilters);
    };

    const handleChangeDateRanges = (value, label) => {
        setDateRanges({ ...dateRanges, [label]: value });
    };

    const handleChangeSources = (event) => {
        setSources({ ...sources, [event.target.name]: event.target.checked });
    };

    const handleShowSources = () => {
        setShowSources(!showSources);
    }

    return (
        <Fragment>
            <div className={styles.settingSection}>
                <Typography variant='h6'>Categorization</Typography>
                <Divider />
                <div className={styles.sectionFormGroup}>
                    <RadioGroup name="catValue" value={catValue} onChange={handleChangeCat}>
                        <FormControlLabel value='weekdays' control={<Radio color="primary" />} label="Weekdays" />
                        <FormControlLabel value='all' control={<Radio color="primary" />} label="All" />
                    </RadioGroup>
                    <Collapse in={catValue === 'all'}>
                        <FormControlLabel
                            control={<Checkbox checked={catAllGroup} onChange={handleChangeCatAllGroup} color="primary" />}
                            label="Group by weekday"
                            className={styles.catAllGroup}
                        />
                    </Collapse>
                </div>
            </div>
            <Collapse in={catValue === 'weekdays'}>
                <div className={styles.settingSection}>
                    <Typography variant='h6'>Calculation</Typography>
                    <Divider />
                    <div className={styles.sectionFormGroup}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={average} onChange={handleChangeCalculation} name="average" color="primary" />}
                                label="Average"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={best} onChange={handleChangeCalculation} name="best" color="primary" />}
                                label="Best"
                            />
                        </FormGroup>
                    </div>
                </div>
            </Collapse>
            <div className={styles.settingSection}>
                <Typography variant='h6'>Filters</Typography>
                <Divider />
                <div className={styles.sectionFormGroup}>
                    <div className={styles.weekdaysDropdown}>
                        <Typography>Weekdays</Typography>
                        <IconButton onClick={handleShowWeekdays}>
                            <ExpandMoreIcon fontSize="small" color="primary"/>
                        </IconButton>
                    </div>
                    <Collapse in={showWeekdays}>
                        <FormGroup>
                            {
                                util.weekdays.map((weekday, index) => {
                                    return (
                                        <FormControlLabel
                                            control={<Checkbox checked={weekdays[weekday]} onChange={handleChangeWeekdays} name={weekday} color="primary" />}
                                            label={weekday}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </FormGroup>
                    </Collapse>
                    <div className={styles.sectionFormGroup}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={completed} onChange={handleChangeCompletedFilters} name="completed" color="primary" />}
                                label="Completed"
                            />
                            <Collapse in={completed}>
                                <FormControlLabel
                                    control={<Checkbox checked={completedOnPuzzleDate} onChange={handleChangeCompletedFilters} name="completedOnPuzzleDate" color="primary" />}
                                    label="Completed on puzzle date"
                                />
                            </Collapse>
                        </FormGroup>
                    </div>
                    <div className={styles.dateSection}>
                        <Typography className={styles.filterLabel}>Puzzle Date</Typography>
                        <div className={styles.dateDiv}>
                            <CustomDatePicker
                                name="puzzleDateFrom"
                                label="From"
                                dateValue={puzzleDateFrom}
                                clearable={true}
                                changeHandler={handleChangeDateRanges}
                            />
                            <CustomDatePicker
                                name="puzzleDateTo"
                                label="To"
                                dateValue={puzzleDateTo}
                                clearable={true}
                                changeHandler={handleChangeDateRanges}
                            />
                        </div>
                    </div>
                    <div className={styles.dateSection}>
                        <Typography className={styles.filterLabel}>Date Completed</Typography>
                        <div className={styles.dateDiv}>
                            <CustomDatePicker
                                name="dateCompletedFrom"
                                label="From"
                                dateValue={dateCompletedFrom}
                                clearable={true}
                                changeHandler={handleChangeDateRanges}
                            />
                            <CustomDatePicker
                                name="dateCompletedTo"
                                label="To"
                                dateValue={dateCompletedTo}
                                clearable={true}
                                changeHandler={handleChangeDateRanges}
                            />
                        </div>
                    </div>
                    <div className={styles.weekdaysDropdown}>
                        <Typography>Sources</Typography>
                        <IconButton onClick={handleShowSources}>
                            <ExpandMoreIcon fontSize="small" color="primary"/>
                        </IconButton>
                    </div>
                    <Collapse in={showSources}>
                        <FormGroup>
                            {
                                util.sources.map((source, index) => {
                                    return (
                                        <FormControlLabel
                                            control={<Checkbox checked={sources[source]} onChange={handleChangeSources} name={source} color="primary" />}
                                            label={source}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </FormGroup>
                    </Collapse>
                </div>
            </div>
        </Fragment>
    )
}

export default Settings;