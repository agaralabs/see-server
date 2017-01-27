create table records(
    uid varchar(36) not null encode lzo,
    experiment_id integer not null encode mostly16,
    experiment_version integer not null encode mostly8,
    variation_id integer not null encode mostly8,
    event_name varchar(100) not null encode runlength,
    time timestamp not null encode delta sortkey,
    ip varchar(15) not null encode lzo,
    method VARCHAR(10) null encode runlength,
    path text not null encode text255,
    referer varchar(10000) encode text255,
    agent varchar(10000) encode text255
);
