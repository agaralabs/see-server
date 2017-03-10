import config from '../config';
import {BaseApi} from '../apis';


export default {
    getStatsForExperiment: (expId) => {
        return BaseApi.get(`${config.apiEndpoints.experimentBase}/${expId}/stats/counts`);
    },


    getTimelineForExperiment: (expId, from, to, granularity) => {
        return BaseApi.get(`${config.apiEndpoints.experimentBase}/${expId}/stats/timeline/${from}/${to}/${granularity}`);
    }
};
