import React, { Fragment, useState } from "react";
import { makeStyles, AppBar, Typography, Toolbar } from "@material-ui/core";
import Main from './Main';
import Logo from './assets/puzzlestats-logo.svg';
import Amplify from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, ForgotPassword } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import SyncContext from './Contexts/SyncContext';
import StatUserContext from "./Contexts/StatUserContext";
import clsx from "clsx";

Amplify.configure(awsconfig);

const MyTheme = {
    button: { backgroundColor: '#263238' },
    a: { color: '#B0BEC5' }
};

const useStyles = makeStyles(theme => ({
    brand: {
        display: 'flex',
        alignItems: 'baseline',
        marginTop: theme.spacing(2.5),
        marginRight: theme.spacing(4),
        marginBottom: theme.spacing(2)
    },
    title: {
        textDecoration: 'none',
        color: 'inherit',
        marginRight: theme.spacing(1),
        fontFamily: 'Bellota Text',
    },
    logo: {
        height: 20,
    },
    headerSpacer: theme.mixins.toolbar,
    authenticatorWrapper: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '100px',
    },
}));

function App() {
    const styles = useStyles();
    const [authState, setAuthState] = useState('signIn');
    const [isSyncing, setIsSyncing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statUser, setStatUser] = useState({});

    return (
        <Fragment>
            {
                authState !== 'signedIn' &&
                <Fragment>
                    <AppBar position="relative" color="primary" elevation={0} >
                        <Toolbar>
                            <div className={styles.brand}>
                                <Typography className={styles.title} variant="h5" color="primary" >PUZZLE STATS</Typography>
                                <img src={Logo} className={styles.logo}/>
                            </div>
                        </Toolbar>
                    </AppBar>
                </Fragment>
            }
            <div className={clsx({[styles.authenticatorWrapper] : (authState !== 'signedIn')})}>
                <Authenticator hideDefault={true} onStateChange={setAuthState} theme={MyTheme} >
                    <SignIn/>
                    <ForgotPassword/>
                    <SignUp signUpConfig={{hiddenDefaults: ["phone_number"]}}/>
                    <ConfirmSignUp/>
                    <SyncContext.Provider value={[{isSyncing, progress}, {setIsSyncing, setProgress}]}>
                    <StatUserContext.Provider value={[{statUser}, {setStatUser}]}>
                        <Main authState={authState}/>
                    </StatUserContext.Provider>
                    </SyncContext.Provider>
                </Authenticator>
            </div>
        </Fragment>
    )
}

export default App;