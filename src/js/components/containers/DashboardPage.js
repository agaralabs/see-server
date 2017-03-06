import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions} from '../../actions';
import {Link} from '../../utils/router';

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
                        to="/experiments/create"
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
                                        <td>{exp.isActive ? 'Active' : 'Inactive'}</td>
                                        <td>{exp.exposure}%</td>
                                        <td>{exp.createTime.toString()}</td>
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
