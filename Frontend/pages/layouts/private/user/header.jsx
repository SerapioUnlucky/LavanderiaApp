import React, { useEffect } from 'react'
import Link from 'next/link';
import Router from 'next/router';

const Header = () => {

  useEffect(() => {

    auth();

  }, []);

  const auth = () => {

    const tokenUser = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    if(!tokenUser && !user){

      Router.push('../../../../');

    }

  }

  return (

    <>

    <h1 className="titulo">Burbujas Lavandería</h1>

      <header className="header-private-user">
      
        <nav>

          <ul className="ul-private-user">

            <li>
              <Link href="./inicio">Inicio</Link>
            </li>

            <li>
              <Link href="./crearReservas">Realizar una reserva</Link>
            </li>

            <li>
              <Link href="./verReservas">Ver mis reservas</Link>
            </li>

            <li>
              <Link href="./verPerfil">Ver mi perfil</Link>
            </li>

            <li>
              <Link href="./logout">Cerrar sesión</Link>
            </li>

          </ul>

        </nav>

      </header>

    </>
  )
}

export default Header;
