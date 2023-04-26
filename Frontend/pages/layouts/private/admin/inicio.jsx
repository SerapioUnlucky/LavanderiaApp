import React, { useState, useEffect } from 'react'
import Router from 'next/router';
import Header from './header';

const Inicio = () => {

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
    
      <Header />

      <div className="inicio-admin">

        <h1 className="bienvenida">¡Bienvenido administrador!</h1>
        
      </div>
    
    </>

  )
}

export default Inicio
