import React from 'react';
import {Link} from '../../../utils/router';
import Logo from '../../../../img/logo.svg';

export default function () {
    return (
        <header className="header has-shadow">
                <div className="container">
                    <Link
                        to="/"
                        className="header__title"
                    >
                        <img
                            src={Logo}
                            title="Sieve"
                            alt="Sieve Logo"
                            className="header__logo"
                        />
                        Sieve
                    </Link>
                </div>
        </header>
    );
}
