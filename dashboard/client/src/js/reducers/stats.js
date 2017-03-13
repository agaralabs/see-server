import ActionConstants from '../ActionConstants';


/**
 * expVariationTimelineMapping structur
 * {
 *     'experimentId': {
 *         '<variationId>': {
 *              '<eventName>': [
 *                {
 *                    count: 12,
 *                    time: 8787382846878
 *                },
 *                {
 *                    count: 12,
 *                    time: 8787382846878
 *                },
 *                .
 *                .
 *                .
 *              ]
 *         }
 *      }
 *  }
 */

const initialState = {
    statsApiStatus: {
        isFetching: false,
        errors: null
    },
    timelineApiStatus: {
        isFetching: false,
        errors: null
    },
    variationStats: {},
    expTimelineMapping: {}
};


export default (state = initialState, action) => {
    let statsApiStatus;
    let timelineApiStatus;
    let variationStats;
    let expTimelineMapping;


    switch (action.type) {
        case ActionConstants.UPDATE_STATS_API_STATUS:
            statsApiStatus = {
                ...state.statsApiStatus,
                isFetching: action.isFetching,
                errors: action.errors
            };

            return {
                ...state,
                statsApiStatus
            };


        case ActionConstants.UPDATE_TIMELINE_API_STATUS:
            timelineApiStatus = {
                ...state.timelineApiStatus,
                isFetching: action.isFetching,
                errors: action.errors
            };

            return {
                ...state,
                timelineApiStatus
            };


        case ActionConstants.UPDATE_VARIATION_EVENTS_MAPPING:
            variationStats = {...state.variationStats};
            variationStats[action.variationId] = action.events;

            return {
                ...state,
                variationStats
            };


        case ActionConstants.UPDATE_EXPERIMENT_TIMELINE_MAPPING:
            expTimelineMapping = {...state.expTimelineMapping};
            expTimelineMapping[action.experimentId] = action.timeline;

            return {
                ...state,
                expTimelineMapping
            };


        default:
            return state;
    }
};
