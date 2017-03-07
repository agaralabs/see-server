import React from 'react';
import {Link} from '../../utils/router';

function getVariationItem(experimentId, variation, index, onDeleteVariation) {
    let deleteOption = (
        <div className="control">
            <button
                type="button"
                data-variationid={variation.id}
                className="button is-small is-danger is-outlined"
                onClick={onDeleteVariation}
            >
                Delete
            </button>
        </div>
    );

    let typeTag;

    if (variation.isControl) {
        deleteOption = null;
        typeTag = (
            <span className="tag is-primary is-small">Control</span>
        );
    }

    return (
        <tr key={variation.id}>
            <td>{index}</td>
            <td>{variation.name} {typeTag}</td>
            <td>{variation.splitPercent}</td>
            <td>
                <div className="control is-grouped">
                    <div className="control">
                        <Link
                            to={`/experiments/${experimentId}/variations/${variation.id}/update`}
                            className="button is-small is-info is-outlined"
                            title="Edit"
                        >
                            Edit
                        </Link>
                    </div>
                    {deleteOption}
                </div>
            </td>
        </tr>
    );
}


export default function (props) {
    return (
        <section className="experiment-variations">
            <div className="is-clearfix">
                <button
                    type="button"
                    className="button is-info is-small is-pulled-right"
                >
                    Create Variation
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Variation Name</th>
                        <th>Split %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.variations.map((v, i) => {
                            return getVariationItem(props.experimentId, v, i + 1, props.onDeleteVariation);
                        })
                    }
                </tbody>
            </table>
        </section>
    );
}
