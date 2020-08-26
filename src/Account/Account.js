import React, {useState, useEffect, useContext} from 'react';
import {makeStyles, Container, Typography, Divider, Box } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import NytAccount from './NytAccount';
import StatUserContext from "../Contexts/StatUserContext";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";

const useStyles = makeStyles(theme => ({
    account: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        display: 'flex',
        justifyContent: 'center',
    },
    accountContent: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%'
    },
    accountSectionHeader: {
        marginBottom: theme.spacing(4),
    },
    accountSection: {
        marginBottom: theme.spacing(2),
    },
    accountItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    accountItemName: {
        marginRight: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(2),
    },
    successCheck: {
        marginLeft: theme.spacing(1),
        color: theme.palette.success.main,
    },
}));

export default function Account() {
    const classes = useStyles();

    const [userInfo, setUserInfo] = useState({});
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [{statUser}, {setStatUser}] = useContext(StatUserContext);

    useEffect(() => {
        Auth.currentUserInfo()
                .then(res => {
                    setUserInfo(res);
                })
                .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (Object.keys(userInfo).length > 0) {
            setUsername(userInfo.username);
            setEmail(userInfo.attributes.email);
        }
    }, [userInfo]);

    return (
        <Container>
            <div className={classes.account}>
                <div className={classes.accountContent}>
                    <div className={classes.accountSection}>
                        <div className={classes.accountSectionHeader}>
                            <Typography variant='h5'>Account</Typography>
                            <Divider style={{width: '100%'}}/>
                        </div>
                        <div className={classes.accountItem}>
                            <Typography variant='body1' className={classes.accountItemName}><strong>username:</strong></Typography>
                            <Typography variant='body1'>{username}</Typography>
                        </div>
                        <div className={classes.accountItem}>
                            <Typography variant='body1' className={classes.accountItemName}><strong>email:</strong></Typography>
                            <Typography variant='body1'>{email}</Typography>
                        </div>
                    </div>
                     <div className={classes.accountSection}>
                        <div className={classes.accountSectionHeader}>
                            <Box display="flex" alignItems="center">
                                <Typography variant='h5' style={{display: "inline", marginRight: "8px"}}>NY Times Account</Typography>
                                {statUser && statUser.nytEmail && <CheckCircleOutlineRoundedIcon className={classes.successCheck}/>}
                            </Box>
                            <Divider style={{width: '100%'}}/>
                        </div>
                        <NytAccount classesProp={classes} />
                    </div>
                </div>
            </div>
        </Container>
    )
}