export default class Experiment {
    constructor(exp = {}) {
        /**
         * @type {?Number}
         */
        this.id = exp.id || null;


        /**
         * @type {?String}
         */
        this.name = exp.name || null;


        /**
         * @type {?Number}
         */
        this.version = exp.version || null;


        /**
         * Number denoting exposure percentage
         * @type {?Number}
         */
        this.exposure = exp.exposure_percent || null;


        /**
         * @type {?Boolean}
         */
        this.isActive = Boolean(exp.is_active);


        /**
         * @type {?String}
         */
        this.metricName = exp.metric_name || null;


        /**
         * @type {?Date}
         */
        this.createTime = exp.create_time ? new Date(exp.create_time) : null;


        /**
         * @type {?Date}
         */
        this.updateTime = exp.update_time ? new Date(exp.update_time) : null;
    }


    static transformForApi(exp) {
        return {
            id: exp.id,
            name: exp.name,
            version: exp.version,
            exposure_percent: exp.exposure,
            is_active: exp.isActive,
            metric_name: exp.metricName,
            create_time: exp.createTime,
            update_time: exp.updateTime
        };
    }
}
