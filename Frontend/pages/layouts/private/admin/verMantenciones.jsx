import React, {useState, useEffect} from 'react'
import Header from './header';
import {CircularProgress} from '@mui/material';
import Swal from 'sweetalert2';
import Router from 'next/router';
import Lavadora from '../../../../public/lavadora.png';
import Secadora from '../../../../public/secadora.png';
import Image from 'next/image';

const VerMantenciones = () => {

    useEffect(() => {

        conseguirMantenciones();

    }, []);

    const [mantenciones, setMantenciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState([]);

    const conseguirMantenciones = async () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');
        
        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        } else {

            const request = await fetch(process.env.SERVIDOR + 'mantencion/obtener/todos', {

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

            setMantenciones(data.mantenciones);
            setLoading(true);
            setResultado(data.message);

        }

    }

    const eliminarMantencion = async (id) => {

        const request = await fetch(process.env.SERVIDOR + 'mantencion/eliminar/' + id, {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            }

        });

        const data = await request.json();

        if (data.message === "Mantención eliminada") {

            Swal.fire(
                'Listo',
                'La mantención ha sido eliminada.',
                'success'
            )

            setTimeout(() => {

                location.reload();

            }, 2000);

        } else {

            Swal.fire(
                'Error',
                'La mantención no ha sido eliminada.',
                'error'
            )

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-verMantenciones">

                <h1>Mantenciones en curso</h1>

                {!loading ? <CircularProgress /> :

                    <table>

                        <thead>
                            <tr>
                                <th>Tipo de máquina</th>
                                <th>Serial</th>
                                <th>Fecha de inicio</th>
                                <th>Fecha de termino</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        {resultado === "No se pudieron obtener las mantenciones" &&

                            <tbody>
                                <tr>
                                    <td>No hay mantenciones</td>
                                    <td>No hay mantenciones</td>
                                    <td>No hay mantenciones</td>
                                    <td>No hay mantenciones</td>
                                    <td>No hay mantenciones</td>                                   
                                </tr>
                            </tbody>

                        }

                        {mantenciones.map((mantenciones, index) => {
                            return (

                                <tbody key={index}>
                                    <tr>
                                        {mantenciones.tipo === "Lavadora" ? <td><Image src={Lavadora} width={40} height={40} alt="Lavadora" /><br/>{mantenciones.tipo}</td> : ""}
                                        {mantenciones.tipo === "Secadora" ? <td><Image src={Secadora} width={50} height={50} alt="Secadora" /><br/>{mantenciones.tipo}</td> : ""}
                                        <td>{mantenciones.maquinaid.serial}</td>
                                        <td>{new Date(mantenciones.fechaIni).toLocaleDateString()}</td>
                                        <td>{new Date(mantenciones.fechaFin).toLocaleDateString()}</td>
                                        <td>
                                            <button className="editar-mantencion" onClick={() => Router.push('./editarMantencion/' + mantenciones._id)}>Editar</button>
                                            <button className="eliminar-mantencion" onClick={() => eliminarMantencion(mantenciones._id)}>Eliminar</button>
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

export default VerMantenciones
