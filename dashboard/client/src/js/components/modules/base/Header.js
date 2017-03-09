import React from 'react';
import {Link} from '../../../utils/router';

export default function () {
    return (
        <header className="header">
            <nav className="nav has-shadow">
                <div className="nav-left">
                    <Link
                        to="/"
                        className="nav-item header__title"
                    >
                        Sieve
                    </Link>
                </div>
            </nav>
        </header>
    );
}
