import React, { useState } from 'react';
import { TableCell, TableRow, Checkbox, IconButton, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import EditableTableRow from './EditableTableRow';
import * as util from '../Utils/util';

const useStyles = makeStyles((theme) => ({
    editVisible: {
        visibility: 'visible'
    },
    editHidden: {
        visibility: 'hidden'
    },
    puzzleDateCell: {
        marginLeft: theme.spacing(2),
    },
    buttonCell: {
        width: 50
    },
    dates: {
        width: 200,
    },
    notes: {
        width: 250
    },
    numLookups: {
        width: 150,
    },
}));

function DynamicTableRow({isItemSelected, row, labelId, clickCheckBoxHandler, saveEditedStatHandler, statList}) {
    const styles = useStyles();
    const [showEditButton, setShowEditButton] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    function handleMouseEnter() {
        setShowEditButton(true);
    }
    
    function handleMouseLeave() {
        setShowEditButton(false);
    }

    if (isEditable) return(
        <EditableTableRow 
            row={row} 
            labelId={labelId} 
            statList={statList}
            closeEditModeHandler={() => setIsEditable(false)} 
            saveEditedStatHandler={saveEditedStatHandler}/>
    )

    else return(
        <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    checked={isItemSelected}
                    onClick={event => clickCheckBoxHandler(event, row.id)}
                />
            </TableCell>
            <TableCell id={labelId} scope="row" className={styles.dates}>
                {util.unixToFormattedDate(row.puzzle_date)}
            </TableCell>
            <TableCell align="left" className={styles.dates}>{row.first_solved === null ? "-" : util.unixToFormattedDate(row.first_solved)}</TableCell>
            <TableCell align="left">{util.secondsToFormattedTime(row.time_elapsed)}</TableCell>
            <TableCell align="left" className={styles.numLookups}>{row.num_lookups === null ? 0 : row.num_lookups}</TableCell>
            <TableCell align="left">{util.weekdays[row.weekday]}</TableCell>
            <TableCell align="left" className={styles.notes}>{row.notes === null ? "-" : row.notes}</TableCell>
            <TableCell align="left" className={styles.source}>{util.typeToString(row.source)}</TableCell>
            <TableCell align="right" className={styles.buttonCell}>
                <IconButton 
                    size="small" 
                    className={clsx({
                                        [styles.editHidden]: !showEditButton, 
                                        [styles.editVisible]: showEditButton
                                    })}
                    onClick={() => setIsEditable(true)}
                >
                    <EditIcon fontSize="small" color="secondary"/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default DynamicTableRow;