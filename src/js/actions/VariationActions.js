import {batchActions} from 'redux-batched-actions';
import objectClean from 'object-clean';
import ActionConstants from '../ActionConstants';
import {VariationModel} from '../models';
import {VariationApi} from '../apis';

/**
 * Action creator for updating the Variation API state
 *
 * @private
 * @param {Boolean} isFetching
 * @param {?Array} errors
 *
 * @return {Object}
 */
function _updateVariationApiState(isFetching, errors = null) {
    return {
        type: ActionConstants.UPDATE_VARIATION_API_STATUS,
        isFetching,
        errors
    };
}

/**
 * Action creator for updating the variation
 *
 * @private
 * @param {Variation} variation
 *
 * @return {Object}
 */
function _updateVariation(variation) {
    return {
        type: ActionConstants.UPDATE_VARIATION,
        variation
    };
}


/**
 * Action creator for removing variation from the store
 *
 * @param  {Number} variationId
 *
 * @return {Object}
 */
function _removeVariation(variationId) {
    return {
        type: ActionConstants.DELETE_VARIATION,
        variationId
    };
}


/**
 * Action creator for fetching all variations of an experiment
 *
 * @param {Number} expId
 * @return {Thunk}
 */
export function fetchVariationsByExpId(expId) {
    return (dispatch) => {
        dispatch(_updateVariationApiState(true));

        return VariationApi.getAllByExperimentId(expId)
            .then(res => {
                const actions = res.data.variations.map(v => {
                    return _updateVariation(new VariationModel(v));
                });

                actions.push(_updateVariationApiState(false));

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateVariationApiState(false, [err]));
            });
    };
}


/**
 * Action creator for deleting a variation
 *
 * @param  {Number} expId
 * @param  {Number} varId
 *
 * @return {Thunk}
 */
export function deleteVariation(expId, varId) {
    return (dispatch) => {
        dispatch(_updateVariationApiState(true));

        return VariationApi.deleteVariation(expId, varId)
            .then(res => {
                const actions = [
                    _removeVariation(varId),
                    _updateVariationApiState(false)
                ];

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateVariationApiState(false, [err]));
            });
    };
}


/**
 * Action creator for creating a new variation
 *
 * @param  {Number} experimentId
 * @param  {Variation} variation
 *
 * @return {Thunk}
 */
export function createVariation(experimentId, variation) {
    return (dispatch) => {
        dispatch(_updateVariationApiState(true));

        const params = {
            variation: objectClean(VariationModel.transformForApi(variation))
        };

        return VariationApi.createVariation(experimentId, params)
            .then(res => {
                const actions = [
                    _updateVariation(new VariationModel(res.data.variation)),
                    _updateVariationApiState(false)
                ];

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateVariationApiState(false, [err]));
            });
    };
}


/**
 * Action creator for updating a variation
 *
 * @param  {Number} experimentId
 * @param  {Variation} variation
 *
 * @return {Thunk}
 */
export function updateVariation(experimentId, variation) {
    return (dispatch) => {
        dispatch(_updateVariationApiState(true));

        const params = {
            variation: VariationModel.transformForApi(variation)
        };

        return VariationApi.updateVariation(experimentId, variation.id, params)
            .then(res => {
                const actions = [
                    _updateVariation(new VariationModel(res.data.variation)),
                    _updateVariationApiState(false)
                ];

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.log(err);
                dispatch(_updateVariationApiState(false, [err]));
            });
    };
}

