import React from 'react';
import {Link} from '../../utils/router';

export default function (props) {
    return (
        <section className="experiment-variations">
            <h3 className="subtitle is-5">Variations</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Variation</th>
                        <th>Split %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.variations.map((v, i) => {
                            return (
                                <tr key={v.id}>
                                    <td>{i + 1}</td>
                                    <td>{v.name}</td>
                                    <td>{v.splitPercent}</td>
                                    <td>
                                        <div className="control is-grouped">
                                            <div className="control">
                                                <Link
                                                    to={`/experiments/${props.experimentId}/variations/${v.id}/update`}
                                                    className="button is-small is-info is-outlined"
                                                    title="Edit"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                            <div className="control">
                                                <button
                                                    type="button"
                                                    data-variationid={v.id}
                                                    className="button is-small is-danger is-outlined"
                                                    disabled={v.isControl}
                                                    onClick={props.onDeleteVariation}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </section>
    );
}
