import React, {Fragment, useState, useEffect, useContext} from 'react';
import { Link, useLocation } from "react-router-dom";
import { makeStyles, AppBar, Tabs, Tab, Typography, Grid, Toolbar } from "@material-ui/core";
import { Auth } from 'aws-amplify';
import AccountMenu from './AccountMenu';
import Logo from '../assets/puzzlestats-logo.svg';
import SyncMenu from "./SyncMenu";
import StatUserContext from "../Contexts/StatUserContext";

const useStyles = makeStyles(theme => ({
    brand: {
        display: 'flex',
        alignItems: 'baseline',
        marginTop: theme.spacing(2.5),
        marginRight: theme.spacing(4),
        marginBottom: theme.spacing(2),
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
    navActions: {
        display: 'flex',
        alignItems: 'center',
    },
    tab: {
        color: theme.palette.secondary.main
    },
    navMenus: {
        display: 'flex'
    },
    headerSpacer: theme.mixins.toolbar,
}));

function Nav() {
    const styles = useStyles();
    const { pathname } = useLocation();
    const [user, setUser] = useState({});
    const [{statUser}, {setStatUser}] = useContext(StatUserContext);

    useEffect(() => {
        Auth.currentAuthenticatedUser().then(user => {
            setUser(user);
        });
    }, []);

    return (
        <Fragment>
            <AppBar position="absolute" color="primary" elevation={0} >
                <Toolbar>
                    <Grid container alignItems="center" justify="space-between" direction="row" >
                        <div className={styles.navActions}>
                            <div className={styles.brand}>
                                <Typography className={styles.title} variant="h5" color="primary" component={Link} to="/" >PUZZLE STATS</Typography>
                                <img src={Logo} className={styles.logo}/>
                            </div>
                            <Tabs value={(pathname !== "/data" && pathname !== "/graphs") ? false : pathname} indicatorColor="secondary" >
                                <Tab to="/data" component={Link} label="Data" value="/data" className={styles.tab} />
                                <Tab to="/graphs" component={Link} label="Graphs" value="/graphs" className={styles.tab} />
                            </Tabs>
                        </div>
                        <div className={styles.navMenus}>
                            <AccountMenu username={user.username} />
                            {statUser && statUser.nytEmail && statUser.nytPassword && <SyncMenu />}
                        </div>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className={styles.headerSpacer}></div>
        </Fragment>
    )
}

export default Nav;