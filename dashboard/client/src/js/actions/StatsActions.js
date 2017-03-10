import {batchActions} from 'redux-batched-actions';
import ActionConstants from '../ActionConstants';
import {EventModel, TimelineModel} from '../models';
import {StatsApi} from '../apis';

/**
 * Action creator for updating the Stats API state
 *
 * @private
 * @param {Boolean} isFetching
 * @param {?Array} errors
 *
 * @return {Object}
 */
function _updateStatsApiState(isFetching, errors = null) {
    return {
        type: ActionConstants.UPDATE_STATS_API_STATUS,
        isFetching,
        errors
    };
}


/**
 * Action creator for updating the Timeline API state
 *
 * @private
 * @param {Boolean} isFetching
 * @param {?Array} errors
 *
 * @return {Object}
 */
function _updateTimelineApiState(isFetching, errors = null) {
    return {
        type: ActionConstants.UPDATE_TIMELINE_API_STATUS,
        isFetching,
        errors
    };
}


/**
 * Action creator for updating the variationEventMapping
 *
 * @param  {Number} variationId
 * @param  {Array<Event>} events
 *
 * @return {Object}
 */
function _updateVariationEventsMapping(variationId, events) {
    return {
        type: ActionConstants.UPDATE_VARIATION_EVENTS_MAPPING,
        variationId,
        events
    };
}


/**
 * Action creator for updating the experiment-timeline mapping report
 *
 * @param  {Number} experimentId
 * @param  {Object} timelineData
 * `
 * {
 *     '<variationId>': {
 *         '<eventName>': [
 *             {
 *                 count: 12,
 *                 time: 8787382846878
 *             },
 *             {
 *                 count: 12,
 *                 time: 8787382846878
 *             },
 *             .
 *             .
 *             .
 *         ]
 *     }
 * }
 * `
 * @return {Object}
 */
function _updateExpTimelineMapping(experimentId, timeline) {
    return {
        type: ActionConstants.UPDATE_EXPERIMENT_TIMELINE_MAPPING,
        experimentId,
        timeline
    };
}


/**
 * Fetches the stats for a experiment
 *
 * @param  {Number} expId
 *
 * @return {Thunk}
 */
export function fetchStatsForExperiment(expId) {
    return (dispatch) => {
        dispatch(_updateStatsApiState(true));

        return StatsApi.getStatsForExperiment(expId)
            .then(res => {
                const actions = res.data.variations.map(v => {
                    const events = v.unique_counts.map(uc => new EventModel(uc));

                    return _updateVariationEventsMapping(v.id, events);
                });

                actions.push(_updateStatsApiState(false));

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.error(err);
                dispatch(_updateStatsApiState(false, [err]));
            });
    };
}


/**
 * Fetches the Timeline data for a given experiment id
 *
 * @param  {Number} expId
 * @param  {Date} from
 * @param  {Date} to
 * @param  {String} [granularity=daily]
 *
 * @return {Thunk}
 */
export function fetchTimelineForExperiment(expId, from, to, granularity = 'daily') {
    return (dispatch) => {
        dispatch(_updateTimelineApiState(true));

        return StatsApi.getTimelineForExperiment(expId, from.toISOString(), to.toISOString(), granularity)
            .then(res => {
                const timeline = new TimelineModel(expId, res.data.variations);

                const actions = [
                    _updateExpTimelineMapping(expId, timeline),
                    _updateTimelineApiState(false)
                ];

                dispatch(batchActions(actions));
            })
            .catch(err => {
                console.error(err);
                dispatch(_updateStatsApiState(false, [err]));
            });
    };
}

