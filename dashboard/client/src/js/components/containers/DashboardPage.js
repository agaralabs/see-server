import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions} from '../../actions';
import {Link} from '../../utils/router';
import Helpers from '../../utils/helpers';

class DashboardPage extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {
        this.props.actions.fetchAllExperiments();
    }


    render() {
        return (
            <section className="container page page-experiments">
                <div className="is-clearfix">
                    <h1 className="title is-3 is-pulled-left">All Experiments</h1>
                    <Link
                        to="/experiments/add"
                        className="button is-primary is-outlined is-pulled-right"
                    >
                        Create new Experiment
                    </Link>
                </div>

                <table className="table is-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Exposure</th>
                            <th>Created On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.experiments.map(exp => {
                                return (
                                    <tr key={exp.id}>
                                        <td>{exp.id}</td>
                                        <td>
                                            <Link to={`/experiments/${exp.id}`}>{exp.name}</Link>
                                        </td>
                                        <td>{exp.isActive ? 'Running' : 'Paused'}</td>
                                        <td>{exp.exposure}%</td>
                                        <td>{Helpers.formatDate(exp.createTime)}</td>
                                        <td>
                                            <div className="control is-grouped">
                                                <div className="control">
                                                    <Link
                                                        to={`/experiments/${exp.id}`}
                                                        className="button is-small is-primary is-outlined"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                                <div className="control">
                                                    <Link
                                                        to={`/experiments/${exp.id}/update`}
                                                        className="button is-small is-info is-outlined"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}


export default connect(
    (state, props) => {
        return {
            experiments: state.experiment.experiments
        };
    },
    (dispatch => ({
        actions: bindActionCreators(ExperimentActions, dispatch)
    }))
)(DashboardPage);
