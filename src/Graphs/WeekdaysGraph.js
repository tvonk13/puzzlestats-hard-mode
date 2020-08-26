import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import * as util from '../Utils/util';

function WeekdaysGraph({data, keys, colors}) {
    return(
        <ResponsiveBar
            data={data}
            keys={keys}
            margin={{ left: 120, top: 50, bottom: 50}}
            padding={0.3}
            groupMode="grouped"
            colors={colors}
            enableLabel={false}
            isInteractive={true}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time (HH:MM:SS)',
                legendPosition: 'middle',
                legendOffset: -75,
                format: value => util.secondsToFormattedTime(value),
                tickValues: [0, 1800, 3600, 5400, 7200]
            }}
            gridYValues={[0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200]}
            maxValue={7200}
            tooltip={({ value, color }) => (
                <div style={{ color }}>
                    {util.secondsToFormattedTime(value)}
                </div>
            )}
            animate={true}
            motionStiffness={90}
            motionDamping={25}
        />
    )
}

export default WeekdaysGraph;