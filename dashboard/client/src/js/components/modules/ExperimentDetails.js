import React from 'react';
import Helpers from '../../utils/helpers';


export default function (props) {
    const items = [
        {
            name: 'Experiment Id',
            value: props.experiment.id
        },
        {
            name: 'Version',
            value: props.experiment.version
        },
        {
            name: 'Exposure',
            value: props.experiment.exposure
        },
        {
            name: 'Created On',
            value: Helpers.formatDate(props.experiment.createTime)
        }
    ];

    if (props.experiment.updateTime) {
        items.push({
            name: 'Last Updated On',
            value: Helpers.formatDate(props.experiment.updateTime)
        });
    }

    return (
        <section className="experiment-details">
            {
                items.map((item, i) => {
                    return (
                        <div
                            key={i}
                            className="item"
                        >
                            <div className="item__name">{item.name}</div>
                            <div className="item__value">{item.value}</div>
                        </div>
                    );
                })
            }
        </section>
    );
}
