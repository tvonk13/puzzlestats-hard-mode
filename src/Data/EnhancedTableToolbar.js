import React, {useState, Fragment, useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Toolbar, Typography, IconButton, Tooltip, FormControlLabel, Switch } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Filters from './Filters.js'
import AddCircleIcon from '@material-ui/icons/AddCircle';	
import AddStatDialog from '../Utils/AddStatDialog';
import SyncContext from "../Contexts/SyncContext";

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
    },
    toolbarDiv: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom: theme.spacing(1),
        minHeight: 60
    },
    title: {
        flex: '1 1 100%',
        display: 'inline-block',
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(2)
    },
    icons: {
        float: 'right'
    },
}));

function EnhancedTableToolbar(props) {
    const styles = useStyles();
    const { numSelected, deleteClickedHandler, saveNewStatHandler, filterHandler, dense, changeDenseHandler } = props;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [{isSyncing, }, ] = useContext(SyncContext);

    function handleOpenDialog() {	
        setIsDialogOpen(true);	
    }	

    function handleCloseDialog() {	
        setIsDialogOpen(false);	
    }

    function handleFilterClicked() {
        setIsFilterOpen(!isFilterOpen);
    }
  
    return (
        <Fragment>
            <Toolbar
                className={clsx(styles.root, {
                    [styles.highlight]: numSelected > 0,
                })}
            >
                <div className={styles.toolbarDiv}>
                    <div>
                        {numSelected > 0 ? (
                            <Fragment>
                                <Typography className={styles.title} color="inherit" variant="subtitle1">
                                    {numSelected} selected
                                </Typography>
                                <div className={styles.icons}>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={deleteClickedHandler}>
                                            <DeleteIcon disabled={isSyncing}/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Typography className={styles.title} variant="h6" id="tableTitle">
                                    {/* Data */}
                                </Typography>
                                <div className={styles.icons}>
                                    <FormControlLabel
                                        control={<Switch checked={dense} onChange={changeDenseHandler} size="small" color="secondary"/>}
                                        label="Dense"
                                    />
                                    <Tooltip title="Add data">	
                                        <IconButton onClick={handleOpenDialog}>	
                                            <AddCircleIcon fontSize="large" color="secondary"/>	
                                        </IconButton>	
                                    </Tooltip>
                                    <Tooltip title="Filter list">
                                        <IconButton onClick={handleFilterClicked} >
                                            <FilterListIcon color="secondary"/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Fragment>
                        )}
                    </div>
                    <Filters isFilterOpen={isFilterOpen} filterHandler={filterHandler}/>
                    <AddStatDialog isOpen={isDialogOpen} closeDialogHandler={handleCloseDialog} saveHandler={saveNewStatHandler}/>
                </div>
            </Toolbar>
        </Fragment>
    )};
  
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    selected: PropTypes.array,
    deleteClickedHandler: PropTypes.func,
    saveNewStatHandler: PropTypes.func,	
    filterHandler: PropTypes.func,
    dense: PropTypes.bool,
    changeDenseHandler: PropTypes.func
};

export default EnhancedTableToolbar;