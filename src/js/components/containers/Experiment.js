import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ExperimentActions, VariationActions} from '../../actions';


class Experiment extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.actions.getExperimentById(this.props.experimentId);
        this.props.actions.fetchVariationsByExpId(this.props.experimentId);
    }


    render() {
        return <div>{this.props.children}</div>;
    }
}

export default connect(
    (state, props) => {
        const experimentId = Number(props.params.expId);

        return {
            ...state,
            ...props,
            experimentId
        };
    },
    (dispatch => ({
        actions: bindActionCreators({
            ...ExperimentActions,
            ...VariationActions
        }, dispatch)
    }))
)(Experiment);
