import React from 'react';
import { makeStyles } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';
import * as util from '../Utils/util';

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        height: 275,
        width: 500,
        marginTop: theme.spacing(4)
    }
}))

function TodayBarGraph({average, best, today}) {
    const styles = useStyles();
    const data = [
        {
            "id": "Average",
            "average": average,
        },
        {
            "id": "Best",
            "best": best,
        },
        {
            "id": "Today",
            "today": today,
        },
    ]
    return(
        <div className={styles.graphContainer}>
            <ResponsiveBar
                data={data}
                keys={[ 'average', 'best', 'today']}
                margin={{ bottom: 20,}}
                padding={0.3}
                colors={["#00b0ff", "#ffc400", "#ec407a"]}
                label={d => {
                    if (`${d.id}` === 'todayMissing') return '';
                    else return util.secondsToFormattedTime(`${d.value}`)
                }}
                labelTextColor='white'
                labelSkipHeight={20}
                isInteractive={false}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                axisLeft={null}
                enableGridY={false}
                animate={true}
                motionStiffness={90}
                motionDamping={25}
            />
        </div>
    )
}

export default TodayBarGraph;