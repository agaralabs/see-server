export default class Variation {
    constructor(vr) {
        /**
         * @type {Number}
         */
        this.id = vr.id;


        /**
         * @type {Number}
         */
        this.experimentId = vr.experiment_id;


        /**
         * @type {String}
         */
        this.name = vr.name;


        /**
         * @type {Boolean}
         */
        this.isControl = vr.is_control;


        /**
         * @type {Number}
         */
        this.splitPercent = vr.split_percent;


        /**
         * @type {Number}
         */
        this.uniqueCounts = vr.unique_counts;


        /**
         * @type {[type]}
         */
        this.timeline = vr.timeline;


        /**
         * @type {?Date}
         */
        this.createTime = vr.create_time ? new Date(vr.create_time) : null;


        /**
         * @type {?Date}
         */
        this.updateTime = vr.update_time ? new Date(vr.update_time) : null;
    }
}
