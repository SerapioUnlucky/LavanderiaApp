import React, { useEffect, useState } from 'react'
import Header from './header';
import { CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import Lavadora from '../../../../public/lavadora.png';
import Secadora from '../../../../public/secadora.png';
import Image from 'next/image';

const ListadoReservas = () => {

    useEffect(() => {

        conseguirReservas();

    }, []);

    const [reservas, setReservas] = useState([]);
    const [resultado, setResultado] = useState([]);
    const [loading, setLoading] = useState(false);

    const conseguirReservas = async () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        } else {

            const request = await fetch(process.env.SERVIDOR + 'ver_reservas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenAdmin
                }
            });

            const data = await request.json();

            if(data.message === "Token inválido"){

                Router.push('./logout');

            }

            if(data.message === "Token expirado"){

                Router.push('./logout');
                
            }

            setReservas(data.reservations);
            setResultado(data.status);
            setLoading(true);

        }

    }

    const eliminarReserva = async (id) => {

        const request = await fetch(process.env.SERVIDOR + 'eliminar_reservas/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            }
        });

        const data = await request.json();

        if (data.status === "success") {

            Swal.fire(
                'Listo',
                'Reserva eliminada correctamente',
                'success'
            );

            setTimeout(() => {

                location.reload();

            }, 2000);

        }

        if(data.status === "error") {

            Swal.fire(
                'Error',
                'No se pudo eliminar la reserva porque ya no existe',
                'error'
            );

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-verReservas">

                <h1>Listado de todas las reservas registradas</h1>

                {!loading ? <CircularProgress /> :

                    <table>

                        <thead>

                            <tr>

                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>RUT</th>
                                <th>Fecha de reserva</th>
                                <th>Hora de reserva</th>
                                <th>Tipo de servicio</th>
                                <th>Acción</th>

                            </tr>

                        </thead>

                        {resultado === "error" &&

                            <tbody>

                                <tr>

                                    <td>No hay reservas</td>
                                    <td>No hay reservas</td>
                                    <td>No hay reservas</td>
                                    <td>No hay reservas</td>
                                    <td>No hay reservas</td>
                                    <td>No hay reservas</td>
                                    <td>No hay reservas</td>

                                </tr>

                            </tbody>

                        }

                        {resultado === "success" &&

                            reservas.map((reserva, index) => {

                                return (

                                    <tbody key={index}>

                                        <tr>

                                            <td>{reserva.usuario.nombre}</td>
                                            <td>{reserva.usuario.apellido}</td>
                                            <td>{reserva.usuario.rut}</td>
                                            <td>{new Date(reserva.fechaReserva).toLocaleDateString()}</td>
                                            <td>{new Date(reserva.fechaReserva).getHours()+3}:00</td>
                                            {reserva.tipo === "Lavadora" ? <td><Image src={Lavadora} width={40} height={40} alt="Lavadora" /><br/>{reserva.tipo}</td> : ""}
                                            {reserva.tipo === "Secadora" ? <td><Image src={Secadora} width={50} height={50} alt="Secadora" /><br/>{reserva.tipo}</td> : ""}
                                            <td><button className="cancelar-reserva" onClick={() => eliminarReserva(reserva._id)}>Eliminar</button></td>

                                        </tr>

                                    </tbody>

                                )

                            })

                        }

                    </table>

                }

            </div>

        </>
    )
}

export default ListadoReservas
