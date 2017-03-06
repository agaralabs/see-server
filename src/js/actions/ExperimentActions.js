import {batchActions} from 'redux-batched-actions';
import objectClean from 'object-clean';
import ActionConstants from '../ActionConstants';
import {ExperimentModel} from '../models';
import {ExperimentApi} from '../apis';

/**
 * Action creator for updating the Experiment API state
 *
 * @private
 * @param {Boolean} isFetching
 * @param {?Array} errors
 *
 * @return {Object}
 */
function _updateExperimentApiState(isFetching, errors = null) {
    return {
        type: ActionConstants.UPDATE_EXPERIMENT_API_STATUS,
        isFetching,
        errors
    };
}

/**
 * Action creator for updating the experiment
 *
 * @private
 * @param {Experiment} experiment
 *
 * @return {Object}
 */
function _updateExperiment(experiment) {
    return {
        type: ActionConstants.UPDATE_EXPERIMENT,
        experiment
    };
}


/**
 * Action creator for fetching all experiments from API
 *
 * @return {Thunk}
 */
export function fetchAllExperiments() {
    return (dispatch) => {
        dispatch(_updateExperimentApiState(true));

        return ExperimentApi.getAllExperiments()
            .then(res => {
                const actions = res.data.experiments.map(exp => {
                    return _updateExperiment(new ExperimentModel(exp));
                });

                actions.push(_updateExperimentApiState(false));

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateExperimentApiState(false, [err]));
            });
    };
}


export function createExperiment(experiment) {
    return (dispatch) => {
        dispatch(_updateExperimentApiState(true));
        const postData = {
            experiment: objectClean(ExperimentModel.transformForApi(experiment))
        };


        return ExperimentApi.createExperiment(postData)
            .then(res => {
                if (res.error) {
                    dispatch(_updateExperimentApiState(false, [res.error]));

                    return;
                }

                const actions = [
                    _updateExperimentApiState(false),
                    _updateExperiment(new ExperimentModel(res.data.experiment))
                ];

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateExperimentApiState(false, [err]));
            });
    };
}


export function getExperimentById(expId) {
    return (dispatch) => {
        dispatch(_updateExperimentApiState(true));

        return ExperimentApi.getExperimentById(expId)
            .then(res => {
                if (res.error) {
                    dispatch(_updateExperimentApiState(false, [res.error]));

                    return;
                }

                const actions = [
                    _updateExperimentApiState(false),
                    _updateExperiment(new ExperimentModel(res.data.experiment))
                ];

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateExperimentApiState(false, [err]));
            });
    };
}
