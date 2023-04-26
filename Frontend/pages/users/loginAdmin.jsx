import React, { useEffect } from 'react';
import Header from '../layouts/public/header';
import { useForm } from '../../hooks/useForm';
import Router from 'next/router';
import Swal from 'sweetalert2';

const LoginAdmin = () => {

  useEffect(() => {

    auth();

  }, []);

  const auth = () => {

    const tokenUser = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    const tokenAdmin = localStorage.getItem('tokenAdmin');
    const admin = localStorage.getItem('admin');

    if(tokenUser && user){

      Router.push('../layouts/private/user/inicio');

    }

    if(tokenAdmin && admin){

      Router.push('../layouts/private/admin/inicio');

    }

  }

  const { form, changed } = useForm({});

  const loginAdmin = async(e) => {

    e.preventDefault();

    let adminToLogin = form;

    const request = await fetch(process.env.SERVIDOR+'login_admin', {
      method: 'POST',
      body: JSON.stringify(adminToLogin),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await request.json();

    if(data.status == 'success'){

      localStorage.setItem('tokenAdmin', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));

      Router.push('../layouts/private/admin/inicio');

    }

    if(data.message === 'Faltan datos por enviar'){
    
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes llenar todos los campos',
      })

    }

    if(data.message === 'El admin no existe'){

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El email ingresado no existe',
      })

    }

    if(data.message === 'Contraseña incorrecta por favor inténtelo nuevamente'){

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Contraseña incorrecta, por favor inténtelo nuevamente',
      })

    }

  }

  return (

    <>

      <Header />

      <div className="login-admin">     

          <h1>Inicio de sesión admin</h1>
          
          <form onSubmit={loginAdmin}>

              <div className="inputs-login-admin">

                <label htmlFor='email'>Ingrese correo electrónico</label>
                <br/>
                <input placeholder="example@example.com" type="email" name="email" onChange={changed}/>

              </div>

              <div className="inputs-login-admin">

                <label htmlFor='contraseña'>Ingrese contraseña</label>
                <br/>
                <input placeholder="********" type="password" name="contraseña" onChange={changed}/>

              </div>
    
              <div className="inputs-login-admin">

                <input className="boton-login" type="submit" value="Iniciar sesión" />

              </div>

          </form>

      </div>

    </>
  )
}

export default LoginAdmin;
