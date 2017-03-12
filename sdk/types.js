function MapT(data) {
    data       = data || {};
    this.key   = data.key ? String(data.key) : '';
    this.value = data.value ? String(data.value) : '';
}

function TimeLineItemT(data) {
    data            = data || {};
    this.time       = data.time ? Number(data.time) : 0;
    this.event_name = data.event_name ? String(data.event_name) : '';
    this.count      = data.count ? Number(data.count) : 0;
}

function VariationT(data) {
	data               = data || {};
	this.id            = data.id ? Number(data.id) : 0;
	this.experiment_id = data.experiment_id ? Number(data.experiment_id) : 0;
	this.name          = data.name ? String(data.name) : '';
    this.is_control    = Boolean(data.is_control);
	this.split_percent = data.split_percent ? Number(data.split_percent) : 0;
	this.is_deleted    = Boolean(data.is_deleted);
    this.unique_counts = data.unique_counts && data.unique_counts.length ? data.unique_counts.map(function (uc) { return new MapT(uc); }) : [];
    this.timeline      = data.timeline && data.timeline.length ? data.timeline.map(function (tl) { return new TimeLineItemT(tl); }) : [];
	this.create_time   = data.create_time ? Number(data.create_time) : 0;
	this.update_time   = data.update_time ? Number(data.update_time) : 0;
}

function ExperimentT(data) {
	data                      = data || {};
	this.id                   = data.id ? Number(data.id) : 0;
	this.name                 = data.name ? String(data.name) : '';
	this.version              = data.version ? Number(data.version) : 0;
	this.exposure_percent     = data.exposure_percent ? Number(data.exposure_percent) : 0;
	this.is_active            = Boolean(data.is_active);
	this.is_usr_participating = Boolean(data.is_usr_participating);
	this.usr_variation        = data.usr_variation ? new VariationT(data.usr_variation) : null;
	this.is_deleted           = Boolean(data.is_deleted);
	this.create_time          = data.create_time ? Number(data.create_time) : 0;
	this.update_time          = data.update_time ? Number(data.update_time) : 0;
    this.variations           = data.variations && data.variations.length ? data.variations.map(function (v) { return new VariationT(v); }) : [];
    this.metric_name          = data.metric_name ? String(data.metric_name) : '';
}

module.exports = {
	VariationT : VariationT,
	ExperimentT: ExperimentT
};
