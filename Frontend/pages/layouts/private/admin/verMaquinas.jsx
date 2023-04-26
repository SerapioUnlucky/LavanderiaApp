import React, { useState, useEffect } from 'react';
import Header from './header';
import { CircularProgress } from '@mui/material';
import Router from 'next/router';
import Swal from 'sweetalert2';
import Lavadora from '../../../../public/lavadora.png';
import Secadora from '../../../../public/secadora.png';
import Image from 'next/image';

const VerMaquinas = () => {

    const [maquinas, setMaquinas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState([]);

    useEffect(() => {

        conseguirMaquinas();

    }, []);

    const conseguirMaquinas = async () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        } else {

            const request = await fetch(process.env.SERVIDOR + 'maquina/obtener_todos', {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenAdmin
                }

            });

            const data = await request.json();

            if (data.message === "Token inválido") {

                Router.push('./logout');

            }

            if (data.message === "Token expirado") {

                Router.push('./logout');

            }

            setMaquinas(data.maquinas);
            setLoading(true);
            setResultado(data.message);

        }

    }

    const eliminarMaquina = async (id) => {

        const request = await fetch(process.env.SERVIDOR + 'maquina/eliminar_maquina/' + id, {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            }

        });

        const data = await request.json();

        if (data.message === "Se eliminó la máquina correctamente") {

            Swal.fire(
                'Listo',
                'Se eliminó la máquina correctamente',
                'success'
            )

            setTimeout(() => {

                location.reload();

            }, 2000);

        }

        if (data.message === "El tipo de máquina que desea eliminar están todas reservadas por ende no puede ser eliminado") {

            Swal.fire(
                'Error',
                'El tipo de máquina que desea eliminar están todas reservadas por ende no puede ser eliminado',
                'error'
            )

        }

        if (data.message === "Hubo un error al eliminar la máquina") {

            Swal.fire(
                'Error',
                'Hubo un error al eliminar la máquina',
                'error'
            )

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-verMaquinas">

                <h1>Máquinas registradas</h1>

                {!loading ? <CircularProgress /> :

                    <table>

                        <thead>
                            <tr>
                                <th>Tipo de máquina</th>
                                <th>Serial</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        {resultado === "Hubo un error al conseguir las máquinas" &&

                            <tbody>
                                <tr>
                                    <td>No hay máquinas</td>
                                    <td>No hay máquinas</td>
                                    <td>No hay máquinas</td>
                                </tr>
                            </tbody>

                        }

                        {resultado === "No se han encontrado máquinas" &&

                            <tbody>
                                <tr>
                                    <td>No hay máquinas</td>
                                    <td>No hay máquinas</td>
                                    <td>No hay máquinas</td>
                                </tr>
                            </tbody>

                        }

                        {maquinas.map((maquina, index) => {
                            return (

                                <tbody key={index}>
                                    <tr>
                                        {maquina.tipo === "Lavadora" ? <td><Image src={Lavadora} width={40} height={40} alt="Lavadora" /><br/>{maquina.tipo}</td> : ""}
                                        {maquina.tipo === "Secadora" ? <td><Image src={Secadora} width={50} height={50} alt="Secadora" /><br/>{maquina.tipo}</td> : ""}
                                        <td>{maquina.serial}</td>
                                        <td>
                                            <button className="editar-maquina" onClick={() => Router.push('./editarMaquina/' + maquina._id)}>Editar</button>
                                            <button className="eliminar-maquina" onClick={() => eliminarMaquina(maquina._id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                </tbody>

                            )

                        })}

                    </table>

                }

            </div>

        </>
    )
}

export default VerMaquinas
