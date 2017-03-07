import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions, VariationActions} from '../../actions';
import {Modal} from '../modules/base';
import VariationsList from '../modules/VariationsList';

// import {Link} from '../../utils/router';

class ExperimentPage extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'details',
            variationToDelete: null,
            shouldConfirmVariationDeletion: false
        };


        this.onDeleteVariation = this.onDeleteVariation.bind(this);
        this.onVariationModalClose = this.onVariationModalClose.bind(this);
        this.deleteVariation = this.deleteVariation.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
    }


    // Show confirmation window & store the variation id in state
    onDeleteVariation(e) {
        e.preventDefault();

        this.setState({
            variationToDelete: Number(e.target.getAttribute('data-variationid')),
            shouldConfirmVariationDeletion: true
        });
    }


    // Actually deletes the variation by making an API call
    deleteVariation() {
        this.props.actions.deleteVariation(this.props.experimentId, this.state.variationToDelete);

        this.setState({
            variationToDelete: null,
            shouldConfirmVariationDeletion: false
        });
    }


    // Closing the modal & removing the variation id
    // which was set on state
    onVariationModalClose() {
        this.setState({
            variationToDelete: null,
            shouldConfirmVariationDeletion: false
        });
    }


    onTabChange(e) {
        this.setState({
            activeTab: e.currentTarget.getAttribute('data-type')
        });
    }


    renderVariationDeletionDialog() {
        if (!this.state.shouldConfirmVariationDeletion) {
            return null;
        }

        const variation = this.props.variations.find(v => v.id === this.state.variationToDelete);

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
                return null;

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
                    <div className="item__name">Status</div>
                    <div className="item__value">{this.props.experiment.isActive ? 'Active' : 'Inactive'}</div>
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
                    <div className="item__value">{this.props.experiment.createTime.toString()}</div>
                </div>
            </section>
        );
    }


    renderExpVariations() {
        return (
            <VariationsList
                variations={this.props.variations}
                experimentId={this.props.experimentId}
                onDeleteVariation={this.onDeleteVariation}
            />
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
                    <h1 className="title is-3">{experiment.name}</h1>
                    {this.renderTabs()}
                    {this.renderTabContent()}
                    {this.renderVariationDeletionDialog()}
                </div>
            );
        }

        return null;
    }
}


export default connect(
    (state, props) => {
        const experimentId = Number(props.params.expId);

        return {
            experimentId,
            apiState: state.experiment.experimentApiStatus,
            experiment: state.experiment.experiments.find(exp => exp.id === experimentId),
            variations: state.variation.variations.filter(v => v.experimentId === experimentId)
        };
    },
    (dispatch => ({
        actions: bindActionCreators({
            ...ExperimentActions,
            ...VariationActions
        }, dispatch)
    }))
)(ExperimentPage);
