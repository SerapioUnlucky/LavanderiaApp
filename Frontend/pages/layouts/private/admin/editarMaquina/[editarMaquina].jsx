import React, { useEffect } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';

const EditarMaquina = () => {

  useEffect(() => {

    auth();

  });

  const auth = () => {

    const tokenAdmin = localStorage.getItem('tokenAdmin');
    const admin = localStorage.getItem('admin');

    if (!tokenAdmin && !admin) {

      Router.push('../../../../');

    }

  }

  const { form, changed } = useForm({});
  const Router = useRouter();
  const { editarMaquina } = Router.query;

  const modificarMaquina = async (e) => {

    e.preventDefault();

    const request = await fetch(process.env.SERVIDOR + 'maquina/modificar_serial/' + editarMaquina, {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('tokenAdmin')
      }
    });

    const data = await request.json();

    if (data.message === "Token inválido") {

      Router.push('../logout');

    }

    if (data.message === "Token expirado") {

      Router.push('../logout');

    }

    if (data.message === "No se ingresó el serial para modificar"){

      Swal.fire(
        'Error',
        'No se ingresó el serial para modificar',
        'error'
      )

    }

    if (data.message === "Ya existe una máquina con el serial ingresado"){

      Swal.fire(
        'Error',
        'Ya existe una máquina con el serial ingresado',
        'error'
      )

    }

    if (data.message === "Hubo un error al modificar la máquina"){

      Swal.fire(
        'Error',
        'Hubo un error al modificar la máquina',
        'error'
      )

    }

    if (data.message === "Se modificó correctamente la máquina"){

      Swal.fire(
        'Éxito',
        'Se modificó correctamente la máquina',
        'success'
      )

      setTimeout(() => {

        Router.push('../verMaquinas');

      }, 2000);

    }

  }

  return (
    <>

      <h1 className="titulo">Burbujas Lavandería</h1>

      <div className="contenedor-crearMaquina">

        <Link href="../verMaquinas">Volver atras</Link>

        <h1>Modificar serial de la maquina</h1>

        <form className="formulario-crearMaquina" onSubmit={modificarMaquina}>

          <div>
            <label>Ingrese nuevo serial</label>
            <br />
            <input type="text" name="serial" placeholder="Ej: asdf13gt" onChange={changed} />
          </div>

          <div>

            <input type="submit" value="Registrar" />

          </div>

        </form>

      </div>

    </>
  )
}

export default EditarMaquina
