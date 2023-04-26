import { useForm } from '../hooks/useForm';
import { useEffect } from 'react';
import Router from 'next/router';
import Header from './layouts/public/header';
import Swal from 'sweetalert2';

const Index = () => {

  useEffect(() => {

    auth();

  }, []);

  const auth = () => {

    const tokenUser = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    const tokenAdmin = localStorage.getItem('tokenAdmin');
    const admin = localStorage.getItem('admin');

    if(tokenUser && user){

      Router.push('./layouts/private/user/inicio');

    }

    if(tokenAdmin && admin){

      Router.push('./layouts/private/admin/inicio');

    }

  }

  const { form, changed } = useForm({});

  const loginUser = async(e) => {

    e.preventDefault();

    let userToLogin = form;

    const request = await fetch(process.env.SERVIDOR+'login_usuario', {
      method: 'POST',
      body: JSON.stringify(userToLogin),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await request.json();

    if(data.status == 'success'){

      localStorage.setItem('tokenUser', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      Router.push('./layouts/private/user/inicio');

    }

    if(data.message === 'Faltan datos por enviar'){

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes llenar todos los campos',
      })

    }

    if(data.message === 'El usuario no existe'){

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

      <Header/>

      <div className="login-usuario">     

          <h1>Inicio de sesión usuario</h1>
          
          <form onSubmit={loginUser}>

              <div className="inputs-login-usuario">

                <label htmlFor='email'>Ingrese correo electrónico</label>
                <br/>
                <input placeholder="example@example.com" type="email" name="email" onChange={changed}/>

              </div>

              <div className="inputs-login-usuario">

                <label htmlFor='contraseña'>Ingrese contraseña</label>
                <br/>
                <input placeholder="********" type="password" name="contraseña" onChange={changed}/>

              </div>

              <div className="inputs-login-usuario">

                <input className="boton-login" type="submit" value="Iniciar sesión" />

              </div>

          </form>

      </div>

    </>
  );
}

export default Index;
