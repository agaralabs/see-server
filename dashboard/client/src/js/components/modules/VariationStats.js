import React from 'react';
import Loader from './base/Loader';
import Helpers from '../../utils/helpers';

const statTypes = [
    {
        type: 'count',
        text: 'Counts'
    },
    {
        type: 'convRate',
        text: 'Conversion Rate'
    },
    {
        type: 'zScore',
        text: 'Z Score'
    },
    {
        type: 'pValue',
        text: 'p Value'
    }
];


function getTableHeaderLabels(variations, selectedEvent) {
    const labels = [selectedEvent];

    statTypes.forEach(v => {
        labels.push(v.text);
    });

    return labels;
}


function getTableRowItems(variations, variationStats, selectedEvent) {
    const rows = variations.map(v => {
        const values = [v.name];

        statTypes.forEach(stat => {
            const stats = variationStats[v.id];

            const valueExists = stats.some(s => {
                if (s.name === selectedEvent) {
                    let value = s[stat.type];

                    if (value) {
                        value = Helpers.roundFloatingNumber(value, 3);
                    }

                    values.push(value);
                }

                return s.name === selectedEvent;
            });

            if (!valueExists) {
                values.push('NA');
            }
        });

        return values;
    });

    return rows;
}


export default function (props) {
    if (props.statsApiStatus.isFetching) {
        return <Loader />;
    }

    if (props.statsApiStatus.errors) {
        return 'Some error occured';
    }

    const tableHeaders = getTableHeaderLabels(props.variations, props.selectedEvent);
    const tableItems = getTableRowItems(
        props.variations,
        props.variationStats,
        props.selectedEvent
    );

    return (
        <table className="table is-bordered stats-table">
            <thead>
                <tr>
                    {
                        tableHeaders.map((t, i) => {
                            return (
                                <th key={i}>{t}</th>
                            );
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    tableItems.map((items, i) => {
                        return (
                            <tr key={i}>
                                {
                                    items.map((item, j) => {
                                        return <td key={j}>{item || 'NA'}</td>;
                                    })
                                }
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}
