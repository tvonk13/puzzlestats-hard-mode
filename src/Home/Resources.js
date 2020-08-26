import React from 'react';
import { makeStyles, Card, CardContent, Link, CardMedia, Typography, Divider } from "@material-ui/core";
import * as util from '../Utils/util';

const useStyles = makeStyles(theme => ({
    resources: {
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    resourcesColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: 400,
    },
    card: {
        width: 230,
        height: 'fit-content',
        cursor: 'pointer',
        margin: theme.spacing(1)
    },
    nyt: {
        height: 75,
        width: 230,
        paddingTop: 10
    },
    media: {
        height: 'auto',
        width: 230,
    }
}));

export default function Resources() {
    const styles = useStyles();
    const nytPuzzleLink = util.getNYTLink();
    const wordplayLink = "https://www.nytimes.com/column/wordplay";
    const rexParkerLink = "https://rexwordpuzzle.blogspot.com/";
    const xWordInfoLink = "https://www.xwordinfo.com/";

    function openUrl(url) {
        window.open(url, "_blank");
    }

    return (
        <div className={styles.resources}>
            <div className={styles.resourcesColumn}>
                <Card className={styles.card} onClick={() => openUrl(nytPuzzleLink)}>
                    <CardMedia 
                        component="img"
                        image={require('../assets/ny-times-crossword.jpg')}
                        title="New York Times Crossword"
                        className={styles.nyt}
                    />
                    <CardContent>
                        <Divider style={{marginTop: 0, marginBottom: 20}}/>
                        <Typography variant="body2" color="textSecondary" component="p">The New York Times daily crossword puzzle</Typography>
                    </CardContent>
                </Card>
                <Card className={styles.card} onClick={() => openUrl(rexParkerLink)}>
                    <CardMedia 
                        component="img"
                        image={require('../assets/rex-parker.jpeg')}
                        title="Rex Parker Does The NY Times Crossword Puzzle"
                        className={styles.media}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">Rex Parker does the NY Times crossword puzzle (SPOILER ALERT!)</Typography>
                    </CardContent>
                </Card>
            </div>
            <div className={styles.resourcesColumn}>
                <Card className={styles.card} onClick={() => openUrl(wordplayLink)}>
                    <CardMedia 
                        component="img"
                        image={require('../assets/ny-times-wordplay.png')}
                        title="New York Times Wordplay Blog"
                        className={styles.media}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">The New York Times Wordplay blog</Typography>
                    </CardContent>
                </Card>
                <Card className={styles.card} onClick={() => openUrl(xWordInfoLink)}>
                    <CardMedia 
                        component="img"
                        image={require('../assets/xword-info.gif')}
                        title="XWord Info"
                        className={styles.media}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">XWord Info: New York Times Crossword Answers and Insights</Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}