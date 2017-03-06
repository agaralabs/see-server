import React, {Component} from 'react';
import {History} from '../../utils/router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions} from '../../actions';
import {ExperimentModel} from '../../models';
import ExperimentForm from '../modules/ExperimentForm';
import Helpers from '../../utils/helpers';


class ExperimentPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            experiment: new ExperimentModel()
        };


        this.onNameChange = this.onNameChange.bind(this);
        this.onExposureChange = this.onExposureChange.bind(this);
        this.onMetricChange = this.onMetricChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormCancel = this.onFormCancel.bind(this);
    }


    onNameChange(e) {
        this.setState({
            ...this.state,
            experiment: {
                ...this.state.experiment,
                name: e.target.value
            }
        });
    }


    onExposureChange(e) {
        let value = Number(Helpers.getNumberStr(e.target.value.trim().slice(0, 3)));

        value = Math.min(100, value);

        this.setState({
            ...this.state,
            experiment: {
                ...this.state.experiment,
                exposure: value
            }
        });
    }


    onMetricChange(e) {
        this.setState({
            ...this.state,
            experiment: {
                ...this.state.experiment,
                metricName: e.target.value
            }
        });
    }


    onStatusChange(e) {
        this.setState({
            ...this.state,
            experiment: {
                ...this.state.experiment,
                isActive: !this.state.experiment.isActive
            }
        });
    }


    onFormSubmit(e) {
        e.preventDefault();

        this.props.actions.createExperiment(this.state.experiment);
    }


    onFormCancel(e) { // eslint-disable-line class-methods-use-this
        e.preventDefault();
        History.back();
    }


    render() {
        return (
            <div className="container page page-experiments">
                <h1 className="title is-3">Create new Experiment</h1>
                <ExperimentForm
                    experiment={this.state.experiment}
                    onNameChange={this.onNameChange}
                    onExposureChange={this.onExposureChange}
                    onMetricChange={this.onMetricChange}
                    onStatusChange={this.onStatusChange}
                    onFormSubmit={this.onFormSubmit}
                    onFormCancel={this.onFormCancel}
                />
            </div>
        );
    }
}


export default connect(
    (state, props) => {
        return {
            ...props
        };
    },
    (dispatch => ({
        actions: bindActionCreators(ExperimentActions, dispatch)
    }))
)(ExperimentPage);
