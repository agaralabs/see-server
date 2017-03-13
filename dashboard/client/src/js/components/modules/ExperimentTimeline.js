import React, {PureComponent} from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Helpers from '../../utils/helpers';

export default class ExperimentTimeline extends PureComponent {
    constructor(props) {
        super(props);

        this.colors = Helpers.getColors();

        this.state = {
            selectedEvent: 'srp_card_cta_click',
            data: [
                {
                    name: 'Page A',
                    uv: 4000,
                    pv: {
                        'v1': 123,
                        'v2': 5453
                    },
                    amt: 2400
                },
                {name: 'Page B', uv: 3000, pv: {
                    'v1': 908,
                    'v2': 898
                }, amt: 2210},
                {name: 'Page C', uv: 2000, pv: {
                    'v1': 453,
                    'v2': 459
                }, amt: 2290},
                {name: 'Page D', uv: 2780, pv: {
                    'v1': 123,
                    'v2': 989
                }, amt: 2000},
                {name: 'Page E', uv: 1890, pv: {
                    'v1': 123,
                    'v2': 139
                }, amt: 2181},
                {name: 'Page F', uv: 2390, pv: {
                    'v1': 123,
                    'v2': 179
                }, amt: 2500},
                {name: 'Page G', uv: 3490, pv: {
                    'v1': 123,
                    'v2': 693
                }, amt: 2100}
            ]
        };
    }


    render() {
        const graphData = this.props.expTimeline.eventTimeline[this.state.selectedEvent];
        const interval = Math.floor(graphData.length / 15);

        const lines = this.props.variations.map((v, i) => {
            return (
                <Line
                    key={v.id}
                    type="monotone"
                    name={v.name}
                    dataKey={`variations.${v.id}`}
                    stroke={this.colors[i % this.colors.length]}
                />
            );
        });


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
                    {lines}
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
