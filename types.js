function VariationT(data) {
	data               = data || {};
	this.id            = data.id ? Number(data.id) : 0;
	this.experiment_id = data.experiment_id ? Number(data.experiment_id) : 0;
	this.name          = data.name ? String(data.name) : '';
	this.split_percent = data.split_percent ? Number(data.split_percent) : 0;
	this.is_deleted    = Boolean(data.is_deleted);
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
	this.variations           = [];
	if (data.variations && data.variations.length) {
		this.variations = data.variations.map(function (vrtn) {
			return new VariationT(vrtn);
		});
	}
}

module.exports = {
	VariationT : VariationT,
	ExperimentT: ExperimentT
};
