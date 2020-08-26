import React, { useContext, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { makeStyles, LinearProgress, Typography, Collapse } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CustomScrollBar from './Utils/CustomScrollBar';
import Nav from './Nav/Nav';
import Home from './Home/Home';
import Data from './Data/Data';
import Graphs from './Graphs/Graphs';
import Account from './Account/Account';
import Puzzle from './Puzzle';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import '@aws-amplify/ui/dist/style.css';
import * as amplify from './Utils/amplifyUtil';
import SyncContext from './Contexts/SyncContext';
import StatUserContext from "./Contexts/StatUserContext";

Amplify.configure(awsconfig);

const useStyles = makeStyles(theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
    },
    syncStatus: {
        padding: theme.spacing(2),
    },
    syncText: {
        marginBottom: theme.spacing(1),
    },
}));

function Main({authState}) {
    const styles = useStyles();
    const [{isSyncing, progress}, ] = useContext(SyncContext);
    const [{statUser}, {setStatUser}] = useContext(StatUserContext);

    // Check if a stat user exists and if not, create one
    useEffect(() => {
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
    }, [])

    if (authState === 'signedIn') {
        return <MuiPickersUtilsProvider utils={MomentUtils}>
            <CustomScrollBar
                    style={{ height: '100vh' }}
                    autoHide
                >
                <div className={styles.main}>
                    <Nav />
                    <Collapse in={isSyncing} >
                        <div className={styles.syncStatus}>
                            <Typography className={styles.syncText}>Syncing NYT Data</Typography>
                            <LinearProgress variant="determinate" value={progress} color="secondary"/>
                        </div>
                    </Collapse>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/data" component={Data} />
                    <Route exact path="/graphs" component={Graphs} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/puzzle/:date" component={Puzzle} />
                </div>
            </CustomScrollBar>
        </MuiPickersUtilsProvider>
    } else {
        return null;
    }
}

export default Main;