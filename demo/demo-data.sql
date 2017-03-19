INSERT INTO `experiments` (`id`, `name`, `exposure_percent`, `is_active`, `version`, `is_deleted`, `create_time`, `update_time`, `metric_name`)
VALUES
	(1,'Test button color',100,1,1,0,'2017-03-13 14:38:07','2017-03-13 14:38:56','button-click');

INSERT INTO `variations` (`id`, `experiment_id`, `name`, `split_percent`, `is_deleted`, `create_time`, `update_time`, `is_control`)
VALUES
	(1,1,'CONTROL',50,0,'2017-03-13 14:38:07',NULL,1),
	(2,1,'greenbutton',25,0,'2017-03-13 14:38:38',NULL,0),
	(3,1,'bluebutton',25,0,'2017-03-13 14:38:49',NULL,0);