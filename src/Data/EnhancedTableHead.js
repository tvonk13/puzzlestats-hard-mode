import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const headCells = [
    { id: 'puzzle_date', numeric: false, disablePadding: false, label: 'Puzzle Date' },
    { id: 'first_solved', numeric: false, disablePadding: false, label: 'Date Completed' },
    { id: 'time_elapsed', numeric: true, disablePadding: false, label: 'Total Time' },
    { id: 'num_lookups', numeric: true, disablePadding: false, label: 'Num Lookups' },
    { id: 'weekday', numeric: false, disablePadding: false, label: 'Weekday' },
    { id: 'notes', numeric: false, disablePadding: false, label: 'Notes' },
    { id: 'source', numeric: false, disablePadding: false, label: 'Source' },
];

const useStyles = makeStyles(theme => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    row: {
        backgroundColor: theme.palette.secondary.main,
    }
}));

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const styles = useStyles();
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow className={styles.row}>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        color="primary"
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align='left'
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={styles.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell padding='none'></TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;