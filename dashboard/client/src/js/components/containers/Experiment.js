import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions, VariationActions, StatsActions} from '../../actions';
import {VariationModel} from '../../models';
import {Modal} from '../modules/base';
import VariationsList from '../modules/VariationsList';
import ExperimentHeader from '../modules/ExperimentHeader';
import ExperimentTimeline from '../modules/ExperimentTimeline';
import Helpers from '../../utils/helpers';


class ExperimentPage extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'variations',
            selectedVariation: null,
            isVarEditModeOn: false,
            shouldConfirmVarDeletion: false,
            shouldConfirmExpDeletion: false
        };

        this.onExperimentDelete = this.onExperimentDelete.bind(this);
        this.onExperimentStatusToggle = this.onExperimentStatusToggle.bind(this);
        this.onVariationDelete = this.onVariationDelete.bind(this);
        this.onVariationModalClose = this.onVariationModalClose.bind(this);
        this.deleteVariation = this.deleteVariation.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.onVariationAddEdit = this.onVariationAddEdit.bind(this);
        this.onVariationInfoChange = this.onVariationInfoChange.bind(this);
        this.onVariationSave = this.onVariationSave.bind(this);
        this.onCancelVariationAddEdit = this.onCancelVariationAddEdit.bind(this);
    }


    componentWillMount() {
        const currentTime = new Date();
        const previousTime = new Date(new Date().setHours(currentTime.getHours() - (24 * 40)));

        this.props.actions.getExperimentById(this.props.experimentId);
        this.props.actions.fetchVariationsByExpId(this.props.experimentId);
        this.props.actions.fetchStatsForExperiment(this.props.experimentId);
        this.props.actions.fetchTimelineForExperiment(
            this.props.experimentId,
            previousTime,
            currentTime,
            'daily'
        );
    }


    onExperimentDelete(e) {
        e.preventDefault(e);

        this.setState({
            shouldConfirmExpDeletion: true
        });
    }


    // Toggles the `isActive` status of the experiment
    onExperimentStatusToggle(e) {
        const experiment = {...this.props.experiment};

        experiment.isActive = !experiment.isActive;

        this.props.actions.updateExperiment(experiment);
    }


    // Show confirmation window & store the variation id in state
    onVariationDelete(e) {
        e.preventDefault();
        const varId = Number(e.target.getAttribute('data-variationid'));

        this.setState({
            selectedVariation: {
                ...this.props.variations.find(v => v.id === varId)
            },
            shouldConfirmVarDeletion: true
        });
    }


    // Actually deletes the variation by making an API call
    deleteVariation() {
        this.props.actions.deleteVariation(this.props.experimentId, this.state.selectedVariation.id);

        this.setState({
            selectedVariation: null,
            shouldConfirmVarDeletion: false
        });
    }


    // Closing the modal & removing the variation id
    // which was set on state
    onVariationModalClose() {
        this.setState({
            selectedVariation: null,
            shouldConfirmVarDeletion: false
        });
    }


    onTabChange(e) {
        this.setState({
            activeTab: e.currentTarget.getAttribute('data-type')
        });
    }


    onVariationAddEdit(e) {
        const action = e.target.getAttribute('data-action');

        let selectedVariation;
        let varId;

        switch (action) {
            case 'create':
                selectedVariation = new VariationModel();
                break;

            case 'update':
                varId = Number(e.target.getAttribute('data-variationid'));

                selectedVariation = {
                    ...this.props.variations.find(v => v.id === varId)
                };

                break;

            default:
                break;
        }

        this.setState({
            selectedVariation,
            isVarEditModeOn: true
        });
    }


    onCancelVariationAddEdit(e) {
        this.setState({
            selectedVariation: null,
            isVarEditModeOn: false
        });
    }


    onVariationInfoChange(e) {
        const selectedVariation = {...this.state.selectedVariation};
        const key = e.target.getAttribute('data-keyname');
        const value = e.target.value.trim();

        switch (key) {
            case 'splitPercent':
                selectedVariation[key] = Number(Helpers.getNumberStr(value.slice(0, 3)));
                break;

            default:
                selectedVariation[key] = value;
        }

        this.setState({
            selectedVariation
        });
    }


    onVariationSave(e) {
        const variation = {...this.state.selectedVariation};

        if (variation.id) {
            this.props.actions.updateVariation(this.props.experimentId, variation);
        } else {
            this.props.actions.createVariation(this.props.experimentId, variation);
        }

        this.setState({
            selectedVariation: null,
            isVarEditModeOn: false
        });
    }


    renderExperimentError() {
        switch (this.props.experimentErrorType) {
            case 'NO_CONTROL':
                return (
                    <div className="notification is-warning">
                        Please add atleast <b>2 variations</b>(including control) to activate the experiment
                    </div>
                );

            case 'NO_VARIATION':
                return (
                    <div className="notification is-warning">
                        Please add atleast <b>1 more variation</b> to activate the experiment
                    </div>
                );

            case 'INCORRECT_SPLIT':
                return (
                    <div className="notification is-warning">
                        Please check the split percentage for all the variations. The total should be <b>100</b> to activate the experiment
                    </div>
                );

            default:
                return null;
        }
    }


    renderExperimentHeader() {
        return (
            <ExperimentHeader
                experiment={this.props.experiment}
                experimentErrorType={this.props.experimentErrorType}
                onExperimentDelete={this.onExperimentDelete}
                onExperimentStatusToggle={this.onExperimentStatusToggle}
            />
        );
    }


    renderTabs() {
        const tabs = [
            {
                type: 'details',
                text: 'Details'
            },
            {
                type: 'variations',
                text: 'Variations'
            },
            {
                type: 'reports',
                text: 'Reports'
            }
        ];

        return (
            <div className="tabs is-boxed">
                <ul>
                    {
                        tabs.map(t => {
                            return (
                                <li
                                    key={t.type}
                                    data-type={t.type}
                                    onClick={this.onTabChange}
                                    className={t.type === this.state.activeTab ? 'is-active' : null}
                                >
                                    <a>
                                        <span>{t.text}</span>
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }


    renderTabContent() {
        switch (this.state.activeTab) {
            case 'details':
                return this.renderExpDetails();

            case 'variations':
                return this.renderExpVariations();

            case 'reports':
                return this.renderExpTimeline();

            default:
                return null;
        }
    }


    renderExpDetails() {
        return (
            <section className="experiment-details">
                <div className="item">
                    <div className="item__name">Id</div>
                    <div className="item__value">{this.props.experiment.id}</div>
                </div>
                <div className="item">
                    <div className="item__name">Version</div>
                    <div className="item__value">{this.props.experiment.version}</div>
                </div>
                <div className="item">
                    <div className="item__name">Exposure</div>
                    <div className="item__value">{this.props.experiment.exposure}%</div>
                </div>
                <div className="item">
                    <div className="item__name">Metric name</div>
                    <div className="item__value">{this.props.experiment.metricName}</div>
                </div>
                <div className="item">
                    <div className="item__name">Created On</div>
                    <div className="item__value">{Helpers.formatDate(this.props.experiment.createTime)}</div>
                </div>
            </section>
        );
    }


    renderExpVariations() {
        return (
            <VariationsList
                variations={this.props.variations}
                experimentId={this.props.experimentId}
                selectedVariation={this.state.selectedVariation}
                isVarEditModeOn={this.state.isVarEditModeOn}
                onVariationAddEdit={this.onVariationAddEdit}
                onVariationDelete={this.onVariationDelete}
                onVariationInfoChange={this.onVariationInfoChange}
                onVariationSave={this.onVariationSave}
                onCancelVariationAddEdit={this.onCancelVariationAddEdit}
            />
        );
    }


    renderExpTimeline() {
        return (
            <ExperimentTimeline
                experimet={this.props.experiment}
                variations={this.props.variations}
                expTimeline={this.props.expTimeline}
            />
        );
    }


    renderVariationDeletionDialog() {
        if (!this.state.shouldConfirmVarDeletion) {
            return null;
        }

        const variation = this.props.variations.find(v => v.id === this.state.selectedVariation.id);

        return (
            <Modal
                onClose={this.onVariationModalClose}
            >
                <div className="dialog">
                    <div className="dialog__content">
                        Are you sure you want to delete variation <b>{variation.name}</b>?
                    </div>
                    <div className="dialog__action">
                        <button
                            onClick={this.deleteVariation}
                            className="button is-primary dialog__action__item"
                        >
                            Yes
                        </button>
                        <button
                            onClick={this.onVariationModalClose}
                            className="button is-danger dialog__action__item"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }


    render() {
        if (this.props.apiState.isFetching) {
            return (
                <div className="container page">
                    Fetching experiment details
                </div>
            );
        }


        if (this.props.apiState.errors) {
            return (
                <div className="container page">
                    {JSON.stringify(this.props.apiState.errors)}
                </div>
            );
        }

        const experiment = this.props.experiment;

        if (experiment) {
            return (
                <div className="container page page-experiment">
                    {this.renderExperimentError()}
                    {this.renderExperimentHeader()}
                    <div className="box">
                        {this.renderTabs()}
                        {this.renderTabContent()}
                        {this.renderVariationDeletionDialog()}
                    </div>
                </div>
            );
        }

        return null;
    }
}


export default connect(
    (state, props) => {
        const experimentId = Number(props.params.expId);
        const apiState = state.experiment.experimentApiStatus;
        const experiment = state.experiment.experiments.find(exp => exp.id === experimentId);
        const variations = state.variation.variations.filter(v => v.experimentId === experimentId);
        const experimentErrorType = VariationModel.getExperimentErrorType(variations);
        const expTimeline = state.stats.expTimelineMapping[experimentId];

        console.log(expTimeline);

        const variationEventsMapping = variations.reduce((mapping, v) => {
            mapping[v.id] = state.stats.variationEventsMapping[v.id];

            return mapping;
        }, {});


        return {
            experimentId,
            apiState,
            experiment,
            variations,
            experimentErrorType,
            variationEventsMapping,
            expTimeline
        };
    },
    (dispatch => ({
        actions: bindActionCreators({
            ...ExperimentActions,
            ...VariationActions,
            ...StatsActions
        }, dispatch)
    }))
)(ExperimentPage);
