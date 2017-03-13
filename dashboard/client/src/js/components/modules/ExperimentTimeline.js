import React, {PureComponent} from 'react';
import EventVariationLineGraph from './EventVariationLineGraph';
import VariationStats from './VariationStats';
import EventSelector from './EventSelector';
import GranularitySelector from './GranularitySelector';


export default class ExperimentTimeline extends PureComponent {
    constructor(props) {
        super(props);

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

        this.onEventChange = this.onEventChange.bind(this);
        this.onGranularityChange = this.onGranularityChange.bind(this);
    }


    onEventChange(e) {
        this.setState({
            selectedEvent: e.target.value
        });
    }


    onGranularityChange(e) {
        this.props.onGraphGranularityChange(e.target.value);
    }


    getUniqueEvents() {
        let events = [];

        if (this.props.expTimeline) {
            events = events.concat(Object.keys(this.props.expTimeline.eventTimeline));
        }

        if (this.props.variationStats && this.props.variations.length) {
            this.props.variations.forEach(v => {
                if (this.props.variationStats[v.id]) {
                    this.props.variationStats[v.id].forEach(stat => {
                        events.push(stat.name);
                    });
                }
            });
        }

        // return unique event values
        return [...new Set(events)].filter(e => e !== 'participation');
    }


    render() {
        const events = this.getUniqueEvents();

        return (
            <div>
                <div className="report-item">
                    <div className="is-clearfix">
                        <h5 className="subtitle is-pulled-left report-item__title">Stats</h5>
                        <div className="is-pulled-right">
                            <EventSelector
                                events={events}
                                selectedEvent={this.state.selectedEvent}
                                onEventChange={this.onEventChange}
                            />
                        </div>
                    </div>
                    <div className="report-item__content">
                        <VariationStats
                            statsApiStatus={this.props.statsApiStatus}
                            variations={this.props.variations}
                            variationStats={this.props.variationStats}
                            selectedEvent={this.state.selectedEvent}
                        />
                    </div>
                </div>
                <div className="report-item">
                    <div className="is-clearfix">
                        <h5 className="subtitle is-pulled-left report-item__title">Graph</h5>
                        <div className="is-pulled-right">
                            <div className="control is-grouped">
                                <GranularitySelector
                                    selectedGranularity={this.props.graphGranularity}
                                    onGranularityChange={this.onGranularityChange}
                                />
                                <EventSelector
                                    events={events}
                                    selectedEvent={this.state.selectedEvent}
                                    onEventChange={this.onEventChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="report-item__content">
                        <EventVariationLineGraph
                            timelineApiStatus={this.props.timelineApiStatus}
                            expTimeline={this.props.expTimeline}
                            selectedEvent={this.state.selectedEvent}
                            variations={this.props.variations}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
