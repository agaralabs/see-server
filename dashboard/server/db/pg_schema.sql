CREATE TABLE records
(
    uid character varying(36) NOT NULL,
    experiment_id integer NOT NULL,
    experiment_version integer NOT NULL,
    variation_id integer NOT NULL,
    event_name character varying(100) NOT NULL,
    "time" timestamp with time zone NOT NULL,
    ip character varying(15) NOT NULL,
    method character varying(10), 
    "path" character varying(10000) NOT NULL,
    referer character varying(10000),
    agent character varying(10000)
);

CREATE TABLE bad_agents
(
   agent character varying(10000)
);
