import React, {useEffect} from 'react'
import Link from 'next/link';
import Router from 'next/router';

const Header = () => {

    useEffect(() => {

        auth();

    }, []);

    const auth = () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if(!tokenAdmin && !admin){
                
            Router.push('../../../../');

        }

    }

  return (

    <>

      <h1 className="titulo">Burbujas Lavandería</h1>

      <header className="header-private-admin">
      
        <nav>

          <ul className="ul-private-admin">

            <li>
              <Link href="./inicio">Inicio</Link>
            </li>

            <li>
              <Link href="./verUsuarios">Ver usuarios</Link>
            </li>

            <li>
              <Link href="./listadoReservas">Ver reservas</Link>
            </li>

            <li>
              <Link href="./verMantenciones">Ver mantenciones</Link>
            </li>

            <li>
              <Link href="./crearMantencion">Realizar mantención</Link>
            </li>

            <li>
              <Link href="./verMaquinas">Ver máquinas</Link>
            </li>

            <li>
              <Link href="./crearMaquina">Ingresar nueva máquina</Link>
            </li>

            <li>
              <Link href="./generarInformeMensual">Generar informe mensual</Link>
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
