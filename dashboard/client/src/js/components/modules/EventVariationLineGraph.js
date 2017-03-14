import React from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Loader from './base/Loader';
import Helpers from '../../utils/helpers';

/**
 * Renders a Line graph of for control & variations for each goal
 *
 * @param  {Array} graphData
 * @param  {Array} variations
 * @param  {Array} colors
 *
 * @return {ReactElement}
 */
function renderGraph(graphData, variations, colors) {
    const interval = Math.floor(graphData.length / 15);

    return (
        <ResponsiveContainer
                width="100%"
                height={500}
            >
            <LineChart
                width={600}
                height={300}
                data={graphData}
                margin={{top: 0, right: 0, left: 0, bottom: 0}}
            >
                <XAxis
                    dataKey="timeLabel"
                    interval={interval}
                    domain={['dataMin', 'dataMax + 2']}
                />
                <YAxis
                    domain={['dataMin', 'dataMax + 2']}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                {
                    variations.map((v, i) => {
                        return (
                            <Line
                                key={v.id}
                                type="monotone"
                                name={v.name}
                                dataKey={`variations.${v.id}`}
                                stroke={colors[i % colors.length]}
                            />
                        );
                    })
                }
            </LineChart>
        </ResponsiveContainer>
    );
}


export default function (props) {
    if (props.timelineApiStatus.isFetching) {
        return <Loader />;
    }

    if (props.timelineApiStatus.errors) {
        return <div className="has-text-centered">Some error occured</div>;
    }

    if (!props.expTimeline) {
        return <div className="has-text-centered">No data for reports to show</div>;
    }

    if (!props.selectedEvent) {
        return <div className="has-text-centered">Please select an event for which the graph needs to be shown</div>;
    }

    const colors = Helpers.getColors();
    const graphData = props.expTimeline.eventTimeline[props.selectedEvent];

    if (!graphData) {
        return <div className="has-text-centered">{`No reports present for event - ${props.selectedEvent}`}</div>;
    }

    return (
        <div className="graph-holder">
            {renderGraph(graphData, props.variations, colors)}
        </div>
    );
}
