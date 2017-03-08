import React from 'react';
import {Link} from '../../utils/router';

// Returns the `Start/Pause` button component for Experiment
function getExperimentStatusButton(experiment, errorType, onStatusToggle) {
    let btnTxt;
    let isDisabled = Boolean(errorType);

    if (experiment.isActive) {
        btnTxt = 'Pause';
        isDisabled = false;
    } else {
        btnTxt = 'Start';
    }

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={onStatusToggle}
            className="button is-primary is-outlined"
        >
            {btnTxt}
        </button>
    );
}


export default function (props) {
    return (
        <div className="is-clearfix">
            <h1 className="title is-3 is-pulled-left">
                {props.experiment.name}
                &nbsp;&nbsp;<span className="tag is-primary">{props.experiment.isActive ? 'Running' : 'Paused'}</span>
            </h1>
            <div className="is-pulled-right">
                <div className="control is-grouped">
                    <div className="control">
                        {getExperimentStatusButton(props.experiment, props.experimentErrorType, props.onExperimentStatusToggle)}
                    </div>
                    <div className="control">
                        <Link
                            to={`/experiments/${props.experiment.id}/edit`}
                            className="button is-info is-outlined"
                        >
                            Edit
                        </Link>
                    </div>
                    <div className="control">
                        <button
                            type="button"
                            onClick={props.onExperimentDelete}
                            className="button is-danger is-outlined"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
