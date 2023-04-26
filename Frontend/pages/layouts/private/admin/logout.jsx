import React, {useEffect} from 'react'
import Router from 'next/router';

const Logout = () => {

    useEffect(() => {

        auth();

        localStorage.removeItem('tokenAdmin');
        localStorage.removeItem('admin');

        Router.push('../../../');

    }, []);

    const auth = () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        }

    }

    return (
        <h1>Cerrando sesión...</h1>
    )
}

export default Logout;
