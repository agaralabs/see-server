export default class Event {
    constructor(event) {
        /**
         * Name of the event eg: 'cta_btn_click|page_view'
         * @type {String}
         */
        this.name = event.key;

        /**
         * Total number of events fired
         * @type {Number}
         */
        this.count = Number(event.value);

        /**
         * Conversion rate of this goal
         * @type {Number}
         */
        this.convRate = event.rate;

        /**
         * Zscore of this goal in this variation against control
         * @type {Number}
         */
        this.zScore = event.zscore || null;

        /**
         * p value of the experiment
         * @type {Number}
         */
        this.pValue = event.pvalue || null;
    }
}
