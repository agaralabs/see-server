create table records(
    uid varchar(36) not null encode lzo,
    experiment_id integer not null encode mostly16,
    experiment_version integer not null encode mostly8,
    variation_id integer not null encode mostly8,
    event_name varchar(100) not null encode runlength,
    time timestamptz not null encode delta sortkey,
    ip varchar(15) not null encode lzo,
    method VARCHAR(10) null encode runlength,
    path varchar(10000) not null encode lzo,
    referer varchar(10000) encode lzo,
    agent varchar(10000) encode lzo
);

CREATE TABLE bad_agents(
   agent varchar(10000) encode sortkey
);
