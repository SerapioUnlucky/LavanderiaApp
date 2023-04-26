import React, { useEffect, useState } from 'react'
import Header from './header'
import { useRouter } from 'next/router';
import { useForm } from '../../../../hooks/useForm';
import Swal from 'sweetalert2';

const EditarReservas = () => {

  useEffect(() => {

    auth();

  });

  const [users, setUser] = useState([]);

  const auth = () => {

    const tokenUser = localStorage.getItem('tokenUser');
    const user = localStorage.getItem('user');

    if (!tokenUser && !user) {

      Router.push('../../../');

    }

    const userObj = JSON.parse(user);
    setUser(userObj.id);

  }

  const Router = useRouter();
  const { editarReservas } = Router.query;

  const { form, changed } = useForm({});

  const editarReserva = async (e) => {

    e.preventDefault();

    let reservaToCreate = form;

    const request = await fetch(process.env.SERVIDOR + 'modificar_reserva/' + editarReservas, {
      method: 'PUT',
      body: JSON.stringify({ usuario: users, fechaReserva: reservaToCreate.fechaReserva, tipo: reservaToCreate.tipo }),
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('tokenUser')
      }
    });

    const data = await request.json();

    if (data.message === "Token inválido") {

      Router.push('../logout');

    }

    if (data.message === "Token expirado") {

      Router.push('../logout');

    }

    if (data.status === "success") {

      Swal.fire(
        'Listo',
        'Se ha modificado la reserva exitosamente',
        'success'
      )

      setTimeout(() => {

        Router.push('./verReservas');

      }, 2000);

    }

    if (data.message === "Faltan datos por enviar") {

      Swal.fire(
        'Error',
        'Debe completar todos los campos',
        'error'
      )

    }

    if (data.message === "Ya registra una reserva para la fecha y hora seleccionada") {

      Swal.fire(
        'Error',
        'Ya registra una reserva para la fecha y hora seleccionada',
        'error'
      )

    }

    if (data.message === "No hay máquinas disponibles para la fecha y hora selecciona") {

      Swal.fire(
        'Error',
        'No hay máquinas disponibles para la fecha y hora selecciona',
        'error'
      )

    }

    if (data.message === "No tiene permisos para modificar esta reserva") {

      Swal.fire(
        'Error',
        'No tiene permisos para modificar esta reserva',
        'error'
      )

    }

    if (data.message === "Ha ocurrido un error al actualizar la reserva, inténtelo nuevamente") {

      Swal.fire(
        'Error',
        'No hay reserva que modificar',
        'error'
      )

    }

    if (data.message === "La hora ingresada no es válida") {

      Swal.fire(
        'Error',
        'La hora ingresada no es válida',
        'error'
      )

    }

    if (data.message === "La fecha ingresada no es válida") {

      Swal.fire(
        'Error',
        'La fecha ingresada no es válida',
        'error'
      )

    }

    if (data.message === "Esta reserva no se puede modificar ya que la fecha de la reserva es anterior a la fecha actual") {

      Swal.fire(
        'Error',
        'Esta reserva no se puede modificar ya que la fecha de la reserva es anterior a la fecha actual',
        'error'
      )

    }

  }

  return (
    <>

      <Header />

      <div className="contenedor-crearReservas">

        <h1>Formulario para editar una reserva</h1>

        <form onSubmit={editarReserva} className="formulario-reserva">

          <div>

            <label>Fecha de reserva</label>
            <br />
            <input type="datetime-local" name="fechaReserva" onChange={changed} />

          </div>

          <div>

            <label>Tipo de servicio</label>
            <br />
            <select name="tipo" onChange={changed}>
              <option>Seleccione un servicio</option>
              <option>Lavadora</option>
              <option>Secadora</option>
            </select>

          </div>

          <div>

            <input type="submit" value="Agendar" />

          </div>

        </form>

      </div>

    </>
  )
}

export default EditarReservas
