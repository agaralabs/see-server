import ActionConstants from '../ActionConstants';

const initialState = {
    variationApiStatus: {
        isFetching: false,
        errors: null
    },
    variations: []
};


export default (state = initialState, action) => {
    let variations;
    let variationApiStatus;


    switch (action.type) {
        case ActionConstants.UPDATE_VARIATION_API_STATUS:
            variationApiStatus = {
                ...state.variationApiStatus,
                isFetching: action.isFetching,
                errors: action.errors
            };

            return {
                ...state,
                variationApiStatus
            };


        case ActionConstants.UPDATE_VARIATION:
            variations = state.variations.filter(v => v.id !== action.variation.id);
            variations.push(action.variation);

            return {
                ...state,
                variations
            };


        case ActionConstants.DELETE_VARIATION:
            variations = state.variations.filter(v => v.id !== action.variationId);

            return {
                ...state,
                variations
            };

        default:
            return state;
    }
};
