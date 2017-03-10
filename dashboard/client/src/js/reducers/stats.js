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
    variationEventsMapping: {},
    expTimelineMapping: {}
};


export default (state = initialState, action) => {
    let statsApiStatus;
    let timelineApiStatus;
    let variationEventsMapping;
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
            variationEventsMapping = {...state.variationEventsMapping};
            variationEventsMapping[action.variationId] = action.events;

            return {
                ...state,
                variationEventsMapping
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
