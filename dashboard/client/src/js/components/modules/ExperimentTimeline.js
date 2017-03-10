import React, {PureComponent} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

export default class ExperimentTimeline extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                {name: 'Page A', uv: 4000, pv: {
                    'v1': 123,
                    'v2': 5453
                }, amt: 2400},
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
        return (
            <LineChart
                width={600}
                height={300}
                data={this.state.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="pv.v1"
                    stroke="#8884d8"
                    activeDot={{r: 8}}
                />
                <Line
                    type="monotone"
                    dataKey="pv.v2"
                    stroke="#82ca9d"
                />
            </LineChart>
        );
    }
}
