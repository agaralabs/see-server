export default class Timeline {
    constructor(experimentId, variations) {
        this.experimentId = experimentId;

        this.variationTimeline = variations.reduce((vmap, v) => {
            vmap[v.id] = v.timeline.reduce((gMap, t) => {
                const value = {
                    count: t.count,
                    time: t.time
                };

                if (gMap[t.event_name]) {
                    gMap[t.event_name].push(value);
                } else {
                    gMap[t.event_name] = [value];
                }

                return gMap;
            }, {});

            return vmap;
        }, {});
    }
}
