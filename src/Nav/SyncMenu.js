import React, {useState, useEffect, useRef, useContext} from 'react';
import { makeStyles, Grow, Paper, Popper } from '@material-ui/core';
import SyncRoundedIcon from '@material-ui/icons/SyncRounded';
import CloseIcon from '@material-ui/icons/Close';
import SyncNytData from "../Account/SyncNytData";
import StatUserContext from "../Contexts/StatUserContext";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginRight: theme.spacing(2),
    },
    closeIcon: {
        float: 'right',
        cursor: 'pointer'
    },
    syncMenuContent: {
        padding: theme.spacing(2),
        width: '300px',
    }
}));

export default function SyncMenu() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [{statUser}, ] = useContext(StatUserContext);

    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <div className={classes.user} 
                color="secondary"
                ref={anchorRef}
                onClick={handleToggle}
            >
                <SyncRoundedIcon fontSize="small"/>
            </div>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                    <Paper>
                    <div className={classes.syncMenuContent}>
                        <CloseIcon onClick={handleClose} className={classes.closeIcon} fontSize="small" />
                        <SyncNytData nytEmail={statUser.nytEmail} nytPassword={statUser.nytPassword} closeHandler={handleClose}/>
                    </div>
                    </Paper>
                </Grow>
                )}
            </Popper>
        </div>
    );
}