import React, { useState, useEffect } from "react";
import {makeStyles, Container, Typography, IconButton, Fade, Dialog} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddStatDialog from '../Utils/AddStatDialog';
import OverallStatistics from './OverallStatistics';
import TodayBarGraph from './TodayBarGraph';
import Resources from './Resources';
import * as util from '../Utils/util';
import * as amplify from '../Utils/amplifyUtil';

const useStyles = makeStyles(theme => ({
    home: {
        paddingTop: theme.spacing(10),
        marginBottom: theme.spacing(4),
    },
    homeGrid: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overallStatistics: {
        width: '80%',
        textAlign: 'center',
        marginBottom: theme.spacing(10),
    },
    displayNone: {
        display: 'none'
    },
    todayAndResources: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    todayHeader: {
        marginTop: theme.spacing(1),
    },
    todayGraph: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    addTodaysData: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resourcesContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 500
    },
    resourcesHeader: {
        marginBottom: theme.spacing(4),
        textAlign: 'center'
    }
}));

function Home() {
    const weekdayToday = util.getWeekdayToday();
    const styles = useStyles();

    const [statListByWeekday, setStatListByWeekday] = useState([]);
    const [todaysStat, setTodaysStat] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showMissingToday, setShowMissingToday] = useState(false);
    const [statList, setStatList] = useState([]);
    const [puzzlesSolved, setPuzzlesSolved] = useState(0);
    const [solveRate, setSolveRate] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    
    useEffect(() => {
        amplify.getTodaysStatsByPuzzleDate().then(function (result) {
            if (result.length <= 0) {
                console.log(true);
                setShowMissingToday(true);
            }
        });
    }, []);

    useEffect(() => {
        amplify.getAllStats().then(stats => {
            setStatList(stats.sort(util.compareStatsByPuzzleDate));
        });
    }, []);

    useEffect(() => {
        amplify.getStatsByWeekday(util.now().day()).then(stats => {
            setStatListByWeekday(stats);
        });
        amplify.getAllStats().then(stats => {
            setStatList(stats.sort(util.compareStatsByPuzzleDate));
        });
    }, [statListByWeekday.length, todaysStat]);

    useEffect(() => {
        amplify.getTodaysStatsByPuzzleDate().then(function (result) {
            if (result.length > 0) {
                setTodaysStat(result[0]);
                setShowMissingToday(false);
            }
        });
    }, [statListByWeekday.length]);

    // Whenever stat list changes, recalculate the statistics
    //TODO eventually store this in the user object
    useEffect(() => {
        var solvedCount = 0;
        var currentStreakCount = 0;
        var longestStreakCount = 0;
        statList.sort((a, b) => {
            if (a.puzzle_date < b.puzzle_date) return -1;
            if (a.puzzle_date > b.puzzle_date) return 1;
            return 0;
        })
        console.log(statList);
        statList.forEach(stat => {
            if (stat.solved) solvedCount++;

            if (stat.solved && util.unixDatesEqual(stat.puzzle_date, stat.first_solved)) {
                //console.log(util.unixToFormattedDateWithFormat(stat.puzzle_date, "MM/DD/YYYY hh:mm:ss a") + " | " + util.unixToFormattedDateWithFormat(stat.first_solved, "MM/DD/YYYY hh:mm:ss a") + " | " +  + stat.solved);
                currentStreakCount++;
            } else {
                if (currentStreakCount > longestStreakCount) longestStreakCount = currentStreakCount;
                if (stat.id !== todaysStat.id) currentStreakCount = 0;
            }

        })

        if (currentStreakCount > longestStreakCount) longestStreakCount = currentStreakCount;


        setPuzzlesSolved(solvedCount);
        if (solvedCount > 0 && statList.length > 0) {
            setSolveRate(Math.round((solvedCount / statList.length) * 100));
        }
        setCurrentStreak(currentStreakCount);
        setLongestStreak(longestStreakCount);
    }, [statList.length]);


    function handleOpenDialog() {
        setIsDialogOpen(true);
    }

    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function handleSave(newStat) {
        if (util.momentDatesEqual(util.unixToMoment(newStat.puzzle_date), util.now())) {
            setTodaysStat(newStat);
        }
        amplify.getStatsByWeekday(util.now().day()).then(stats => {
            setStatListByWeekday(stats);
        });
    }

    function calculateAverage(stats) {
        var total = 0;
        var count = 0;
        stats.forEach((stat) => {
            if (stat.solved) {
                count++;
                total += stat.time_elapsed;
            }
        });
        if (total === 0) return total;
        return Math.round(total/count);
    }
    
    function calculateBest(stats) {
        if (stats.length <= 0) return 0;
    
        var best = Number.POSITIVE_INFINITY;
        stats.forEach((stat) => {
            if (stat.time_elapsed < best && stat.solved) best = stat.time_elapsed;
        });
    
        if (best === Number.POSITIVE_INFINITY) return 0;
        return best;
    }

    return (
        <Container className={styles.home}>
            <div className={styles.homeGrid}>
                <div className={styles.overallStatistics}>
                    <Typography variant="h4">Overall Statistics</Typography>
                    <OverallStatistics puzzlesSolved={puzzlesSolved} solveRate={solveRate} currentStreak={currentStreak} longestStreak={longestStreak} />
                </div>
                <div className={styles.todayAndResources}>
                    <div className={styles.todayGraph}>
                        <div className={styles.todayHeader}>
                            <Typography variant="h4">On {weekdayToday}s</Typography>
                        </div>
                        <TodayBarGraph average={calculateAverage(statListByWeekday)} best={calculateBest(statListByWeekday)} today={todaysStat.time_elapsed}/>
                        <Fade in={showMissingToday} timeout={1000}>
                            <div className={styles.addTodaysData}>
                                <Typography>You have not added data for today's puzzle yet</Typography>
                                <IconButton onClick={handleOpenDialog}>
                                    <AddCircleIcon fontSize="large" color="secondary"/>
                                </IconButton>
                                <AddStatDialog isOpen={isDialogOpen} closeDialogHandler={handleCloseDialog} saveHandler={handleSave}/>
                            </div>
                        </Fade>
                    </div>
                    <div className={styles.resourcesContainer}>
                        <Typography variant="h4" className={styles.resourcesHeader}>Resources</Typography>
                        <Resources />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Home;