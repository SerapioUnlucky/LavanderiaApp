import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Header from './header';

const Inicio = () => {

  useEffect(() => {

    authUser();

  }, []);

  const [users, setUsers] = useState([]);

  const authUser = async () => {

    const token = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    if (!token && !user) {

      Router.push('../../../');

    } else {

      const userObj = JSON.parse(user);

      setUsers(userObj);

    }

  }

  return (
    <>

      <Header />

      <div className="inicio-user">

        <h1 className="bienvenida">Bienvenido {users.nombre + " " + users.apellido}</h1>

      </div>


    </>
  );

}

export default Inicio;
