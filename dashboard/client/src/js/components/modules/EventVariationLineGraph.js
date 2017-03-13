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


/**
 * Renders list of events against the graph
 *
 * @param  {Array} events
 * @param  {String} selectedEvent
 * @param  {Function} onClick
 *
 * @return {ReactElement}
 */
function renderEventsList(events, selectedEvent, onClick) {
    return (
        <div>
            <h5 className="subtitle events-holder__title">Events</h5>
            <ul className="events-holder__list">
                {
                    events.map((e, i) => {
                        const itemClasses = ['events-holder__list__item'];

                        if (e === selectedEvent) {
                            itemClasses.push('events-holder__list__item--active');
                        }

                        return (
                            <li
                                key={i}
                                data-event={e}
                                onClick={onClick}
                                className={itemClasses.join(' ')}
                            >
                                {e}
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}


export default function (props) {
    if (props.timelineApiStatus.isFetching) {
        return <Loader />;
    }

    if (props.timelineApiStatus.errors) {
        return 'Some error occured';
    }

    if (!props.expTimeline) {
        return 'No data for reports to show';
    }


    const colors = Helpers.getColors();
    const graphData = props.expTimeline.eventTimeline[props.selectedEvent];


    return (
        <div className="graph-holder">
            {renderGraph(graphData, props.variations, colors)}
        </div>
    );
}
