import React from 'react';


export default function (props) {
    return (
        <div className="control is-horizontal">
            <div className="control-label">
                <label className="label">Event</label>
            </div>
            <p className="control">
                <span className="select">
                    <select
                        value={props.selectedEvent}
                        onChange={props.onEventChange}
                    >
                        {
                            props.events.map(e => {
                                return (
                                    <option
                                        key={e}
                                        value={e}
                                    >
                                        {e}
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
