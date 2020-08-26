import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import * as util from '../Utils/util';

function AllGraph({data, colors, tickValue, tickInterval}) {

    console.log(data);

    return (
        <ResponsiveLine
            data={data}
            margin={{ left: 120, top: 50, bottom: 100, right: 100}}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
                type: 'linear',
                stacked: false,
                max: 7200
            }}
            yFormat={value => util.secondsToFormattedTime(value)}
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
            axisBottom={{
                format: '%Y-%m-%d',
                //tickValues: 'every ' + tickValues + ' days',
                tickValues: 'every ' + tickValue + ' ' + tickInterval,
                //tickValues: 'every 1 week',
                legend: 'Date',
                legendOffset: 75,
                legendPosition: 'middle',
                tickRotation: -45,
            }}
            gridYValues={[0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200]}
            colors={colors.length > 0 ? colors : {scheme: "blues"}}
            enablePointLabel={false}
            pointSize={5}
            pointBorderWidth={1}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            enableSlices={false}
            enableCrosshair={false}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
}

export default AllGraph;