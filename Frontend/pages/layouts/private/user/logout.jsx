import React, { useEffect } from 'react'
import Router from 'next/router';

const Logout = () => {

  useEffect(() => {

    auth();

    localStorage.removeItem('tokenUser');
    localStorage.removeItem('user');

    Router.push('../../../');

  }, []);

  const auth = () => {

    const tokenUser = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    if (!tokenUser && !user) {

      Router.push('../../../');

    }

  }

  return (
    <h1>Cerrando sesión...</h1>
  )
}

export default Logout
