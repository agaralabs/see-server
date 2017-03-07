import React from 'react';
import {Link} from '../../../utils/router';

export default function (props) {
    return (
        <footer className="footer has-text-centered">
            <strong>Sieve</strong>. The source code is licensed under&nbsp;
            <Link
                to="http://opensource.org/licenses/mit-license.php"
                target="_blank"
            >
                MIT
            </Link>
        </footer>
    );
}
