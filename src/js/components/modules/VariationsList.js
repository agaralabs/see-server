import React from 'react';


function getVariationViewMode(experimentId, variation, index, onVariationAddEdit, onDelete) {
    let deleteOption = (
        <div className="control">
            <button
                type="button"
                data-variationid={variation.id}
                className="button is-small is-danger is-outlined"
                onClick={onDelete}
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
        <tr key={index}>
            <td>{index}</td>
            <td>{variation.name} {typeTag}</td>
            <td>{variation.splitPercent}</td>
            <td>
                <div className="control is-grouped">
                    <div className="control">
                        <button
                            type="button"
                            data-action="update"
                            data-variationid={variation.id}
                            onClick={onVariationAddEdit}
                            className="button is-small is-info is-outlined"
                        >
                            Edit
                        </button>
                    </div>
                    {deleteOption}
                </div>
            </td>
        </tr>
    );
}


function getVariationEditMode(variation, index, onVariationInfoChange, onVariationSave, onCancelVariationAddEdit) {
    return (
        <tr key={index}>
            <td>{index}</td>
            <td>
                <div className="control">
                    <input
                        type="text"
                        value={variation.name || ''}
                        data-keyname="name"
                        onChange={onVariationInfoChange}
                        placeholder="variation-name"
                        className="input"
                    />
                </div>
            </td>
            <td>
                <div className="control">
                    <input
                        type="text"
                        value={variation.splitPercent || 0}
                        data-keyname="splitPercent"
                        onChange={onVariationInfoChange}
                        placeholder="20"
                        className="input inline-block"
                    />
                </div>
            </td>
            <td>
                <div className="control is-grouped">
                    <div className="control">
                        <button
                            type="button"
                            onClick={onVariationSave}
                            className="button is-small is-info is-outlined"
                        >
                            Save
                        </button>
                    </div>
                    <div className="control">
                        <button
                            type="button"
                            onClick={onCancelVariationAddEdit}
                            className="button is-small is-danger is-outlined"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}


export default function (props) {
    let isEditModeAdded = false;

    const listItems = props.variations.map((v, i) => {
        if (props.isVarEditModeOn && props.selectedVariation && props.selectedVariation.id === v.id) {
            isEditModeAdded = true;


            return getVariationEditMode(
                props.selectedVariation,
                i + 1,
                props.onVariationInfoChange,
                props.onVariationSave,
                props.onCancelVariationAddEdit
            );
        }

        return getVariationViewMode(
            props.experimentId,
            v,
            i + 1,
            props.onVariationAddEdit,
            props.onVariationDelete
        );
    });

    if (props.isVarEditModeOn && props.selectedVariation && !isEditModeAdded) {
        listItems.push(getVariationEditMode(
            props.selectedVariation,
            listItems.length + 1,
            props.onVariationInfoChange,
            props.onVariationSave,
            props.onCancelVariationAddEdit
        ));
    }


    return (
        <section className="experiment-variations">
            <div className="is-clearfix">
                <button
                    type="button"
                    data-action="create"
                    onClick={props.onVariationAddEdit}
                    className="button is-info is-small is-outlined is-pulled-right"
                >
                    Create Variation
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th width="10%">#</th>
                        <th>Variation Name</th>
                        <th width="10%">Split %</th>
                        <th width="25%">Actions</th>
                    </tr>
                </thead>
                <tbody>{listItems}</tbody>
            </table>
        </section>
    );
}
