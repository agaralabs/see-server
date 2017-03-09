import React from 'react';

export default function (props) {
    return (
        <div className="modal is-active">
            <div
                onClick={props.onClose}
                className="modal-background"
            />
            <div className="modal-content">{props.children}</div>
            <button
                onClick={props.onClose}
                className="modal-close"
            />
        </div>
    );
}
