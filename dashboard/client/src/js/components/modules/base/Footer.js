import React from 'react';
import {Link} from '../../../utils/router';

export default function (props) {
    return (
        <footer className="footer has-text-centered">
            <strong>Sieve</strong>. The source code is licensed under
            <Link
                to="http://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
            >
                Apache 2
            </Link>
        </footer>
    );
}
