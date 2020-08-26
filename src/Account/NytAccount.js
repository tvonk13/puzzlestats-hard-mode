import React, {useState, useEffect, useContext} from 'react';
import {
    Typography,
    Button,
    TextField,
    makeStyles,
    Box,
    DialogTitle,
    DialogContent,
    DialogContentText, DialogActions, Dialog
} from '@material-ui/core';
import * as amplify from '../Utils/amplifyUtil';
import * as util from '../Utils/util';
import SyncNytData from "./SyncNytData";
import StatUserContext from "../Contexts/StatUserContext";
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import VisibilityOffRoundedIcon from '@material-ui/icons/VisibilityOffRounded';
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

const useStyles = makeStyles(theme => ({
    visibilityIcon: {
        marginLeft: theme.spacing(1),
        cursor: 'pointer',
    }
}));

export default function NytAccount({classesProp}) {
    const classes = useStyles();

    const buttonTextedLinked = "Update Account";
    const buttonTextNotLinked = "Link Account";

    const [{statUser}, {setStatUser}] = useContext(StatUserContext);
    const [nytEmail, setNytEmail] = useState("");
    const [nytPassword, setNytPassword] = useState("");
    const [isNytLinked, setIsNytLinked] = useState(false);
    const [buttonText, setButtonText] = useState(buttonTextNotLinked);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (statUser != null) {
            setNytEmail(statUser.nytEmail);
            setNytPassword(statUser.nytPassword);
            setIsNytLinked(statUser.isNytLinked);
        } else {
            amplify.getCurrentStatUser()
                .then(currentStatUser => {
                    if (currentStatUser == undefined) {
                        var newStatUser = {
                            isNytLinked: false
                        }

                        amplify.createNewStatUser(newStatUser).then(statUser => {
                            setStatUser(statUser);
                        });
                    } else {
                        setStatUser(currentStatUser)
                    }
                })
                .catch(err => console.log(err));
        }
    }, [statUser]);

    useEffect(() => {
        if (isNytLinked) setButtonText(buttonTextedLinked);
        else setButtonText(buttonTextNotLinked);
    }, [isNytLinked]);

    function linkNytAccount() {
        if (nytEmail == null || nytPassword == null) {
            setError("Username and password required");
        } else {
            util.nytLogin(nytEmail, nytPassword)
                .then(res => {
                    if (res == undefined) {
                        setError("Unable to link NYT account. Username or password may be incorrect");
                    } else {
                        var updateStatUser = {
                            id: statUser.id,
                            nytEmail: nytEmail,
                            nytPassword: nytPassword,
                            isNytLinked: true,
                        }

                        amplify.updateStatUser(updateStatUser)
                            .then(updatedStatUser => {
                                setStatUser(updatedStatUser);
                                setError(null);
                            })
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => {
                    setError("Unable to link NYT account. Username or password may be incorrect");
                    console.log(err);
                })
        }
    }

    function unlinkNytAccount() {
        var updateStatUser = {
            id: statUser.id,
            nytEmail: null,
            nytPassword: null,
            isNytLinked: false,
        }

        amplify.updateStatUser(updateStatUser)
            .then(updatedStatUser => {
                setStatUser(updatedStatUser);
                setError(null);
            })
            .catch(err => console.log(err));
    }

    function toggleShowPassword() {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
            setShowPassword(true);
        } else {
            x.type = "password";
            setShowPassword(false);
        }
    }

    const handleOpenDialog = () => { setDialogOpen(true) }
    const handleCloseDialog = () => { setDialogOpen(false) }

    return(
        <>
            <div className={classesProp.accountItem}>
                <Typography variant='body1' className={classesProp.accountItemName}><strong>NYT username:</strong></Typography>
                <TextField id="email" variant="outlined" size="small" type="username" value={nytEmail || ''} onChange={(event) => setNytEmail(event.target.value)}/>
            </div>
            <div className={classesProp.accountItem}>
                <Typography variant='body1' className={classesProp.accountItemName}><strong>NYT password:</strong></Typography>
                <TextField id="password" variant="outlined" size="small" type="password" value={nytPassword || ''} onChange={(event) => setNytPassword(event.target.value)}/>
                {showPassword ? <VisibilityOffRoundedIcon onClick={toggleShowPassword} className={classes.visibilityIcon}/> : <VisibilityRoundedIcon onClick={toggleShowPassword} className={classes.visibilityIcon}/>}
            </div>
            <Box mb={6} display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                    <Button variant="contained" color="secondary" onClick={linkNytAccount} className={classesProp.button}>{buttonText}</Button>
                    {isNytLinked && <Button variant="contained" color="secondary" onClick={unlinkNytAccount} className={classesProp.button} style={{marginRight: '8px'}}>Unlink Account</Button>}
                    <WarningRoundedIcon onClick={handleOpenDialog} color="error"/>
                </Box>
                <Box mt={2}>{error && <Typography variant="body2" color="error">{error}</Typography>}</Box>
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle id="alert-dialog-title">Password Security Warning</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Due to the way the NYT API works, your NYT password cannot be encrypted. This means that
                            your password is not stored securely. Use this feature at your own risk.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {isNytLinked && <SyncNytData nytEmail={nytEmail} nytPassword={nytPassword} />}
        </>
    )
}