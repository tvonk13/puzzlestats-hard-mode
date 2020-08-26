import React, { useState, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Collapse, FormControl, InputLabel, Select, MenuItem, Chip, TextField, Divider, Button } from '@material-ui/core';
import CustomDatePicker from '../Utils/CustomDatePicker';
import * as util from '../Utils/util';

const useStyles = makeStyles(theme => ({
    filtersDiv: {
        marginLeft: theme.spacing(2),
        marginRight: 0,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        display: 'flex',
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    filterInputsDiv: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '75%',
    },
    weekday: {
        marginRight: theme.spacing(1),
        minWidth: 120,
    },
    puzzleDateDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    filterLabel: {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(1.5)
    },
    numLookupsDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    numLookups: {
        width: 65,
        alignSelf: 'flex-end'
    },
    source: {
        marginLeft: theme.spacing(1),
        minWidth: 120,
    },
    clearButton: {
        margin: theme.spacing(1),
    },
    chipListDiv: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    chip: {
        marginRight: theme.spacing(0.5),
    },
}));

const emptyFilters = {
    weekday: {key: 0, label: 'weekday: ', value: '', comparator: 'eq'},
    puzzle_date_from: {key: 1, label: 'puzzle date from: ', value: '', comparator: 'ge'},
    puzzle_date_to: {key: 2, label: 'puzzle date to: ', value: '', comparator: 'le'},
    num_lookups: {key: 3, label: 'num lookups: ', value: '', comparator: 'eq'},
    source: {key: 4, label: 'source: ', value: '', comparator: 'eq'},
}

function Filters({isFilterOpen, filterHandler}) {
    const styles = useStyles();
    const [isChipListOpen, setIsChipListOpen] = useState(true);
    const [activeFilters, setActiveFilters] = useState(emptyFilters);
    const [numActiveFilters, setNumActiveFilters] = useState(0);
    const [weekday, setWeekday] = useState('');
    const [puzzleDateFrom, setPuzzleDateFrom] = useState(null);
    const [puzzleDateTo, setPuzzleDateTo] = useState(null);
    const [numLookups, setNumLookups] = useState('');
    const [source, setSource] = useState('');

    useEffect(() => {
        activeFilters.weekday.value = weekday;
        activeFilters.puzzle_date_to.value = puzzleDateTo;
        activeFilters.puzzle_date_from.value = puzzleDateFrom;
        activeFilters.num_lookups.value = numLookups;
        activeFilters.source.value = source;
        setActiveFilters({...activeFilters});
    }, [weekday, puzzleDateTo, puzzleDateFrom, numLookups, source]);

    useEffect(() => {
        var numFilters = countActiveFilters();
        setNumActiveFilters(numFilters);
        filterHandler(activeFilters, numFilters);
    }, [activeFilters]);

    useEffect(() => {
        numActiveFilters === 0 ? setIsChipListOpen(false) : setIsChipListOpen(true);
    }, [numActiveFilters])

    function handleSetNumLookups(value) {
        if (value === '') setNumLookups('');
        else setNumLookups(parseInt(value));
    }

    function handleDeleteChip(key) {
        activeFilters[key].value = '';
        setActiveFilters({...activeFilters});

        if (key === 'weekday') {
            setWeekday('');
        } else if (key === 'num_lookups') {
            setNumLookups('');
        } else if (key === 'puzzle_date_to') {
            setPuzzleDateTo(null);
        } else if (key === 'puzzle_date_from') {
            setPuzzleDateFrom(null);
        } else if (key === 'source') {
            setSource('');
        }
    }

    function handleClear() {
        setWeekday('');
        setNumLookups('');
        setPuzzleDateFrom(null);
        setPuzzleDateTo(null);
        setSource('')
        setActiveFilters(emptyFilters);
    }

    function countActiveFilters() {
        var count = 0;
        Object.values(activeFilters).map(filter => {
            if (!util.isBlankOrNull(filter.value)) return count++;
        })
        return count;
    }

    return(
        <Fragment>
            <Collapse in={isFilterOpen}>
                <Divider />
                <div className={styles.filtersDiv}>
                    <div className={styles.filterInputsDiv}>
                        <FormControl className={styles.weekday} variant="outlined" margin="dense">
                            <InputLabel id="weekday-label">Weekday</InputLabel>
                            <Select
                                labelId="weekday-label"
                                label="Weekday"
                                id="weekday"
                                value={weekday}
                                onChange={(event) => setWeekday(event.target.value)}
                            >
                                <MenuItem key={-1} value=''><em>None</em></MenuItem>
                                {
                                    util.weekdays.map((weekday, index) => {
                                        return <MenuItem key={index} value={index}>{weekday}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <div className={styles.puzzleDateDiv}>
                            <Typography className={styles.filterLabel} variant="body2">Puzzle Date</Typography>
                            <CustomDatePicker 
                                label="From"
                                dateValue={puzzleDateFrom}
                                changeHandler={setPuzzleDateFrom}
                            />
                            <CustomDatePicker 
                                label="To"
                                dateValue={puzzleDateTo}
                                changeHandler={setPuzzleDateTo}
                            />
                        </div>
                        <div className={styles.numLookupsDiv}>
                            <Typography className={styles.filterLabel} variant="body2">Num Lookups</Typography>
                            <TextField
                                id="outlined-number"
                                type="number"
                                variant="outlined"
                                size="small"
                                margin="dense"
                                value={numLookups}
                                onChange={(event) => handleSetNumLookups(event.target.value)}
                                className={styles.numLookups}
                            />
                        </div>
                        <FormControl className={styles.source} variant="outlined" margin="dense">
                            <InputLabel id="source-label">Source</InputLabel>
                            <Select
                                labelId="source-label"
                                label="Source"
                                id="source"
                                value={source}
                                onChange={(event) => setSource(event.target.value)}
                            >
                                <MenuItem key={-1} value=''><em>None</em></MenuItem>
                                {
                                    util.sources.map((source, index) => {
                                        return <MenuItem key={index} value={index}>{source}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <Button onClick={handleClear} variant="contained" color="secondary" className={styles.clearButton} size="small">Clear</Button>
                </div>
            </Collapse>
            <Collapse in={isChipListOpen} timeout={1000}>
                <div className={styles.chipListDiv}>
                    <ChipList filters={activeFilters} deleteHandler={handleDeleteChip}/>
                </div>
            </Collapse>
        </Fragment>
    )
}

function ChipList({filters, deleteHandler}) {
    const styles = useStyles();
    return(
        <Fragment>
            {
                Object.entries(filters).map(data => {
                if (data[1].value !== null && data[1].value !== '') {
                    var chipValue = data[1].value;
                    if (data[0] === "weekday") chipValue = util.weekdays[data[1].value];
                    if (data[0] === "source") chipValue = util.sources[data[1].value];
                    if (data[0].startsWith("puzzle_date")) chipValue = util.formatMomentToDateString(data[1].value);
                    return(
                        <Chip
                            key={data[0]}
                            label={data[1].label + chipValue} 
                            onDelete={() => deleteHandler(data[0])}
                            className={styles.chip}
                        />
                    );
                }
            })
            }
        </Fragment>
    );
}

export default Filters;