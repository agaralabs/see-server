import config from '../config';
import {BaseApi} from '../apis';


export default {
    getAllByExperimentId: (expId) => {
        return BaseApi.get(`${config.apiEndpoints.experimentBase}/${expId}/variations`);
    },


    deleteVariation: (expId, varId) => {
        return BaseApi.delete(`${config.apiEndpoints.experimentBase}/${expId}/variations/${varId}`);
    }
};
