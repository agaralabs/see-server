import cloneDeep from 'lodash.clonedeep';
import {experiment as expReducer} from '../../src/js/reducers';
import ActionConstants from '../../src/js/ActionConstants';
import {ExperimentModel} from '../../src/js/models';

const initialState = {
    experimentApiStatus: {
        isFetching: false,
        errors: null
    },
    experiments: []
};

let state;


describe('Experiment reducer', () => {
    beforeEach(() => {
        state = cloneDeep(initialState);
    });


    it('should return the initial state', () => {
        expect(expReducer(undefined, {}))
            .toEqual(initialState);
    });


    it('should update experiment api status', () => {
        const errors = ['Some errors'];

        state.experimentApiStatus.isFetching = true;

        let newState = expReducer(initialState, {
            type: ActionConstants.UPDATE_EXPERIMENT_API_STATUS,
            isFetching: true,
            errors: null
        });

        expect(newState).toEqual(state);

        state.experimentApiStatus.isFetching = false;
        state.experimentApiStatus.errors = errors;

        newState = expReducer(initialState, {
            type: ActionConstants.UPDATE_EXPERIMENT_API_STATUS,
            isFetching: false,
            errors
        });

        expect(newState).toEqual(state);
    });


    it('should update the experiment', () => {
        let exp1 = new ExperimentModel();
        const exp2 = new ExperimentModel();

        exp1.id = 1;
        exp1.name = 'test';

        exp2.id = 2;
        exp2.name = 'exp2';

        state.experiments = [exp1];

        let newState = expReducer(initialState, {
            type: ActionConstants.UPDATE_EXPERIMENT,
            experiment: exp1
        });

        expect(newState).toEqual(state);

        const state2 = cloneDeep(state);

        state2.experiments.push(exp2);

        newState = expReducer(state, {
            type: ActionConstants.UPDATE_EXPERIMENT,
            experiment: exp2
        });

        expect(newState).toEqual(state2);

        const state3 = cloneDeep(state2);

        exp1 = cloneDeep(exp1);
        exp1.name = 'exp1';

        state3.experiments.shift();
        state3.experiments.push(exp1);

        newState = expReducer(state2, {
            type: ActionConstants.UPDATE_EXPERIMENT,
            experiment: exp1
        });

        expect(newState).toEqual(state3);
    });
});
