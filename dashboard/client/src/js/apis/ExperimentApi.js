import config from '../config';
import {BaseApi} from '../apis';


export default {
    getAllExperiments: () => {
        return BaseApi.get(config.apiEndpoints.experimentBase);
    },


    createExperiment: (experiment) => {
        return BaseApi.post(config.apiEndpoints.experimentBase, experiment);
    },


    getExperimentById: (expId) => {
        return BaseApi.get(`${config.apiEndpoints.experimentBase}/${expId}`);
    },


    updateExperiment: (expId, params) => {
        return BaseApi.put(`${config.apiEndpoints.experimentBase}/${expId}`, params);
    }
};
