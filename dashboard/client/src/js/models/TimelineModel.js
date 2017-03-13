import Helpers from '../utils/helpers';

export default class Timeline {
    constructor(experimentId, variations) {
        this.experimentId = experimentId;

        const timelines = {};

        variations.forEach(v => {
            v.timeline.forEach(t => {
                if (!timelines[t.event_name]) {
                    timelines[t.event_name] = [];
                }

                if (!timelines[t.event_name][t.time]) {
                    timelines[t.event_name][t.time] = {
                        time: t.time,
                        timeLabel: Helpers.formatDate(t.time, 'MMM DD'),
                        variations: {}
                    };
                }

                timelines[t.event_name][t.time].variations[v.id] = t.count;
            });
        });

        Object.keys(timelines).forEach(eventName => {
            const times = Object.keys(timelines[eventName]).map(t => timelines[eventName][t]);

            timelines[eventName] = times.sort((t1, t2) => t1.time - t2.time);
        });

        this.eventTimeline = timelines;
    }
}
