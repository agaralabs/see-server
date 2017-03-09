import ActionConstants from '../ActionConstants';

const initialState = {
    experimentApiStatus: {
        isFetching: false,
        errors: null
    },
    experiments: []
};


export default (state = initialState, action) => {
    let experiments;
    let experimentApiStatus;


    switch (action.type) {
        case ActionConstants.UPDATE_EXPERIMENT_API_STATUS:
            experimentApiStatus = {
                ...state.experimentApiStatus,
                isFetching: action.isFetching,
                errors: action.errors
            };

            return {
                ...state,
                experimentApiStatus
            };


        case ActionConstants.UPDATE_EXPERIMENT:
            experiments = state.experiments.filter(e => e.id !== action.experiment.id);
            experiments.push(action.experiment);

            return {
                ...state,
                experiments
            };


        default:
            return state;
    }
};
