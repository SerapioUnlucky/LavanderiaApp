import React, { useEffect } from 'react'
import Router from 'next/router';
import Link from 'next/link';

const Header = () => {

  useEffect(() => {

    auth();

  }, []);

  const auth = () => {

    const tokenUser = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    const tokenAdmin = localStorage.getItem('tokenAdmin');
    const admin = localStorage.getItem('admin');

    if (tokenUser && user) {

      Router.push('../layouts/private/user/inicio');

    }

    if (tokenAdmin && admin) {

      Router.push('../layouts/private/admin/inicio');

    }

  }

  return (

    <>

      <h1 className="titulo">Burbujas Lavandería</h1>

      <header className="header-public">

        <nav>

          <ul className='ul-public'>

            <li>
              <Link href="../../">Iniciar sesión como usuario</Link>
            </li>

            <li>
              <Link href="../../users/loginAdmin">Iniciar sesión como admin</Link>
            </li>

            <li>
              <Link href="../../users/registerUser">Registrarse como usuario</Link>
            </li>

          </ul>

        </nav>

      </header>

    </>
  )
}

export default Header;
