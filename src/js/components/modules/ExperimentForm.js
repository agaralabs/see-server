import React from 'react';


export default function ExperimentForm(props) {
    return (
        <form className="experiment-form" onSubmit={props.onFormSubmit}>
            <label className="label">Experiment Name</label>
            <div className="control">
                <input
                    type="text"
                    value={props.experiment.name || ''}
                    onChange={props.onNameChange}
                    placeholder="My test experiment"
                    className="input"
                />
            </div>
            <label className="label">Experiment Exposure (In %)</label>
            <div className="control">
                <input
                    type="text"
                    value={props.experiment.exposure || ''}
                    onChange={props.onExposureChange}
                    placeholder="50"
                    className="input"
                />
            </div>
            <label className="label">Metric Name</label>
                <div className="control">
                <input
                    type="text"
                    value={props.experiment.metricName || ''}
                    onChange={props.onMetricChange}
                    placeholder="book-btn-click"
                    className="input"
                />
            </div>
            <label className="label">Status</label>
            <div className="control">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        value=""
                        checked={props.experiment.isActive}
                        onChange={props.onStatusChange}
                    />
                    Active
                </label>
            </div>
            <div className="control is-grouped">
                <div className="control">
                    <button
                        type="submit"
                        className="button is-primary"
                    >
                        Submit
                    </button>
                </div>
                <div className="control">
                    <button
                        type="button"
                        className="button"
                        onClick={props.onFormCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}
