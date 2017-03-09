var pb      = require('protobufjs');
var builder = pb.loadProtoFile(__dirname + '/types.proto');

module.exports = {
    MetricT      : builder.build('MetricT'),
    VariationT   : builder.build('VariationT'),
    ExperimentT  : builder.build('ExperimentT'),
    MapT         : builder.build('MapT'),
    TimelineItemT: builder.build('TimelineItemT')
};
