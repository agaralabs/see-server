import React, {Component} from 'react';
import {History} from '../../utils/router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions} from '../../actions';
import {ExperimentModel} from '../../models';
import ExperimentForm from '../modules/ExperimentForm';
import Helpers from '../../utils/helpers';


class ExperimentAddEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editableExperiment: {}
        };

        this.onExperimentInfoChange = this.onExperimentInfoChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormCancel = this.onFormCancel.bind(this);
    }


    componentWillMount() {
        if (this.props.experimentId) {
            this.props.actions.getExperimentById(this.props.experimentId);
        }
    }


    onExperimentInfoChange(e) {
        const key = e.target.getAttribute('name');
        let value;

        switch (key) {
            case 'exposure':
                value = Number(Helpers.getNumberStr(e.target.value.trim().slice(0, 3)));
                value = Math.min(100, value);
                break;

            default:
                value = e.target.value;
                break;
        }

        const editableExperiment = {...this.state.editableExperiment};

        editableExperiment[key] = value;

        this.setState({
            editableExperiment
        });
    }


    onFormSubmit(e) {
        // ToDo: Validations
        e.preventDefault();

        const experiment = {
            ...this.props.experiment,
            ...this.state.editableExperiment
        };

        if (experiment.id) {
            this.props.actions.updateExperiment(experiment)
                .then(() => History.push(`/experiments/${experiment.id}`));
        } else {
            this.props.actions.createExperiment(experiment)
                .then(expId => History.replace(`/experiments/${expId}`));
        }
    }


    onFormCancel(e) {
        e.preventDefault();
        const url = this.props.experimentId ? `/experiments/${this.props.experimentId}` : '/dashboard';

        History.replace(url);
    }


    renderPageTitle() {
        let title = 'Create new Experiment';

        if (this.props.experimentId) {
            title = 'Edit Experiment';
        }

        if (this.props.experiment.name) {
            title = `${title} - ${this.props.experiment.name}`;
        }

        return <h1 className="title is-3">{title}</h1>;
    }


    renderExperimentForm() {
        // FixMe: Antipattern. Composing a variable mix of state & props.
        // It is as same as assigning props to state which is anti-pattern
        const experiment = {
            ...this.props.experiment,
            ...this.state.editableExperiment
        };

        return (
            <ExperimentForm
                experiment={experiment}
                onExperimentInfoChange={this.onExperimentInfoChange}
                onFormSubmit={this.onFormSubmit}
                onFormCancel={this.onFormCancel}
            />
        );
    }


    render() {
        return (
            <div className="columns page page-expedit">
                <div className="column is-4 form-container">
                    {this.renderPageTitle()}
                    {this.renderExperimentForm()}
                </div>
            </div>
        );
    }
}


export default connect(
    (state, props) => {
        const experimentId = Number(props.params.expId);
        let experiment = new ExperimentModel();

        if (experimentId) {
            const exp = state.experiment.experiments.find(e => e.id === experimentId);

            if (exp) {
                experiment = exp;
            }
        }

        return {
            experimentId,
            experiment
        };
    },
    (dispatch => ({
        actions: bindActionCreators(ExperimentActions, dispatch)
    }))
)(ExperimentAddEdit);
