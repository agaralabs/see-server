module.exports = require("protobufjs").newBuilder({})['import']({
    "package": null,
    "messages": [
        {
            "name": "VariationT",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "id",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "experiment_id",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "name",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "split_percent",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "create_time",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "update_time",
                    "id": 6
                }
            ]
        },
        {
            "name": "ExperimentT",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "id",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "name",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "version",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "exposure_percent",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "is_active",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "is_usr_participating",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "VariationT",
                    "name": "usr_variation",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "create_time",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "update_time",
                    "id": 9
                },
                {
                    "rule": "repeated",
                    "type": "VariationT",
                    "name": "variations",
                    "id": 10
                }
            ]
        }
    ]
}).build();