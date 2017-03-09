export default class Variation {
    constructor(vr = {}) {
        /**
         * @type {Number}
         */
        this.id = vr.id || null;


        /**
         * @type {Number}
         */
        this.experimentId = vr.experiment_id || null;


        /**
         * @type {String}
         */
        this.name = vr.name || null;


        /**
         * @type {Boolean}
         */
        this.isControl = Boolean(vr.is_control);


        /**
         * @type {Number}
         */
        this.splitPercent = vr.split_percent || 0;


        /**
         * @type {?Date}
         */
        this.createTime = vr.create_time ? new Date(vr.create_time) : null;


        /**
         * @type {?Date}
         */
        this.updateTime = vr.update_time ? new Date(vr.update_time) : null;
    }


    /**
     * Returns an error if any for experiment based on the variations
     * that are given
     *
     * @param  {Array} variations
     *
     * @return {?String}
     */
    static getExperimentErrorType(variations) {
        // Usually this case should never happen since we create
        // control by default on backend
        if (!variations || !variations.length) {
            return 'NO_CONTROL';
        }


        // If there is only 1 variation, it means we have control but no test bucket
        if (variations.length === 1) {
            return 'NO_VARIATION';
        }

        // If the combination of all split is not 100, then mark it as an error
        const alloc = variations.reduce((sum, v) => sum + v.splitPercent, 0);

        if (alloc !== 100) {
            return 'INCORRECT_SPLIT';
        }

        return null;
    }


    /**
     * Transforms the `Variation` object into server side
     * expected api structure
     *
     * @param  {Variation} variation
     *
     * @return {Object}
     */
    static transformForApi(variation) {
        return {
            id: variation.id,
            experiment_id: variation.experimentId,
            name: variation.name,
            is_control: variation.isControl,
            split_percent: variation.splitPercent
        };
    }
}
