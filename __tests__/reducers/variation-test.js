import cloneDeep from 'lodash.clonedeep';
import {variation as varReducer} from '../../src/js/reducers';
import ActionConstants from '../../src/js/ActionConstants';

// import {VariationModel} from '../../src/js/models';

const initialState = {
    variationApiStatus: {
        isFetching: false,
        errors: null
    },
    variations: []
};

let state;


describe('Variation reducer', () => {
    beforeEach(() => {
        state = cloneDeep(initialState);
    });


    it('should return the initial state', () => {
        expect(varReducer(undefined, {}))
            .toEqual(initialState);
    });


    it('should update variation api status', () => {
        const errors = ['Some errors'];

        state.variationApiStatus.isFetching = true;

        let newState = varReducer(initialState, {
            type: ActionConstants.UPDATE_VARIATION_API_STATUS,
            isFetching: true,
            errors: null
        });

        expect(newState).toEqual(state);

        state.variationApiStatus.isFetching = false;
        state.variationApiStatus.errors = errors;

        newState = varReducer(initialState, {
            type: ActionConstants.UPDATE_VARIATION_API_STATUS,
            isFetching: false,
            errors
        });

        expect(newState).toEqual(state);
    });
});
