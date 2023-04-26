import React, {useState, useEffect} from 'react';
import { useForm } from '../../hooks/useForm';
import Header from '../layouts/public/header';
import Swal from 'sweetalert2';

const RegisterUser = () => {

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
  const [ save, setSave ] = useState("not_sended");

  const saveUser = async(e) => {

    e.preventDefault();

    let newUser = form;

    let añoActual = new Date().getFullYear();
    let añoNacimiento = new Date(newUser.fechaNacimiento).getFullYear();

    if(añoNacimiento < añoActual-100 || añoNacimiento > añoActual-18){

      Swal.fire({
        title: 'Error',
        text: 'La fecha ingresada no es válida',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

      return false;

    }

    const request = await fetch(process.env.SERVIDOR+"crear_usuario", {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await request.json();

    if(data.status === "success"){

      Swal.fire({
        title: 'Usuario creado',
        text: 'El usuario se creó correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      setTimeout(() => {
        
        location.reload();

      }, 2000);

    }

    if(data.message === "Faltan datos por enviar"){

      Swal.fire({
        title: 'Error',
        text: 'Debe completar los campos obligatorios',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El nombre es incorrecto, solo se aceptan letras"){

      Swal.fire({
        title: 'Error',
        text: 'El nombre es incorrecto, solo se aceptan letras',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El apellido es incorrecto, solo se aceptan letras"){

      Swal.fire({
        title: 'Error',
        text: 'El apellido es incorrecto, solo se aceptan letras',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El RUT es incorrecto, solo se aceptan números"){

      Swal.fire({
        title: 'Error',
        text: 'El RUT es incorrecto, solo se aceptan números',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El RUT ingresado no es el válido"){

      Swal.fire({
        title: 'Error',
        text: 'El RUT ingresado no es el válido',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "La fecha ingresada no es válida, solo se acepta el formato de YYYY-mm-dd"){

      Swal.fire({
        title: 'Error',
        text: 'La fecha ingresada no es válida, solo se acepta el formato de YYYY-mm-dd',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El correo ingresado no es válido"){

      Swal.fire({
        title: 'Error',
        text: 'El correo ingresado no es válido',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "La contraseña ingresada no es válida, el número de caracteres mínimo es de 8"){

      Swal.fire({
        title: 'Error',
        text: 'La contraseña ingresada no es válida, el número de caracteres mínimo es de 8',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El número de teléfono no es válido, solo se aceptan números"){

      Swal.fire({
        title: 'Error',
        text: 'El número de teléfono no es válido, solo se aceptan números',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El número de teléfono no es válido, solo se acepta el formato de +569-xxxxxxxx"){

      Swal.fire({
        title: 'Error',
        text: 'El número de teléfono no es válido, solo se acepta el formato de +569-xxxxxxxx',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    if(data.message === "El usuario ya existe"){

      Swal.fire({
        title: 'Error',
        text: 'El usuario ya existe',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

    }

    const fileInput = document.querySelector("#file");

    if(data.status === "success" && fileInput.files[0]){

      const formData = new FormData();

      formData.append('file0', fileInput.files[0]);

      const subida = await fetch(process.env.SERVIDOR+"subir_imagen/"+data.user._id, {

        method: 'POST',
        body: formData

      });

      const subidaImagen = await subida.json();

      if(subidaImagen.status === "success"){

        setSave("saved");

      }

    }

  }

  return (

    <>

      <Header />

      <div className="registro-usuario">
          
          <h1>Registro de usuario</h1>

          <strong>{save === "saved" ? "Imagen guardada correctamente" : " "}</strong>

          <form onSubmit={saveUser}>

              <div className="inputs-registro">

                <label>Ingrese su nombre*</label>
                <br/>
                <input placeholder="Ej: Carlos" name="nombre" type="text" onChange={changed}/>

              </div>

              <div className="inputs-registro">

                <label>Ingrese su apellido*</label>
                <br/>
                <input placeholder="Ej: Jara" name="apellido" type="text" onChange={changed}/>

              </div>
              
              <div className="inputs-registro">

                <label>Ingrese su RUT* (Sin puntos ni guion)</label>
                <br/>
                <input placeholder="Ej: 111111111" name="rut" type="number" onChange={changed}/>

              </div>
            
              <div className="inputs-registro">

                <label>Ingrese su dirección*</label>
                <br/>
                <input placeholder="Ej: Pasaje las garzas 123" name="direccion" type="text" onChange={changed}/>

              </div>

              <div className="inputs-registro">

                <label>Ingrese su fecha de nacimiento*</label>
                <br/>
                <input name="fechaNacimiento" type="date" onChange={changed}/>

              </div>
            
              <div className="inputs-registro">

                <label>Ingrese su número de contacto*</label>
                <br/>
                <input placeholder="Ej: +569-XXXXXX" name="telefono" type="number" onChange={changed}/>

              </div>
            
              <div className="inputs-registro">

                <label>Ingrese su correo electronico*</label>
                <br/>
                <input placeholder="Ej: example@example.com" type="email" name="email" onChange={changed}/>

              </div>

              <div className="inputs-registro">

                <label>Ingrese una contraseña*</label>
                <br/>
                <input placeholder="********" type="password" name="contraseña" onChange={changed}/>

              </div>

              <div className="inputs-registro">

                <label htmlFor="file0">Ingrese una imagen</label>
                <br/>
                <input className="imagen" type="file" name="file0" id="file"/>

              </div>

              <div className="inputs-registro">

                <input className="boton-login" type="submit" value="Registrarme" onChange={changed} />

              </div>

          </form>

      </div>

    </>

  );
}

export default RegisterUser;
