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
         * @type {?Date}
         */
        this.createTime = exp.create_time ? new Date(exp.create_time) : null;


        /**
         * @type {?Date}
         */
        this.updateTime = exp.update_time ? new Date(exp.update_time) : null;
    }


    /**
     * Given an experiment object of Experiment type
     * it returns a transformed object which is accepted by
     * APIs
     *
     * @param  {Experiment} exp
     *
     * @return {Object}
     */
    static transformForApi(exp) {
        return {
            id: exp.id,
            name: exp.name,
            version: exp.version,
            exposure_percent: exp.exposure,
            is_active: exp.isActive
        };
    }


    /**
     * Given an experiment object of Experiment type
     * it validates the keys & returns an error object
     * in case of validation errors. Or returns null
     *
     * @param  {Experiment} exp
     *
     * @return {?Object}
     */
    static validate(exp) {
        const errors = {};

        // Validate name
        if (!(exp.name && exp.name.trim().length)) {
            errors.name = 'Please provide a valid experiment name';
        }


        // Validate exposure percentage
        if (!(exp.exposure && Number.isInteger(exp.exposure) && exp.exposure <= 100)) {
            errors.exposure = 'Please set a valid exposure value in number (<= 100)';
        }

        return Object.keys(errors).length ? errors : null;
    }
}
