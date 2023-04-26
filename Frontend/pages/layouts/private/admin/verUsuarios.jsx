import React, { useState, useEffect } from 'react'
import Router from 'next/router';
import Header from './header';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import Default from '../../../../public/default.jpg';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';

const VerUsuarios = () => {

    useEffect(() => {

        conseguirUsuarios();

    }, []);

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState([]);

    const conseguirUsuarios = async () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        } else {

            const request = await fetch(process.env.SERVIDOR + 'ver_perfiles', {

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
            
            setUsuarios(data.users);
            setLoading(true);
            setResultado(data.status);

        }

    }

    const eliminarUsuario = async (id) => {

        const request = await fetch(process.env.SERVIDOR + 'eliminar_usuario/'+id, {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            }

        });

        const data = await request.json();

        if(data.status === 'success'){

            Swal.fire(
                'Listo',
                'El usuario se ha eliminado correctamente',
                'success'
            )

            setTimeout(() => {

                location.reload();

            }, 2000);

        }

        if(data.message === "El usuario tiene reservas registradas, no puede ser eliminado"){

            Swal.fire(
                'Error',
                'El usuario tiene reservas registradas, no puede ser eliminado',
                'error'
            )

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-verUsuarios">

                <h1>Usuarios registrados</h1>

                {!loading ? <CircularProgress /> :

                    <table>

                        <thead>

                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>RUT</th>
                                <th>Email</th>
                                <th>Dirección</th>
                                <th>Fecha de nacimiento</th>
                                <th>Teléfono</th>
                                <th>Autorizado</th>
                                <th>Acción</th>
                            </tr>

                        </thead>

                        {resultado === "error" &&

                            <tbody>
                                <tr>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                    <td>No hay usuarios</td>
                                </tr>
                            </tbody>

                        }

                        {resultado === "success" &&

                            usuarios.map((usuario, index) => {

                                return (

                                    <tbody key={index}>

                                        <tr>

                                            {usuario.imagen != "default.png" && <td><picture><img src={process.env.SERVIDOR + "ver_imagen/" + usuario.imagen} alt="Usuario" width={50} height={50} /></picture></td>}
                                            {usuario.imagen == "default.png" && <td><Image className="usuario" src={Default} width={50} height={50} alt="Usuario" /></td>}
                                            <td>{usuario.nombre}</td>
                                            <td>{usuario.apellido}</td>
                                            <td>{usuario.rut}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.direccion}</td>
                                            <td>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</td>
                                            <td>+569-{usuario.telefono}</td>
                                            <td>{usuario.autorizado}</td>
                                            <td>
                                                <button className="editar-autorizado" onClick={() => Router.push('./editarUsuario/' + usuario._id)}>Editar</button>
                                                <button className='eliminar-usuario' onClick={() => eliminarUsuario(usuario._id)}>Eliminar</button>
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

export default VerUsuarios
