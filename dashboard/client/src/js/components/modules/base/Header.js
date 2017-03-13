import React from 'react';
import {Link} from '../../../utils/router';

export default function () {
    return (
        <header className="header has-shadow">
                <div className="container">
                    <Link
                        to="/"
                        className="header__title"
                    >
                        Sieve
                    </Link>
                </div>
        </header>
    );
}
