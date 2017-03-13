import React from 'react';


const granularity = [
    'Hourly',
    'Daily',
    'Weekly',
    'Monthly'
];


export default function (props) {
    return (
        <div className="control is-horizontal">
            <div className="control-label">
                <label className="label">Granularity</label>
            </div>
            <p className="control">
                <span className="select">
                    <select
                        value={props.selectedGranularity}
                        onChange={props.onGranularityChange}
                    >
                        {
                            granularity.map(g => {
                                return (
                                    <option
                                        key={g}
                                        value={g.toLowerCase()}
                                    >
                                        {g}
                                    </option>
                                );
                            })
                        }
                    </select>
                </span>
            </p>
        </div>
    );
}
