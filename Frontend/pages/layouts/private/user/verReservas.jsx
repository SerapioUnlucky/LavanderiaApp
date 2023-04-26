import React, { useState, useEffect } from 'react';
import Header from './header';
import Router from 'next/router';
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/material';
import Lavadora from '../../../../public/lavadora.png';
import Secadora from '../../../../public/secadora.png';
import Image from 'next/image';

const VerReservas = () => {

    useEffect(() => {

        getReservas();

    }, []);

    const [reservas, setReservas] = useState([]);
    const [resultado, setResultado] = useState([]);
    const [loading, setLoading] = useState(false);

    const getReservas = async () => {

        const tokenUser = localStorage.getItem('tokenUser');
        const user = localStorage.getItem('user');

        if (!tokenUser && !user) {

            Router.push('../../../');

        }

        const userObj = JSON.parse(user);

        const request = await fetch(process.env.SERVIDOR + 'ver_mis_reservas/' + userObj.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': tokenUser
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

    const deleteReserva = async (id) => {

        const tokenUser = localStorage.getItem('tokenUser');

        const request = await fetch(process.env.SERVIDOR + 'eliminar_reserva/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': tokenUser
            }
        });

        const data = await request.json();

        if (data.status === "success") {

            Swal.fire(
                'Listo',
                'Se ha cancelado la reserva exitosamente',
                'success'
            );

            setTimeout(() => {

                location.reload();

            }, 2000);

        }

        if (data.message === "La reserva no puede ser eliminada debido a que ya paso") {

            Swal.fire(
                'Error',
                'La reserva no puede ser cancelada debido a que ya paso',
                'error'
            );

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-verReservas">

                <h1>Mis reservas registradas</h1>

                {!loading ? <CircularProgress /> : 

                    <table>

                        <thead>
                            <tr>
                                <th>Fecha de reserva</th>
                                <th>Hora de reserva</th>
                                <th>Tipo de servicio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        {resultado === "error" &&

                            <tbody>
                                <tr>
                                    <td>No tiene reservas aún</td>
                                    <td>No tiene reservas aún</td>
                                    <td>No tiene reservas aún</td>
                                    <td>No tiene reservas aún</td>
                                </tr>
                            </tbody>

                        }

                        {resultado === "success" &&

                            reservas.map((reserva, index) => {

                                return (

                                    <tbody key={index}>
                                        <tr>
                                            <td>{new Date(reserva.fechaReserva).toLocaleDateString()}</td>
                                            <td>{new Date(reserva.fechaReserva).getHours()+3}:00</td>
                                            {reserva.tipo === "Lavadora" ? <td><Image src={Lavadora} width={40} height={40} alt="Lavadora" /><br/>{reserva.tipo}</td> : ""}
                                            {reserva.tipo === "Secadora" ? <td><Image src={Secadora} width={50} height={50} alt="Secadora" /><br/>{reserva.tipo}</td> : ""}
                                            <td>
                                                <button className="editar-reserva" onClick={() => Router.push('./' + reserva._id)}>Editar</button>
                                                <button className="cancelar-reserva" onClick={() => deleteReserva(reserva._id)}>Cancelar</button>
                                            </td>
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

export default VerReservas
