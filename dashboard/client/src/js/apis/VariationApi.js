import config from '../config';
import {BaseApi} from '../apis';


export default {
    getAllByExperimentId: (expId) => {
        return BaseApi.get(`${config.apiEndpoints.experimentBase}/${expId}/variations`);
    },


    createVariation: (expId, params) => {
        return BaseApi.post(`${config.apiEndpoints.experimentBase}/${expId}/variations`, params);
    },


    updateVariation: (expId, varId, params) => {
        return BaseApi.put(`${config.apiEndpoints.experimentBase}/${expId}/variations/${varId}`, params);
    },


    deleteVariation: (expId, varId) => {
        return BaseApi.delete(`${config.apiEndpoints.experimentBase}/${expId}/variations/${varId}`);
    }
};
